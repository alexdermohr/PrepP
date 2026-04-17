# Projekt-Dokumentation

## Zweck

Dieses Repository dient der strukturierten Dokumentation eines Entwicklungsprozesses.

Ziel ist es, Beobachtungen, Hypothesen und Entscheidungen nachvollziehbar zu machen,
um Lernen, Reflexion und Weiterentwicklung zu ermöglichen.

Das Repo ist **kein reiner Dokumentenspeicher**, sondern eine **Transformationsmaschine**:

> Beobachtung → Struktur → Argument → Hausarbeit

## Architektur: Vier Ebenen

### Ebene 1: Rohmaterial (Beobachtung & Dokumentation)

Unverarbeitete Quellen – Ereignisse, Muster, Entscheidungen, Feedback.

- `docs/tagebuch/` – Beschreibung von Ereignissen (ohne Interpretation)
- `docs/beobachtungen/` – strukturierte Muster und Auffälligkeiten
- `docs/entscheidungen/` – getroffene Maßnahmen und deren Begründung
- `docs/feedback/` – direkte Perspektive / Rückmeldung der Zielperson
- `docs/hypothesen.md` – explizite Annahmen
- `docs/reflexion.md` – Bewertung von Wirkungen
- `docs/intervention/` – Interventionsprotokolle
- `docs/icf-reports/` – ICF-bezogene Berichte

### Ebene 2: Gruppennachweis (strukturierte Verdichtung)

Verdichtung des Rohmaterials zu einem bewertbaren Dokument. Zusammenfassen, nicht interpretieren.

- `docs/gruppennachweis/_contract.md` – was rein darf und was nicht
- `docs/gruppennachweis/_state.md` – Zustandsmodell (draft → structured → integrated → final)
- `docs/gruppennachweis/kapitel/` – Kapitelstruktur (Thema, Kontext, Menschen, Zielsetzung, Reflexion, Formalia)
- `docs/gruppennachweis/_compiled.md` – zusammengeführte Fassung

### Ebene 3: Hausarbeit (argumentative Transformation)

Wissenschaftliche Aufarbeitung auf Basis des Gruppennachweises. Interpretieren, aber nur mit Quellenreferenz.

- `docs/hausarbeit/_contract.md` – was rein darf und was nicht
- `docs/hausarbeit/_state.md` – Zustandsmodell
- `docs/hausarbeit/outline.md` – Gliederung
- `docs/hausarbeit/kapitel/` – Kapitelstruktur (Einleitung, Theoretischer Rahmen, Methodik, Ergebnisse, Diskussion, Fazit)
- `docs/hausarbeit/apparat/` – Literaturverzeichnis und ergänzende Materialien
- `docs/hausarbeit/mapping/` – Rückverfolgbarkeit: welche Quelle stützt welche Aussage

### Ebene 4: Transformation (Brücken zwischen Ebenen)

Explizite Beschreibung, wie Inhalte von einer Ebene zur nächsten überführt werden.

- `docs/transformation/beobachtung_to_gruppennachweis.md` – Regeln für die Verdichtung
- `docs/transformation/gruppennachweis_to_hausarbeit.md` – Regeln für die Argumentation

### Übergreifend

- `models/` – übergreifende Modelle (z. B. Bedürfnisse, Prep-Planung)
- `meta/` – Zielsetzung und Arbeitsregeln

## Prinzip

Beobachtung, Interpretation, Entscheidung und subjektive Rückmeldung der Zielperson werden als unterschiedliche Quellen getrennt dokumentiert.

## Zustandsmodell

Jede Datei in Gruppennachweis und Hausarbeit trägt einen expliziten Status:

```
draft → structured → integrated → final
```

- **draft**: Erste Skizze, unvollständig
- **structured**: Struktur steht, Lücken markiert
- **integrated**: Alle Quellen eingebunden, geprüft
- **final**: Freigegeben, keine inhaltlichen Änderungen

Details: `_state.md` in den jeweiligen Verzeichnissen.

## Arbeitsweise mit Agenten

1. **Texte werden geliefert** – Neue Inhalte kommen als Rohmaterial ins Repository
2. **Agenten ordnen ein** – Inhalte werden gemäß Contract und Transformationsregeln zugeordnet
3. **Keine freie Umstrukturierung** – Agenten dürfen keine Struktur eigenmächtig ändern
4. **Statusregeln beachten** – Kein stiller Statuswechsel, keine Vermischung von Reifegrade
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
