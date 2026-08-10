# SOM Vastgoed — design-systeem (hero)

Richting: **Gouden Uur** (SteylVisuals inspiratie-library, `dir_gouden_uur`)
Merk: SOM Vastgoed, Hasselt & Genk — "Immo met een plus!"

## Palet met rollen

| Rol | Waarde | Herkomst |
|---|---|---|
| `bg` | `#EFE7D8` crème | richting |
| `ink` | `#2A241C` diep sepia-zwart | richting (support) |
| `ink-soft` | `#6E5A3E` warm bruin | richting (tekst) |
| `accent` | `#facb04` SOM-geel | **klant — behouden**, vervangt richting-accent `#C9A87E` |
| `support` | `#C4B9A6` / `#111111` | richting + klant-zwart |

Het richting-accent `#C9A87E` is bewust vervangen door het merkgeel. Gouden uur
en SOM-geel liggen in dezelfde warme familie, dus de richting versterkt de
huisstijl in plaats van ertegen te vechten.

## Typografie

- **Display / wordmark:** Archivo (vervanging voor PP Neue Montreal Thin — niet
  vrij beschikbaar). Gewicht **100**, uitsluitend voor het manshoge wordmark over
  de foto. Dit is de signatuurzet, geen body-stijl.
- **Kop:** Archivo 400, `letter-spacing: -0.03em` — de neo-grotesk die de richting
  vraagt, op een normaal leesgewicht.
- **Lopende tekst:** DM Sans 400 (bestaand op de site). Cormorant Garamond blijft
  voorbehouden aan de rest van de pagina.
- **Micro-labels:** DM Sans 500, 11px, `letter-spacing: .14em`, uppercase — alleen
  in de vier hoeken van het beeldvlak (case-study-cachet), niet boven secties.

## Signatuurzet + risico

Het wordmark **SOM VASTGOED** staat spierdun en manshoog over een gouden-uur
foto, met `mix-blend-mode: screen` zodat de zon er letterlijk doorheen schijnt.
Dat is de risico-zet van de richting en mag niet afgezwakt worden.

`screen` en niet `overlay`: overlay keert wit om naar zwart op donkere vlakken,
en het pand op de hero-foto is donker metselwerk. Screen licht altijd op — het
wordmark gloeit over het pand en brandt weg waar de zon staat. Wie de foto
vervangt, controleert deze blend-mode opnieuw.

## Intro — gordijn dat opent

Crème vlak over het volle scherm met hetzelfde wordmark en een dunne
voortgangslijn; splitst na ~1s horizontaal open en onthult de hero. Regels:

- Speelt **één keer per sessie** (`sessionStorage: som_intro_seen`) en helemaal
  niet bij `prefers-reduced-motion`.
- Wacht op `document.fonts.ready` (max 1,2s) voor het opent — anders staat het
  wordmark er even in de fallback-font en is juist het haarlijn-gewicht weg.
- Zet `body overflow: hidden` en **geeft dat weer vrij** zodra het open is.
- De hero begint pas te bewegen als het gordijn open is (`start`-prop), zodat de
  reveal niet achter het gordijn opgebruikt wordt.

## Paginaritme

Banden wisselen tussen `#EFE7D8` en `#E6DCC8`, met twee sepia-blokken als
contrapunt (statement + contact). Geen wit op de homepage.

Secties dragen een **index in de kantlijn** (01–07) in hairline — dat is de
case-study-structuur van de richting en vervangt de uppercase kicker.

## Dichtheid

Laag. Veel lucht: het beeldvlak beslaat ~64svh, de crème-band eronder draagt de
kop, één regel tekst en twee CTA's. Statistieken als dunne editorial-rij, geen
kaarten. Ook panden, kantoren en team staan zonder kaart, schaduw of radius —
alleen beeld, een dunne bovenlijn en tekst.

## Bekende valkuil — kop achter een masker

Een kop die op `y: 104%` begint binnen zijn eigen `overflow: hidden` valt buiten
het intersectie-rechthoek, waardoor `whileInView` nooit vuurt en de kop
permanent onzichtbaar blijft. `MaskedHeading` zet de trigger daarom op de
wrapper en stuurt de kop via variants.

## Vaste verboden (Sam)

- Geen pill-knoppen — `border-radius: 2px`, hoekig.
- Geen → pijltjes in CTA's of links.
- Geen 8px stip-labels.
- Geen kleine uppercase kicker boven elke sectietitel.
- Geen `fontWeight: 300` als leesgewicht (uitzondering: hairline 100 display, zie boven).
- Geen identieke fade-animatie op elk element — beeld schaalt traag, tekst komt
  via clip-reveal, hoeklabels via losse timing.
