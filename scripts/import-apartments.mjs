// Run: node scripts/import-apartments.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ucen4x5m",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skoo8L82TOV9KFphgwEr00MEl8tln1gtT2KZ0MqGOaQv1oLKwSSGgoAbTTNNi693AiW4yc73sWJQitNNFFgvOdRQHcUM7SA2OOwXbUpMiny4QHI2ApM0RqniAoeKHcnPcfMxdVc39bgdCfxYPGfJqhnUGF32s4iIp6GbH8ZNktHv24ELaMLO",
  useCdn: false,
});

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[àáâä]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const apartments = [
  // ── Residentie Coconn – Genk ────────────────────────────────────────────────
  {
    title: "Residentie Coconn – 1 slpk appartement (0.04)",
    type: "Appartement",
    location: "Genk",
    price: "€ 231.200",
    beds: 1,
    area: 61,
    status: "Te koop",
    description: "Moderne 1 slaapkamerappartement met terras (15 m²) op het gelijkvloers van Residentie Coconn in Genk. Vloerverwarming, warmtepomp, hoogkwalitatieve afwerking. 6% BTW mogelijk. Oplevering eind 2027.",
    order: 30,
  },
  {
    title: "Residentie Coconn – 2 slpk appartement (1.05)",
    type: "Appartement",
    location: "Genk",
    price: "€ 315.000",
    beds: 2,
    area: 85,
    status: "Te koop",
    description: "Licht doorzonappartement met 2 slaapkamers en terras (12 m²) op de eerste verdieping van Residentie Coconn. EPC A+. Vloerverwarming via warmtepomp, zonnepanelen, domotica. 6% BTW mogelijk. Oplevering eind 2027.",
    order: 31,
  },
  {
    title: "Residentie Coconn – Penthouse (4.01)",
    type: "Penthouse",
    location: "Genk",
    price: "€ 715.000",
    beds: 3,
    area: 143,
    status: "Te koop",
    description: "Exclusief penthouse met 3 slaapkamers en gigantisch dakterras van 96 m² op de 4e verdieping van Residentie Coconn. Panoramisch zicht over Genk. EPC A+. Oplevering eind 2027.",
    order: 32,
  },
  // ── Residentie Sacramento – Tongeren ────────────────────────────────────────
  {
    title: "Residentie Sacramento – 1 slpk appartement",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 220.000",
    beds: 1,
    area: 57,
    status: "Te koop",
    description: "Betaalbaar 1 slaapkamerappartement met terras (9 m²) in Residentie Sacramento, centrum Tongeren. Energiezuinige BEN-bouw met gunstig E-label. Privatieve parking en kelder apart beschikbaar. 6% BTW mogelijk.",
    order: 33,
  },
  {
    title: "Residentie Sacramento – 2 slpk appartement (gelijkvloers)",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 310.000",
    beds: 2,
    area: 105,
    status: "Te koop",
    description: "Ruim gelijkvloers appartement met 2 slaapkamers en groot terras (20 m²) in Residentie Sacramento. 29 stijlvolle appartementen verdeeld over 3 entiteiten in hartje Tongeren. EPC A. 6% BTW mogelijk.",
    order: 34,
  },
  {
    title: "Residentie Sacramento – 2 slpk appartement met groot terras",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 395.000",
    beds: 2,
    area: 119,
    status: "Te koop",
    description: "Ruim appartement met 2 slaapkamers en uitzonderlijk groot terras (47 m²) in Residentie Sacramento, Tongeren. Topafwerking met vloerverwarming en warmtepomp. Model appartement direct beschikbaar. EPC A.",
    order: 35,
  },
  // ── Residentie Ambiorix – Tongeren ──────────────────────────────────────────
  {
    title: "Residentie Ambiorix – 2 slpk (gelijkvloers)",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 245.000",
    beds: 2,
    area: 91,
    status: "Te koop",
    description: "2 slaapkamerappartement op het gelijkvloers in Residentie Ambiorix, op wandelafstand van het centrum van Tongeren. Privatieve autostaanplaats en kelderberging inbegrepen. BEN-standaard, EPC A. 6% BTW mogelijk.",
    order: 36,
  },
  {
    title: "Residentie Ambiorix – 2 slpk (1e verdieping)",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 240.000",
    beds: 2,
    area: 81,
    status: "Te koop",
    description: "Modern 2 slaapkamerappartement met terras (8 m²) op de 1e verdieping van Residentie Ambiorix. 14 BEN-appartementen op wandelafstand van het centrum van Tongeren. Autostaanplaats en kelder inbegrepen.",
    order: 37,
  },
  {
    title: "Residentie Ambiorix – 2 slpk (2e verdieping)",
    type: "Appartement",
    location: "Tongeren",
    price: "€ 255.000",
    beds: 2,
    area: 95,
    status: "Te koop",
    description: "Ruim 2 slaapkamerappartement met terras op de 2e verdieping van Residentie Ambiorix, Tongeren. 14 BEN-appartementen met privatieve autostaanplaats en kelderberging. EPC A. 6% BTW mogelijk.",
    order: 38,
  },
  // ── Residentie Ferro – Genk ─────────────────────────────────────────────────
  {
    title: "Residentie Ferro – 1 slpk appartement",
    type: "Appartement",
    location: "Genk",
    price: "€ 241.500",
    beds: 1,
    area: 67,
    status: "Te koop",
    description: "Instapklaar 1 slaapkamerappartement in Residentie Ferro, Genk. 48 appartementen op een toplocatie aan de Stalenstraat. Vloerverwarming, warmtepomp, terras. EPC E-peil 30. 6% BTW mogelijk.",
    order: 39,
  },
  {
    title: "Residentie Ferro – 2 slpk appartement",
    type: "Appartement",
    location: "Genk",
    price: "€ 280.000",
    beds: 2,
    area: 85,
    status: "Te koop",
    description: "Modern 2 slaapkamerappartement in Residentie Ferro aan de Stalenstraat in Genk. Volledige inspraak in afwerking: vloer, keuken, badkamer. Terrassen tot 34 m². E-peil 30. 6% BTW mogelijk.",
    order: 40,
  },
  // ── Residentie Carbon – Maasmechelen ────────────────────────────────────────
  {
    title: "Residentie Carbon – 2 slpk appartement",
    type: "Appartement",
    location: "Maasmechelen",
    price: "€ 230.000",
    beds: 2,
    area: 75,
    status: "Te koop",
    description: "Modern 2 slaapkamerappartement in Residentie Carbon aan de Rijksweg in Maasmechelen. 24 appartementen en 1 handelspand, verdeeld over 2 blokken. Vloerverwarming, warmtepomp, terras. EPC A. Volledige inspraak in afwerking.",
    order: 41,
  },
  // ── Residentie Zingaro – Diepenbeek ─────────────────────────────────────────
  {
    title: "Residentie Zingaro – 1 slpk appartement",
    type: "Appartement",
    location: "Diepenbeek",
    price: "€ 250.000",
    beds: 1,
    area: 69,
    status: "Te koop",
    description: "Licht en rustig 1 slaapkamerappartement in Residentie Zingaro, hartje Diepenbeek. 58 appartementen met privéterrassen, ondergrondse parking en groene binnenkoer. Energiezuinig (EPB). 6% BTW mogelijk.",
    order: 42,
  },
  {
    title: "Residentie Zingaro – 2 slpk appartement",
    type: "Appartement",
    location: "Diepenbeek",
    price: "€ 269.000",
    beds: 2,
    area: 89,
    status: "Te koop",
    description: "Ruim 2 slaapkamerappartement (89–109 m²) met terras in Residentie Zingaro, Diepenbeek. Nabij station, scholen en universiteiten. Ondergrondse parking. Interieuradvies inbegrepen. 6% BTW mogelijk.",
    order: 43,
  },
  // ── Residentie Heritage – Hasselt ───────────────────────────────────────────
  {
    title: "Residentie Heritage – 2 slpk appartement",
    type: "Appartement",
    location: "Hasselt",
    price: "€ 365.000",
    beds: 2,
    area: 96,
    status: "Te koop",
    description: "Luxueus 2 slaapkamerappartement in Residentie Heritage, Schierverlaan, hartje Hasselt. 15 exclusieve appartementen op 6 verdiepingen. BEN-standaard (E-peil <30). Terras van 9–27 m². 6% BTW mogelijk.",
    order: 44,
  },
  {
    title: "Residentie Heritage – Penthouse",
    type: "Penthouse",
    location: "Hasselt",
    price: "€ 575.000",
    beds: 3,
    area: 130,
    status: "Te koop",
    description: "Exclusief penthouse op de 6e verdieping van Residentie Heritage in hartje Hasselt. BEN-bouw, uniek uitzicht over Hasselt. Op wandelafstand van Groene Boulevard en Quartier Bleu. 6% BTW mogelijk.",
    order: 45,
  },
  // ── Residentie Bella Vista – Bilzen ─────────────────────────────────────────
  {
    title: "Residentie Bella Vista – 2 slpk appartement",
    type: "Appartement",
    location: "Bilzen",
    price: "€ 325.000",
    beds: 2,
    area: 85,
    status: "Te koop",
    description: "Luxueus 2 slaapkamerappartement in Residentie Bella Vista, vlakbij het centrum van Bilzen. 29 topappartementen van 70–113 m². EPC A. Ondergrondse parking beschikbaar.",
    order: 46,
  },
];

async function importApartments() {
  const existing = await client.fetch('*[_type == "property"]{title}');
  const existingTitles = new Set(existing.map(p => p.title));
  console.log(`\n📦 ${existing.length} bestaande panden gevonden.`);

  let created = 0;
  let skipped = 0;

  for (const p of apartments) {
    if (existingTitles.has(p.title)) {
      console.log(`  ⏭️  Skip: ${p.title}`);
      skipped++;
      continue;
    }

    const doc = {
      _type: "property",
      title: p.title,
      type: p.type,
      location: p.location,
      price: p.price,
      beds: p.beds,
      area: p.area,
      status: p.status,
      description: p.description,
      order: p.order,
      featured: false,
      slug: { _type: "slug", current: slug(p.title) },
    };

    try {
      const result = await client.create(doc);
      console.log(`  ✅ ${p.title} (${result._id})`);
      created++;
    } catch (err) {
      console.error(`  ❌ Fout: ${p.title}:`, err.message);
    }
  }

  console.log(`\n🎉 Klaar: ${created} aangemaakt, ${skipped} overgeslagen.`);
  console.log("💡 Voeg foto's toe via Sanity Studio: /studio\n");
}

importApartments().catch(console.error);
