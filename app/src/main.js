import './styles.css';
import { loadData } from './lib/data';
import {
  renderBeobachtungen,
  renderEntscheidungen,
  renderOverview,
  renderSimpleDoc,
  renderTagebuch,
  renderProjektplan,
  renderICFReports,
  renderMeta,
  renderModels
} from './components/views';

const views = [
  { id: 'overview', label: 'Übersicht', render: renderOverview },
  { id: 'tagebuch', label: 'Tagebuch', render: renderTagebuch },
  { id: 'beobachtungen', label: 'Beobachtungen', render: renderBeobachtungen },
  { id: 'entscheidungen', label: 'Entscheidungen', render: renderEntscheidungen },
  { id: 'hypothesen', label: 'Hypothesen', render: (el, data) => renderSimpleDoc(el, data.hypothesen) },
  { id: 'reflexion', label: 'Reflexion', render: (el, data) => renderSimpleDoc(el, data.reflexion) },
  { id: 'projektplan', label: 'Projektplan', render: renderProjektplan },
  { id: 'icf-reports', label: 'ICF-Reports', render: renderICFReports },
  { id: 'meta', label: 'Meta', render: renderMeta },
  { id: 'modelle', label: 'Modelle', render: renderModels }
];

const data = loadData();
const app = document.querySelector('#app');

function render(activeId) {
  app.innerHTML = '';

  const layout = document.createElement('div');
  layout.className = 'layout';

  const nav = document.createElement('nav');
  nav.className = 'sidebar';

  views.forEach((view) => {
    const button = document.createElement('button');
    button.textContent = view.label;
    button.className = view.id === activeId ? 'active' : '';
    button.addEventListener('click', () => render(view.id));
    nav.appendChild(button);
  });

  const content = document.createElement('main');
  content.className = 'content';

  const current = views.find((view) => view.id === activeId) || views[0];
  const h1 = document.createElement('h1');
  h1.textContent = current.label;
  content.appendChild(h1);

  current.render(content, data);

  layout.append(nav, content);
  app.appendChild(layout);
}

render('overview');



const currentVersion = __APP_VERSION__;

function getCurrentVersion() {
  return currentVersion;
}

async function fetchRemoteVersion() {
  try {
    const res = await fetch('/version.json', { cache: 'no-store' });
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
  if (sessionStorage.getItem('lastReloadedVersion') === version) return false;
  return true;
}

function markReloadedVersion(version) {
  sessionStorage.setItem('lastReloadedVersion', version);
}

async function maybeApplyUpdate() {
  if (getCurrentVersion() === 'dev') return;

  // Wir unterbrechen den Nutzer nicht aktiv. Updates werden nur eingespielt,
  // wenn der Tab nicht sichtbar ist.
  if (document.visibilityState === 'visible') return;

  const remoteVersion = await fetchRemoteVersion();

  if (shouldReloadForVersion(remoteVersion)) {
    markReloadedVersion(remoteVersion);
    location.reload();
  }
}

document.addEventListener('visibilitychange', () => {
  // Wenn der Tab versteckt wird, checken wir, ob wir updaten koennen
  if (document.visibilityState === 'hidden') {
    maybeApplyUpdate();
  }
});

setInterval(maybeApplyUpdate, 30000);
maybeApplyUpdate();
