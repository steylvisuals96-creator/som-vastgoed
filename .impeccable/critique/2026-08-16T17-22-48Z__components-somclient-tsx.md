---
target: components/SOMClient.tsx
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
timestamp: 2026-08-16T17-22-48Z
slug: components-somclient-tsx
---
Method: dual-agent (A: abb751b86046d1759 · B: a7eda9e9e29c043e1)

## Design Health Score

| # | Heuristic | Score | Kernbevinding |
|---|-----------|-------|---------------|
| H1 | Visibility of System Status | 3 | Curtain progress bar goed. Contact form loading + success/error correct. Geen skeleton of loading indicator voor SSR pand-data. |
| H2 | Match System / Real World | 3 | Correct Nederlands. Sectie-index (01–07) is editorial convention onbekend aan niet-design publiek. |
| H3 | User Control and Freedom | 2 | Geen skip op 2.2s curtain. Geen focus trap in mobiel menu (B bevestigt). "Over ons" nav link leidt nergens. |
| H4 | Consistency and Standards | 2 | Desktop nav CTA "Gratis schatting" → /schatting; mobiel overlay CTA "Contact opnemen" → /#contact — zelfde visueel gewicht, andere bestemming. Cormorant Garamond in mobiele nav-links, DESIGN.md reserveert dit voor niet-homepage. Button vs inline-`<a>` pattern inconsistent. |
| H5 | Error Prevention | 3 | `required` correct afwezig op telefoon. `type="email"` actief. Loading state blokkeert double-submit. Contact label text (11px, 55% opacity) is contrast-risico voor foutieve invoer. |
| H6 | Recognition Rather Than Recall | 2 | Active nav highlight ✓. Select field heeft geen caret — visueel ononderscheidbaar van text input. "Over ons" nav link werkt niet. PropertyCard niet keyboard-activeerbaar (B: F2). |
| H7 | Flexibility and Efficiency | n/a | Persuade-pagina. |
| H8 | Aesthetic and Minimalist Design | 3 | Gouden Uur-terughoudendheid. "45 dagen" en "A tot Z" elk drie keer herhaald zonder escalatie. USP strip na Statement-climax creëert emotionele dip. |
| H9 | Error Recognition and Recovery | 3 | Contact form error: telefoon + e-mail als clickable links, role="alert" aanwezig. Error kleur (#f5a623) dichtbij brand-geel — potentiële signaalverwarring. |
| H10 | Help and Documentation | n/a | Persuade-pagina. |
| **Totaal** | | **21/32** | **Acceptable → richting Good** |

## Design Specificity Verdict

**LLM assessment:** Sterker eigengemaakt dan de vorige versie — "gemiddeld 45 dagen" in de headline, Gouden Uur-palette door alle componenten, en de TaskSolution-copy ("zegt ook wanneer een pand níets voor u is") zijn onkopieerbaar zonder te liegen. De structurele breukpunten zijn nu subtiler: de USP-strip ("Gevestigd kantoor", "3 vestigingen", "Persoonlijk", "Snel resultaat") is de exacte checklist van elke Belgische concurrent; het Over ons-stuk bestaat in de data maar wordt niet gerenderd; de sectievolgorde (Hero → Aanbod) spreekt kopers aan vóór het verkopers-vertrouwen is opgebouwd.

**Deterministic scan:** Detector retourneert 0 bevindingen. CLI clean — alle visuele systeem-regels en code-patronen zijn conform. Technische violations zijn situationeel (keyboard access, focus trap) en niet door de statische detector detecteerbaar.

## Overall Impression

Van 17/32 naar 21/32: de P0-blockers en design-systeem-inconsistenties zijn opgelost, de basisarchitectuur is integer. De resterende gap richting 28+ zit in vier concrete punten: een dode navigatielink die vertrouwen breekt, een keyboard/a11y-laag die stelselmatig ontbreekt op de Button-component en mobiel menu, een conversie-mismatch tussen desktop- en mobiel-funnel, en herhaalde copy zonder escalatie die de emotionele vaart afstopt net voor de close.

## What's Working

**1. Intro curtain + hero mix-blend-mode: screen — technisch correct én cinematisch effectief.** `document.fonts.ready` guard (met 1200ms cap), `sessionStorage` replay-blokkering, `aria-hidden` gedurende de animatie, `pointerEvents: "none"` — elk detail klopt. Het wordmark gloeit over het pand en brandt weg waar de zon staat. Niemand die de site voor het eerst ziet verwacht dit.

**2. Contact form foutherstel is nu expliciet en direct.** `role="alert"`, inline telefoon + e-mail als clickable links, `setLoading(false)` in finally-blok — de gebruiker die een netwerk-fout raakt krijgt onmiddellijk een alternatieve route, zonder dat het formulier gewist wordt.

**3. TaskSolution copy is onkopieerbaar.** "Wij vergelijken met recente verkopen in uw straat" en "zegt ook wanneer een pand níets voor u is" zijn specifiek genoeg om geloofwaardig te zijn. Meer overtuigingskracht dan de hele USP-strip samen.

## Priority Issues

**[P0] "Over ons" nav link is gebroken — sectie bestaat niet in de DOM**
- **What:** `NAV_LINKS` in SiteNav bevat `{ label: "Over ons", href: "/#over-ons" }`. Geen enkel element in SOMClient.tsx heeft `id="over-ons"`. Het `D.about`-object (title, text1, text2, yearsLabel, cta) bestaat in de data maar er is geen component dat het rendert. De link scrollt gebruikers naar de footer.
- **Why it matters:** "Over ons" is de vertrouwenslink — de schakel die Leen opent vóórdat ze een verkooptraject overweegt. Een dode anker-link op de primaire navigatie ondermijnt het vertrouwenssignaal dat de site probeert op te bouwen. Assessment B heeft dit niet gevangen (detector is statisch), maar Assessment A heeft het bevestigd door de volledige component-boom te doorzoeken.
- **Fix:** Render de `D.about`-sectie als sectie 06 (vóór Team of Contact) met `id="over-ons"` op de wrapper, of verwijder de nav-link totdat de sectie bestaat.
- **Suggested command:** `/impeccable polish components/SOMClient.tsx`

**[P1] Button-component heeft geen zichtbare keyboard focus ring**
- **What:** De `Button`-component (gebruikt voor hero CTAs, TaskSolution, SchattingTeaser, Statement) heeft `onMouseEnter`/`onMouseLeave` maar geen `onFocus`/`onBlur` en geen `focus:`-class. Nav-links hebben dit wél (vorige polish-ronde). Buttons niet. (B: F1)
- **Why it matters:** Keyboard-gebruikers navigeren via Tab door de pagina en komen op elke primaire CTA zonder visuele indicatie dat het element geselecteerd is. WCAG 2.1 AA vereist zichtbare focus op alle interactieve elementen.
- **Fix:** Voeg `onFocus`/`onBlur` toe aan de `Button`-component, parallel aan de nav-link implementatie. Of voeg een `focus-visible:` Tailwind-class toe aan de `<a>`. Beide oplossingen zijn consistent met het bestaande patroon.
- **Suggested command:** `/impeccable audit components/SOMClient.tsx`

**[P1] Mobiel menu: geen focus trap en geen focus-on-open**
- **What:** Het mobiele overlay heeft `role="dialog"` + `aria-modal="true"` + `aria-label` (correct), maar Tab-focus kan het dialog verlaten naar de pagina erachter. Er is geen `useRef` op de container, geen `useEffect` die `.focus()` aanroept bij openen, en geen focus-trap. (B: F13, A: Sam-persona)
- **Why it matters:** `aria-modal="true"` informeert screen readers dat de achtergrond modaal is, maar de browser dwingt dit niet af op keyboard focus. Gebruikers kunnen Tab-pen naar verborgen inhoud achter het menu.
- **Fix:** Voeg een focus-trap toe via `useEffect` bij `open === true`: zet focus op het eerste navigatie-element, luister naar Tab/Shift+Tab om focus binnen het dialog te houden, en stuur focus terug bij Escape.
- **Suggested command:** `/impeccable audit components/SiteNav.tsx`

**[P1] Contact form label-tekst: 11px + 55% opacity = WCAG contrast fail**
- **What:** `labelStyle` in het contact-formulier setzt `fontSize: "11px"` en `color: "rgba(239,231,216,0.55)"` op de donkere SEPIA-achtergrond. De opgeloste kleur is ~rgb(147,138,127). Contrast tegen SEPIA (#2A241C) ligt onder de 4.5:1 AA-drempel voor normale tekst. 11px is ook kleiner dan de 14px bold / 18px normal drempel voor "large text". (B: F6)
- **Why it matters:** Veldlabels die onleesbaar zijn verhogen het foutenrisico bij invullen — precies wat H5 (Error Prevention) wil vermijden. Leen leest de labels om te weten wat ze invult; als ze dat niet kan, verhoogt dit abandonment-risico.
- **Fix:** Verhoog naar `fontSize: "12px"` en `color: "rgba(239,231,216,0.80)"` om de 4.5:1 drempel te halen, of zet labels volledig naar CREAM bij 100% en verklein de `letterSpacing`.
- **Suggested command:** `/impeccable audit components/SOMClient.tsx`

**[P2] Mobiel nav CTA stuurt naar /#contact, desktop naar /schatting — funnel-mismatch**
- **What:** Desktop nav CTA: "Gratis schatting" → `/schatting`. Mobiel overlay CTA: "Contact opnemen" → `/#contact`. Visueel identiek (solid Y, 2px radius), maar twee totaal verschillende conversiepaden. Leen (hoogstwaarschijnlijk op mobiel) bereikt nooit het schatting-tool via de navigatie. (B: F15, A: P1)
- **Why it matters:** Verkopers zijn de primaire omzetdoelgroep. De mobiele funnel stuurt hen naar een generiek contactformulier i.p.v. de geautomatiseerde waardebepaling die leads kwalificeert. Desktop-verkopers zien de schatting-CTA in de nav; mobiele verkopers niet.
- **Fix:** Verander mobiel overlay CTA naar "Gratis schatting" → `/schatting`, consistent met de desktop nav.
- **Suggested command:** `/impeccable polish components/SiteNav.tsx`

## Persona Red Flags

**Jordan (first-timer):** De intro curtain toont 2.2s een créme scherm met een dunne typografie — geen tekst die uitlegt wat SOM is. Jordan leest dit als "site laadt traag." De hero-headline "Vastgoed in Limburg, gemiddeld 45 dagen." veronderstelt kennis van wat 45 dagen betekent voor een verkoper — een koper begrijpt dit volledig niet. De eerste zin die uitlegt wat SOM doet staat in de hero-subtitle, die op mobiel onder de vouw zit.

**Sam (keyboard/screen reader):** Tab-flow: Logo (✓) → Nav links (✓, onFocus aanwezig) → Nav CTA (✓) → Hero CTA "Gratis waardebepaling" (geen focus ring — F1) → Hero CTA "Bekijk ons aanbod" (geen focus ring) → mobiel hamburgermenu opent → overlay verschijnt → Tab verlaat overlay (geen trap — F13). WordMark rendert twee `<span>`-elementen (md+ en mobile) simultaan — screen reader kondigt "SOM VASTGOED SOM VASTGOED" aan.

**Casey (distracted mobile):** Hero CTA-knoppen zitten in de créme-band ónder het hero-beeld — op een 375×812 scherm waarschijnlijk onder de vouw. Casey moet scrollen vóór ze een CTA zien. PropertyCard is `motion.article` met `onClick` maar geen `role="link"` of `tabIndex` — geen touch-affordance signaleert interactiviteit. Mobiel nav CTA stuurt naar contactformulier i.p.v. schatting-tool (P2 hierboven).

**Leen (vrouw 45+, Limburg, overweegt woning te verkopen):** Komt op site via Google, ziet intro curtain als loadingprobleem. Klikt navigatie "Over ons" — link werkt niet (P0). Ziet op mobiel "Contact opnemen" als nav-CTA, niet "Gratis schatting". Vindt het formulier onderaan, ziet labels die moeilijk leesbaar zijn (11px, laag contrast). Vult het in — ziet geen IPI/BIV-erkenning, geen "erkend makelaar"-badge, geen testimonials in visueel bereik. Hoogste angstmoment (persoonlijke informatie delen) heeft de laagste trust-signaling van de hele pagina.

## Minor Observations

1. **PropertyCard (aanbod-pagina) is niet keyboard-activeerbaar:** `motion.article` met `onClick={() => window.location.href = href}` maar geen `role="link"`, geen `tabIndex`, geen `onKeyDown`. Keyboard-gebruikers kunnen pand-kaarten niet activeren. De homepage-variant `PandKaart` gebruikt correct `motion.a`. (B: F2)

2. **`D.hero.ctaSecondary` is de gele primaire knop:** De data-modelnamen `ctaPrimary` en `ctaSecondary` zijn semantisch omgewisseld t.o.v. de visuele hiërarchie. Als een CMS-editor ooit de veld-inhoud wisselt op basis van de veldnaam, keert de knophiërarchie om. Hernoem naar `ctaSeller` en `ctaBuyer`. (B: F5, A: P2)

3. **Select-field in contactformulier heeft geen caret:** `appearance: "none"` verwijdert de native dropdown-pijl, geen SVG-caret ingevoegd. Visueel ononderscheidbaar van een text-input. (A: P1 — B heeft dit niet gezien)

4. **Sectie-index springt van 05 → 07 bij lege getuigenissen:** `Getuigenissen` retourneert `null` bij 0 items. De editoriale nummering breekt. Bij launch is het CMS waarschijnlijk leeg.

5. **`D.about`-data bestaat maar wordt niet gerenderd:** title, text1, text2, yearsLabel, cta — alles gevuld in de constanten. Geen component consumeert het. Dode data + dode nav-link (P0 hierboven).

6. **Ongebruikte constanten `B` en `W`:** Gedefinieerd op module-niveau in SOMClient.tsx, nooit gebruikt binnen dat bestand. (B: F9)

7. **CornerLabel verborgen onder 640px:** `hidden sm:block` betekent dat de "Immo met een plus!" brand-tagline onzichtbaar is op kleine telefoons — de meest gebruikte viewport voor Leen.

8. **Form `aria-busy` ontbreekt:** `<form>` zet geen `aria-busy={loading}` tijdens submit. Screen readers krijgen geen melding dat verwerking bezig is. (B: F3)

## Questions to Consider

1. De "Over ons" navigatielink is gebroken — maar `D.about` heeft zinvolle copy: wie is SOM, hoeveel jaar ervaring, een CTA. Is dit bewust uitgesteld of vergeten? Een about-sectie precies vóór het team zou het structurele gat vullen én de geloofwaardigheid van het team-blok verhogen.

2. De intro curtain kost een first-time bezoeker 2.2s op een créme scherm. Voor Leen leest dit als een laadprobleem, niet als een ontwerpmoment. Is de conversiewaarde van de curtain gemeten, of is het een aanname dat premium = wachten?

3. De emotionele high point is de Statement-sectie ("Klaar om te starten? Wij ook."). Daarna volgt onmiddellijk de USP-strip, die herhaalt wat TaskSolution al zei. Wat als Statement de laatste sectie vóór Contact was, en de USP-strip vóór TaskSolution stond — als trust-anker in plaats van als naschrift?
