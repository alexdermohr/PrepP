import { firstHeading, normalizePath, parseDecisionBlocks, parseMarkdownSections } from './markdown';

const markdownFiles = import.meta.glob('../../../{docs,meta,models}/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

function byFolder(folder) {
  return Object.entries(markdownFiles)
    .filter(([path]) => path.includes(`/docs/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b));
}

function parseFile(path, content) {
  return {
    path: normalizePath(path),
    title: firstHeading(content, path.split('/').pop().replace('.md', '')),
    sections: parseMarkdownSections(content)
  };
}

function parseDecisionFile(path, content) {
  return {
    ...parseFile(path, content),
    decisionBlocks: parseDecisionBlocks(content)
  };
}

export function loadData() {
  const tagebuch = byFolder('tagebuch').map(([path, content]) => parseFile(path, content));
  const beobachtungen = byFolder('beobachtungen').map(([path, content]) => parseFile(path, content));
  const entscheidungen = byFolder('entscheidungen').map(([path, content]) => parseDecisionFile(path, content));

  const hypothesenEntry = Object.entries(markdownFiles).find(([path]) => path.endsWith('/docs/hypothesen.md'));
  const reflexionEntry = Object.entries(markdownFiles).find(([path]) => path.endsWith('/docs/reflexion.md'));

  const hypothesen = hypothesenEntry ? parseFile(hypothesenEntry[0], hypothesenEntry[1]) : null;
  const reflexion = reflexionEntry ? parseFile(reflexionEntry[0], reflexionEntry[1]) : null;

  const projektplanEntry = Object.entries(markdownFiles).find(([path]) => path.endsWith('/docs/projektplan.md'));
  const projektplan = projektplanEntry ? parseFile(projektplanEntry[0], projektplanEntry[1]) : null;

  const icfReports = Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/docs/icf-reports/') && path.endsWith('.md'))
    .map(([path, content]) => parseFile(path, content));

  const meta = Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/meta/') && path.endsWith('.md'))
    .map(([path, content]) => parseFile(path, content));

  const models = Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/models/') && path.endsWith('.md'))
    .map(([path, content]) => parseFile(path, content));

  return {
    tagebuch,
    beobachtungen,
    entscheidungen,
    hypothesen,
    reflexion,
    projektplan,
    icfReports,
    meta,
    models
  };
}
