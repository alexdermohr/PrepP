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

export function renderOverview(root, data) {
  const areas = [
    { label: 'Tagebuch', count: data.tagebuch.length },
    { label: 'Beobachtungen', count: data.beobachtungen.length },
    { label: 'Entscheidungen', count: data.entscheidungen.length },
    { label: 'Hypothesen', count: data.hypothesen ? 1 : 0, single: true },
    { label: 'Reflexion', count: data.reflexion ? 1 : 0, single: true },
    { label: 'Projektplan', count: data.projektplan ? 1 : 0, single: true },
    { label: 'ICF-Reports', count: data.icfReports.length },
    { label: 'Meta', count: data.meta.length },
    { label: 'Modelle', count: data.models.length }
  ];
  const ul = document.createElement('ul');
  ul.className = 'overview-list';

  areas.forEach((area) => {
    const li = document.createElement('li');
    li.textContent = area.single ? `${area.label}: Dokument ${area.count > 0 ? 'vorhanden' : 'fehlt'}` : `${area.label}: ${area.count}`;
    ul.appendChild(li);
  });

  root.appendChild(ul);
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
    card.className = 'card';

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

      const details = {
        Maßnahme: decisionBlock.massnahme,
        Begründung: decisionBlock.begruendung,
        Ziel: decisionBlock.ziel,
        Prüfhinweis: decisionBlock.pruefhinweis
      };

      Object.entries(details).forEach(([label, values]) => {
        const detailSection = document.createElement('section');
        detailSection.className = 'section-block';

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
        blockCard.appendChild(detailSection);
      });

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
  data.icfReports.forEach(entry => root.appendChild(createFileCard(entry)));
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
