# Projekt-Dokumentation

## Zweck

Dieses Repository dient der strukturierten Dokumentation eines Entwicklungsprozesses.

Ziel ist es, Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen,
um Lernen, Reflexion und Weiterentwicklung zu ermöglichen.

Das Repo ist **kein reiner Dokumentenspeicher**, sondern eine **Evidenzmaschine**:

> Quellenebene → Zieltextebene → Stützapparat

## Architektur

### Quellenebene: Rohmaterial

Unverarbeitete Quellen – Ereignisse, Muster, Entscheidungen, Feedback.

- `docs/tagebuch/` – Beschreibung von Ereignissen (ohne Interpretation)
- `docs/beobachtungen/` – strukturierte Muster und Auffälligkeiten
- `docs/entscheidungen/` – getroffene Maßnahmen und deren Begründung
- `docs/feedback/` – direkte Perspektive / Rückmeldung der Zielperson
- `docs/hypothesen.md` – explizite Annahmen
- `docs/reflexion.md` – Bewertung von Wirkungen
- `docs/intervention/` – Interventionsprotokolle
- `docs/icf-reports/` – ICF-bezogene Berichte

### Zieltextebene: Gruppennachweis

Der Gruppennachweis ist das **einzige Zielartefakt** des Repos.
Er verdichtet das Rohmaterial zu einem bewertbaren Dokument.

- `docs/gruppennachweis/_contract.md` – erlaubte/verbotene Inhalte, Quellenpflicht
- `docs/gruppennachweis/_state.md` – Zustandsmodell und Übergangsregeln
- `docs/gruppennachweis/_compiled.md` – laufende Arbeitsfassung (Gesamttext)
- `docs/gruppennachweis/kapitel/` – Kapitelstruktur nach Bewertungsbogen:
  - `01_thema.md`
  - `02_kontext.md`
  - `03_menschen_und_icf.md`
  - `04_zielsetzung_und_paedagogisches_handeln.md`
  - `05_reflexion.md`
  - `06_formalia_und_anhang.md`

### Stützapparat (innerhalb Gruppennachweis)

- `docs/gruppennachweis/mapping/rohmaterial_zu_kapiteln.md` – Rückverfolgbarkeit: welche Quelle stützt welche Aussage
- `docs/gruppennachweis/apparat/literaturverzeichnis.md` – Literatur und ergänzende Materialien

### Übergreifend

- `models/` – übergreifende Modelle (z. B. Bedürfnisse, Prep-Planung)
- `meta/` – Zielsetzung und Arbeitsregeln
- `docs/transformation/` – Regeln für die Überführung von Rohmaterial in den Gruppennachweis (`rohmaterial_to_gruppennachweis.md`)

## Prinzip

Beobachtung, Interpretation, Entscheidung und subjektive Rückmeldung der Zielperson werden als unterschiedliche Quellen getrennt dokumentiert.

## Zustandsmodell

Jede Kapitel-Datei (`docs/gruppennachweis/kapitel/*.md`) und `_compiled.md` trägt als erste Zeile einen expliziten Status. Strukturdateien (`_state.md`, `_contract.md`) und Stützapparat (`mapping/`, `apparat/`) sind ausgenommen.

```
draft → structured → integrated → final
```

- **draft**: Erste Skizze, unvollständig
- **structured**: Pflichtstruktur vollständig, Quellenbezüge vorhanden
- **integrated**: Alle `[OFFEN]`-Punkte aufgelöst, Mapping geprüft
- **final**: Freigegeben, keine inhaltlichen Änderungen

Details: `docs/gruppennachweis/_state.md`.

## Arbeitsweise mit Agenten

1. **Texte werden geliefert** – Neue Inhalte kommen als Rohmaterial ins Repository
2. **Agenten ordnen ein** – Inhalte werden gemäß Contract und Transformationsregeln zugeordnet
3. **Keine freie Umstrukturierung** – Agenten dürfen keine Struktur eigenmächtig ändern
4. **Statusregeln beachten** – Kein stiller Statuswechsel, keine Vermischung von Reifegraden
5. **Rückverfolgbarkeit** – Keine Aussage ohne Quellenrückverweis

## Visualisierung

Eine minimale Web-App unter `app/` visualisiert ausgewählte Markdown-Dateien aus `docs/`, `meta/` und `models/` strukturiert.
Die App ist **read-only**: Es gibt keine Bearbeitung, kein Rückschreiben und keine Repo-Mutationen.

### Lokale Visualisierung starten

```bash
cd app
npm install
npm run dev
```
