function createSectionBlock(section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section-block';

  const heading = document.createElement('h4');
  heading.textContent = section.heading;
  sectionEl.appendChild(heading);

  if (section.blocks && section.blocks.length > 0) {
    let currentUl = null;

    section.blocks.forEach((block) => {
      if (block.type === 'bullet') {
        if (!currentUl) {
          currentUl = document.createElement('ul');
          sectionEl.appendChild(currentUl);
        }
        const li = document.createElement('li');
        li.textContent = normalizeInlineMarkdown(block.text);
        currentUl.appendChild(li);
      } else if (block.type === 'code') {
        currentUl = null;
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = block.text;
        pre.appendChild(code);
        sectionEl.appendChild(pre);
      } else {
        currentUl = null;
        const p = document.createElement('p');
        p.textContent = normalizeInlineMarkdown(block.text);
        sectionEl.appendChild(p);
      }
    });
  } else if (section.bullets && section.bullets.length > 0) {
    // Fallback for old structure if any
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
      if ((section.blocks && section.blocks.length > 0) || (section.bullets && section.bullets.length > 0)) {
        const bulletOnly = createSectionBlock({ heading: '', blocks: section.blocks, bullets: section.bullets });
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
  intro.textContent = 'Kompakter Überblick über den aktuellen Projektstand, extrahiert aus den jüngsten Dokumentationen.';
  article.appendChild(intro);

  if (data.projektplan) {
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Projektkontext';
    section.appendChild(heading);

    let firstText = 'Projektplan ist angelegt.';
    for (const s of data.projektplan.sections) {
      const blocks = s.blocks ?? [];
      const tb = blocks.find(b => b.type === 'text' && b.text.length > 20);
      if (tb) {
        firstText = tb.text;
        break;
      }
    }
    const p = document.createElement('p');
    p.textContent = firstText;
    section.appendChild(p);
    article.appendChild(section);
  }

  if (data.tagebuch && data.tagebuch.length > 0) {
    const latestTagebuch = data.tagebuch[0];
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Zuletzt passiert';
    section.appendChild(heading);

    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latestTagebuch.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    let contentSnippet = '';
    for (const s of latestTagebuch.sections) {
      const blocks = s.blocks ?? [];
      const tb = blocks.find(b => b.type === 'text' || b.type === 'bullet');
      if (tb) {
        contentSnippet = tb.text;
        break;
      }
    }

    if (contentSnippet) {
      const p = document.createElement('p');
      p.textContent = contentSnippet;
      section.appendChild(p);
    }
    article.appendChild(section);
  }

  if (data.entscheidungen && data.entscheidungen.length > 0) {
    const latestDecision = data.entscheidungen[0];
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Letzte Entscheidung / Steuerung';
    section.appendChild(heading);

    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latestDecision.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    if (latestDecision.decisionBlocks && latestDecision.decisionBlocks.length > 0) {
       const block = latestDecision.decisionBlocks[0];
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

  if (data.beobachtungen && data.beobachtungen.length > 0) {
    const latestObs = data.beobachtungen[0];
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Zentrale Beobachtung';
    section.appendChild(heading);

    let contentSnippet = latestObs.title;
    for (const s of latestObs.sections) {
      const blocks = s.blocks ?? [];
      const tb = blocks.find(b => b.type === 'text' || b.type === 'bullet');
      if (tb) {
        contentSnippet = tb.text;
        break;
      }
    }
    const p = document.createElement('p');
    p.textContent = contentSnippet;
    section.appendChild(p);
    article.appendChild(section);
  }


  if (data.feedback && data.feedback.length > 0) {
    const latestFeedback = data.feedback[0];
    const section = document.createElement('section');
    section.className = 'section-block';
    const heading = document.createElement('h4');
    heading.textContent = 'Jüngstes Feedback (Subjektive Perspektive)';
    section.appendChild(heading);


    const titleP = document.createElement('p');
    const strongTitle = document.createElement('strong');
    strongTitle.textContent = latestFeedback.title;
    titleP.appendChild(strongTitle);
    section.appendChild(titleP);

    let contentSnippet = 'Feedback-Dokument vorhanden.';
    for (const s of latestFeedback.sections) {
      const blocks = s.blocks ?? [];
      const tb = blocks.find(b => b.type === 'text' || b.type === 'bullet');
      if (tb) {
        contentSnippet = tb.text;
        break;
      }
    }
    const p = document.createElement('p');
    p.textContent = contentSnippet;
    section.appendChild(p);

    article.appendChild(section);

  }

  const icfSection = document.createElement('section');
  icfSection.className = 'section-block';
  const icfHeading = document.createElement('h4');
  icfHeading.textContent = 'Evidenz & Rahmen';
  icfSection.appendChild(icfHeading);
  const icfP = document.createElement('p');
  if (data.icfReports.length > 0) {
    icfP.textContent = 'ICF-Reports liegen vor und stützen die Beobachtungen mit normierter Evidenz.';
  } else {
    icfP.textContent = 'Noch keine normierten ICF-Reports verknüpft.';
  }
  icfSection.appendChild(icfP);
  article.appendChild(icfSection);

  root.appendChild(article);
}


export function renderFeedback(root, data) {
  if (!data.feedback || data.feedback.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Bislang kein Feedback erfasst.';
    root.appendChild(p);
    return;
  }
  data.feedback.forEach((entry) => root.appendChild(createFileCard(entry)));
}
