import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.NOTIFICATION_EMAIL ?? "info@somvastgoed.be";

// ── Limburgse marktprijzen per gemeente (€/m² bewoonbaar, 2024) ───────────────
const GEMEENTE_PRIJS: Record<string, number> = {
  "Hasselt": 2450, "Genk": 2100, "Tongeren": 1950, "Sint-Truiden": 1850,
  "Bilzen": 2000, "Diepenbeek": 2200, "Beringen": 1800, "Heusden-Zolder": 1850,
  "Herk-de-Stad": 2050, "Lummen": 2000, "Alken": 2100, "Wellen": 1900,
  "Borgloon": 1850, "Nieuwerkerken": 1900, "Gingelom": 1750, "Zoutleeuw": 1750,
  "Landen": 1700, "Riemst": 2050, "Maasmechelen": 2000, "Lanaken": 2150,
  "Dilsen-Stokkem": 1900, "Peer": 1800, "Houthalen-Helchteren": 1750,
  "Leopoldsburg": 1750, "Ham": 1700, "Tessenderlo": 1700, "Diest": 2100,
  "Lommel": 1800, "Maaseik": 1950, "Andere": 1900,
};

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
  "D": 0.97, "E": 0.93, "F": 0.88, "Onbekend": 1.0,
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
  const gemeente = String(data.gemeente ?? "Hasselt");
  const opp = Number(data.bewoonbaarOpp) || 0;
  const perceel = Number(data.perceelOpp) || 0;
  const bouwjaar = Number(data.bouwjaar) || 1990;
  const slaapkamers = Number(data.slaapkamers) || 0;
  const garage = String(data.garage ?? "Geen");
  const tuin = Boolean(data.tuin);
  const terras = Boolean(data.terras);
  const epc = String(data.epc ?? "Onbekend");
  const staat = String(data.staat ?? "");

  // Grond apart
  if (type === "Grond") {
    const grondprijs = perceel > 0 ? perceel : opp;
    const base = grondprijs * 85; // ~€85/m² Limburg gemiddeld
    return { min: Math.round(base * 0.90 / 1000) * 1000, max: Math.round(base * 1.10 / 1000) * 1000 };
  }

  if (type === "Garage") {
    return { min: 18000, max: 35000 };
  }

  if (opp === 0) return null;

  // Basisprijs
  const basisPrijs = (GEMEENTE_PRIJS[gemeente] ?? 1900) * (TYPE_MULTI[type] ?? 1.0);

  // Ouderdomscorrectie (nieuwer = duurder)
  const leeftijd = new Date().getFullYear() - bouwjaar;
  const ouderdomFactor = Math.max(0.70, 1 - leeftijd * 0.004);

  // Oppervlaktecorrectie (schaalvoordeel)
  const oppFactor = opp < 80 ? 1.05 : opp < 120 ? 1.0 : opp < 180 ? 0.97 : 0.94;

  // Slaapkamers bonus
  const slaapBonus = Math.min(slaapkamers * 0.015, 0.06);

  // EPC & staat
  const epcF = EPC_MULTI[epc] ?? 1.0;
  const staatF = STAAT_MULTI[staat] ?? 1.0;

  // Extras
  const extrasBonus =
    (garage !== "Geen" ? (garage.includes("2") ? 16000 : 10000) : 0) +
    (garage === "Carport" ? 5000 : 0) +
    (tuin && perceel > 200 ? 12000 : tuin ? 6000 : 0) +
    (terras ? 4000 : 0);

  const waardePerM2 = basisPrijs * ouderdomFactor * oppFactor * (1 + slaapBonus) * epcF * staatF;
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
          <p style="margin:8px 0 0;font-size:0.78rem;color:#aaa">Automatische schatting op basis van Limburgse marktdata · ter indicatie</p>
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
                <p style="margin:2px 0 0;font-size:0.9rem;color:#111;font-weight:500">${data.gemeente}${data.straat ? `, ${data.straat} ${data.nummer ?? ""}` : ""}</p>
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
      await resend.emails.send({
        from: "SOM Vastgoed Schatting <onboarding@resend.dev>",
        to: [TO_EMAIL],
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
