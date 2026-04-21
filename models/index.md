# Modellindex: Leitfragen, Vorrang und Einsatz

Dieser Index ordnet den Modellkorpus als Werkzeugkasten.

## 1) Leitfrage je Modell

- **[Stresstoleranzfenster](./stresstoleranzfenster.md) (STATE):** Ist Regulation aktuell möglich? → Vorrang bei akuter Dysregulation.
- **[Maslow](./maslow.md) (NEED):** Welche Grundbedürfnisse sind ungedeckt? → Vorrang vor höheren Modellen bei Basisdefiziten.
- **[Selbstbestimmungstheorie](./selbstbestimmungstheorie.md) (NEED + MOTIVATION):** Warum kippt Mitmachen in Widerstand? → Nach STF/Maslow, vor Feintuning.
- **[Lazarus](./transaktionales_stressmodell_lazarus.md) (STATE + COGNITION):** Wie wird die Situation bewertet? → Nach STF, ergänzend zu SDT.
- **[Yerkes-Dodson](./yerkes_dodson.md) (PERFORMANCE):** Ist das Aktivierungsniveau passend? → Nach STF/Lazarus zur Leistungssteuerung.
- **[ABC/SORKC](./abc_sorkc.md) (BEHAVIOR):** Welche Sequenz stabilisiert Verhalten? → Funktionsanalyse, nicht alleinige Primärursache.
- **[Bindungstheorie](./bindungstheorie.md) (RELATION + STATE):** Bei wem ist Co-Regulation möglich? → Vorrang bei klarer Personenspezifik.
- **[Big Five](./big_five.md) (TRAIT):** Welche stabilen Dispositionen prägen Verhalten? → Nachrangig bei starker Situationsdynamik.
- **[Emotionsregulation](./emotionsregulation_gross.md) (STATE + PROCESS):** Wo im Prozess kippt Regulation? → Nach STF, ergänzend zu Lazarus/ABC.
- **[Frustration-Aggression](./frustration_aggression.md) (DRIVE/STATE):** Welches Ziel wurde blockiert? → Ergänzend bei Zielunterbrechung.
- **[Ökologische Systemtheorie](./oekologische_systemtheorie_bronfenbrenner.md) (SYSTEM):** Welcher Kontext erzeugt Verhalten mit? → Ergänzend bei Kontextvarianz.
- **[Erikson](./psychosoziale_entwicklung_erikson.md) (DEVELOPMENT):** Welche Entwicklungsfrage ist aktiv? → Ergänzend für Langzeitdeutung.
- **[Prep-Planung](./prep_planung.md) (PLANNING):** Wie wird aus Bedarf/Interessen/Ressourcen eine Intervention? → Rahmenlogik; setzt psychologische Klärung voraus.

## 2) Gate-Schema (empfohlene Reihenfolge)

1. STF prüfen (Sicherheit/Regulation zuerst)
2. Maslow prüfen (Basisbedürfnisse)
3. SDT + Lazarus prüfen (Motivation + Bewertung)
4. Yerkes-Dodson prüfen (Aktivierung/Leistung)
5. ABC/SORKC prüfen (Sequenz/Funktion/Kontingenz)
6. Bindung prüfen (personenspezifische Sicherheit)
7. Emotionsregulation / Frustration ergänzen (Prozess + Zielblockade)
8. System + Entwicklung + Trait einordnen (Kontext, Langzeit, Disposition)
9. Prep-Planung ableiten (Interventionsarchitektur)

## 3) Nutzungsprinzipien

- Modelle sind primär komplementär, müssen im Einzelfall aber auch konkurrierend geprüft werden.
- Fallzuordnungen sind heuristisch und alternativ deutbar.
- Kein Einzelmodell überstimmt akute Sicherheitslogik (STF).

## 3b) Konkurrenzprüfung (Falsifikationsfokus)

- Modelle werden im Einzelfall nicht nur kombiniert, sondern gegeneinander geprüft.
- Für jede Deutung sollte mindestens eine widerlegende Beobachtung benannt werden.
- Beispiel Leitfrage: „Welche Beobachtung würde Hypothese A schwächen und Hypothese B stärken?“
- Ziel: Bestätigungsbias reduzieren und handlungsrelevante Entscheidungen erzwingen.

## 4) Hinweis zur Navigation im Renderer

- Interne Markdown-Links auf `.md`-Dateien werden im aktuellen Frontend als interne Referenzen aufgelöst.
- Relative Pfade wie `./abc_sorkc.md` werden kontextbezogen auf `models/` normalisiert.
- Technische Grundlage: Link- und Pfadauflösung in `app/src/components/views.js` sowie Abschnitts-/Listen-Parsing in `app/src/lib/markdown.js`.
- Status: aktuell funktional; Stabilitätsgarantie für zukünftige Renderer-Änderungen ist nicht impliziert.
