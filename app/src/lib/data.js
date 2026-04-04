import { firstHeading, normalizePath, parseDecisionBlocks, parseMarkdownSections } from './markdown';

const markdownFiles = import.meta.glob('../../../{docs,meta,models}/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const htmlFiles = import.meta.glob('../../../docs/icf-reports/**/*.html', {
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

function buildICFReports() {
  const reportsMap = new Map();

  // Process Markdown Reports
  Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/docs/icf-reports/') && path.endsWith('.md'))
    .forEach(([path, content]) => {
      const filename = path.split('/').pop();
      const id = filename.replace(/\.md$/, '');
      const parsed = parseFile(path, content);

      reportsMap.set(id, {
        id,
        title: parsed.title, // Initial title from markdown
        md: parsed
      });
    });

  // Process HTML Reports
  Object.entries(htmlFiles)
    .forEach(([path, content]) => {
      const filename = path.split('/').pop();
      const id = filename.replace(/\.html$/, '');

      if (reportsMap.has(id)) {
        // Merge with existing markdown
        const report = reportsMap.get(id);
        report.html = { path: normalizePath(path), content };
      } else {
        // Create new entry for HTML-only reports
        reportsMap.set(id, {
          id,
          title: id, // Fallback title
          html: { path: normalizePath(path), content }
        });
      }
    });

  // Convert map to sorted array and add preference
  return Array.from(reportsMap.values())
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(report => ({
      ...report,
      preferred: report.html ? 'html' : 'md'
    }));
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

  const icfReports = buildICFReports();

  const meta = Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/meta/') && path.endsWith('.md'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, content]) => parseFile(path, content));

  const models = Object.entries(markdownFiles)
    .filter(([path]) => path.includes('/models/') && path.endsWith('.md'))
    .sort(([a], [b]) => a.localeCompare(b))
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
