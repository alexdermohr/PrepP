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

  for (const rawLine of rawLines) {
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      flushText();
      flushList();
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

    if (!line) {
      flushText();
      flushList();
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushText();
      flushList();
      if (current.heading || current.blocks.length) {
        sections.push(current);
      }
      current = {
        heading: line.replace(/^#{1,6}\s+/, '').trim(),
        blocks: []
      };
      continue;
    }

    if (/^-\s+/.test(line)) {
      flushText();
      if (!currentListBlock || currentListBlock.ordered) {
        flushList();
        currentListBlock = { type: 'list', ordered: false, items: [] };
      }
      const rawText = line.replace(/^-\s+/, '').trim();
      currentListBlock.items.push(rawText);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushText();
      if (!currentListBlock || !currentListBlock.ordered) {
        flushList();
        currentListBlock = { type: 'list', ordered: true, items: [] };
      }
      let rawText = line.replace(/^\d+\.\s+/, '').trim();
      currentListBlock.items.push(rawText);
      continue;
    }

    flushList();

    const rawText = line; // Maintain raw text
    if (currentTextBlock) {
      currentTextBlock.text += ' ' + rawText;
    } else {
      currentTextBlock = { type: 'text', text: rawText };
    }
  }

  flushText();
  flushList();

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
  const match = line.match(/^-\s+\*\*(.+?):\*\*\s*(.+)$/);
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
    pruefhinweis: []
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

  if (labeled.label.startsWith('prüfhinweis') || labeled.label.startsWith('pruefhinweis')) {
    block.pruefhinweis.push(labeled.value);
  }
}

export function parseDecisionBlocks(markdown) {
  const rawLines = lines(markdown);
  const blocks = [];
  let current = createDecisionBlock();

  rawLines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (/^##\s+/.test(line)) {
      if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length) {
        blocks.push(current);
      }
      current = createDecisionBlock(line.replace(/^##\s+/, '').trim(), false);
      return;
    }

    const labeled = extractLabeledBullet(line);
    if (!labeled) return;
    applyLabeledValue(current, labeled);
  });

  if (current.massnahme.length || current.begruendung.length || current.ziel.length || current.pruefhinweis.length) {
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
