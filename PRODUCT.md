# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Twee gelijke primaire doelgroepen:

- **Verkopers / verhuurders** — eigenaars in Limburg die een makelaar zoeken voor verkoop of verhuur. Situatie: oriëntatiefase tot concrete keuze van makelaar. Job: vertrouwen wekken, schatting aanvragen.
- **Kopers / huurders** — actief woningzoekenden in Limburg. Situatie: online oriëntatie, vergelijking van aanbod. Job: snel het relevante aanbod vinden en contact leggen.

## Product Purpose

SOM Vastgoed is een erkend vastgoedkantoor actief in heel Limburg, met kantoren in Hasselt en Genk. De site overtuigt eigenaars om hun pand bij SOM te verkopen of verhuren, en helpt kopers het juiste pand te vinden — beide even primair. Succes = dossier geopend (schatting aangevraagd of bezichtiging ingepland).

## Positioning

"Immo met een plus" — SOM onderscheidt zich op vier gecombineerde assen:
1. **Persoonlijke aanpak:** één makelaar begeleidt het volledige dossier van A tot Z, geen doorschuiven naar collega's.
2. **Lokale expertise:** diepgaande kennis van de Limburgse markt, buurtprijzen en netwerk.
3. **Snelheid & resultaat:** gemiddeld 45 dagen verkoop, meetbaar beter dan marktgemiddelde.
4. **Breed aanbod:** gewoon vastgoed, nieuwbouw, projecten en verhuur onder één dak.

Geen van deze vier is uniek op zich — de combinatie is de claim die concurrenten niet kunnen kopiëren zonder SOM's model over te nemen.

## Operating Context

- Belgisch vastgoedrecht, IPI/BIV-erkenning verondersteld.
- Panden komen via Zabun CMS (API-integratie aanwezig in `app/api/zabun/`).
- Schatting-tool (`/schatting`) genereert automatische waardebepaling op basis van gemeente en type — lead-capture voor verkopers.
- Twee fysieke kantoren: Hasselt (Het Dorlik 16) en Genk (Europalaan 30) + nieuwbouwkantoor.
- Deploy via Vercel, preview-branches per feature (`preview/hero-gouden-uur`).

## Capabilities and Constraints

- Panden-overzicht (`/aanbod`) en detailpagina's met kaart
- Nieuwbouw-sectie (`/nieuwbouw`) met projecten
- Nieuws-feed (`/nieuws`)
- Gratis waardebepaling-tool (`/schatting`) — laat een lead toe zonder makelaarsgesprek
- Contactformulier met Resend e-mail + optionele Payload CMS lead-opslag
- Teamfoto's via Zabun CMS (`somvastgoed.be` → redirect `storage.googleapis.com`)
- Intro-gordijn: één keer per sessie, niet bij `prefers-reduced-motion`
- **Geen wit op de homepage** — alleen crème/sepia palet (zie DESIGN.md)

## Brand Commitments

- Naam: **SOM Vastgoed**
- Tagline: **"Immo met een plus!"**
- Accent: **#facb04** (SOM-geel) — behouden, niet vervangen
- Ontwerp-richting: **Gouden Uur** (zie DESIGN.md voor volledig systeem)
- Verboden door klant: pill-knoppen, →-pijltjes, stip-labels, fontWeight 300, identieke fade-animaties
- Regionale scope: **heel Limburg** — niet beperken tot Hasselt/Genk in copy

## Evidence on Hand

- **Team:** 6 leden — Tom Muermans (Bestuurder), Maxime Vanoppen (Kantoorhouder), Larissa Fluder, Raf Zels, Kathleen Penders, Chaniz Gielen — foto's live via Zabun
- **Stats (eigen opgave):** 500+ panden verkocht, 15+ jaar ervaring, 3 vestigingen, 98% tevreden klanten
- **Getuigenissen:** via CMS, FALLBACK leeg — geen gefabriceerde quotes toevoegen
- **Hero-beeld:** Higgsfield-gegenereerde golden-hour villa (`public/som-hero/gouden-uur-villa.jpg`)
- **Logo:** transparante versie beschikbaar (`public/som-logo-white.png`)

## Product Principles

1. **Beide doelgroepen verdienen een eigen ingang.** Verkopers zien "Gratis schatting" als primaire CTA; kopers zien "Bekijk aanbod". Nooit één CTA die beide probeert te bedienen.
2. **Vertrouwen gaat vóór volume.** Toon team, aanpak en bewijs vóór panden — dit is geen portaal maar een kantoor met een naam.
3. **Limburg, niet één stad.** Copy en context vermijden steden als scope-afbakening; de markt is de provincie.
4. **Eén makelaar, heel het traject.** De A-tot-Z-belofte is het kernonderscheid en moet in elke sectie voelbaar zijn, niet alleen in de tekst erover.
5. **Design is het vertrouwenssignaal.** Gouden Uur-richting en de kwaliteit van de uitvoering moeten uitstralen dat SOM een premiumkantoor is — niet zomaar een kantoor met een website.
