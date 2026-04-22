# Modelle → Kapitel: Integrationsplan (Stützapparat)

## Status und Geltung

> **Status:** Dieses Dokument ist ein **Arbeits- und Integrationsplan** im Stützapparat.
> Es ist **keine eigenständige Transformationsnorm**.
>
> Verbindlich bleiben Contract, State und Transformation:
> - [../_contract.md](../_contract.md)
> - [../_state.md](../_state.md)
> - [../../transformation/rohmaterial_to_gruppennachweis.md](../../transformation/rohmaterial_to_gruppennachweis.md)

Ziel: Modelle aus `models/` kapitelkonsistent einfügen, ohne die Trennung von Beobachtung, Interpretation und Bewertung zu verletzen.

---

## 1) Bestandsbasis (Stand: 22.04.2026)

Die folgenden Modelle sind **im Repository vorhanden** und damit direkt nutzbar:

- `abc_sorkc.md`
- `adler_individualpsychologie.md`
- `attributionstheorie.md`
- `big_five.md`
- `bindungstheorie.md`
- `emotionsregulation_gross.md`
- `frustration_aggression.md`
- `maslow.md`
- `oekologische_systemtheorie_bronfenbrenner.md`
- `operante_konditionierung.md`
- `prep_planung.md`
- `psychosoziale_entwicklung_erikson.md`
- `selbstbestimmungstheorie.md`
- `stresstoleranzfenster.md`
- `systemische_zirkularitaet.md`
- `transaktionales_stressmodell_lazarus.md`
- `yerkes_dodson.md`
- plus Ordnungsdatei: `index.md`

**Hinweis:** Falls später neue Modelle hinzukommen, gelten sie zunächst als **prospektiv** und müssen im Mapping gesondert markiert werden.

---

## 2) Integrationsmatrix: Modell → Kapitel → Einfügemodus

| Modell | Leitfrage | Kapitel / Abschnitt (empfohlen) | Einfügemodus |
|---|---|---|---|
| `stresstoleranzfenster.md` | Ist Regulation aktuell möglich? | K4.4.1, K5.3 (E1/E3b/E4) | Kontrast zu reiner Konsequenzlogik; Entscheidungskriterium für Frühintervention/Pause |
| `maslow.md` | Welche Grundbedürfnisse sind akut bedroht? | K3.2.1 (P2), K5.3 (E1/E3d) | Ergänzt Profil P2; Gegenlesart zu „reinem Regelverstoß“ |
| `selbstbestimmungstheorie.md` | Kippt Motivation über Autonomie/Kompetenz/Bezug? | K4.3, K5.7 | Präzisiert, warum Eigenmotivation > Druck wirkt |
| `transaktionales_stressmodell_lazarus.md` | Wie wird die Situation bewertet? | K4.4.1, K5.3 (E3b/E4) | Bewertungslogik für Kippsignale und Re-Appraisal |
| `yerkes_dodson.md` | Passt Aktivierungsniveau zur Aufgabe? | K4.4.1 (Scaffolding), K5.1 (T3) | Erklärt Leistungsabfall in formeller Exposition |
| `abc_sorkc.md` | Welche Verhaltenskette stabilisiert Muster? | K5.3 (E1/E3b/E3d), K5 offene Punkte | Standardformat für Episodenprotokolle |
| `operante_konditionierung.md` | Welche Konsequenzen verstärken/löschen Verhalten? | K5.3 (E1), K5.6 (H4/H8) | Trennt Kurzzeitunterbrechung von langfristiger Verstärkung |
| `attributionstheorie.md` | Welche Zuschreibung ist plausibel – welche Alternative? | K5 „Interpretationsprüfung“, K5.3 quer | Schließt OFFEN-Punkt zur Attributionsprüfung |
| `bindungstheorie.md` | Bei wem gelingt Co-Regulation? | K3.9, K4.4.1 (Y, T./A.), K5.2 | Einordnung von Rückkehr/Entschuldigung (P5/H9) |
| `emotionsregulation_gross.md` | Wo im Prozess kippt Regulation? | K5.3 (E3b/E4), K5.6.1 (H11) | Prozessmarker vor Eskalation operationalisieren |
| `frustration_aggression.md` | Welche Zielblockade führt zur Aggression? | K3.2.1 (P2), K5.3 (E1/E3d/E4) | Zielblockaden explizit codieren |
| `systemische_zirkularitaet.md` | Welche Rückkopplung stabilisiert das Muster? | K2.2, K5.4, K5.7 | Mehrpersonen-Schleifen statt linearer Schuldlogik |
| `oekologische_systemtheorie_bronfenbrenner.md` | Welche Systemebenen wirken mit? | K2.1/2.2, K5.4 (Tag 7), K5.7 | Mikro-/Meso-/Exo-Ebene für Stakeholderfehler |
| `psychosoziale_entwicklung_erikson.md` | Welche Entwicklungsaufgabe ist aktiv? | K3.3/3.4, K5.7 | Nachgeordnet für Langzeitdeutung |
| `big_five.md` | Welche stabilen Dispositionen sind plausibel? | K3.2, K5 Grenzen | Randdeutung, nicht Primärbegründung |

---

## 3) Kapitelweise Einbindung (Governance-kompatibel)

### Kapitel 1 (Thema)
- Rahmend: `prep_planung` bleibt Primäranker.
- Optional kurze Ergänzung über SDT (1–2 Sätze).

### Kapitel 2 (Kontext)
- Systemisch ergänzen: Bronfenbrenner + Zirkularität.
- Zweck: Kontext als Wirkzusammenhang, nicht nur als Kulisse.

### Kapitel 3 (Menschen und ICF)
- Primat bleibt deskriptiv (ICF + Beobachtung).
- Maximal ein Modellanker je Profil, klar als **Hypothesenanker** markiert.

### Kapitel 4 (Zielsetzung und Handeln)
- Hauptort der Modellbegründung (gemäß Transformation).
- Praktisch: in 4.4.1 je Handlungsschritt 1 Leitmodell + 1 Kontrastmodell.

### Kapitel 5 (Reflexion)
- Sekundärer Modellort: robuste Kontrast-/Alternativprüfung, nicht neue Theorieebene.
- Praktisch: je Entscheidung in 5.3 ein Feld „Modellbasierte Kontrastprüfung“.

### Kapitel 6 (Formalia)
- Nur dokumentieren, keine neue inhaltliche Modellargumentation.

---

## 4) Einfügeverfahren in 4 Schritten

1. **Problemfall wählen** (z. B. E1, E3b, E4).
2. **Gate-Schema aus `models/index.md` anwenden** (Regulation/Bedürfnis → Motivation/Bewertung → Verhalten/Interaktion).
3. **Genau zwei Modelle setzen**:
   - 1 Leitmodell für Intervention,
   - 1 Gegenmodell zur Falsifikation.
4. **Mini-Struktur dokumentieren**:
   - Beobachtung,
   - Modell A: Deutung + Indikator,
   - Modell B: Alternativindikator,
   - vorläufiges Urteil + Nachweislücke.

---

## 5) Priorisierte Einführung (empfohlen)

1. Attributionstheorie + ABC/SORKC in Kapitel 5.3.
2. Stresstoleranzfenster + Lazarus + Gross für E3b/E4 und H11.
3. SDT + Maslow in Kapitel 4.3/4.4.1.
4. Systemisch/Ökologisch in Kapitel 2, 5.4, 5.7.
5. Bindung/Erikson/Big Five nachgeordnet.

---

## 6) Guardrails

- Kein Modell ersetzt Primärquellen (Tagebuch, Beobachtung, Feedback, ICF).
- Keine diagnostischen Aussagen aus Einzelmodellen.
- Pro zentraler Deutung mindestens eine Gegenhypothese.
- Bei unklarer Evidenz bleibt das Urteil **(C)**.
- Kapitel 3 bleibt deskriptiv; Deutungsdichte liegt in Kapitel 4/5.
