import Anthropic from "@anthropic-ai/sdk";

const SANITY_TOKEN = "skoo8L82TOV9KFphgwEr00MEl8tln1gtT2KZ0MqGOaQv1oLKwSSGgoAbTTNNi693AiW4yc73sWJQitNNFFgvOdRQHcUM7SA2OOwXbUpMiny4QHI2ApM0RqniAoeKHcnPcfMxdVc39bgdCfxYPGfJqhnUGF32s4iIp6GbH8ZNktHv24ELaMLO";
const PROJECT_ID = "ucen4x5m";
const DATASET = "production";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchProperties() {
  const query = encodeURIComponent(
    `*[_type == "property" && length(description) > 500] | order(order asc) { _id, title, type, location, fullAddress, price, area, landArea, beds, buildYear, condition, bebouwing, epc, epcLabel, description }`
  );
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${query}`,
    { headers: { Authorization: `Bearer ${SANITY_TOKEN}` } }
  );
  const data = await res.json();
  return data.result;
}

async function rewriteDescription(p) {
  const specs = [
    p.area && `${p.area} m² bewoonbaar`,
    p.landArea && `${p.landArea} m² perceel`,
    p.beds && `${p.beds} slaapkamers`,
    p.buildYear && `bouwjaar ${p.buildYear}`,
    p.condition && p.condition !== "-" && p.condition,
    p.bebouwing && p.bebouwing !== "-" && `${p.bebouwing} bebouwing`,
    p.epc && p.epcLabel && `EPC ${p.epcLabel} (${p.epc} kWh/m²/jaar)`,
  ]
    .filter(Boolean)
    .join(", ");

  const prompt = `Je bent copywriter voor SOM Vastgoed, een premium Belgisch vastgoedkantoor in Limburg (Hasselt & Genk). Herschrijf onderstaande vastgoedbeschrijving in het Nederlands.

Regels:
- Maximaal 200 woorden
- Levendig, warm en professioneel — premium maar toegankelijk
- Begin direct met de troeven van het pand, geen "Welkom bij..." of URL-verwijzingen
- Geen herhaling, geen bulleted lists, vloeiende alinea's
- Verwijder links, URLs, locatie-zinnen zoals "Locatie: ..." en herhaling van specs
- Eindig met één prikkelende zin die de bezoeker uitnodigt contact op te nemen

Pand: ${p.title} — ${p.fullAddress ?? p.location}
Type: ${p.type} | Prijs: ${p.price}
Specs: ${specs || "zie titel"}

Originele tekst:
${p.description}

Geef enkel de herschreven beschrijving terug, geen uitleg.`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content[0].text.trim();
}

async function patchSanity(id, description) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [{ patch: { id, set: { description } } }],
      }),
    }
  );
  return res.ok;
}

const properties = await fetchProperties();
console.log(`Herschrijven van ${properties.length} beschrijvingen...\n`);

for (let i = 0; i < properties.length; i++) {
  const p = properties[i];
  process.stdout.write(`[${i + 1}/${properties.length}] ${p.title.slice(0, 50)}...`);
  try {
    const newDesc = await rewriteDescription(p);
    const ok = await patchSanity(p._id, newDesc);
    console.log(ok ? ` ✓ (${newDesc.split(" ").length} woorden)` : " ✗ Sanity patch mislukt");
    // Rate limit: ~3 req/sec is fine for Haiku
    await new Promise((r) => setTimeout(r, 400));
  } catch (e) {
    console.log(` ✗ Fout: ${e.message}`);
  }
}

console.log("\nKlaar!");
