# Projekt-Dokumentation

## Zweck

Dieses Repository dient der strukturierten Dokumentation eines Entwicklungsprozesses.

Ziel ist es, Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen,
um Lernen, Reflexion und Weiterentwicklung zu ermöglichen.

## Struktur

- `docs/tagebuch/` – Beschreibung von Ereignissen (ohne Interpretation)
- `docs/beobachtungen/` – strukturierte Muster und Auffälligkeiten
- `docs/entscheidungen/` – getroffene Maßnahmen und deren Begründung
- `docs/hypothesen.md` – explizite Annahmen
- `docs/reflexion.md` – Bewertung von Wirkungen

- `models/` – übergreifende Modelle (z. B. Bedürfnisse)
- `meta/` – Zielsetzung und Arbeitsregeln

## Prinzip

Beobachtung, Interpretation und Entscheidung werden getrennt dokumentiert.

## Visualisierung

Eine minimale Web-App unter `app/` visualisiert ausgewählte Markdown-Dateien aus `docs/`, `meta/` und `models/` strukturiert.
Die App ist **read-only**: Es gibt keine Bearbeitung, kein Rückschreiben und keine Repo-Mutationen.

### Lokale Visualisierung starten

```bash
cd app
npm install
npm run dev
```
