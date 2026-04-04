function createSectionBlock(section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section-block';

  const heading = document.createElement('h4');
  heading.textContent = section.heading;
  sectionEl.appendChild(heading);

  if (section.bullets.length > 0) {
    const ul = document.createElement('ul');
    section.bullets.forEach((bullet) => {
      const li = document.createElement('li');
      li.textContent = normalizeInlineMarkdown(bullet);
      ul.appendChild(li);
    });
    sectionEl.appendChild(ul);
  }

  return sectionEl;
}

function normalizeInlineMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
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
      if (section.bullets.length > 0) {
        const bulletOnly = createSectionBlock({ heading: '', bullets: section.bullets });
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
  iframe.srcdoc = entry.content;
  iframe.setAttribute('sandbox', '');

  iframe.loading = 'lazy';
  iframe.title = `ICF Report: ${report.title}`;
  card.appendChild(iframe);

  return card;
}

export function renderOverview(root, data) {
  const article = document.createElement('article');
  article.className = 'start-page card';

  const intro = document.createElement('p');
  intro.textContent = 'Willkommen zur Projekt-Dokumentation. Diese Oberfläche dient der strukturierten Einsicht in den Entwicklungsprozess, um Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen.';
  article.appendChild(intro);

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'status-cards';

  const areas = [
    { label: 'Projektplan', status: data.projektplan ? 'Vorhanden' : 'Fehlt' },
    { label: 'Tagebuch-Einträge', status: data.tagebuch.length },
    { label: 'Beobachtungen', status: data.beobachtungen.length },
    { label: 'Entscheidungen', status: data.entscheidungen.length },
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
          li.textContent = normalizeInlineMarkdown(value);
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
  if (!data.icfReports.length) {
    const p = document.createElement('p');
    p.textContent = 'Keine ICF-Reports vorhanden.';
    root.appendChild(p);
    return;
  }

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
      const label = document.createElement('div');
      label.className = 'icf-format-label';
      label.textContent = 'HTML';
      group.appendChild(label);
      group.appendChild(createHtmlFileCard(report));
    }

    root.appendChild(group);
  });
}

export function renderMeta(root, data) {
  if (!data.meta.length) {
    const p = document.createElement('p');
    p.textContent = 'Keine Meta-Daten vorhanden.';
    root.appendChild(p);
    return;
  }
  data.meta.forEach(entry => root.appendChild(createFileCard(entry)));
}

export function renderModels(root, data) {
  if (!data.models.length) {
    const p = document.createElement('p');
    p.textContent = 'Keine Modelle vorhanden.';
    root.appendChild(p);
    return;
  }
  data.models.forEach(entry => root.appendChild(createFileCard(entry)));
}

export function renderAktuellerStand(root, data) {
  const article = document.createElement('article');
  article.className = 'stand-section card';

  const intro = document.createElement('p');
  intro.textContent = 'Kompakter Überblick über den letzten Stand des Projekts.';
  article.appendChild(intro);

  if (data.tagebuch && data.tagebuch.length > 0) {
    const latestTagebuch = data.tagebuch[0]; // Assuming data is now sorted newest first
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Zuletzt im Tagebuch';
    section.appendChild(heading);
    const p = document.createElement('p');
    p.textContent = latestTagebuch.title;
    section.appendChild(p);
    article.appendChild(section);
  }

  if (data.entscheidungen && data.entscheidungen.length > 0) {
    const latestDecision = data.entscheidungen[0]; // Getting the last one (assuming older sort or just picking one)
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Letzte Entscheidung';
    section.appendChild(heading);
    const p = document.createElement('p');
    p.textContent = latestDecision.title;
    section.appendChild(p);
    article.appendChild(section);
  }

  if (data.beobachtungen && data.beobachtungen.length > 0) {
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Beobachtungen';
    section.appendChild(heading);
    const p = document.createElement('p');
    p.textContent = `${data.beobachtungen.length} dokumentierte Muster.`;
    section.appendChild(p);
    article.appendChild(section);
  }

  const icfSection = document.createElement('section');
  icfSection.className = 'section-block';
  const icfHeading = document.createElement('h4');
  icfHeading.textContent = 'Evidenz';
  icfSection.appendChild(icfHeading);
  const icfP = document.createElement('p');
  icfP.textContent = data.icfReports.length > 0 ? 'ICF-Verlauf liegt vor.' : 'Noch keine ICF-Reports verknüpft.';
  icfSection.appendChild(icfP);
  article.appendChild(icfSection);

  root.appendChild(article);
}
