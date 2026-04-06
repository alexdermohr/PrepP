

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
  article.className = 'start-page card dashboard-hero';

  const intro = document.createElement('p');
  intro.textContent = 'Willkommen zur Projekt-Dokumentation. Diese Oberfläche dient der strukturierten Einsicht in den Entwicklungsprozess, um Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen.';
  article.appendChild(intro);

  if (data.projektplan) {
    const focusSection = document.createElement('section');
    focusSection.className = 'section-block project-context-block';

    const h4 = document.createElement('h4');
    h4.textContent = 'Worum geht es in diesem Projekt?';
    focusSection.appendChild(h4);

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
    { label: 'Projektplan', status: data.projektplan ? 'Vorhanden' : 'Fehlt', type: data.projektplan ? 'complete' : 'empty' },
    { label: 'Tagebuch-Einträge', status: data.tagebuch.length, type: data.tagebuch.length > 0 ? 'complete' : 'empty' },
    { label: 'Beobachtungen', status: data.beobachtungen.length, type: data.beobachtungen.length > 0 ? 'complete' : 'empty' },
    { label: 'Hypothesen', status: (data.hypothesen?.hypothesisBlocks || []).length > 0 ? `${data.hypothesen.hypothesisBlocks.length} strukturiert` : '0', type: (data.hypothesen?.hypothesisBlocks || []).length > 0 ? 'partial' : 'empty' },
    { label: 'Entscheidungen', status: data.entscheidungen.length, type: data.entscheidungen.length > 0 ? 'complete' : 'empty' },
    { label: 'Feedback', status: data.feedback ? data.feedback.length : 0, type: data.feedback && data.feedback.length > 0 ? 'complete' : 'empty' },
    { label: 'ICF-Reports', status: data.icfReports.length > 0 ? 'Vorhanden' : 'Fehlt', type: data.icfReports.length > 0 ? 'complete' : 'empty' }
  ];

  areas.forEach(area => {
    const card = document.createElement('div');
    card.className = `status-card status--${area.type}`;

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

    const explainer = document.createElement('div');
    explainer.className = 'icf-explainer';
    explainer.textContent = 'Formale ICF-Dokumentation';
    group.appendChild(explainer);

    if (report.md) {
      const label = document.createElement('div');
      label.className = 'icf-format-label';
      label.textContent = 'Markdown (Arbeitsversion)';
      group.appendChild(label);
      group.appendChild(createFileCard(report.md));
    }
    if (report.html) {
      const details = document.createElement('details');
      details.className = 'icf-html-details';
      details.open = true;
      const summary = document.createElement('summary');
      summary.textContent = 'Formale ICF-Ansicht (HTML) öffnen';
      details.appendChild(summary);

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
  const container = document.createElement('div');
  container.className = 'dashboard-grid';

  // [ HERO / HEAD ]
  const hero = document.createElement('article');
  hero.className = 'dashboard-hero';

  const introTitle = document.createElement('h2');
  introTitle.textContent = 'Aktueller Projektstand';
  hero.appendChild(introTitle);

  let heroText = 'Kompakter Überblick über den aktuellen Projektstand, extrahiert aus den jüngsten Dokumentationen.';
  if (data.projektplan) {
      const snippet = extractFirstSnippet(data.projektplan.sections);
      if (snippet) heroText = snippet;
  }
  const introP = document.createElement('p');
  introP.textContent = heroText;
  hero.appendChild(introP);
  container.appendChild(hero);

  // [ PRIMARY BLOCKS - max 3 ]
  const primaryGrid = document.createElement('div');
  primaryGrid.className = 'primary-blocks';

  // 1. Zuletzt passiert
  if (data.tagebuch && data.tagebuch.length > 0) {
    const latest = data.tagebuch[0];
    const card = document.createElement('div');
    card.className = 'card';
    card.appendChild(createSummarySection('Zuletzt passiert', extractFirstSnippet(latest.sections) || latest.title));
    primaryGrid.appendChild(card);
  }

  // 2. Aktive Hypothesen
  if (data.hypothesen && data.hypothesen.hypothesisBlocks && data.hypothesen.hypothesisBlocks.length > 0) {
    const activeHypothesen = data.hypothesen.hypothesisBlocks.filter(h => h.normalizedStatus === 'aktiv_geprueft' || h.normalizedStatus === 'offen');
    if (activeHypothesen.length > 0) {
        const h = activeHypothesen[0];
        const card = document.createElement('div');
        card.className = 'card';
        const aussageText = h.aussage.length > 0 ? h.aussage.join(' ') : 'Noch unklar.';
        card.appendChild(createSummarySection('Zentrale Hypothese', aussageText));
        primaryGrid.appendChild(card);
    }
  }

  // 3. Letzte Entscheidung
  if (data.entscheidungen && data.entscheidungen.length > 0) {
    const latest = data.entscheidungen[0];
    const card = document.createElement('div');
    card.className = 'card';
    let content = latest.title;
    if (latest.decisionBlocks && latest.decisionBlocks.length > 0) {
        const block = latest.decisionBlocks[0];
        if (block.massnahme.length > 0) content = block.massnahme[0];
    }
    card.appendChild(createSummarySection('Letzte Entscheidung', content));
    primaryGrid.appendChild(card);
  }

  container.appendChild(primaryGrid);

  // [ SECONDARY BLOCKS ]
  const secondaryGrid = document.createElement('div');
  secondaryGrid.className = 'secondary-blocks';

  // Feedback
  if (data.feedback && data.feedback.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    const latest = data.feedback[0];
    card.appendChild(createSummarySection('Jüngstes Feedback', extractFirstSnippet(latest.sections) || latest.title));
    secondaryGrid.appendChild(card);
  }

  // Beobachtungen
  if (data.beobachtungen && data.beobachtungen.length > 0) {
    const card = document.createElement('div');
    card.className = 'card';
    const latest = data.beobachtungen[0];
    card.appendChild(createSummarySection('Letzte Beobachtung', extractFirstSnippet(latest.sections) || latest.title));
    secondaryGrid.appendChild(card);
  }

  // ICF
  const icfCard = document.createElement('div');
  icfCard.className = 'card';
  const icfSnippet = data.icfReports.length > 0
    ? 'ICF-Reports liegen vor und stützen die Beobachtungen mit normierter Evidenz.'
    : 'Noch keine normierten ICF-Reports verknüpft.';
  icfCard.appendChild(createSummarySection('Evidenz & Rahmen', icfSnippet));
  secondaryGrid.appendChild(icfCard);

  container.appendChild(secondaryGrid);
  root.appendChild(container);
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

    // Titel = Aussage
    const title = document.createElement('h3');
    title.className = 'hypothesis-title';

    const metaSpan = document.createElement('span');
    metaSpan.className = 'meta';
    metaSpan.textContent = block.id ? `${block.id} – ${block.heading}` : block.heading;
    title.appendChild(metaSpan);

    title.appendChild(document.createElement('br'));

    const aussageSpan = document.createElement('span');
    if (block.aussage.length > 0) {
      renderInlineText(aussageSpan, block.aussage.join(' '));
    } else {
      aussageSpan.textContent = 'Aussage noch unklar';
    }
    title.appendChild(aussageSpan);

    card.appendChild(title);

    // Badges Row
    const badgesRow = document.createElement('div');
    badgesRow.className = 'hypothesis-badges';

    const badgesData = [
      { label: 'Status', values: block.status },
      { label: 'Kategorie', values: block.kategorie.length > 0 ? block.kategorie : (block.normalizedCategory ? [block.normalizedCategory] : []) },
      { label: 'Steuerung', values: block.steuerungsrelevanz }
    ];

    badgesData.forEach(bd => {
      const valText = bd.values.length > 0 ? bd.values.join(', ') : 'unklar';
      const badge = document.createElement('span');
      badge.className = 'badge';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'badge-label';
      labelSpan.textContent = bd.label + ':';
      badge.appendChild(labelSpan);

      badge.appendChild(document.createTextNode(' ' + valText));
      badgesRow.appendChild(badge);
    });

    card.appendChild(badgesRow);

    // Details Grid
    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'hypothesis-grid';

    const leftCol = document.createElement('div');
    leftCol.className = 'hypothesis-grid-left';

    const rightCol = document.createElement('div');
    rightCol.className = 'hypothesis-grid-right';

    const renderDetailSection = (label, values, targetCol) => {
      const detailSection = document.createElement('section');
      detailSection.className = 'hypothesis-section';

      const h5 = document.createElement('h5');
      h5.textContent = label;
      detailSection.appendChild(h5);

      const ul = document.createElement('ul');
      const list = values.length > 0 ? values : ['nicht explizit angegeben'];
      list.forEach((value) => {
        const li = document.createElement('li');
        renderInlineText(li, value);
        ul.appendChild(li);
      });
      detailSection.appendChild(ul);
      targetCol.appendChild(detailSection);
    };

    renderDetailSection('Alternativerklärung', block.alternativerklaerung, leftCol);
    renderDetailSection('Prüfweg', block.pruefweg, leftCol);
    renderDetailSection('Gestützt durch', block.gestuetztDurch, rightCol);

    detailsGrid.appendChild(leftCol);
    detailsGrid.appendChild(rightCol);

    card.appendChild(detailsGrid);
    root.appendChild(card);
  });
}
