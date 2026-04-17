# State-Modell: Gruppennachweis

## Zustände

| Status | Bedeutung | Erlaubte Aktionen |
|---|---|---|
| `draft` | Erste Skizze, unvollständig, Struktur kann sich ändern | Inhalte hinzufügen, umstrukturieren, löschen |
| `structured` | Struktur steht, Inhalte sind zugeordnet, Lücken markiert | Inhalte ergänzen, Verweise prüfen, Lücken füllen |
| `integrated` | Alle Quellen eingebunden, Verweise geprüft, Lücken geschlossen | Nur Korrekturen und Präzisierungen |
| `final` | Freigegeben, keine inhaltlichen Änderungen mehr | Keine inhaltlichen Änderungen, nur Formatierung |

## Regeln

1. Jede Datei im Gruppennachweis trägt als erste Zeile ihren aktuellen Status:
   ```
   <!-- status: draft -->
   ```
2. Statusübergänge sind nur in der Reihenfolge `draft → structured → integrated → final` erlaubt.
3. Ein Rücksprung (z. B. `integrated → draft`) ist nur mit expliziter Begründung erlaubt und muss dokumentiert werden.
4. Kein Agent darf den Status stillschweigend ändern.
5. Vor jedem Statusübergang muss geprüft werden, ob die Anforderungen des Zielstatus erfüllt sind.

## Übergangsbedingungen

| Von | Nach | Bedingung |
|---|---|---|
| `draft` | `structured` | Pflichtstruktur des Kapitels vollständig vorhanden, alle Abschnitte haben mindestens einen Quellenverweis |
| `structured` | `integrated` | Alle `[OFFEN]`-Punkte aufgelöst, Quellenbezüge geprüft, Mapping aktualisiert |
| `integrated` | `final` | Inhaltliche Freigabe durch Projektleitung |
