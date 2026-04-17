import "./styles.css";
import { loadData } from "./lib/data";
import {
  renderHypothesen,
  renderBeobachtungen,
  renderEntscheidungen,
  renderStart,
  renderSimpleDoc,
  renderTagebuch,
  renderFeedback,
  renderProjektplan,
  renderICFReports,
  renderMeta,
  renderModels,
  renderIntervention,
  renderGruppennachweis,
  renderGruppennachweisKapitel,
  renderGruppennachweisMeta,
} from "./components/views";

const viewGroups = [
  {
    heading: "Start",
    views: [{ id: "start", label: "Start", render: renderStart }],
  },
  {
    heading: "Projekt",
    views: [
      { id: "projektplan", label: "Projektplan", render: renderProjektplan },
      // Deaktiviert: „Aktueller Stand“ erzeugt eine interpretative Aggregation,
      // die aktuell nicht strikt deterministisch aus den zugrunde liegenden Dokumenten ableitbar ist.
      // Daher bewusst nicht im UI enthalten.
      // Reaktivierung nur sinnvoll, wenn:
      // - klare Ableitungsregeln definiert sind ODER
      // - der interpretative Charakter explizit gekennzeichnet wird
      // { id: 'aktueller_stand', label: 'Aktueller Stand', render: renderAktuellerStand }
    ],
  },
  {
    heading: "Verlauf",
    views: [
      { id: "tagebuch", label: "Tagebuch", render: renderTagebuch },
      { id: "feedback", label: "Feedback", render: renderFeedback },
    ],
  },
  {
    heading: "Analyse",
    views: [
      {
        id: "beobachtungen",
        label: "Beobachtungen",
        render: renderBeobachtungen,
      },
      { id: "hypothesen", label: "Hypothesen", render: renderHypothesen },
      {
        id: "reflexion",
        label: "Reflexion",
        render: (el, data) => renderSimpleDoc(el, data.reflexion),
      },
    ],
  },
  {
    heading: "Steuerung",
    views: [
      {
        id: "entscheidungen",
        label: "Entscheidungen",
        render: renderEntscheidungen,
      },
      { id: "intervention", label: "Intervention", render: renderIntervention },
    ],
  },
  {
    heading: "Evidenz & Rahmen",
    views: [
      { id: "icf-reports", label: "ICF-Reports", render: renderICFReports },
      { id: "modelle", label: "Modelle", render: renderModels },
      { id: "meta", label: "Meta", render: renderMeta },
    ],
  },
  {
    heading: "Gruppennachweis",
    views: [
      {
        id: "gruppennachweis",
        label: "Gruppennachweis",
        render: renderGruppennachweis,
      },
      {
        id: "gruppennachweis-kapitel",
        label: "Kapitelübersicht",
        render: renderGruppennachweisKapitel,
      },
      {
        id: "gruppennachweis-meta",
        label: "Meta & Anhang",
        render: renderGruppennachweisMeta,
      },
    ],
  },
];

const views = viewGroups.flatMap((group) => group.views);

const data = loadData();
const app = document.querySelector("#app");

function render(activeId) {
  currentActiveView = activeId;
  app.innerHTML = "";

  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.className = "skip-link";
  skipLink.textContent = "Zum Inhalt springen";
  app.appendChild(skipLink);

  const layout = document.createElement("div");
  layout.className = "layout";

  const nav = document.createElement("nav");
  nav.className = "sidebar";

  viewGroups.forEach((group) => {
    const header = document.createElement("div");
    header.className = "sidebar-group-label";
    header.textContent = group.heading;
    nav.appendChild(header);

    group.views.forEach((view) => {
      const link = document.createElement("a");
      link.href = `#${view.id}`;
      link.textContent = view.label;
      link.className = view.id === activeId ? "active" : "";

      if (view.id === activeId) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });
  });

  const content = document.createElement("main");
  content.className = "content";
  content.id = "main-content";
  content.tabIndex = -1;

  const current = views.find((view) => view.id === activeId) || views[0];
  const h1 = document.createElement("h1");
  h1.textContent = current.label;
  content.appendChild(h1);

  current.render(content, data);

  layout.append(nav, content);
  app.appendChild(layout);
}

let currentActiveView = null;

function renderFromHash() {
  const hash = location.hash.replace("#", "");

  if (!hash) {
    if (currentActiveView !== "start") render("start");
    return;
  }

  const isViewHash = views.some((v) => v.id === hash);
  if (isViewHash) {
    if (currentActiveView !== hash) {
      render(hash);
      // Optional focus management for genuine view changes
      const mainContent = document.getElementById("main-content");
      if (mainContent) mainContent.focus();
    }
  } else {
    // If it's an unknown hash but nothing is rendered yet (initial load), fallback to start
    if (currentActiveView === null) {
      render("start");
    }
    // Otherwise, ignore the unknown hash (allows in-page anchors like #main-content to work)
  }
}

window.addEventListener("hashchange", renderFromHash);
renderFromHash();

const currentVersion = __APP_VERSION__;

function getCurrentVersion() {
  return currentVersion;
}

async function fetchRemoteVersion() {
  try {
    const res = await fetch("/version.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.version;
  } catch (error) {
    // Ignore fetch errors (e.g. offline) to not spam the console
    return null;
  }
}

function shouldReloadForVersion(version) {
  if (!version) return false;
  if (version === getCurrentVersion()) return false;
  if (sessionStorage.getItem("lastReloadedVersion") === version) return false;
  return true;
}

function markReloadedVersion(version) {
  sessionStorage.setItem("lastReloadedVersion", version);
}

let isCheckingForUpdate = false;
let pendingUpdateVersion = null;

async function maybeApplyUpdate() {
  if (getCurrentVersion() === "dev") return;
  if (isCheckingForUpdate) return;

  isCheckingForUpdate = true;
  try {
    const remoteVersion = await fetchRemoteVersion();

    if (shouldReloadForVersion(remoteVersion)) {
      pendingUpdateVersion = remoteVersion;
      applyPendingUpdateIfSafe();
    }
  } finally {
    isCheckingForUpdate = false;
  }
}

function applyPendingUpdateIfSafe() {
  const versionToApply = pendingUpdateVersion;
  if (!versionToApply) return;

  // Versionen werden auch im sichtbaren Tab erkannt; Reload wird nur im hidden state ausgeführt, um sichtbare Interaktion nicht zu stören.
  if (document.visibilityState === "visible") return;

  pendingUpdateVersion = null;
  markReloadedVersion(versionToApply);
  location.reload();
}

document.addEventListener("visibilitychange", () => {
  // Tab-Wechsel-Event als Trigger für verzögertes Update
  if (document.visibilityState === "hidden") {
    applyPendingUpdateIfSafe();
  }
});

setInterval(maybeApplyUpdate, 30000);
maybeApplyUpdate();
