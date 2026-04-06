

function renderInlineText(container, text) {
  if (!text) return;
  // Simple regex to split text into tokens
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  parts.forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = part.slice(2, -2);
      container.appendChild(strong);
    } else if (part.startsWith('`') && part.endsWith('`')) {
      const code = document.createElement('code');
      code.textContent = part.slice(1, -1);
      container.appendChild(code);
    } else if (part) {
      container.appendChild(document.createTextNode(part));
    }
  });
}

function renderEmptyState(root, text) {
  const p = document.createElement('p');
  p.textContent = text;
  root.appendChild(p);
}

function extractFirstSnippet(sections) {
  let fallbackText = '';

  for (const s of sections) {
    const blocks = s.blocks ?? [];

    for (const b of blocks) {
      if (b.type === 'text') {
        if (!fallbackText) fallbackText = b.text;
        if (b.text.length > 20) return b.text;
      } else if (b.type === 'list' && b.items && b.items.length > 0) {
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
  const section = document.createElement('section');
  section.className = 'section-block';

  const heading = document.createElement('h4');
  heading.textContent = title;
  section.appendChild(heading);

  if (contentSnippet) {
    const p = document.createElement('p');
    renderInlineText(p, contentSnippet);
    section.appendChild(p);
  }
  return section;
}

const blockRenderers = {
  text: (b, container) => {
    const p = document.createElement('p');
    renderInlineText(p, b.text);
    container.appendChild(p);
  },
  list: (b, container) => {
    const listEl = document.createElement(b.ordered ? 'ol' : 'ul');
    b.items.forEach(item => {
      const li = document.createElement('li');
      renderInlineText(li, item);
      listEl.appendChild(li);
    });
    container.appendChild(listEl);
  },
  code: (b, container) => {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = b.text;
    pre.appendChild(code);
    container.appendChild(pre);
  }
};

function renderBlock(block, container) {
  if (blockRenderers[block.type]) {
    blockRenderers[block.type](block, container);
  } else {
    const p = document.createElement('p');
    p.className = 'unknown-block-type';
    p.textContent = '[Unbekannter Blocktyp]';
    container.appendChild(p);
  }
}

function createSectionBlock(section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section-block';

  const heading = document.createElement('h4');
  heading.textContent = section.heading;
  sectionEl.appendChild(heading);

  if (section.blocks && section.blocks.length > 0) {
    section.blocks.forEach((block) => renderBlock(block, sectionEl));
  }

  return sectionEl;
}

function createFileCard(entry) {
  const card = document.createElement('article');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = entry.title;
  card.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.textContent = entry.path;
  card.appendChild(meta);

  entry.sections.forEach((section, index) => {
    if (index === 0 && section.heading === entry.title) {
      if (section.blocks && section.blocks.length > 0) {
        const bulletOnly = createSectionBlock({ heading: '', blocks: section.blocks });
        const heading = bulletOnly.querySelector('h4');
        if (heading) heading.remove();
        card.appendChild(bulletOnly);
      }
      return;
    }

    card.appendChild(createSectionBlock(section));
  });

  return card;
}

function createHtmlFileCard(report) {
  const entry = report.html;
  const card = document.createElement('article');
  card.className = 'card icf-report-card';

  const title = document.createElement('h3');
  title.textContent = report.title;
  card.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'meta icf-report-meta';
  meta.textContent = entry.path;
  card.appendChild(meta);

  const iframe = document.createElement('iframe');
  iframe.className = 'icf-report-frame';

  // Use srcdoc with raw content
  iframe.setAttribute('sandbox', '');
  iframe.srcdoc = entry.content;

  iframe.loading = 'lazy';
  iframe.title = `ICF Report: ${report.title}`;
  card.appendChild(iframe);

  return card;
}

export function renderStart(root, data) {
  const article = document.createElement('article');
  article.className = 'start-page card';

  const intro = document.createElement('p');
  intro.textContent = 'Willkommen zur Projekt-Dokumentation. Diese Oberfläche dient der strukturierten Einsicht in den Entwicklungsprozess, um Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen.';
  article.appendChild(intro);

  if (data.projektplan) {
    const focusSection = document.createElement('section');
    focusSection.className = 'section-block project-context-block';

    const h4 = document.createElement('h4');
    h4.textContent = 'Worum geht es in diesem Projekt?';
    focusSection.appendChild(h4);

    // Find the first non-empty text block in Projektplan
    let firstText = 'Ein Projektplan ist hinterlegt.';
    for (const section of data.projektplan.sections) {
      const blocks = section.blocks ?? [];
      const tb = blocks.find(b => b.type === 'text' && b.text.length > 20);
      if (tb) {
        firstText = tb.text;
        break;
      }
    }

    const p = document.createElement('p');
    p.textContent = firstText;

    focusSection.appendChild(p);
    article.appendChild(focusSection);
  }

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'status-cards';

  const areas = [
    { label: 'Projektplan', status: data.projektplan ? 'Vorhanden' : 'Fehlt' },
    { label: 'Tagebuch-Einträge', status: data.tagebuch.length },
    { label: 'Beobachtungen', status: data.beobachtungen.length },
    { label: 'Hypothesen', status: (data.hypothesen?.hypothesisBlocks || []).length > 0 ? `${data.hypothesen.hypothesisBlocks.length} strukturiert` : '0' },
    { label: 'Entscheidungen', status: data.entscheidungen.length },
    { label: 'Feedback-Einträge', status: data.feedback ? data.feedback.length : 0 },
    { label: 'ICF-Reports', status: data.icfReports.length > 0 ? 'Vorhanden' : 'Fehlt' }
  ];

  areas.forEach((area) => {
    const card = document.createElement('div');
    card.className = 'status-card';

    const label = document.createElement('div');
    label.className = 'status-label';
    label.textContent = area.label;

    const value = document.createElement('div');
    value.className = 'status-value';
    value.textContent = area.status;

    card.appendChild(label);
    card.appendChild(value);
    cardsContainer.appendChild(card);
  });

  article.appendChild(cardsContainer);
  root.appendChild(article);
}

export function renderTagebuch(root, data) {
  data.tagebuch.forEach((entry) => root.appendChild(createFileCard(entry)));
}

export function renderBeobachtungen(root, data) {
  data.beobachtungen.forEach((entry) => root.appendChild(createFileCard(entry)));
}

export function renderEntscheidungen(root, data) {
  data.entscheidungen.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'card decision-card';

    const title = document.createElement('h3');
    title.textContent = entry.title;
    card.appendChild(title);

    const blocks = entry.decisionBlocks ?? [];

    const hideDefaultHeading = blocks.length === 1 && blocks[0].heading === 'Entscheidung' && blocks[0].implicit;

    blocks.forEach((decisionBlock) => {
      const blockCard = document.createElement('section');
      blockCard.className = 'decision-block';

      if (!hideDefaultHeading) {
        const subtitle = document.createElement('h4');
        subtitle.textContent = decisionBlock.heading;
        blockCard.appendChild(subtitle);
      }

      const detailsContainer = document.createElement('div');
      detailsContainer.className = 'decision-details-grid';

      const details = {
        Maßnahme: decisionBlock.massnahme,
        Begründung: decisionBlock.begruendung,
        Ziel: decisionBlock.ziel,
        Prüfhinweis: decisionBlock.pruefhinweis
      };

      Object.entries(details).forEach(([label, values]) => {
        const detailSection = document.createElement('section');
        detailSection.className = 'section-block detail-box';

        const h5 = document.createElement('h5');
        h5.textContent = label;
        detailSection.appendChild(h5);

        const ul = document.createElement('ul');
        const list = values.length > 0 ? values : ['Nicht explizit angegeben'];
        list.forEach((value) => {
          const li = document.createElement('li');
          renderInlineText(li, value);
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

export function renderSimpleDoc(root, doc) {
  if (!doc) {
    const p = document.createElement('p');
    p.textContent = 'Keine Daten gefunden.';
    root.appendChild(p);
    return;
  }

  root.appendChild(createFileCard(doc));
}

export function renderProjektplan(root, data) {
  renderSimpleDoc(root, data.projektplan);
}

export function renderICFReports(root, data) {
  if (!data.icfReports.length) return renderEmptyState(root, 'Keine ICF-Reports vorhanden.');

  data.icfReports.forEach(report => {
    const group = document.createElement('section');
    group.className = 'icf-report-group';

    if (report.md) {
      const label = document.createElement('div');
      label.className = 'icf-format-label';
      label.textContent = 'Markdown';
      group.appendChild(label);
      group.appendChild(createFileCard(report.md));
    }
    if (report.html) {
      const details = document.createElement('details');
      details.className = 'icf-html-details';
      const summary = document.createElement('summary');
      summary.textContent = 'HTML-Ansicht einblenden';
      details.appendChild(summary);

      const label = document.createElement('div');
      label.className = 'icf-format-label';
      label.textContent = 'HTML';
      label.classList.add('icf-html-label');
      details.appendChild(label);

      details.appendChild(createHtmlFileCard(report));
      group.appendChild(details);
    }

    root.appendChild(group);
  });
}

export function renderMeta(root, data) {
  if (!data.meta.length) return renderEmptyState(root, 'Keine Meta-Daten vorhanden.');
  data.meta.forEach(entry => root.appendChild(createFileCard(entry)));
}

export function renderModels(root, data) {
  if (!data.models.length) return renderEmptyState(root, 'Keine Modelle vorhanden.');
  data.models.forEach(entry => root.appendChild(createFileCard(entry)));
}

export function renderAktuellerStand(root, data) {
  const article = document.createElement('article');
  article.className = 'stand-section card';

  const intro = document.createElement('p');
  intro.textContent = 'Kompakter Überblick über den aktuellen Projektstand, extrahiert aus den jüngsten Dokumentationen.';
  article.appendChild(intro);

  // 1. Projektkontext
  if (data.projektplan) {
    let snippet = extractFirstSnippet(data.projektplan.sections) || 'Projektplan ist angelegt.';
    article.appendChild(createSummarySection('Projektkontext', snippet));
  }

  // 2. Zuletzt passiert
  if (data.tagebuch && data.tagebuch.length > 0) {
    const latest = data.tagebuch[0];
    const section = createSummarySection('Zuletzt passiert');

    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latest.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    const snippet = extractFirstSnippet(latest.sections);
    if (snippet) {
      const p = document.createElement('p');
      p.textContent = snippet;
      section.appendChild(p);
    }
    article.appendChild(section);
  }

  // 3. Letzte Entscheidung
  if (data.entscheidungen && data.entscheidungen.length > 0) {
    const latest = data.entscheidungen[0];
    const section = createSummarySection('Letzte Entscheidung / Steuerung');

    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latest.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    if (latest.decisionBlocks && latest.decisionBlocks.length > 0) {
       const block = latest.decisionBlocks[0];
       if (block.massnahme.length > 0) {
         const p = document.createElement('p');
         p.textContent = 'Maßnahme: ' + block.massnahme[0];
         section.appendChild(p);
       } else if (block.begruendung.length > 0) {
         const p = document.createElement('p');
         p.textContent = 'Begründung: ' + block.begruendung[0];
         section.appendChild(p);
       }
    }
    article.appendChild(section);
  }

  // 4. Hypothesenlage
  if (data.hypothesen && data.hypothesen.hypothesisBlocks && data.hypothesen.hypothesisBlocks.length > 0) {
    const activeHypothesen = data.hypothesen.hypothesisBlocks.filter(h => h.normalizedStatus === 'aktiv_geprueft' || h.normalizedStatus === 'offen');
    const displayHypothesen = activeHypothesen.length > 0 ? activeHypothesen.slice(0, 2) : data.hypothesen.hypothesisBlocks.slice(0, 2);

    const section = createSummarySection('Hypothesenlage');
    const countP = document.createElement('p');
    countP.textContent = `Anzahl strukturierter Hypothesen: ${data.hypothesen.hypothesisBlocks.length} (${activeHypothesen.length} offen/aktiv geprüft).`;
    section.appendChild(countP);

    displayHypothesen.forEach(h => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = h.id ? `${h.id} – ${h.heading}: ` : `${h.heading}: `;
        p.appendChild(strong);
        const aussageText = h.aussage.length > 0 ? h.aussage.join(' ') : 'Noch unklar.';
        const span = document.createElement('span');
        renderInlineText(span, aussageText);
        p.appendChild(span);
        section.appendChild(p);
    });
    article.appendChild(section);
  }

  // 5. Jüngstes Feedback
  if (data.feedback && data.feedback.length > 0) {
    const latest = data.feedback[0];
    const section = createSummarySection('Jüngstes Feedback (Subjektive Perspektive)');

    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latest.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    const snippet = extractFirstSnippet(latest.sections) || 'Feedback-Dokument vorhanden.';
    const p = document.createElement('p');
    p.textContent = snippet;
    section.appendChild(p);
    article.appendChild(section);
  }

  // 6. Zentrale Beobachtung
  if (data.beobachtungen && data.beobachtungen.length > 0) {
    const latest = data.beobachtungen[0];
    const snippet = extractFirstSnippet(latest.sections) || latest.title;
    article.appendChild(createSummarySection('Zentrale Beobachtung', snippet));
  }

  // 7. Evidenz & Rahmen
  const icfSnippet = data.icfReports.length > 0
    ? 'ICF-Reports liegen vor und stützen die Beobachtungen mit normierter Evidenz.'
    : 'Noch keine normierten ICF-Reports verknüpft.';
  article.appendChild(createSummarySection('Evidenz & Rahmen', icfSnippet));

  root.appendChild(article);
}


export function renderFeedback(root, data) {
  if (!data.feedback || data.feedback.length === 0) return renderEmptyState(root, 'Bislang kein Feedback erfasst.');
  data.feedback.forEach((entry) => root.appendChild(createFileCard(entry)));
}


export function renderHypothesen(root, data) {
  if (!data.hypothesen || !data.hypothesen.hypothesisBlocks || data.hypothesen.hypothesisBlocks.length === 0) return renderEmptyState(root, 'Keine strukturierten Hypothesen gefunden.');

  data.hypothesen.hypothesisBlocks.forEach((block) => {
    const card = document.createElement('article');
    card.className = 'card hypothesis-card';

    const title = document.createElement('h3');
    title.textContent = block.id ? `${block.id} – ${block.heading}` : block.heading;
    card.appendChild(title);

    const blockCard = document.createElement('section');
    blockCard.className = 'hypothesis-block';

    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'hypothesis-details-grid';

    const details = {
      'Aussage': block.aussage,
      'Alternativerklärung': block.alternativerklaerung,
      'Prüfweg': block.pruefweg,
      'Status': block.status,
      'Kategorie': block.kategorie.length > 0 ? block.kategorie : (block.normalizedCategory ? [block.normalizedCategory] : []),
      'Gestützt durch': block.gestuetztDurch,
      'Steuerungsrelevanz': block.steuerungsrelevanz
    };

    Object.entries(details).forEach(([label, values]) => {
      const detailSection = document.createElement('section');
      detailSection.className = 'section-block detail-box';
      if (label === 'Status' || label === 'Steuerungsrelevanz' || label === 'Kategorie') {
         detailSection.classList.add('hypothesis-highlight');
      }


      const h5 = document.createElement('h5');
      h5.textContent = label;
      detailSection.appendChild(h5);

      const ul = document.createElement('ul');
      const list = values.length > 0 ? values : ['noch unklar'];
      list.forEach((value) => {
        const li = document.createElement('li');
        renderInlineText(li, value);
        ul.appendChild(li);
      });

      detailSection.appendChild(ul);
      detailsContainer.appendChild(detailSection);
    });

    blockCard.appendChild(detailsContainer);
    card.appendChild(blockCard);
    root.appendChild(card);
  });
}
