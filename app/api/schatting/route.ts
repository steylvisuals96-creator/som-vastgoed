import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const lines = [
      `🏠 NIEUWE SCHATTING AANVRAAG`,
      ``,
      `Type: ${data.propertyType}`,
      `Locatie: ${data.gemeente}${data.straat ? `, ${data.straat} ${data.nummer}` : ""}`,
      ``,
      `── Kenmerken ──`,
      data.bewoonbaarOpp && `Bewoonbare opp.: ${data.bewoonbaarOpp} m²`,
      data.perceelOpp && `Perceel: ${data.perceelOpp} m²`,
      data.bouwjaar && `Bouwjaar: ${data.bouwjaar}`,
      data.slaapkamers && `Slaapkamers: ${data.slaapkamers}`,
      data.badkamers && `Badkamers: ${data.badkamers}`,
      ``,
      `── Extra ──`,
      `Garage: ${data.garage}`,
      `Tuin: ${data.tuin ? "Ja" : "Nee"}`,
      `Terras: ${data.terras ? "Ja" : "Nee"}`,
      data.epc && `EPC: ${data.epc}`,
      data.staat && `Staat: ${data.staat}`,
      ``,
      `── Contact ──`,
      `Naam: ${data.naam}`,
      `E-mail: ${data.email}`,
      `Telefoon: ${data.telefoon}`,
      data.opmerking && `Opmerkingen: ${data.opmerking}`,
    ].filter(Boolean).join("\n");

    // Log to console (Vercel logs) so the team can see it
    console.log(lines);

    // If you add an email service (Resend, SendGrid, etc.) in future, send here.
    // For now the form data is captured and logged.

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
