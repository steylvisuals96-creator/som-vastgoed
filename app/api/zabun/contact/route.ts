import { NextRequest, NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/zabun/leads";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, message, propertyId, mailingOptIn } =
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

  // Sla lead op in Payload CMS
  if (process.env.CMS_URL && process.env.CMS_WEBHOOK_SECRET) {
    await fetch(`${process.env.CMS_URL}/api/webhook/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": process.env.CMS_WEBHOOK_SECRET },
      body: JSON.stringify({
        naam: [firstName, lastName].filter(Boolean).join(" "),
        email,
        telefoon: typeof phone === "string" ? phone : undefined,
        bericht: message,
        bron: "website",
        pand_ref: typeof propertyId === "number" ? String(propertyId) : undefined,
      }),
    }).catch(() => {});
  }

  try {
    await sendContactMessage({
      firstName: typeof firstName === "string" ? firstName : undefined,
      lastName,
      email,
      phone: typeof phone === "string" ? phone : undefined,
      message,
      propertyId: typeof propertyId === "number" ? propertyId : undefined,
      mailingOptIn: mailingOptIn === true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Zabun] Contact route error:", err);
    return NextResponse.json(
      { error: "Verzenden mislukt. Probeer het later opnieuw." },
      { status: 500 }
    );
  }
}
