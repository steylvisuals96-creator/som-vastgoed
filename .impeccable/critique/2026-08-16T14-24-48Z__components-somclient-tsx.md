---
target: components/SOMClient.tsx
total_score: 17
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 3
timestamp: 2026-08-16T14-24-48Z
slug: components-somclient-tsx
---
## Design Health Score

| # | Heuristic | Score | Kernbevinding |
|---|-----------|-------|---------------|
| H1 | Visibility of System Status | 2 | Curtain progress bar: goed. Contactform: stille fetch-failure triggert toch `setSent(true)` — lie at peak moment. Leeg pand-grid geeft geen feedback. |
| H2 | Match System / Real World | 3 | Correct Nederlands. "Gratis waardebepaling" en "Gratis schatting" gebruikt door elkaar op 4 plaatsen. |
| H3 | User Control and Freedom | 2 | Geen skip op 2.2s+ curtain. Geen form-reset. "Bekijk aanbod" in Statement scrollt bezoeker omhoog naar §01. |
| H4 | Consistency and Standards | 2 | PropertyCard en PandKaart zijn twee totaal verschillende visuele talen voor hetzelfde contenttype. Section-index heeft gaten. |
| H5 | Error Prevention | 1 | catch {} leeg op contactform. Geen required-indicatoren. Geen inline validatie. |
| H6 | Recognition Rather Than Recall | 3 | Sticky nav, SchattingTeaser 3-stappen verlaagt cognitieve last op conversiemoment. |
| H7 | Flexibility and Efficiency | n/a | Persuade-pagina. |
| H8 | Aesthetic and Minimalist Design | 3 | Sterke editoriale terughoudendheid. Twee CTA-secties achter elkaar. |
| H9 | Error Recognition and Recovery | 1 | Nul error states. Stille form-failure. Geen fallback voor leeg pand-grid. |
| H10 | Help and Documentation | n/a | Persuade-pagina. |
| **Totaal** | | **17/32** | **Acceptable** |

## Design Specificity Verdict

Goed gechoreografeerd, niet generiek — maar twee breukpunten: PropertyCard (witte kaart, rounded-full, Cormorant, pill-knop) op /aanbod en hero-koptekst die uitwisselbaar is met elke Belgische makelaar. CLI detector: 0 bevindingen.

## Overall Impression

Technisch vakmanschap is hoog. Persuasie-architectuur dient verkopers niet: ze krijgen de outline-knop, tweede positie, en een hero-kop die over kopen praat. Twee P0's vóór live.

## What's Working

1. PandKaart correct systeem-conform (lines 475–522)
2. TaskSolution copy — zeldzaam inzicht-gedreven ("En zegt ook wanneer een pand níets voor u is")
3. IntroCurtain technische uitvoering — font-guard, StrictMode fix, scroll-lock lifecycle, reduced-motion

## Priority Issues

**P0 — Stille mislukking contactform** (lines 815–832): catch {} leeg, setSent(true) triggert bij failure. Fix: try/catch met error-state en recovery-tekst met telefoon/email. → /impeccable harden

**P0 — CTA-hiërarchie omgekeerd t.o.v. brief** (hero lines 387–390, SiteNav lines 104–112): kopers krijgen gele solid, verkopers krijgen outline, nav-CTA is "Contact". Fix: gelijke visuele gewichten of "Gratis waardebepaling" als primaire CTA. Nav-CTA naar "Gratis schatting". → /impeccable clarify

**P1 — PropertyCard schendt design-systeem** (lines 419–472): rounded-full badges/knop, bg-white, Cormorant, #888 grijs. Fix: migreer naar CREAM, sepia-palet, 2px radius, Archivo. → /impeccable polish

**P1 — Hero-koptekst uitwisselbaar** (lines 75–78): "Uw thuis vinden, dat doen we samen" is generiek. 45-daagse differentiator en A-tot-Z belofte zijn begraven in bodytekst. Fix: breng 45-daagse cijfer naar display-koptekst. → /impeccable clarify

**P1 — Focus-styling ontbreekt overal** (SOMClient lines 897/905/916, SiteNav lines 94–112): outline-none zonder vervanging, geen focus-trap mobiel menu, geen role="dialog". Fix: focus-visible:ring, focus-trap via useEffect. → /impeccable audit

**P2 — Opacity-reductie op stap-nummers breekt contrast** (line 631): SEPIA_SOFT op 0.55 opacity ≈ 2.2:1, faalt WCAG AA. Fix: verhoog opacity of gebruik SEPIA direct. → /impeccable audit

## Persona Red Flags

Jordan (First-Timer): ziet pand-grid vóór context/vertrouwen. TaskSolution staat ná listings.
Casey (Mobile): hero-afbeelding ~519px op iPhone 14 Pro, CTA's hoogstwaarschijnlijk under the fold.
Sam (A11y): H1 is WordMark, hero-kop is <p>. outline-none formulieren zonder focus-ring. Succes-state geen aria-live.
Luc (55+, verkoper): curtain leest als broken. Hero-kop is koper-georiënteerd. Gele knop = "Bekijk aanbod" = irrelevant.

## Minor Observations

- D.about gedefinieerd maar About-sectie rendert niet
- Statement "Bekijk aanbod" → #aanbod (scroll omhoog) ipv /aanbod
- Getuigenissen §06 — als leeg: nummering springt van §05 naar §07
- font-light op Genk-telefoon in nav, niet op Hasselt
- 6 team-foto's met unoptimized prop — LCP impact
- var(--font-cormorant) in mobiele menu-overlay — Cormorant voorbehouden per brief
