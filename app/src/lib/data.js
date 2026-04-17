import {
  firstHeading,
  normalizePath,
  parseDecisionBlocks,
  parseMarkdownSections,
  parseHypothesisBlocks,
} from "./markdown";

const markdownFiles = import.meta.glob("../../../{docs,meta,models}/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const htmlFiles = import.meta.glob("../../../docs/icf-reports/**/*.html", {
  query: "?raw",
  import: "default",
  eager: true,
});

function byFolder(folder) {
  return Object.entries(markdownFiles)
    .filter(([path]) => path.includes(`/docs/${folder}/`))
    .sort(([a], [b]) => a.localeCompare(b));
}

function parseFile(path, content) {
  return {
    path: normalizePath(path),
    title: firstHeading(content, path.split("/").pop().replace(".md", "")),
    sections: parseMarkdownSections(content),
  };
}

function parseDecisionFile(path, content) {
  return {
    ...parseFile(path, content),
    decisionBlocks: parseDecisionBlocks(content),
  };
}

function extractHtmlTitle(content, fallback) {
  const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch && titleMatch[1].trim()) return titleMatch[1].trim();
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (h1Match && h1Match[1].trim())
    return h1Match[1].trim().replace(/<[^>]+>/g, "");
  return fallback;
}

function reportIdFromPath(path) {
  // Extract path relative to icf-reports folder and remove extension
  const normalized = normalizePath(path);
  const match = normalized.match(/docs\/icf-reports\/(.+)\.(md|html)$/);
  return match
    ? match[1]
    : normalized
        .split("/")
        .pop()
        .replace(/\.(md|html)$/, "");
}

function buildICFReports() {
  const reportsMap = new Map();

  // Process Markdown Reports
  Object.entries(markdownFiles)
    .filter(
      ([path]) => path.includes("/docs/icf-reports/") && path.endsWith(".md"),
    )
    .forEach(([path, content]) => {
      const id = reportIdFromPath(path);
      const parsed = parseFile(path, content);

      reportsMap.set(id, {
        id,
        title: parsed.title, // Initial title from markdown
        md: parsed,
      });
    });

  // Process HTML Reports
  Object.entries(htmlFiles).forEach(([path, content]) => {
    const id = reportIdFromPath(path);

    if (reportsMap.has(id)) {
      // Merge with existing markdown
      const report = reportsMap.get(id);
      report.html = { path: normalizePath(path), content };
    } else {
      // Create new entry for HTML-only reports
      reportsMap.set(id, {
        id,
        title: extractHtmlTitle(content, id.split("/").pop()), // Fallback title or extracted
        html: { path: normalizePath(path), content },
      });
    }
  });

  // Convert map to sorted array
  return Array.from(reportsMap.values()).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
}

export function loadData() {
  const tagebuch = byFolder("tagebuch")
    .reverse()
    .map(([path, content]) => parseFile(path, content));
  const feedback = byFolder("feedback")
    .filter(([path]) => !path.endsWith("/01_feedback_zielperson.md"))
    .reverse()
    .map(([path, content]) => parseFile(path, content));
  const beobachtungen = byFolder("beobachtungen")
    .reverse()
    .map(([path, content]) => parseFile(path, content));
  const entscheidungen = byFolder("entscheidungen")
    .reverse()
    .map(([path, content]) => parseDecisionFile(path, content));
  const intervention = byFolder("intervention")
    .reverse()
    .map(([path, content]) => parseFile(path, content));

  const hypothesenEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/hypothesen.md"),
  );
  const reflexionEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/reflexion.md"),
  );

  const hypothesen = hypothesenEntry
    ? {
        ...parseFile(hypothesenEntry[0], hypothesenEntry[1]),
        hypothesisBlocks: parseHypothesisBlocks(hypothesenEntry[1]),
      }
    : null;
  const reflexion = reflexionEntry
    ? parseFile(reflexionEntry[0], reflexionEntry[1])
    : null;

  const projektplanEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/projektplan.md"),
  );
  const projektplan = projektplanEntry
    ? parseFile(projektplanEntry[0], projektplanEntry[1])
    : null;

  const icfReports = buildICFReports();

  const meta = Object.entries(markdownFiles)
    .filter(([path]) => path.includes("/meta/") && path.endsWith(".md"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, content]) => parseFile(path, content));

  const models = Object.entries(markdownFiles)
    .filter(([path]) => path.includes("/models/") && path.endsWith(".md"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, content]) => parseFile(path, content));

  const gnCompiledEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/gruppennachweis/_compiled.md"),
  );
  const gnContractEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/gruppennachweis/_contract.md"),
  );
  const gnStateEntry = Object.entries(markdownFiles).find(([path]) =>
    path.endsWith("/docs/gruppennachweis/_state.md"),
  );

  const gruppennachweis = {
    compiled: gnCompiledEntry
      ? parseFile(gnCompiledEntry[0], gnCompiledEntry[1])
      : null,
    contract: gnContractEntry
      ? parseFile(gnContractEntry[0], gnContractEntry[1])
      : null,
    state: gnStateEntry ? parseFile(gnStateEntry[0], gnStateEntry[1]) : null,
    kapitel: Object.entries(markdownFiles)
      .filter(
        ([path]) =>
          path.includes("/docs/gruppennachweis/kapitel/") &&
          path.endsWith(".md"),
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => parseFile(path, content)),
    mapping: Object.entries(markdownFiles)
      .filter(
        ([path]) =>
          path.includes("/docs/gruppennachweis/mapping/") &&
          path.endsWith(".md"),
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => parseFile(path, content)),
    apparat: Object.entries(markdownFiles)
      .filter(
        ([path]) =>
          path.includes("/docs/gruppennachweis/apparat/") &&
          path.endsWith(".md"),
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => parseFile(path, content)),
  };

  return {
    tagebuch,
    feedback,
    beobachtungen,
    entscheidungen,
    intervention,
    hypothesen,
    reflexion,
    projektplan,
    icfReports,
    meta,
    models,
    gruppennachweis,
  };
}
