# State-Modell: Gruppennachweis

## Zustände

| Status | Bedeutung | Erlaubte Aktionen |
|---|---|---|
| `draft` | Erste Skizze, unvollständig, Struktur kann sich ändern | Inhalte hinzufügen, umstrukturieren, löschen |
| `structured` | Struktur steht, Inhalte sind zugeordnet, Lücken markiert | Inhalte ergänzen, Verweise prüfen, Lücken füllen |
| `integrated` | Alle Quellen eingebunden, Verweise geprüft, Lücken geschlossen | Nur Korrekturen und Präzisierungen |
| `final` | Freigegeben, keine inhaltlichen Änderungen mehr | Keine inhaltlichen Änderungen, nur Formatierung |

## Regeln

1. Jede Datei im Gruppennachweis trägt im YAML-Frontmatter oder als erste Zeile ihren aktuellen Status:
   ```
   <!-- status: draft -->
   ```
2. Statusübergänge sind nur in der Reihenfolge `draft → structured → integrated → final` erlaubt.
3. Ein Rücksprung (z. B. `integrated → draft`) ist nur mit expliziter Begründung erlaubt und muss dokumentiert werden.
4. Kein Agent darf den Status stillschweigend ändern.
5. Vor jedem Statusübergang muss geprüft werden, ob die Anforderungen des Zielstatus erfüllt sind.

## Aktuelle Status-Übersicht

| Datei | Status | Letzte Änderung |
|---|---|---|
| `kapitel/01_thema.md` | draft | 2026-04-17 |
| `kapitel/02_kontext.md` | draft | 2026-04-17 |
| `kapitel/03_menschen.md` | draft | 2026-04-17 |
| `kapitel/04_zielsetzung.md` | draft | 2026-04-17 |
| `kapitel/05_reflexion.md` | draft | 2026-04-17 |
| `kapitel/06_formalia.md` | draft | 2026-04-17 |
| `_compiled.md` | draft | 2026-04-17 |
