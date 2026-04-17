# Transformation: Gruppennachweis → Hausarbeit

## Zweck

Dieses Dokument beschreibt, wie der Gruppennachweis in die Hausarbeit überführt wird.

## Prinzip

> Argumentation, nicht Wiederholung.
> Der Gruppennachweis liefert die Evidenz; die Hausarbeit liefert die Argumentation.

## Transformationsregeln

### 1. Gruppennachweis-Kapitel → Hausarbeit-Kapitel

| Quelle (Gruppennachweis) | Ziel (Hausarbeit) | Transformation |
|---|---|---|
| `01_thema.md` | `01_einleitung.md` | Thema wird zur Problemstellung mit Fragestellung |
| `02_kontext.md` | `01_einleitung.md`, `03_methodik.md` | Kontext wird zum Hintergrund und zur Methodenbegründung |
| `03_menschen.md` | `04_ergebnisse.md` | Beobachtungen zu Personen werden zu Ergebnisdarstellung |
| `04_zielsetzung.md` | `02_theoretischer_rahmen.md`, `04_ergebnisse.md` | Ziele und Hypothesen werden theoretisch eingebettet |
| `05_reflexion.md` | `05_diskussion.md` | Reflexionen werden zur Diskussion und Einordnung |
| `06_formalia.md` | `06_fazit.md` | Formale Aspekte fließen in den Abschluss |

### 2. Transformationstypen

| Typ | Beschreibung | Beispiel |
|---|---|---|
| **Einbettung** | Empirische Daten werden in theoretischen Rahmen gesetzt | Beobachtung → Literaturverknüpfung |
| **Argumentation** | Aus Mustern werden Thesen abgeleitet | Hypothesenübersicht → Argumentationskette |
| **Reflexion** | Wirkungen werden kritisch eingeordnet | Entscheidungswirkung → Diskussion der Grenzen |
| **Synthese** | Verschiedene Quellen werden zu einem Schluss zusammengeführt | Beobachtung + Theorie → Fazit |

### 3. Zusätzliche Anforderungen

Die Hausarbeit erfordert im Unterschied zum Gruppennachweis:

- Fachliteratur als zusätzliche Quelle
- Theoretische Rahmung (z. B. Empowerment, ICF, Partizipation)
- Wissenschaftliche Sprache und Formalia
- Methodenreflexion

## Qualitätsprüfung

Vor Abschluss der Transformation muss geprüft werden:

- [ ] Mapping (`docs/hausarbeit/mapping/gruppennachweis_zu_hausarbeit.md`) ist vollständig
- [ ] Jede Aussage in der Hausarbeit ist rückverfolgbar
- [ ] Keine Gruppennachweis-Inhalte wurden ohne Transformation übernommen
- [ ] Fachliteratur ist im Apparat dokumentiert
- [ ] Status in `_state.md` ist aktualisiert
