function resolveInternalMarkdownPath(url, contextPath) {
  if (
    !contextPath ||
    !url ||
    url.startsWith("/") ||
    url.startsWith("http") ||
    url.startsWith("docs/")
  ) {
    return url;
  }

  const contextDir = contextPath.substring(0, contextPath.lastIndexOf("/"));
  let resolvedUrl = url;

  if (resolvedUrl.startsWith("./")) {
    resolvedUrl = resolvedUrl.substring(2);
  }

  if (resolvedUrl.startsWith("../")) {
    const upLevels = (resolvedUrl.match(/\.\.\//g) || []).length;
    const parts = contextDir.split("/");
    const resolvedDir = parts.slice(0, parts.length - upLevels).join("/");
    resolvedUrl = resolvedDir + "/" + resolvedUrl.replace(/\.\.\//g, "");
  } else {
    resolvedUrl = contextDir + "/" + resolvedUrl;
  }

  return resolvedUrl;
}

function resolveInternalRef(url, contextPath) {
  if (!url) return null;

  const [rawPath, ...fragmentParts] = url.split("#");
  const resolvedPath = resolveInternalMarkdownPath(rawPath, contextPath);
  const fragment = fragmentParts.length > 0 ? fragmentParts.join("#") : null;

  return {
    path: resolvedPath,
    fragment,
  };
}

function viewIdForDocPath(path) {
  if (path.includes("/beobachtungen/")) return "beobachtungen";
  if (path.includes("/feedback/")) return "feedback";
  if (path.includes("/tagebuch/")) return "tagebuch";
  if (path.includes("/entscheidungen/")) return "entscheidungen";
  if (path.includes("/icf-reports/")) return "icf-reports";
  if (path.includes("/hypothesen.md")) return "hypothesen";
  if (path.includes("/projektplan.md")) return "projektplan";
  if (path.includes("/reflexion.md")) return "reflexion";
  if (path.startsWith("meta/") || path.includes("/meta/")) return "meta";
  if (path.startsWith("models/") || path.includes("/models/")) return "modelle";
  if (path.includes("/intervention/")) return "intervention";
  if (path.includes("/gruppennachweis/kapitel/")) return "gruppennachweis-kapitel";
  if (path.includes("/gruppennachweis/_compiled.md")) return "gruppennachweis";
  if (
    path.includes("/gruppennachweis/_contract.md") ||
    path.includes("/gruppennachweis/_state.md") ||
    path.includes("/gruppennachweis/mapping/") ||
    path.includes("/gruppennachweis/apparat/")
  ) {
    return "gruppennachweis-meta";
  }
  return "start";
}

function renderInlineText(container, text, contextPath = null) {
  if (!text) return;
  // Simple regex to split text into tokens
  const parts = text.split(/(\*\*.*?\*\*|_.*?_|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);

  parts.forEach((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      container.appendChild(strong);
    } else if ((part.startsWith("_") && part.endsWith("_")) || (part.startsWith("*") && part.endsWith("*"))) {
      const em = document.createElement("em");
      em.textContent = part.slice(1, -1);
      container.appendChild(em);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      const code = document.createElement("code");
      code.textContent = part.slice(1, -1);
      container.appendChild(code);
    } else if (
      part.startsWith("[") &&
      part.includes("](") &&
      part.endsWith(")")
    ) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        let url = match[2];
        const isExternalLike = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url);
        const resolvedRefCandidate = !isExternalLike
          ? resolveInternalRef(url, contextPath)
          : null;
        const resolvedPath = resolvedRefCandidate?.path || "";
        const isInternalMarkdownRef = !isExternalLike && /\.md($|#)/.test(url);
        const isInternalIcfHtmlRef =
          !isExternalLike && /\/icf-reports\/.+\.html$/.test(resolvedPath);

        if (isInternalMarkdownRef || isInternalIcfHtmlRef) {
          const a = document.createElement("a");
          a.textContent = match[1];

          const resolvedRef = resolvedRefCandidate;
          if (!resolvedRef?.path) {
            container.appendChild(document.createTextNode(match[1]));
            return;
          }

          const canonicalRef = resolvedRef.fragment
            ? `${resolvedRef.path}#${resolvedRef.fragment}`
            : resolvedRef.path;
          a.title = canonicalRef;
          const targetViewId = viewIdForDocPath(resolvedRef.path);
          a.href = `#${targetViewId}?src=${encodeURIComponent(canonicalRef)}${resolvedRef.fragment ? '&frag=' + encodeURIComponent(resolvedRef.fragment) : ''}`;
          container.appendChild(a);
        } else {
          // Whitelist allowed external protocols
          let isAllowed = false;
          try {
            const parsedUrl = new URL(url);
            if (
              ["http:", "https:", "mailto:", "tel:"].includes(
                parsedUrl.protocol,
              )
            ) {
              isAllowed = true;
            }
          } catch (e) {
            // Invalid URL, ignore as link
          }

          if (isAllowed) {
            const a = document.createElement("a");
            a.textContent = match[1];
            a.href = url;
            if (url.startsWith("http")) {
              a.target = "_blank";
              a.rel = "noopener noreferrer";
            }
            container.appendChild(a);
          } else {
            // Render as plain text for unsafe/unsupported URLs
            container.appendChild(document.createTextNode(match[1]));
          }
        }
      }
    } else if (part) {
      container.appendChild(document.createTextNode(part));
    }
  });
}

function renderEmptyState(root, text) {
  const p = document.createElement("p");
  p.textContent = text;
  root.appendChild(p);
}

function sanitizeImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("/images/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch (e) {}
  return null;
}

function extractFirstSnippet(sections) {
  let fallbackText = "";

  for (const s of sections) {
    const blocks = s.blocks ?? [];

    for (const b of blocks) {
      if (b.type === "text") {
        if (!fallbackText) fallbackText = b.text;
        if (b.text.length > 20) return b.text;
      } else if (b.type === "list" && b.items && b.items.length > 0) {
        if (!fallbackText) fallbackText = b.items[0];
        for (const item of b.items) {
          if (item.length > 20) return item;
        }
      }
    }
  }

  return fallbackText;
}

function createSummarySection(title, contentSnippet) {
  const section = document.createElement("section");
  section.className = "section-block";

  const heading = document.createElement("h4");
  heading.textContent = title;
  section.appendChild(heading);

  if (contentSnippet) {
    const p = document.createElement("p");
    renderInlineText(p, contentSnippet);
    section.appendChild(p);
  }
  return section;
}

const blockRenderers = {
  hr: (b, container) => {
    container.appendChild(document.createElement("hr"));
  },
  blockquote: (b, container, contextPath) => {
    const blockquote = document.createElement("blockquote");
    renderInlineText(blockquote, b.text, contextPath);
    container.appendChild(blockquote);
  },
  table: (b, container, contextPath) => {
    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";

    const table = document.createElement("table");
    table.className = "markdown-table";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    b.headers.forEach(headerText => {
      const th = document.createElement("th");
      renderInlineText(th, headerText, contextPath);
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    b.rows.forEach(row => {
      const tr = document.createElement("tr");
      row.forEach(cellText => {
        const td = document.createElement("td");
        renderInlineText(td, cellText, contextPath);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);
    container.appendChild(wrapper);
  },

  text: (b, container, contextPath) => {
    const p = document.createElement("p");
    renderInlineText(p, b.text, contextPath);
    container.appendChild(p);
  },
  list: (b, container, contextPath) => {
    const listEl = document.createElement(b.ordered ? "ol" : "ul");
    b.items.forEach((item) => {
      const li = document.createElement("li");
      renderInlineText(li, item, contextPath);
      listEl.appendChild(li);
    });
    container.appendChild(listEl);
  },
  image: (b, container) => {
    const safeUrl = sanitizeImageUrl(b.url);
    if (!safeUrl) {
      const fallback = document.createElement("p");
      fallback.className = "meta";
      fallback.textContent = "[Bild konnte nicht geladen werden]";
      container.appendChild(fallback);
      return;
    }
    const img = document.createElement("img");
    img.src = safeUrl;
    img.alt = b.alt || "Projektbild";
    img.className = "content-image";
    img.loading = "lazy";
    container.appendChild(img);
  },
  code: (b, container) => {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = b.text;
    pre.appendChild(code);
    container.appendChild(pre);
  },
};

function renderBlock(block, container, contextPath) {
  if (blockRenderers[block.type]) {
    blockRenderers[block.type](block, container, contextPath);
  } else {
    const p = document.createElement("p");
    p.className = "unknown-block-type";
    p.textContent = "[Unbekannter Blocktyp]";
    container.appendChild(p);
  }
}

function createSectionBlock(section, contextPath) {
  const sectionEl = document.createElement("section");
  sectionEl.className = "section-block";

  const heading = document.createElement("h4");
  heading.textContent = section.heading;
  sectionEl.appendChild(heading);

  if (section.blocks && section.blocks.length > 0) {
    section.blocks.forEach((block) =>
      renderBlock(block, sectionEl, contextPath),
    );
  }

  return sectionEl;
}

function createFileCard(entry) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.path = entry.path;

  const title = document.createElement("h3");
  title.textContent = entry.title;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = entry.path;
  card.appendChild(meta);

  entry.sections.forEach((section, index) => {
    if (index === 0 && section.heading === entry.title) {
      if (section.blocks && section.blocks.length > 0) {
        const bulletOnly = createSectionBlock(
          {
            heading: "",
            blocks: section.blocks,
          },
          entry.path,
        );
        const heading = bulletOnly.querySelector("h4");
        if (heading) heading.remove();
        card.appendChild(bulletOnly);
      }
      return;
    }

    card.appendChild(createSectionBlock(section, entry.path));
  });

  return card;
}

function normalizeSourcePath(src) {
  if (!src) return null;
  return src.split("#")[0];
}

function addSourceHighlights(cards, params) {
  const sourceRef = params?.get("src");
  if (!sourceRef) return;

  const sourcePath = normalizeSourcePath(sourceRef);
  cards.forEach(({ entryPath, card }) => {
    if (entryPath === sourcePath) {
      card.classList.add("highlight");
    }
  });
}

function renderEntries(root, entries, params) {
  const cards = entries.map((entry) => {
    const card = createFileCard(entry);
    root.appendChild(card);
    return { entryPath: entry.path, card };
  });
  addSourceHighlights(cards, params);
}

function createHtmlFileCard(report) {
  const entry = report.html;
  const card = document.createElement("article");
  card.className = "card icf-report-card";

  const title = document.createElement("h3");
  title.textContent = report.title;
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "meta icf-report-meta";
  meta.textContent = entry.path;
  card.appendChild(meta);

  const iframe = document.createElement("iframe");
  iframe.className = "icf-report-frame";

  // Use srcdoc with raw content
  iframe.setAttribute("sandbox", "");
  iframe.srcdoc = entry.content;

  iframe.loading = "lazy";
  iframe.title = `ICF Report: ${report.title}`;
  card.appendChild(iframe);

  return card;
}

export function renderStart(root, data) {
  const article = document.createElement("article");
  article.className = "start-page card dashboard-hero";

  const intro = document.createElement("p");
  intro.textContent =
    "Willkommen zur Projekt-Dokumentation. Diese Oberfläche dient der strukturierten Einsicht in den Entwicklungsprozess, um Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen.";
  article.appendChild(intro);

  if (data.projektplan) {
    const focusSection = document.createElement("section");
    focusSection.className = "section-block project-context-block";

    const h4 = document.createElement("h4");
    h4.textContent = "Worum geht es in diesem Projekt?";
    focusSection.appendChild(h4);

    let firstText = "Ein Projektplan ist hinterlegt.";
    for (const section of data.projektplan.sections) {
      const blocks = section.blocks ?? [];
      const tb = blocks.find((b) => b.type === "text" && b.text.length > 20);
      if (tb) {
        firstText = tb.text;
        break;
      }
    }

    const p = document.createElement("p");
    p.textContent = firstText;
    focusSection.appendChild(p);
    article.appendChild(focusSection);
  }

  // Find first image of the most recent diary entry containing an image
  const getLatestDiaryImage = () => {
    for (const entry of data.tagebuch) {
      for (const section of entry.sections) {
        const imgBlock = section.blocks?.find((b) => b.type === "image");
        if (imgBlock) return imgBlock;
      }
    }
    return null;
  };

  const latestImage = getLatestDiaryImage();
  const safeHeroUrl = latestImage ? sanitizeImageUrl(latestImage.url) : null;

  if (safeHeroUrl) {
    const resultSection = document.createElement("section");
    resultSection.className = "section-block project-context-block";

    const h4 = document.createElement("h4");
    h4.textContent = "Aktuelles Ergebnis";
    resultSection.appendChild(h4);

    const img = document.createElement("img");
    img.src = safeHeroUrl;
    img.alt = latestImage.alt || "Projektbild";
    img.className = "content-image hero-image";
    // Loading lazy is omitted here to keep hero image fast
    resultSection.appendChild(img);

    article.appendChild(resultSection);
  }

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "status-cards";

  const areas = [
    {
      label: "Projektplan",
      status: data.projektplan ? "Vorhanden" : "Fehlt",
      type: data.projektplan ? "complete" : "empty",
    },
    {
      label: "Tagebuch-Einträge",
      status: data.tagebuch.length,
      type: data.tagebuch.length > 0 ? "complete" : "empty",
    },
    {
      label: "Beobachtungen",
      status: data.beobachtungen.length,
      type: data.beobachtungen.length > 0 ? "complete" : "empty",
    },
    {
      label: "Hypothesen",
      status:
        (data.hypothesen?.hypothesisBlocks || []).length > 0
          ? `${data.hypothesen.hypothesisBlocks.length} strukturiert`
          : "0",
      type:
        (data.hypothesen?.hypothesisBlocks || []).length > 0
          ? "partial"
          : "empty",
    },
    {
      label: "Entscheidungen",
      status: data.entscheidungen.length,
      type: data.entscheidungen.length > 0 ? "complete" : "empty",
    },
    {
      label: "Feedback",
      status: data.feedback ? data.feedback.length : 0,
      type: data.feedback && data.feedback.length > 0 ? "complete" : "empty",
    },
    {
      label: "ICF-Reports",
      status: data.icfReports.length > 0 ? "Vorhanden" : "Fehlt",
      type: data.icfReports.length > 0 ? "complete" : "empty",
    },
    {
      label: "Gruppennachweis",
      status:
        data.gruppennachweis && data.gruppennachweis.compiled
          ? "Vorhanden"
          : "Fehlt",
      type:
        data.gruppennachweis && data.gruppennachweis.compiled
          ? "complete"
          : "empty",
    },
  ];

  areas.forEach((area) => {
    const card = document.createElement("div");
    card.className = `status-card status--${area.type}`;

    const label = document.createElement("div");
    label.className = "status-label";
    label.textContent = area.label;

    const value = document.createElement("div");
    value.className = "status-value";
    value.textContent = area.status;

    card.appendChild(label);
    card.appendChild(value);
    cardsContainer.appendChild(card);
  });

  article.appendChild(cardsContainer);
  root.appendChild(article);
}

export function renderTagebuch(root, data, params) {
  renderEntries(root, data.tagebuch, params);
}

export function renderBeobachtungen(root, data, params) {
  renderEntries(root, data.beobachtungen, params);
}

export function renderEntscheidungen(root, data, params) {
  const sourcePath = normalizeSourcePath(params?.get("src"));
  data.entscheidungen.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "card decision-card";
    if (sourcePath && entry.path === sourcePath) {
      card.classList.add("highlight");
    }

    const title = document.createElement("h3");
    title.textContent = entry.title;
    card.appendChild(title);

    const blocks = entry.decisionBlocks ?? [];

    const hideDefaultHeading =
      blocks.length === 1 &&
      blocks[0].heading === "Entscheidung" &&
      blocks[0].implicit;

    blocks.forEach((decisionBlock) => {
      const blockCard = document.createElement("section");
      blockCard.className = "decision-block";

      if (!hideDefaultHeading) {
        const subtitle = document.createElement("h4");
        subtitle.textContent = decisionBlock.heading;
        blockCard.appendChild(subtitle);
      }

      const detailsContainer = document.createElement("div");
      detailsContainer.className = "decision-details-grid";

      const detailsEntries = [
        ["Maßnahme", decisionBlock.massnahme],
        ["Begründung", decisionBlock.begruendung],
        ["Ziel", decisionBlock.ziel],
        ["Prüfhinweis / Messkriterien", decisionBlock.pruefhinweis],
      ];

      if (
        decisionBlock.bezugZurHypothese &&
        decisionBlock.bezugZurHypothese.length > 0
      ) {
        detailsEntries.push([
          "Bezug zur Hypothese",
          decisionBlock.bezugZurHypothese,
        ]);
      }

      detailsEntries.forEach(([label, values]) => {
        const detailSection = document.createElement("section");
        detailSection.className = "section-block detail-box";

        const h5 = document.createElement("h5");
        h5.textContent = label;
        detailSection.appendChild(h5);

        const ul = document.createElement("ul");
        const list = values.length > 0 ? values : ["Nicht explizit angegeben"];
        list.forEach((value) => {
          const li = document.createElement("li");
          renderInlineText(li, value, entry.path);
          ul.appendChild(li);
        });

        detailSection.appendChild(ul);
        detailsContainer.appendChild(detailSection);
      });

      blockCard.appendChild(detailsContainer);
      card.appendChild(blockCard);
    });

    root.appendChild(card);
  });
}

export function cleanStatusComment(entry) {
  if (!entry || !entry.sections) return entry;

  // Create a deep copy to not mutate the original data
  const cleanedEntry = JSON.parse(JSON.stringify(entry));

  cleanedEntry.sections.forEach((section) => {
    if (section.blocks) {
      // Filter out text blocks that contain exactly the status comment
      section.blocks = section.blocks.filter((block) => {
        if (block.type === "text") {
          const text = block.text.trim();
          // Remove HTML comments like <!-- status: draft -->
          if (
            text.startsWith("<!--") &&
            text.endsWith("-->") &&
            text.includes("status:")
          ) {
            return false;
          }
        }
        return true;
      });
    }
  });

  return cleanedEntry;
}

export function renderSimpleDoc(root, doc) {
  if (!doc) {
    const p = document.createElement("p");
    p.textContent = "Keine Daten gefunden.";
    root.appendChild(p);
    return;
  }

  root.appendChild(createFileCard(doc));
}

export function renderProjektplan(root, data, params) {
  const card = data.projektplan ? createFileCard(data.projektplan) : null;
  if (!card) return renderSimpleDoc(root, data.projektplan);
  if (normalizeSourcePath(params?.get("src")) === data.projektplan.path) {
    card.classList.add("highlight");
  }
  root.appendChild(card);
}

export function renderICFReports(root, data) {
  if (!data.icfReports.length)
    return renderEmptyState(root, "Keine ICF-Reports vorhanden.");

  data.icfReports.forEach((report) => {
    const group = document.createElement("section");
    group.className = "icf-report-group";

    const explainer = document.createElement("div");
    explainer.className = "icf-explainer";
    explainer.textContent = "Formale ICF-Dokumentation";
    group.appendChild(explainer);

    if (report.md) {
      const label = document.createElement("div");
      label.className = "icf-format-label";
      label.textContent = "Markdown (Arbeitsversion)";
      group.appendChild(label);
      group.appendChild(createFileCard(report.md));
    }
    if (report.html) {
      const details = document.createElement("details");
      details.className = "icf-html-details";
      details.open = true;
      const summary = document.createElement("summary");
      summary.textContent = "Formale ICF-Ansicht (HTML) ein-/ausblenden";
      details.appendChild(summary);

      details.appendChild(createHtmlFileCard(report));
      group.appendChild(details);
    }

    root.appendChild(group);
  });
}

export function renderMeta(root, data, params) {
  if (!data.meta.length)
    return renderEmptyState(root, "Keine Meta-Daten vorhanden.");
  renderEntries(root, data.meta, params);
}

export function renderModels(root, data, params) {
  if (!data.models || !data.models.length)
    return renderEmptyState(root, "Keine Modelle vorhanden.");

  const sourceRef = params?.get("src");
  const sourcePath = normalizeSourcePath(sourceRef);

  // Extract index.md
  const indexModel = data.models.find(e => e.path === 'models/index.md' || e.path === 'index.md');
  const otherModels = data.models.filter(e => e.path !== 'models/index.md' && e.path !== 'index.md');

  // Render global index first
  if (indexModel) {
    const indexCard = document.createElement("article");
    indexCard.className = "card model-index-card";
    indexCard.dataset.path = indexModel.path;

    if (indexModel.path === sourcePath) {
      indexCard.classList.add("highlight");
    }

    const title = document.createElement("h2");
    title.textContent = indexModel.title || "Modelle im Überblick";
    indexCard.appendChild(title);

    // Render sections of the index
    indexModel.sections.forEach((section, index) => {
      if (index === 0 && section.heading === indexModel.title) {
        if (section.blocks && section.blocks.length > 0) {
          const bulletOnly = createSectionBlock(
            { heading: "", blocks: section.blocks },
            indexModel.path
          );
          const heading = bulletOnly.querySelector("h4");
          if (heading) heading.remove();
          indexCard.appendChild(bulletOnly);
        }
        return;
      }

      const secBlock = createSectionBlock(section, indexModel.path);
      indexCard.appendChild(secBlock);
    });

    root.appendChild(indexCard);
  }

  // Render other models
  otherModels.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "card model-card";
    card.dataset.path = entry.path;
    if (entry.path === sourcePath) {
      card.classList.add("highlight");
    }

    const title = document.createElement("h3");
    title.textContent = entry.title;
    card.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = entry.path;
    card.appendChild(meta);

    // Render sections
    entry.sections.forEach((section, index) => {
      if (index === 0 && section.heading === entry.title) {
        if (section.blocks && section.blocks.length > 0) {
          const bulletOnly = createSectionBlock(
            { heading: "", blocks: section.blocks },
            entry.path
          );
          const heading = bulletOnly.querySelector("h4");
          if (heading) heading.remove();
          card.appendChild(bulletOnly);
        }
        return;
      }

      const secBlock = createSectionBlock(section, entry.path);
      secBlock.classList.add("model-section-block");
      card.appendChild(secBlock);
    });

    root.appendChild(card);
  });
}
export function renderAktuellerStand(root, data) {
  const container = document.createElement("div");
  container.className = "dashboard-grid";

  // [ HERO / HEAD ]
  const hero = document.createElement("article");
  hero.className = "dashboard-hero";

  const introTitle = document.createElement("h2");
  introTitle.textContent = "Aktueller Projektstand";
  hero.appendChild(introTitle);

  let heroText =
    "Kompakter Überblick über den aktuellen Projektstand, extrahiert aus den jüngsten Dokumentationen.";
  if (data.projektplan) {
    const snippet = extractFirstSnippet(data.projektplan.sections);
    if (snippet) heroText = snippet;
  }
  const introP = document.createElement("p");
  introP.textContent = heroText;
  hero.appendChild(introP);
  container.appendChild(hero);

  // [ PRIMARY BLOCKS - max 3 ]
  const primaryGrid = document.createElement("div");
  primaryGrid.className = "primary-blocks";

  // 1. Zuletzt passiert
  if (data.tagebuch && data.tagebuch.length > 0) {
    const latest = data.tagebuch[0];
    const card = document.createElement("div");
    card.className = "card";
    card.appendChild(
      createSummarySection(
        "Zuletzt passiert",
        extractFirstSnippet(latest.sections) || latest.title,
      ),
    );
    primaryGrid.appendChild(card);
  }

  // 2. Aktive Hypothesen
  if (
    data.hypothesen &&
    data.hypothesen.hypothesisBlocks &&
    data.hypothesen.hypothesisBlocks.length > 0
  ) {
    const activeHypothesen = data.hypothesen.hypothesisBlocks.filter(
      (h) =>
        h.normalizedStatus === "aktiv_geprueft" ||
        h.normalizedStatus === "offen",
    );
    if (activeHypothesen.length > 0) {
      const h = activeHypothesen[0];
      const card = document.createElement("div");
      card.className = "card";
      const aussageText =
        h.aussage.length > 0 ? h.aussage.join(" ") : "Noch unklar.";
      card.appendChild(createSummarySection("Zentrale Hypothese", aussageText));
      primaryGrid.appendChild(card);
    }
  }

  // 3. Letzte Entscheidung
  if (data.entscheidungen && data.entscheidungen.length > 0) {
    const latest = data.entscheidungen[0];
    const card = document.createElement("div");
    card.className = "card";
    let content = latest.title;
    if (latest.decisionBlocks && latest.decisionBlocks.length > 0) {
      const block = latest.decisionBlocks[0];
      if (block.massnahme.length > 0) {
        content = block.massnahme[0];
      } else if (block.begruendung && block.begruendung.length > 0) {
        content = block.begruendung[0];
      }
    }
    card.appendChild(createSummarySection("Letzte Entscheidung", content));
    primaryGrid.appendChild(card);
  }

  container.appendChild(primaryGrid);

  // [ SECONDARY BLOCKS ]
  const secondaryGrid = document.createElement("div");
  secondaryGrid.className = "secondary-blocks";

  // Feedback
  if (data.feedback && data.feedback.length > 0) {
    const card = document.createElement("div");
    card.className = "card";
    const latest = data.feedback[0];
    card.appendChild(
      createSummarySection(
        "Jüngstes Feedback",
        extractFirstSnippet(latest.sections) || latest.title,
      ),
    );
    secondaryGrid.appendChild(card);
  }

  // Beobachtungen
  if (data.beobachtungen && data.beobachtungen.length > 0) {
    const card = document.createElement("div");
    card.className = "card";
    const latest = data.beobachtungen[0];
    card.appendChild(
      createSummarySection(
        "Letzte Beobachtung",
        extractFirstSnippet(latest.sections) || latest.title,
      ),
    );
    secondaryGrid.appendChild(card);
  }

  // ICF
  const icfCard = document.createElement("div");
  icfCard.className = "card";
  const icfSnippet =
    data.icfReports.length > 0
      ? "ICF-Reports liegen vor und stützen die Beobachtungen mit normierter Evidenz."
      : "Noch keine normierten ICF-Reports verknüpft.";
  icfCard.appendChild(createSummarySection("Evidenz & Rahmen", icfSnippet));
  secondaryGrid.appendChild(icfCard);

  container.appendChild(secondaryGrid);
  root.appendChild(container);
}

export function renderFeedback(root, data, params) {
  if (!data.feedback || data.feedback.length === 0)
    return renderEmptyState(root, "Bislang kein Feedback erfasst.");
  renderEntries(root, data.feedback, params);
}

export function renderHypothesen(root, data, params) {
  if (
    !data.hypothesen ||
    !data.hypothesen.hypothesisBlocks ||
    data.hypothesen.hypothesisBlocks.length === 0
  )
    return renderEmptyState(root, "Keine strukturierten Hypothesen gefunden.");

  const shouldHighlightSource =
    normalizeSourcePath(params?.get("src")) === data.hypothesen.path;

  data.hypothesen.hypothesisBlocks.forEach((block, index) => {
    const card = document.createElement("article");
    card.className = "card hypothesis-card";
    if (shouldHighlightSource && index === 0) {
      card.classList.add("highlight");
    }

    // Titel = Aussage
    const title = document.createElement("h3");
    title.className = "hypothesis-title";

    const metaSpan = document.createElement("span");
    metaSpan.className = "meta";
    metaSpan.textContent = block.id
      ? `${block.id} – ${block.heading}`
      : block.heading;
    title.appendChild(metaSpan);

    title.appendChild(document.createElement("br"));

    const aussageSpan = document.createElement("span");
    if (block.aussage.length > 0) {
      renderInlineText(
        aussageSpan,
        block.aussage.join(" "),
        data.hypothesen?.path,
      );
    } else {
      aussageSpan.textContent = "Aussage noch unklar";
    }
    title.appendChild(aussageSpan);

    card.appendChild(title);

    // Badges Row
    const badgesRow = document.createElement("div");
    badgesRow.className = "hypothesis-badges";

    const badgesData = [
      { label: "Status", values: block.status },
      {
        label: "Kategorie",
        values:
          block.kategorie.length > 0
            ? block.kategorie
            : block.normalizedCategory
              ? [block.normalizedCategory]
              : [],
      },
      { label: "Steuerung", values: block.steuerungsrelevanz },
    ];

    badgesData.forEach((bd) => {
      const valText = bd.values.length > 0 ? bd.values.join(", ") : "unklar";
      const badge = document.createElement("span");
      badge.className = "badge";

      const labelSpan = document.createElement("span");
      labelSpan.className = "badge-label";
      labelSpan.textContent = bd.label + ":";
      badge.appendChild(labelSpan);

      badge.appendChild(document.createTextNode(" " + valText));
      badgesRow.appendChild(badge);
    });

    card.appendChild(badgesRow);

    // Details Grid
    const detailsGrid = document.createElement("div");
    detailsGrid.className = "hypothesis-grid";

    const leftCol = document.createElement("div");
    leftCol.className = "hypothesis-grid-left";

    const rightCol = document.createElement("div");
    rightCol.className = "hypothesis-grid-right";

    const renderDetailSection = (label, values, targetCol) => {
      const detailSection = document.createElement("section");
      detailSection.className = "hypothesis-section";

      const h5 = document.createElement("h5");
      h5.textContent = label;
      detailSection.appendChild(h5);

      const ul = document.createElement("ul");
      const list = values.length > 0 ? values : ["nicht explizit angegeben"];
      list.forEach((value) => {
        const li = document.createElement("li");
        renderInlineText(li, value, data.hypothesen?.path);
        ul.appendChild(li);
      });
      detailSection.appendChild(ul);
      targetCol.appendChild(detailSection);
    };

    renderDetailSection(
      "Alternativerklärung",
      block.alternativerklaerung,
      leftCol,
    );
    renderDetailSection("Prüfweg", block.pruefweg, leftCol);
    renderDetailSection("Gestützt durch", block.gestuetztDurch, rightCol);

    detailsGrid.appendChild(leftCol);
    detailsGrid.appendChild(rightCol);

    card.appendChild(detailsGrid);
    root.appendChild(card);
  });
}

export function renderIntervention(root, data, params) {
  if (!data.intervention || data.intervention.length === 0)
    return renderEmptyState(root, "Keine Interventionen vorhanden.");
  renderEntries(root, data.intervention, params);
}

export function renderGruppennachweis(root, data, params) {
  if (!data.gruppennachweis || !data.gruppennachweis.compiled) {
    return renderEmptyState(
      root,
      "Kein Gruppennachweis (Kompilierte Fassung) vorhanden.",
    );
  }
  const entry = cleanStatusComment(data.gruppennachweis.compiled);
  const card = createFileCard(entry);
  if (normalizeSourcePath(params?.get("src")) === entry.path) {
    card.classList.add("highlight");
  }
  root.appendChild(card);
}

export function renderGruppennachweisKapitel(root, data, params) {
  if (
    !data.gruppennachweis ||
    !data.gruppennachweis.kapitel ||
    data.gruppennachweis.kapitel.length === 0
  ) {
    return renderEmptyState(
      root,
      "Keine Kapitel für den Gruppennachweis gefunden.",
    );
  }
  renderEntries(
    root,
    data.gruppennachweis.kapitel.map((k) => cleanStatusComment(k)),
    params,
  );
}

export function renderGruppennachweisMeta(root, data, params) {
  if (!data.gruppennachweis) {
    return renderEmptyState(
      root,
      "Keine Metadaten für den Gruppennachweis vorhanden.",
    );
  }

  let hasContent = false;

  if (data.gruppennachweis.contract) {
    const card = createFileCard(cleanStatusComment(data.gruppennachweis.contract));
    if (normalizeSourcePath(params?.get("src")) === data.gruppennachweis.contract.path) {
      card.classList.add("highlight");
    }
    root.appendChild(card);
    hasContent = true;
  }
  if (data.gruppennachweis.state) {
    const card = createFileCard(cleanStatusComment(data.gruppennachweis.state));
    if (normalizeSourcePath(params?.get("src")) === data.gruppennachweis.state.path) {
      card.classList.add("highlight");
    }
    root.appendChild(card);
    hasContent = true;
  }

  if (data.gruppennachweis.mapping && data.gruppennachweis.mapping.length > 0) {
    renderEntries(
      root,
      data.gruppennachweis.mapping.map((m) => cleanStatusComment(m)),
      params,
    );
    hasContent = true;
  }

  if (data.gruppennachweis.apparat && data.gruppennachweis.apparat.length > 0) {
    renderEntries(
      root,
      data.gruppennachweis.apparat.map((a) => cleanStatusComment(a)),
      params,
    );
    hasContent = true;
  }

  if (!hasContent) {
    renderEmptyState(
      root,
      "Keine Metadaten für den Gruppennachweis vorhanden.",
    );
  }
}
