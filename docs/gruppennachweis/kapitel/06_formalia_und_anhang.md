<!-- status: structured -->

# Kapitel 6: Formalia und Anhang

## 6.1 Dokumentationsrahmen

- **Arbeitsregeln:** [meta/arbeitsregeln.md](../../../meta/arbeitsregeln.md)
- **Dokumentationsziel (Meta-/Repo-Ebene):** [meta/projektziel.md](../../../meta/projektziel.md)
- **Contract (verbindlicher Rahmen dieses Gruppennachweises):** [docs/gruppennachweis/_contract.md](../_contract.md)
- **Statusmodell:** [docs/gruppennachweis/_state.md](../_state.md)
- **Transformationsregeln Rohmaterial → Gruppennachweis:** [docs/transformation/rohmaterial_to_gruppennachweis.md](../../transformation/rohmaterial_to_gruppennachweis.md)

## 6.2 Einhaltung der Arbeitsregeln

| Nr. | Regel | Umsetzung im Gruppennachweis | Nachweis |
|---|---|---|---|
| 1 | Beobachtung und Interpretation werden getrennt festgehalten | Getrennte Ordner `beobachtungen/`, `tagebuch/` (Beobachtung) vs. `hypothesen.md`, `reflexion.md` (Interpretation) | Verzeichnisstruktur; Kapitel 3–5 trennen Beobachtung, Einordnung und Schlussfolgerung |
| 2 | Hypothesen werden explizit formuliert | 11 Hypothesen mit Status, Alternativerklärung, Prüfweg, Steuerungsrelevanz | [docs/hypothesen.md](../../hypothesen.md), Kapitel 4.5, 5.5 |
| 3 | Entscheidungen werden begründet | 5 dokumentierte Entscheidungsdokumente (E1, E2, E3, E4 und E6) mit Maßnahme, Begründung, Ziel/Prüfhinweis | [docs/entscheidungen/*.md](../../entscheidungen/01_konsequenzen.md), Kapitel 4.2 |
| 4 | Reflexion prüft Wirkung, nicht Absicht | Kapitel 5 bewertet teilzielweise nach Evidenzstärke (A/B/C) und benennt Abweichungen | [docs/reflexion.md](../../reflexion.md), Kapitel 5 |
| 5 | Dokumentation erfolgt kurz und regelmäßig | Vorlauf + 7 Tageseinträge, Beobachtungsraster, Feedback-Einträge | [docs/tagebuch/*.md](../../tagebuch/00_vorlauf.md), [docs/beobachtungen/03_pause_und_pfandprojekt_beobachtungsraster.md](../../beobachtungen/03_pause_und_pfandprojekt_beobachtungsraster.md) |
| 6 | Keine identifizierenden Angaben | Zielperson als X, Mitschüler als Y, Fachkräfte als T., A., J, stellvertretender Schulleiter als K | Alle Kapitel und Rohdokumente |
| 7 | Feedback als eigene Quelle | Eigener Ordner `docs/feedback/` mit Eintragsregeln, Format und Erhebungsmodi | [docs/feedback/01_feedback_zielperson.md](../../feedback/01_feedback_zielperson.md), Kapitel 3.8 |
| 8 | Form der Rückmeldung wird markiert | Einträge dokumentieren Erhebungsart und Quellentreue („direkt / wörtlich"); Platzhalter nennen alle Modi (wörtlich / paraphrasiert / Auswahl / Skala / nicht erhoben) | [docs/feedback/02_feedback_x.md](../../feedback/02_feedback_x.md), [docs/feedback/03_feedback_x.md](../../feedback/03_feedback_x.md) – Vorlage: [docs/feedback/01_feedback_zielperson.md](../../feedback/01_feedback_zielperson.md) |

> Regel 8 ist in den Feedback-Dateien durch die Felder `Erhebungsart` und `Quellentreue` bereits operationalisiert. Bisher dokumentiert ist ausschließlich der Modus „direkt / wörtlich"; andere Modi (paraphrasiert, Auswahl, Skala) stehen als zulässige Alternativen bereit, wurden im dokumentierten Zeitraum aber nicht angewendet.

## 6.3 Sprache und Stil

- Sachlicher, auf Rohmaterial bezogener Stil; keine Umgangssprache.
- Fachbegriffe (ICF, Partizipation, Empowerment, Scaffolding, Stresstoleranz) werden im Material oder in den Modellen definiert und dort verankert referenziert.
  → Quelle: [models/index.md](../../../models/index.md), [models/prep_planung.md](../../../models/prep_planung.md)
- Personenbezüge durchgängig pseudonymisiert (Regel 6).

## 6.4 Literaturverzeichnis

- Der **Apparat** wird in [apparat/literaturverzeichnis.md](../apparat/literaturverzeichnis.md) gepflegt.
- **Stand:** Im dokumentierten Zeitraum liegen keine externen Fachliteraturquellen vor; Begründungen stützen sich auf das interne Material (Beobachtungen, Hypothesen, Entscheidungen, Reflexion) sowie die repo-internen Modelle (`models/*`). Der Zitierstil ist noch nicht festgelegt.
- [OFFEN] Eintragen externer Fachliteratur zu Empowerment, Partizipation und ICF-CY; Klärung des Zitierstils.

## 6.5 Anhang

> Der Bewertungsbogen sieht Protokolle und Notizen im Anhang vor. Nachfolgend sind die relevanten Rohdokumente als **Anhänge A1–A7** referenziert. Es handelt sich um verlinkte Quellen im Repo, nicht um gedruckte Beilagen.

| Anhang | Beschreibung | Umfang | Quelle |
|---|---|---|---|
| A1 | Projektplan „Schulhof verschönern mit X" | ca. 1 Seite | [docs/projektplan.md](../../projektplan.md) |
| A2 | Tagebucheinträge Vorlauf + Tag 1–7 | 8 Einträge | [docs/tagebuch/00_vorlauf.md](../../tagebuch/00_vorlauf.md) – [docs/tagebuch/07_tag_7.md](../../tagebuch/07_tag_7.md) |
| A3 | Beobachtungen in verschiedenen Situationen / Grenzen / Raster | 3 Dokumente | [docs/beobachtungen/01_verhalten_in_situationen.md](../../beobachtungen/01_verhalten_in_situationen.md), [docs/beobachtungen/02_umgang_mit_grenzen.md](../../beobachtungen/02_umgang_mit_grenzen.md), [docs/beobachtungen/03_pause_und_pfandprojekt_beobachtungsraster.md](../../beobachtungen/03_pause_und_pfandprojekt_beobachtungsraster.md) |
| A4 | Hypothesen (H1–H11) mit Status | 11 Einträge | [docs/hypothesen.md](../../hypothesen.md) |
| A5 | Entscheidungsdokumente E1, E2, E3, E4 und E6 (inkl. Systemarchitektur, Pause, Pfandprojekt) | 5 Dokumente | [docs/entscheidungen/*.md](../../entscheidungen/01_konsequenzen.md) |
| A6 | Feedback der Zielperson (Vorlage + Erhebungen) | 3 Dokumente | [docs/feedback/01_feedback_zielperson.md](../../feedback/01_feedback_zielperson.md), [docs/feedback/02_feedback_x.md](../../feedback/02_feedback_x.md), [docs/feedback/03_feedback_x.md](../../feedback/03_feedback_x.md) |
| A7 | Interventionsprotokoll (Pause-Protokoll) | 1 Dokument | [docs/intervention/pause_protokoll.md](../../intervention/pause_protokoll.md) |
| A8 | ICF-Report (Klassifikationsbericht vom 04.04.2026) | 1 HTML-Report | [docs/icf-reports/icf-report-gemeinschaftsprojekt-ko-konstr-2026-04-04-07-49.html](../../icf-reports/icf-report-gemeinschaftsprojekt-ko-konstr-2026-04-04-07-49.html) |
| A9 | Reflexionsnotizen (Wirkungen, offene Fragen) | 1 Dokument | [docs/reflexion.md](../../reflexion.md) |

## 6.6 Mapping und Rückverfolgbarkeit

- Jede Aussage ist über das Mapping auf mindestens eine Primärquelle rückführbar.
  → Quelle: [docs/gruppennachweis/mapping/rohmaterial_zu_kapiteln.md](../mapping/rohmaterial_zu_kapiteln.md)
- Offene epistemische Lücken sind im Mapping und in den Kapiteln mit `[OFFEN]` markiert.

## Offene Punkte

- [OFFEN] Formale Anforderungen an den Gruppennachweis (Umfang, Abgabeformat, Zitierstil) sind projektseitig noch nicht festgelegt.
- [OFFEN] Ausbau des Literaturverzeichnisses mit externen Fachquellen (siehe 6.4).
