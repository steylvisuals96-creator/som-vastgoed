import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, message, propertyId } =
    body as Record<string, unknown>;

  if (!lastName || typeof lastName !== "string") {
    return NextResponse.json({ error: "Achternaam is verplicht" }, { status: 400 });
  }
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-mailadres is verplicht" }, { status: 400 });
  }
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Bericht is verplicht" }, { status: 400 });
  }

  const naam = [firstName, lastName].filter(Boolean).join(" ");

  // Stuur email naar SOM Vastgoed via Resend
  await resend.emails.send({
    from: "SOM Vastgoed Website <onboarding@resend.dev>",
    to: ["maxime@somvastgoed.be", process.env.NOTIFICATION_EMAIL!].filter(Boolean),
    replyTo: email,
    subject: `Nieuw contactbericht van ${naam}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px">
        <h2>Nieuw contactbericht</h2>
        <p><strong>Naam:</strong> ${naam}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Telefoon:</strong> ${phone}</p>` : ""}
        ${propertyId ? `<p><strong>Pand ref:</strong> ${propertyId}</p>` : ""}
        <p><strong>Bericht:</strong><br>${String(message).replace(/\n/g, "<br>")}</p>
      </div>
    `,
  });

  // Sla lead op in Payload CMS
  if (process.env.CMS_URL && process.env.CMS_WEBHOOK_SECRET) {
    await fetch(`${process.env.CMS_URL}/api/webhook/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": process.env.CMS_WEBHOOK_SECRET },
      body: JSON.stringify({
        naam,
        email,
        telefoon: typeof phone === "string" ? phone : undefined,
        bericht: message,
        bron: "website",
        pand_ref: typeof propertyId === "number" ? String(propertyId) : undefined,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
