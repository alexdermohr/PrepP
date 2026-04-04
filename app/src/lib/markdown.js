function lines(markdown) {
  return markdown.split(/\r?\n/);
}

export function parseMarkdownSections(markdown) {
  const rawLines = lines(markdown);
  const sections = [];
  let current = { heading: 'Inhalt', blocks: [] };

  let inCodeBlock = false;
  let codeContent = [];

  for (const rawLine of rawLines) {
    const line = rawLine.trim();
    if (line.startsWith('```')) {
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

    if (!line) continue;

    if (/^#{1,6}\s+/.test(line)) {
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
      current.blocks.push({ type: 'bullet', text: line.replace(/^-\s+/, '').trim() });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      current.blocks.push({ type: 'bullet', text: line.replace(/^\d+\.\s+/, '').trim() });
      continue;
    }

    current.blocks.push({ type: 'text', text: line.trim() });
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
