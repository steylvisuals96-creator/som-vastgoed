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
foto, met `mix-blend-mode: overlay` zodat de zon er letterlijk doorheen schijnt.
Dat is de risico-zet van de richting en mag niet afgezwakt worden.

## Dichtheid

Laag. Veel lucht: het beeldvlak beslaat ~72svh, de crème-band eronder draagt de
kop, één regel tekst en twee CTA's. Statistieken als dunne editorial-rij, geen
kaarten.

## Vaste verboden (Sam)

- Geen pill-knoppen — `border-radius: 2px`, hoekig.
- Geen → pijltjes in CTA's of links.
- Geen 8px stip-labels.
- Geen kleine uppercase kicker boven elke sectietitel.
- Geen `fontWeight: 300` als leesgewicht (uitzondering: hairline 100 display, zie boven).
- Geen identieke fade-animatie op elk element — beeld schaalt traag, tekst komt
  via clip-reveal, hoeklabels via losse timing.
