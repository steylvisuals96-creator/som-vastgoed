import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAILS = ["maxime@somvastgoed.be", "steylvisuals96@gmail.com"];

// ── Marktprijzen per gemeente (€/m² bewoonbaar, 2024) ─────────────────────────
const GEMEENTE_PRIJS: Record<string, number> = {
  // Limburg
  "hasselt": 2450, "genk": 2100, "tongeren": 1950, "sint-truiden": 1850,
  "bilzen": 2000, "diepenbeek": 2200, "beringen": 1800, "heusden-zolder": 1850,
  "herk-de-stad": 2050, "lummen": 2000, "alken": 2100, "wellen": 1900,
  "borgloon": 1850, "nieuwerkerken": 1900, "gingelom": 1750, "zoutleeuw": 1750,
  "landen": 1700, "riemst": 2050, "maasmechelen": 2000, "lanaken": 2150,
  "dilsen-stokkem": 1900, "peer": 1800, "houthalen-helchteren": 1750,
  "leopoldsburg": 1750, "ham": 1700, "tessenderlo": 1700, "diest": 2100,
  "lommel": 1800, "maaseik": 1950, "zonhoven": 2150, "as": 1900,
  "zutendaal": 2050, "oudsbergen": 1850, "bree": 1850, "bocholt": 1800,
  "hamont-achel": 1850, "pelt": 1900, "hechtel-eksel": 1800, "halen": 1900,
  "hoeselt": 1950, "kortessem": 1950, "heers": 1700, "voeren": 1800,
  // Vlaams-Brabant
  "leuven": 3400, "tienen": 2000, "aarschot": 2250, "scherpenheuvel-zichem": 2050,
  "tielt-winge": 2200, "vilvoorde": 2700, "halle": 2600, "dilbeek": 2900,
  "zaventem": 2900, "tervuren": 3400, "overijse": 3200, "grimbergen": 2800,
  // Antwerpen
  "antwerpen": 2750, "mechelen": 2750, "turnhout": 2100, "mol": 2100,
  "geel": 2150, "herentals": 2250, "lier": 2500, "heist-op-den-berg": 2250,
  "westerlo": 2200, "balen": 2000, "schoten": 2800, "brasschaat": 3000,
  "kapellen": 2900, "mortsel": 2800, "edegem": 2900, "kontich": 2800,
  // Oost-Vlaanderen
  "gent": 3050, "aalst": 2250, "sint-niklaas": 2300, "dendermonde": 2250,
  "oudenaarde": 2200, "ronse": 1700, "eeklo": 2100, "deinze": 2400,
  "wetteren": 2300, "lokeren": 2200, "geraardsbergen": 1900, "ninove": 2100,
  // West-Vlaanderen
  "brugge": 2700, "oostende": 2400, "kortrijk": 2150, "roeselare": 2200,
  "ieper": 1900, "waregem": 2250, "knokke-heist": 4500, "blankenberge": 2500,
  "de-panne": 2300, "koksijde": 2700, "nieuwpoort": 2900, "veurne": 2100,
  "menen": 1700, "izegem": 2000, "tielt": 2100, "diksmuide": 1900,
  // Brussel
  "brussel": 3300, "bruxelles": 3300, "schaarbeek": 2900, "anderlecht": 2600,
  "elsene": 3700, "ixelles": 3700, "ukkel": 3500, "uccle": 3500,
  "etterbeek": 3300, "jette": 2800, "sint-gillis": 3000, "molenbeek": 2400,
  // Wallonië (grote steden)
  "luik": 1700, "liege": 1700, "namen": 2000, "namur": 2000,
  "charleroi": 1300, "bergen": 1500, "mons": 1500, "doornik": 1600,
  "tournai": 1600, "waver": 2600, "wavre": 2600, "nijvel": 2500, "nivelles": 2500,
  "aarlen": 2200, "arlon": 2200, "eupen": 1900, "verviers": 1400,
};

// ── Postcode-fallback per regio (€/m², 2024) ──────────────────────────────────
function prijsViaPostcode(postcode: number): number | null {
  if (postcode >= 1000 && postcode <= 1299) return 3100; // Brussel
  if (postcode >= 1300 && postcode <= 1499) return 2500; // Waals-Brabant
  if (postcode >= 1500 && postcode <= 1999) return 2650; // Vlaams-Brabant (Halle-Vilvoorde)
  if (postcode >= 2000 && postcode <= 2999) return 2450; // Antwerpen
  if (postcode >= 3000 && postcode <= 3499) return 2500; // Vlaams-Brabant (Leuven)
  if (postcode >= 3500 && postcode <= 3999) return 1950; // Limburg
  if (postcode >= 4000 && postcode <= 4999) return 1700; // Luik
  if (postcode >= 5000 && postcode <= 5999) return 1800; // Namen
  if (postcode >= 6000 && postcode <= 6599) return 1400; // Henegouwen (Charleroi)
  if (postcode >= 6600 && postcode <= 6999) return 1900; // Luxemburg
  if (postcode >= 7000 && postcode <= 7999) return 1450; // Henegouwen (Bergen)
  if (postcode >= 8000 && postcode <= 8999) return 2250; // West-Vlaanderen
  if (postcode >= 9000 && postcode <= 9999) return 2300; // Oost-Vlaanderen
  return null;
}

function zoekGemeentePrijs(gemeente: string, postcode: number): number {
  const key = gemeente.toLowerCase().trim().replace(/\s+/g, "-");
  if (GEMEENTE_PRIJS[key]) return GEMEENTE_PRIJS[key];
  // ook zonder koppeltekens proberen ("sint truiden" → "sint-truiden")
  const alt = Object.keys(GEMEENTE_PRIJS).find(
    k => k.replace(/-/g, " ") === gemeente.toLowerCase().trim()
  );
  if (alt) return GEMEENTE_PRIJS[alt];
  return prijsViaPostcode(postcode) ?? 2100; // Belgisch gemiddelde
}

// ── Type multipliers ──────────────────────────────────────────────────────────
const TYPE_MULTI: Record<string, number> = {
  "Villa": 1.35, "Woning": 1.0, "Eengezinswoning": 1.0,
  "Appartement": 0.85, "Penthouse": 1.15,
  "Grond": 0.0, // apart berekend
  "Handelspand": 0.95, "Garage": 0.0,
};

// ── EPC multipliers ───────────────────────────────────────────────────────────
const EPC_MULTI: Record<string, number> = {
  "A+": 1.08, "A": 1.05, "B": 1.02, "C": 1.0,
  "D": 0.97, "E": 0.93, "F": 0.88, "G": 0.82, "Onbekend": 1.0,
};

// ── Staat multipliers ─────────────────────────────────────────────────────────
const STAAT_MULTI: Record<string, number> = {
  "Uitstekend — instapklaar": 1.08,
  "Goed — lichte opfrissing": 1.0,
  "Matig — renovatie nodig": 0.88,
  "Slecht — grondige renovatie": 0.75,
};

function berekenSchatting(data: Record<string, string | boolean | number>) {
  const type = String(data.propertyType ?? "Woning");
  const gemeente = String(data.gemeente ?? "");
  const postcode = Number(data.postcode) || 0;
  const opp = Number(data.bewoonbaarOpp) || 0;
  const perceel = Number(data.perceelOpp) || 0;
  const bouwjaar = Number(data.bouwjaar) || 1990;
  const slaapkamers = Number(data.slaapkamers) || 0;
  const badkamers = Number(String(data.badkamers ?? "").replace("+", "")) || 0;
  const garage = String(data.garage ?? "Geen");
  const tuin = Boolean(data.tuin);
  const terras = Boolean(data.terras);
  const epc = String(data.epc ?? "Onbekend");
  const staat = String(data.staat ?? "");

  // Regionale basisprijs per m² — schaal de grondprijs mee met de woningmarkt
  const regioPrijs = zoekGemeentePrijs(gemeente, postcode);

  // Grond apart
  if (type === "Grond") {
    const grondOpp = perceel > 0 ? perceel : opp;
    if (grondOpp === 0) return null;
    // grondprijs schaalt mee met regio (~€85/m² bij regioPrijs 1950)
    const grondPerM2 = 85 * (regioPrijs / 1950);
    const base = grondOpp * grondPerM2;
    return { min: Math.round(base * 0.90 / 1000) * 1000, max: Math.round(base * 1.10 / 1000) * 1000 };
  }

  if (type === "Garage") {
    const f = regioPrijs / 1950;
    return { min: Math.round(18000 * f / 1000) * 1000, max: Math.round(35000 * f / 1000) * 1000 };
  }

  if (opp === 0) return null;

  // Basisprijs
  const basisPrijs = regioPrijs * (TYPE_MULTI[type] ?? 1.0);

  // Ouderdomscorrectie (nieuwer = duurder)
  const leeftijd = new Date().getFullYear() - bouwjaar;
  const ouderdomFactor = Math.max(0.70, 1 - leeftijd * 0.004);

  // Oppervlaktecorrectie (schaalvoordeel)
  const oppFactor = opp < 80 ? 1.05 : opp < 120 ? 1.0 : opp < 180 ? 0.97 : 0.94;

  // Slaapkamers & badkamers bonus
  const slaapBonus = Math.min(slaapkamers * 0.015, 0.06);
  const badBonus = badkamers >= 2 ? Math.min((badkamers - 1) * 0.02, 0.04) : 0;

  // EPC & staat
  const epcF = EPC_MULTI[epc] ?? 1.0;
  const staatF = STAAT_MULTI[staat] ?? 1.0;

  // Extras — carport telt als lichtere variant, niet als garage + bonus
  const garageBonus =
    garage === "Carport" ? 5000 :
    garage === "Garage + carport" ? 15000 :
    garage.includes("2") ? 16000 :
    garage !== "Geen" ? 10000 : 0;
  const extrasBonus =
    garageBonus +
    (tuin && perceel > 200 ? 12000 : tuin ? 6000 : 0) +
    (terras ? 4000 : 0);

  const waardePerM2 = basisPrijs * ouderdomFactor * oppFactor * (1 + slaapBonus + badBonus) * epcF * staatF;
  const basisWaarde = waardePerM2 * opp + extrasBonus;

  // ±8% bandbreedte
  const min = Math.round(basisWaarde * 0.92 / 5000) * 5000;
  const max = Math.round(basisWaarde * 1.08 / 5000) * 5000;

  return { min, max };
}

function formatEur(n: number) {
  return "€ " + n.toLocaleString("nl-BE");
}

function buildEmail(data: Record<string, string | boolean | number>, schatting: { min: number; max: number } | null) {
  const prijsvork = schatting
    ? `<strong style="color:#111;font-size:1.4rem">${formatEur(schatting.min)} — ${formatEur(schatting.max)}</strong>`
    : "<em>Onvoldoende gegevens voor automatische schatting</em>";

  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#111111;padding:28px 36px;">
          <p style="margin:0;color:#fff;font-size:1rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">
            SOM <span style="color:#facb04">Vastgoed</span>
          </p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.45);font-size:0.8rem">Nieuwe schattingsaanvraag via de website</p>
        </td></tr>

        <!-- Prijsvork -->
        <tr><td style="padding:32px 36px 24px;border-bottom:1px solid #f0f0f0;">
          <p style="margin:0 0 6px;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#888">Geschatte marktwaarde</p>
          <p style="margin:0;">${prijsvork}</p>
          <p style="margin:8px 0 0;font-size:0.78rem;color:#aaa">Automatische schatting op basis van lokale marktdata · ter indicatie</p>
        </td></tr>

        <!-- Eigendom details -->
        <tr><td style="padding:24px 36px;border-bottom:1px solid #f0f0f0;">
          <p style="margin:0 0 16px;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#888">Eigendom</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-bottom:12px;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">Type</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.propertyType}</p>
              </td>
              <td width="50%" style="padding-bottom:12px;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">Locatie</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.postcode ? `${data.postcode} ` : ""}${data.gemeente}${data.straat ? `, ${data.straat} ${data.nummer ?? ""}` : ""}</p>
              </td>
            </tr>
            <tr>
              ${data.bewoonbaarOpp ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">Bewoonbare opp.</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.bewoonbaarOpp} m²</p></td>` : "<td></td>"}
              ${data.perceelOpp ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">Perceel</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.perceelOpp} m²</p></td>` : "<td></td>"}
            </tr>
            <tr>
              ${data.bouwjaar ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">Bouwjaar</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.bouwjaar}</p></td>` : "<td></td>"}
              ${data.slaapkamers ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">Slaapkamers</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.slaapkamers}</p></td>` : "<td></td>"}
            </tr>
            <tr>
              ${data.staat ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">Staat</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.staat}</p></td>` : "<td></td>"}
              ${data.epc ? `<td width="50%" style="padding-bottom:12px;vertical-align:top"><p style="margin:0;font-size:0.72rem;color:#aaa">EPC</p><p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.epc}</p></td>` : "<td></td>"}
            </tr>
            <tr>
              <td width="50%" style="padding-bottom:0;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">Extra's</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">
                  ${[data.garage !== "Geen" ? data.garage : null, data.tuin ? "Tuin" : null, data.terras ? "Terras" : null].filter(Boolean).join(" · ") || "—"}
                </p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Contact -->
        <tr><td style="padding:24px 36px;border-bottom:1px solid #f0f0f0;">
          <p style="margin:0 0 16px;font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#888">Contactgegevens</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="33%" style="padding-bottom:12px;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">Naam</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.naam}</p>
              </td>
              <td width="33%" style="padding-bottom:12px;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">E-mail</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500"><a href="mailto:${data.email}" style="color:#111">${data.email}</a></p>
              </td>
              <td width="33%" style="padding-bottom:12px;vertical-align:top">
                <p style="margin:0;font-size:0.72rem;color:#aaa">Telefoon</p>
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500"><a href="tel:${data.telefoon}" style="color:#111">${data.telefoon}</a></p>
              </td>
            </tr>
          </table>
          ${data.opmerking ? `<p style="margin:8px 0 0;font-size:0.85rem;color:#555;font-style:italic">"${data.opmerking}"</p>` : ""}
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 36px 32px;text-align:center;">
          <a href="mailto:${data.email}" style="display:inline-block;background:#facb04;color:#111;font-weight:700;font-size:0.85rem;padding:12px 28px;border-radius:50px;text-decoration:none;letter-spacing:0.02em">
            Beantwoord ${data.naam}
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f7f7f5;padding:20px 36px;text-align:center;">
          <p style="margin:0;font-size:0.72rem;color:#bbb">SOM Vastgoed · Het Dorlik 16, 3500 Hasselt · info@somvastgoed.be</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Bereken schatting
    const schatting = berekenSchatting(data);

    // Stuur e-mail via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "SOM Vastgoed Schatting <onboarding@resend.dev>",
        to: TO_EMAILS,
        subject: `🏠 Nieuwe schatting: ${data.propertyType} in ${data.gemeente} — ${data.naam}`,
        html: buildEmail(data, schatting),
      });
    }

    return NextResponse.json({ ok: true, schatting });
  } catch (err) {
    console.error("Schatting API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
