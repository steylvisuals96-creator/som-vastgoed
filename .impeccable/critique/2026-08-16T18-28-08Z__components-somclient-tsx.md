---
target: components/SOMClient.tsx
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
timestamp: 2026-08-16T18-28-08Z
slug: components-somclient-tsx
---
Method: dual-agent (A: a3e3ee01a7131be64 · B: ac423b5e329b41bcc)

## Design Health Score

| # | Heuristic | Score | Kernbevinding |
|---|-----------|-------|---------------|
| H1 | Visibility of System Status | 3 | Form loading/success/error correct. Geen retry-prompt bij fout. |
| H2 | Match System / Real World | 2 | 5 labels voor /schatting: "Gratis schatting", "Gratis waardebepaling" (3x), "Start gratis schatting". Gebruikers twijfelen of dit hetzelfde product is. |
| H3 | User Control and Freedom | 3 | Over ons + focus trap gefixed. Curtain heeft nog geen skip. |
| H4 | Consistency and Standards | 3 | Mobiel menu volledig compliant. ctaPrimary/ctaSecondary naming omgekeerd. Statement/UspStrip zonder sectie-index. |
| H5 | Error Prevention | 3 | Type-validatie, disabled submit bij loading. Labels 12px + 0.82 opacity. |
| H6 | Recognition Rather Than Recall | 3 | Actieve nav-state, badges, contact-info herhaald. Nav active state-bug voor Home. |
| H7 | n/a | — | Persuade-pagina. |
| H8 | Aesthetic and Minimalist Design | 2 | Alle scroll-animaties zijn identieke opacity-fades: PRODUCT.md-overtreding. |
| H9 | Error Recognition and Recovery | 3 | Telefoon + e-mail als clickable links, role="alert". Geen retry-prompt. |
| H10 | n/a | — | Persuade-pagina. |
| **Totaal** | | **22/32** | **Acceptable** |

## Design Specificity Verdict

Partieel eigengemaakt. Screen-blend wordmark, kantlijnindices, CREAM/SEPIA/Y palet zonder wit, en TaskSolution-copy zijn onkopieerbaar. Copylayer ("Uw vertrouwde partner", "Eerlijk advies, transparante communicatie") is categorie-inwisselbaar. Identieke opacity-fades wissen de choreografische eigenheid uit. Detector: 0 bevindingen.

## Overall Impression

17 → 21 → 22/32. De P0/P1-reeks is gesloten; Over ons, Button focus ring, focus trap en label contrast werken. Twee nieuwe prioritaire bevindingen: PRODUCT.md-overtreding (identieke fades) en terminologisch breukpunt (5 labels voor /schatting). Grootste onbenutte kans: Statement-CTA stuurt verkopers naar aanbod.

## What's Working

1. Focus- en a11y-laag is nu coherent: Button boxShadow focus ring, mobiel menu met volledige focus trap, role="dialog" + aria-modal, useReducedMotion door de hele codebase.
2. Over ons sectie lost het structurele vertrouwensgat op. Nav-link werkt, emotionele opbouw klopt.
3. TaskSolution blijft de sterkste tekst: onkopieerbare claims voor beide doelgroepen.

## Priority Issues

**[P0] Alle scroll-animaties zijn identieke opacity-fades — PRODUCT.md-overtreding**
- UspStrip, Offices, Team, Getuigenissen, PandKaart, SchattingTeaser-stappen, OverOns — allemaal opacity 0→1 via whileInView. Verboden door PRODUCT.md en DESIGN.md.
- Fix: 2-3 distinctieve reveal-patronen (y-translate voor tekst, x-translate voor beelden, scale voor icons). Wissel per sectie af.
- Suggested: /impeccable animate

**[P1] CTA-terminologie: 5 labels voor 1 pagina (/schatting)**
- Nav: "Gratis schatting" | Hero: "Gratis waardebepaling" | TaskSolution: "Gratis waardebepaling" | SchattingTeaser: "Start gratis schatting" | OverOns: "Gratis waardebepaling".
- Fix: Kies "Gratis waardebepaling" doorheen. Pas nav CTA en SchattingTeaser-knoptekst aan.
- Suggested: /impeccable clarify

**[P1] PropertyCard niet keyboard-activeerbaar**
- motion.article met onClick maar geen tabIndex, role="link", of onKeyDown. Homepage PandKaart is correct motion.a.
- Fix: Verander motion.article naar motion.a met href={href}.
- Suggested: /impeccable audit

**[P1] Statement-CTA stuurt verkopers naar /aanbod**
- Gele primaire knop op het emotionele hoogtepunt gaat naar /aanbod, niet /schatting. Verkopers vinden geen eigen actie.
- Fix: "Gratis waardebepaling" als gele primaire, "Bekijk aanbod" als outline-secundair.
- Suggested: /impeccable polish

**[P2] Nav active state voor Home is altijd false**
- "/".includes("home") = false. Home is nooit actief gemarkeerd.
- Fix: isActive = activePage === "home" ? href === "/" : href.includes(activePage)
- Suggested: /impeccable polish

## Persona Red Flags

Jordan: curtain = laadprobleem. 5 schatting/waardebepaling-varianten = verwarring. 98% stat niet verificeerbaar.
Sam: Nav CTA geen focus handler. WordMark dubbel aangekondigd door AT. PropertyCard niet keyboard-activeerbaar.
Casey: CTAs waarschijnlijk below fold op iPhone SE. PandKaart "Bekijken" hover-only.
Leen: "45 dagen" adresseert snelheid, niet prijs-angst. Copyleft identiek aan categorie-generiek. Geen makelaar-match flow.

## Minor Observations

1. Nav CTA "Gratis schatting" mist onFocus/onBlur in SiteNav.tsx
2. WordMark: beide span-varianten altijd in DOM, geen aria-hidden op verborgen variant
3. Cormorant Garamond in mobiele nav — DESIGN.md wijst Archivo aan
4. HERO_IMG hardcoded — klant kan foto niet wisselen via CMS
5. D.boldCta.topLabel nooit gerenderd
6. const B en const W in SOMClient.tsx nooit gebruikt
7. aria-busy ontbreekt op form
8. Getuigenissen verdwijnt bij leeg CMS — geen fallback structuur

## Questions to Consider

1. Is de intro-curtain meten waard? Wat is de bounce rate op mobiele verbindingen voor de hero laadt?
2. Welke term gebruikt Maxime: "schatting" of "waardebepaling"? Die term wint.
3. Statement is het emotionele hoogtepunt. Waarom stuurt de primaire CTA verkopers naar het aanbod?
