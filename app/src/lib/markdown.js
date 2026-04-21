function lines(markdown) {
  return markdown.split(/\r?\n/);
}

export function parseMarkdownSections(markdown) {
  const rawLines = lines(markdown);
  const sections = [];
  let current = { heading: 'Inhalt', blocks: [] };

  let inCodeBlock = false;
  let codeContent = [];

  let currentTextBlock = null;
  let currentListBlock = null;
  let currentTableBlock = null;
  let currentBlockquoteBlock = null;

  function flushText() {
    if (currentTextBlock) {
      current.blocks.push(currentTextBlock);
      currentTextBlock = null;
    }
  }

  function flushList() {
    if (currentListBlock) {
      current.blocks.push(currentListBlock);
      currentListBlock = null;
    }
  }

  function flushTable() {
    if (currentTableBlock) {
      current.blocks.push(currentTableBlock);
      currentTableBlock = null;
    }
  }

  function flushBlockquote() {
    if (currentBlockquoteBlock) {
      current.blocks.push(currentBlockquoteBlock);
      currentBlockquoteBlock = null;
    }
  }

  function flushAll() {
    flushText();
    flushList();
    flushTable();
    flushBlockquote();
  }

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      flushAll();
      if (inCodeBlock) {
        current.blocks.push({ type: 'code', text: codeContent.join('\n') });
        inCodeBlock = false;
        codeContent = [];
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(rawLine);
      continue;
    }

    const imgMatch = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (imgMatch) {
      flushAll();
      current.blocks.push({ type: 'image', alt: imgMatch[1], url: imgMatch[2] });
      continue;
    }

    if (line === '---' || line === '***') {
      flushAll();
      current.blocks.push({ type: 'hr' });
      continue;
    }

    if (!line) {
      flushAll();
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushAll();
      if (current.heading || current.blocks.length) {
        sections.push(current);
      }
      current = {
        heading: line.replace(/^#{1,6}\s+/, '').trim(),
        blocks: []
      };
      continue;
    }

    if (/^>\s+/.test(line) || line === '>') {
      flushText();
      flushList();
      flushTable();
      const rawText = line.replace(/^>\s?/, '').trim();
      if (currentBlockquoteBlock) {
        currentBlockquoteBlock.text += '\n' + rawText;
      } else {
        currentBlockquoteBlock = { type: 'blockquote', text: rawText };
      }
      continue;
    }

    if (/^-\s+/.test(line) || /^\*\s+/.test(line)) {
      flushText();
      flushTable();
      flushBlockquote();
      if (!currentListBlock || currentListBlock.ordered) {
        flushList();
        currentListBlock = { type: 'list', ordered: false, items: [] };
      }
      const rawText = line.replace(/^[-*]\s+/, '').trim();
      currentListBlock.items.push(rawText);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushText();
      flushTable();
      flushBlockquote();
      if (!currentListBlock || !currentListBlock.ordered) {
        flushList();
        currentListBlock = { type: 'list', ordered: true, items: [] };
      }
      const rawText = line.replace(/^\d+\.\s+/, '').trim();
      currentListBlock.items.push(rawText);
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      flushText();
      flushList();
      flushBlockquote();

      const cells = line.split('|').slice(1, -1).map(c => c.trim());

      // Is it a separator line?
      const isSeparator = cells.every(c => /^-+:?$/.test(c));

      if (!currentTableBlock) {
        currentTableBlock = { type: 'table', headers: cells, rows: [] };
      } else if (!isSeparator) {
        currentTableBlock.rows.push(cells);
      }
      continue;
    }

    flushList();
    flushTable();
    flushBlockquote();

    const rawText = line; // Maintain raw text
    if (currentTextBlock) {
      currentTextBlock.text += ' ' + rawText;
    } else {
      currentTextBlock = { type: 'text', text: rawText };
    }
  }

  flushAll();

  if (inCodeBlock) {
    current.blocks.push({ type: 'code', text: codeContent.join('\n') });
  }

  if (current.heading || current.blocks.length) {
    sections.push(current);
  }

  return sections.filter((section) => section.blocks.length > 0 || section.heading !== 'Inhalt');
}

export function firstHeading(markdown, fallback) {
  const match = markdown.match(/^#{1,6}\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

export function normalizePath(path) {
  const normalized = path.replace(/\\/g, '/');
  const docsIndex = normalized.indexOf('/docs/');

  if (docsIndex >= 0) {
    return normalized.slice(docsIndex + 1);
  }

  return normalized.replace(/^(\.\.\/)+/, '');
}

export function extractLabeledBullet(line) {
  const match = line.match(/^[-*]\s+\*\*(.+?):\*\*\s*(.+)$/);
  if (!match) return null;

  return {
    label: match[1].trim().toLowerCase(),
    value: match[2].trim()
  };
}

function createDecisionBlock(heading = 'Entscheidung', implicit = true) {
  return {
    heading,
    implicit,
    massnahme: [],
    begruendung: [],
    ziel: [],
    pruefhinweis: [],
    bezugZurHypothese: []
  };
}

function applyLabeledValue(block, labeled) {
  if (labeled.label.startsWith('maßnahme') || labeled.label.startsWith('massnahme')) {
    block.massnahme.push(labeled.value);
    return;
  }

  if (labeled.label.startsWith('begründung') || labeled.label.startsWith('begruendung')) {
    block.begruendung.push(labeled.value);
    return;
  }

  if (labeled.label.startsWith('ziel')) {
    block.ziel.push(labeled.value);
    return;
  }

  if (labeled.label.startsWith('prüfhinweis') || labeled.label.startsWith('pruefhinweis') || labeled.label.startsWith('messkriterien')) {
    block.pruefhinweis.push(labeled.value);
    return;
  }

  if (labeled.label.startsWith('bezug zur hypothese')) {
    block.bezugZurHypothese.push(labeled.value);
    return;
  }
}

export function parseDecisionBlocks(markdown) {
  const rawLines = lines(markdown);
  const blocks = [];
  let current = createDecisionBlock();

  // Tracks which section is currently active when parsing headings
  // Supported headings:
  // - Maßnahme / Massnahme
  // - Begründung / Begruendung
  // - Ziel
  // - Messkriterien / Prüfhinweis / Pruefhinweis
  // - Bezug zur Hypothese
  let activeSection = null;

  rawLines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (/^##\s+/.test(line)) {
      const headingText = line.replace(/^##\s+/, '').trim().toLowerCase();

      if (headingText === 'maßnahme' || headingText === 'massnahme') {
        activeSection = 'massnahme';
        return;
      } else if (headingText === 'begründung' || headingText === 'begruendung') {
        activeSection = 'begruendung';
        return;
      } else if (headingText === 'ziel') {
        activeSection = 'ziel';
        return;
      } else if (headingText === 'messkriterien' || headingText === 'prüfhinweis' || headingText === 'pruefhinweis') {
        activeSection = 'pruefhinweis';
        return;
      } else if (headingText === 'bezug zur hypothese') {
        activeSection = 'bezugZurHypothese';
        return;
      // "Konkrete Umsetzung" is consciously treated as an operative "Maßnahme"
      } else if (headingText === 'konkrete umsetzung' || headingText.startsWith('konkrete umsetzung')) {
        activeSection = 'massnahme';
        return;
      }

      if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
        blocks.push(current);
      }
      current = createDecisionBlock(line.replace(/^##\s+/, '').trim(), false);
      activeSection = null;
      return;
    }

    const labeled = extractLabeledBullet(line);
    if (labeled) {
      applyLabeledValue(current, labeled);
      return;
    }

    if (activeSection && line) {
      let textToAdd = rawLine;

      if (textToAdd.trim().match(/^[-*]\s+/)) {
        textToAdd = textToAdd.trim().replace(/^[-*]\s+/, "");
      } else if (textToAdd.trim().match(/^\d+\.\s+/)) {
        textToAdd = textToAdd.trim().replace(/^\d+\.\s+/, '');
      } else {
        textToAdd = textToAdd.trim();
      }

      if (textToAdd) {
        current[activeSection].push(textToAdd);
      }
    }
  });

  if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length || current.bezugZurHypothese.length) {
    blocks.push(current);
  }

  return blocks.length > 0 ? blocks : [createDecisionBlock()];
}


export function normalizeHypothesisStatus(statusStr) {
  if (!statusStr || !statusStr.trim()) return null;
  const s = statusStr.toLowerCase().trim();
  if (s.includes('aktiv geprüft') || s.includes('aktiv geprueft')) return 'aktiv_geprueft';
  if (s.includes('vorläufig gestützt') || s.includes('vorlaeufig gestuetzt')) return 'vorlaeufig_gestuetzt';
  if (s.includes('fraglich')) return 'fraglich';
  if (s.includes('widerlegt')) return 'widerlegt';
  if (s.includes('pausiert')) return 'pausiert';
  if (s.includes('offen')) return 'offen';
  return null;
}

export function normalizeHypothesisCategory(categoryStr) {
  if (!categoryStr || !categoryStr.trim()) return null;
  const c = categoryStr.toLowerCase().trim();
  if (c.includes('verhaltens') && c.includes('regulations')) return 'Verhaltens- und Regulationshypothese';
  if (c.includes('situations') || c.includes('kontext')) return 'Situations- / Kontext-Hypothese';
  if (c.includes('system')) return 'Systemhypothese';
  if (c.includes('methodisch')) return 'methodische Hypothese';
  return null;
}

function createHypothesisBlock(id = '', heading = 'Hypothese') {
  return {
    id,
    heading,
    aussage: [],
    kategorie: [],
    gestuetztDurch: [],
    alternativerklaerung: [],
    pruefweg: [],
    status: [],
    steuerungsrelevanz: [],
    normalizedStatus: null,
    normalizedCategory: null
  };
}

function applyHypothesisLabeledValue(block, labeled) {
  if (labeled.label.startsWith('aussage')) {
    block.aussage.push(labeled.value);
    return;
  }
  if (labeled.label.startsWith('kategorie')) {
    block.kategorie.push(labeled.value);
    block.normalizedCategory = normalizeHypothesisCategory(labeled.value);
    return;
  }
  if (labeled.label.startsWith('gestützt durch') || labeled.label.startsWith('gestuetzt durch')) {
    block.gestuetztDurch.push(labeled.value);
    return;
  }
  if (labeled.label.startsWith('alternativerklärung') || labeled.label.startsWith('alternativerklaerung')) {
    block.alternativerklaerung.push(labeled.value);
    return;
  }
  if (labeled.label.startsWith('prüfweg') || labeled.label.startsWith('pruefweg')) {
    block.pruefweg.push(labeled.value);
    return;
  }
  if (labeled.label.startsWith('status')) {
    block.status.push(labeled.value);
    block.normalizedStatus = normalizeHypothesisStatus(labeled.value);
    return;
  }
  if (labeled.label.startsWith('steuerungsrelevanz')) {
    block.steuerungsrelevanz.push(labeled.value);
    return;
  }
}

export function parseHypothesisBlocks(markdown) {
  const rawLines = lines(markdown);
  const blocks = [];
  let current = null;

  rawLines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (/^##\s+/.test(line)) {
      if (current) {
        blocks.push(current);
      }
      const rawHeading = line.replace(/^##\s+/, '').trim();
      let idMatch = rawHeading.match(/^(H\d+)\s*(?:[-–:]\s*)?(.*)$/);
      if (idMatch) {
         current = createHypothesisBlock(idMatch[1], idMatch[2] || idMatch[1]);
      } else {
         current = createHypothesisBlock('', rawHeading);
      }
      return;
    }

    if (!current) return; // Skip content before first hypothesis block (e.g. # Hypothesen)

    const labeled = extractLabeledBullet(line);
    if (!labeled) return;
    applyHypothesisLabeledValue(current, labeled);
  });

  if (current) {
    blocks.push(current);
  }

  return blocks;
}


export function normalizeFragment(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
