# Contract: Gruppennachweis

## Zweck

Der Gruppennachweis ist das einzige Zielartefakt des Repos.
Er verdichtet Rohmaterial (Beobachtungen, Hypothesen, Entscheidungen, Feedback, Reflexion) zu einem kohärenten, bewertbaren Dokument.

## Verhältnis zu anderen Ebenen

- **Eingang:** Rohmaterial aus `docs/beobachtungen/`, `docs/tagebuch/`, `docs/entscheidungen/`, `docs/feedback/`, `docs/hypothesen.md`, `docs/reflexion.md`, `docs/intervention/`, `docs/icf-reports/`, `models/`
- **Transformation:** beschrieben in `docs/transformation/rohmaterial_to_gruppennachweis.md`
- **Rückverfolgbarkeit:** `mapping/rohmaterial_zu_kapiteln.md`
- **Argumentation:** `mapping/argumentationsschicht.md` (Beobachtung → Interpretation → Gegenhypothese → begründete Entscheidung für zentrale Aussagen)
- **Operationalisierung Partizipation:** `mapping/partizipationsgrad.md` (einheitsweise Erhebung nach Prep-Planung-Schwelle)
- **Stützapparat:** `apparat/literaturverzeichnis.md`

## Erlaubte Inhalte

- Zusammenfassungen und Verdichtungen von Beobachtungen
- Strukturierte Darstellung von Hypothesen und deren Status
- Begründete Entscheidungen mit Verweis auf Quellen
- Reflexion von Wirkungen und offenen Fragen
- Verweise auf ICF-Codes und Modelle
- Offene Lücken, explizit als `[OFFEN]` markiert

## Verbotene Inhalte

- Eigenständige Interpretation ohne Quellenrückverweis
- Spekulationen, die über die dokumentierten Hypothesen hinausgehen
- Fließtext ohne Strukturbezug
- Inhalte, die nicht auf Rohmaterial zurückführbar sind
- Bewertungen, die nicht durch Beobachtungen gestützt sind

## Interpretationsgovernance (zentral)

- Zentrale Interpretationen sollen modellgestützt sein oder explizit modellfrei begründet werden.
- Verhaltenszuschreibungen (z. B. Absicht/Wille/Provokation) werden per Attributionstheorie kontrastgeprüft, um Fehlattributionen zu reduzieren.
- Modellverweise sind kein Selbstzweck: Jede Modellnennung muss eine prüfbare Alternativdeutung, Verstärkerlogik oder Interaktionsschleife klären.

## Notwendige Quellen

Jede Aussage im Gruppennachweis muss auf mindestens eine der folgenden Quellen verweisen:

- `docs/tagebuch/` (Tageseinträge)
- `docs/beobachtungen/` (strukturierte Muster)
- `docs/entscheidungen/` (Maßnahmen und Begründungen)
- `docs/feedback/` (Rückmeldungen der Zielperson)
- `docs/hypothesen.md` (explizite Annahmen)
- `docs/reflexion.md` (Wirkungsbewertungen)
- `docs/icf-reports/` (ICF-Klassifikationen)
- `models/` (übergreifende Modelle)

## Qualitätskriterien

- Keine Aussage ohne Rückverweis auf Rohmaterial
- Verdichtung darf zusammenfassen, aber nicht interpretativ überziehen
- Offene Punkte werden als `[OFFEN]` markiert
- Jede Kapitel-Datei (`kapitel/*.md`) und `_compiled.md` trägt einen Status gemäß `_state.md`
- Kapitelstruktur folgt dem Bewertungsbogen (Thema, Kontext, Menschen+ICF, Zielsetzung+päd. Handeln, Reflexion, Formalia+Anhang)
