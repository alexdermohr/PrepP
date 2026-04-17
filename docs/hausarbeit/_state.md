# State-Modell: Hausarbeit

## Zustände

| Status | Bedeutung | Erlaubte Aktionen |
|---|---|---|
| `draft` | Erste Skizze, unvollständig, Struktur kann sich ändern | Inhalte hinzufügen, umstrukturieren, löschen |
| `structured` | Struktur steht, Argumentation ist skizziert, Lücken markiert | Argumente ausarbeiten, Quellen einbinden |
| `integrated` | Alle Quellen eingebunden, Argumentation geschlossen, Mapping geprüft | Nur Korrekturen, sprachliche Überarbeitung |
| `final` | Freigegeben, keine inhaltlichen Änderungen mehr | Keine inhaltlichen Änderungen, nur Formatierung |

## Regeln

1. Jede Datei in der Hausarbeit trägt im YAML-Frontmatter oder als erste Zeile ihren aktuellen Status:
   ```
   <!-- status: draft -->
   ```
2. Statusübergänge sind nur in der Reihenfolge `draft → structured → integrated → final` erlaubt.
3. Ein Rücksprung (z. B. `integrated → draft`) ist nur mit expliziter Begründung erlaubt und muss dokumentiert werden.
4. Kein Agent darf den Status stillschweigend ändern.
5. Vor jedem Statusübergang muss geprüft werden, ob die Anforderungen des Zielstatus erfüllt sind.
6. Zusätzlich zu den Gruppennachweis-Regeln: Vor dem Übergang zu `integrated` muss das Mapping (`docs/hausarbeit/mapping/gruppennachweis_zu_hausarbeit.md`) vollständig und geprüft sein.

## Aktuelle Status-Übersicht

| Datei | Status | Letzte Änderung |
|---|---|---|
| `outline.md` | draft | 2026-04-17 |
| `kapitel/01_einleitung.md` | draft | 2026-04-17 |
| `kapitel/02_theoretischer_rahmen.md` | draft | 2026-04-17 |
| `kapitel/03_methodik.md` | draft | 2026-04-17 |
| `kapitel/04_ergebnisse.md` | draft | 2026-04-17 |
| `kapitel/05_diskussion.md` | draft | 2026-04-17 |
| `kapitel/06_fazit.md` | draft | 2026-04-17 |
