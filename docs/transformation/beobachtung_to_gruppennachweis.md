# Transformation: Beobachtung → Gruppennachweis

## Zweck

Dieses Dokument beschreibt, wie Rohmaterial (Beobachtungen, Tagebuch, Hypothesen, Entscheidungen, Feedback, Reflexion) in den Gruppennachweis überführt wird.

## Prinzip

> Verdichtung, nicht Interpretation.
> Rohdaten werden strukturiert zusammengefasst, aber nicht eigenständig gedeutet.

## Transformationsregeln

### 1. Tagebuch → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `docs/tagebuch/*.md` | `kapitel/02_kontext.md`, `kapitel/05_reflexion.md` | Chronologische Einträge werden zu thematischen Blöcken verdichtet |
| Einzelereignisse | Kontextbeschreibung | Muster und Wiederholungen herausarbeiten |
| Wörtliche Beschreibungen | Zusammenfassungen | Kürzen, ohne Bedeutung zu verändern |

### 2. Beobachtungen → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `docs/beobachtungen/*.md` | `kapitel/01_thema.md`, `kapitel/03_menschen.md` | Situative Beobachtungen werden zu Verhaltensmustern zusammengefasst |
| Einzelbeobachtungen | Kategorisierte Muster | Gruppierung nach Situationstyp |

### 3. Hypothesen → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `docs/hypothesen.md` | `kapitel/04_zielsetzung.md`, `kapitel/05_reflexion.md` | Hypothesen werden mit ihrem aktuellen Status und Prüfweg dargestellt |
| Einzelhypothesen | Hypothesenübersicht | Statusbewertung hinzufügen |

### 4. Entscheidungen → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `docs/entscheidungen/*.md` | `kapitel/04_zielsetzung.md`, `kapitel/05_reflexion.md` | Entscheidungen werden mit Begründung und beobachteter Wirkung dargestellt |
| Einzelentscheidungen | Maßnahmenübersicht | Wirkungszusammenhänge herstellen |

### 5. Feedback → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `docs/feedback/*.md` | `kapitel/03_menschen.md`, `kapitel/05_reflexion.md` | Rückmeldungen der Zielperson werden als eigene Perspektive dokumentiert |
| Einzelfeedback | Perspektivenübersicht | Subjektive Qualität markieren |

### 6. Modelle → Gruppennachweis

| Quelle | Ziel im Gruppennachweis | Transformation |
|---|---|---|
| `models/*.md` | `kapitel/04_zielsetzung.md` | Modelle werden als Rahmen referenziert |

## Qualitätsprüfung

Vor Abschluss der Transformation muss geprüft werden:

- [ ] Jede Aussage im Gruppennachweis hat einen Quellenverweis
- [ ] Keine eigenständige Interpretation wurde hinzugefügt
- [ ] Offene Lücken sind als `[OFFEN]` markiert
- [ ] Status in `_state.md` ist aktualisiert
