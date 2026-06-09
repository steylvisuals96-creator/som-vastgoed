// Run: node scripts/import-projects.mjs
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "ucen4x5m",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skoo8L82TOV9KFphgwEr00MEl8tln1gtT2KZ0MqGOaQv1oLKwSSGgoAbTTNNi693AiW4yc73sWJQitNNFFgvOdRQHcUM7SA2OOwXbUpMiny4QHI2ApM0RqniAoeKHcnPcfMxdVc39bgdCfxYPGfJqhnUGF32s4iIp6GbH8ZNktHv24ELaMLO",
  useCdn: false,
});

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[àáâä]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const projects = [
  {
    name: "Residentie Zingaro",
    location: "Diepenbeek",
    type: "Appartementen",
    units: 58,
    priceFrom: "€ 245.000",
    status: "In verkoop",
    description: "Wonen in licht en rust in het hart van Diepenbeek. 58 moderne appartementen verdeeld over 4 blokken, met privéterrassen, ondergrondse parking en een gedeelde groene binnenkoer. 6% BTW mogelijk voor rechthebbenden.",
    developer: "SOM Project",
    order: 1,
  },
  {
    name: "Residentie Heritage",
    location: "Hasselt",
    type: "Appartementen",
    units: 15,
    priceFrom: "€ 295.000",
    status: "In verkoop",
    description: "Prachtige luxe appartementen in hartje Hasselt – koop aan 6% BTW. Kleinschalig project met 15 stijlvolle appartementen verdeeld over 6 verdiepingen, op wandelafstand van Groene Boulevard en Quartier Bleu. BEN-standaard (E-peil <30).",
    developer: "SOM Vastgoed",
    order: 2,
  },
  {
    name: "Hof ter Linden",
    location: "Diepenbeek",
    type: "Gemengd",
    priceFrom: "€ 250.000",
    status: "In verkoop",
    description: "Stijlvol nieuwbouwproject op een toplocatie in Diepenbeek. EPC A.",
    order: 3,
  },
  {
    name: "Residentie Thonis",
    location: "Hasselt",
    type: "Appartementen",
    priceFrom: "€ 440.000",
    status: "In verkoop",
    description: "Stijlvol en exclusief wonen in het kloppend hart van Hasselt.",
    order: 4,
  },
  {
    name: "Villa58",
    location: "Sint-Truiden",
    type: "Woningen",
    priceFrom: "€ 325.000",
    status: "In verkoop",
    description: "Wonen met klasse in Sint-Truiden. Een nieuw begin in een stijlvol woonproject.",
    order: 5,
  },
  {
    name: "Residentie Diesterhof – Woningen",
    location: "Tessenderlo",
    type: "Woningen",
    priceFrom: "€ 395.000",
    status: "In verkoop",
    description: "Moderne woningen op een toplocatie in hartje Tessenderlo. EPC A.",
    order: 6,
  },
  {
    name: "Residentie Diesterhof – Appartementen",
    location: "Tessenderlo",
    type: "Appartementen",
    priceFrom: "€ 235.000",
    status: "In verkoop",
    description: "Moderne appartementen op een toplocatie in hartje Tessenderlo. EPC A.",
    order: 7,
  },
  {
    name: "Residentie Molenhoek",
    location: "Korbeek-Lo",
    type: "Gemengd",
    priceFrom: "€ 353.000",
    status: "In verkoop",
    description: "Wonen in stijl en rust: ontdek nieuwbouw-residentie Molenhoek in Korbeek-Lo. EPC A.",
    order: 8,
  },
  {
    name: "Residentie Quinta",
    location: "Zonhoven",
    type: "Appartementen",
    priceFrom: "€ 230.000",
    status: "In verkoop",
    description: "Stijlvol en duurzaam wonen in het hart van Zonhoven. EPC A.",
    order: 9,
  },
  {
    name: "Residentie De Wissel",
    location: "Aarschot",
    type: "Appartementen",
    priceFrom: "€ 267.000",
    status: "In verkoop",
    description: "Energiezuinig en modern wonen in centrum Aarschot.",
    order: 10,
  },
  {
    name: "Halfopen Bebouwingen Diepenbeek",
    location: "Diepenbeek",
    type: "Woningen",
    units: 4,
    priceFrom: "€ 530.000",
    status: "In verkoop",
    description: "Prachtig nieuwbouwproject met 4 halfopen bebouwingen in Diepenbeek. EPC A.",
    order: 11,
  },
  {
    name: "Residentie Ferro",
    location: "Genk",
    type: "Appartementen",
    priceFrom: "€ 241.500",
    status: "In verkoop",
    description: "Exclusief wonen aan de Stalenstraat in Genk.",
    order: 12,
  },
  {
    name: "Woonpark De Sleutel",
    location: "Betekom",
    type: "Gemengd",
    priceFrom: "€ 265.000",
    status: "In verkoop",
    description: "Open de deur naar jouw toekomst in Woonpark De Sleutel, Betekom.",
    order: 13,
  },
  {
    name: "Residentie Carbon",
    location: "Maasmechelen",
    type: "Appartementen",
    units: 24,
    priceFrom: "€ 230.000",
    status: "In verkoop",
    description: "Residentie Carbon in Maasmechelen: 24 moderne appartementen + 1 handelspand. Hedendaagse luxe, duurzaamheid en een aantrekkelijke ligging aan de Rijksweg. Vloerverwarming, warmtepompen en premium afwerking. EPC A.",
    developer: "SOM Vastgoed",
    order: 14,
  },
  {
    name: "Residentie Ambiorix",
    location: "Tongeren",
    type: "Appartementen",
    units: 14,
    priceFrom: "€ 245.000",
    status: "In verkoop",
    description: "14 BEN-appartementen op wandelafstand van het centrum van Tongeren. Privatieve autostaanplaats en kelderberging inbegrepen. EPC A.",
    order: 15,
  },
  {
    name: "Ter Has Business Hub",
    location: "Hasselt",
    type: "Commercieel",
    priceFrom: "€ 485.675",
    status: "In verkoop",
    description: "Werken in stijl op een toplocatie in Hasselt.",
    order: 16,
  },
  {
    name: "Residentie Tuedo",
    location: "Diepenbeek",
    type: "Gemengd",
    units: 11,
    priceFrom: "€ 284.000",
    status: "In verkoop",
    description: "Kleinschalig woonproject, stijlvol wonen op een toplocatie: 5 eengezinswoningen en 6 appartementen in Diepenbeek. EPC A.",
    order: 17,
  },
  {
    name: "Appartementen Centrum Genk",
    location: "Genk",
    type: "Appartementen",
    priceFrom: "€ 325.000",
    status: "In verkoop",
    description: "Stijlvolle appartementen met 2-3 slaapkamers en terrassen in het centrum van Genk. EPC A.",
    order: 18,
  },
  {
    name: "Residentie Sacramento",
    location: "Tongeren",
    type: "Appartementen",
    priceFrom: "€ 220.000",
    status: "In verkoop",
    description: "Moderne 1 en 2 slaapkamerappartementen in Tongeren-Borgloon. EPC A.",
    order: 19,
  },
  {
    name: "Residentie Coconn",
    location: "Genk",
    type: "Appartementen",
    priceFrom: "€ 231.200",
    status: "In verkoop",
    description: "Prachtige 1, 2 en 3 slaapkamer doorzonappartementen in Genk. 6% BTW mogelijk. EPC A+.",
    order: 20,
  },
  {
    name: "Belgiek",
    location: "Genk",
    type: "Appartementen",
    priceFrom: "€ 450.000",
    status: "In verkoop",
    description: "Exclusieve villa-appartementen in het centrum van Genk. EPC A.",
    order: 21,
  },
  {
    name: "Residentie Bella Vista",
    location: "Bilzen",
    type: "Appartementen",
    units: 29,
    priceFrom: "€ 325.000",
    status: "In verkoop",
    description: "29 luxe-appartementen op een toplocatie vlakbij het centrum van Bilzen. Appartementen tussen 70-113m². EPC A.",
    order: 22,
  },
];

async function importProjects() {
  // Check which ones already exist
  const existing = await client.fetch('*[_type == "project"]{name}');
  const existingNames = new Set(existing.map(p => p.name));
  console.log(`\n📦 ${existing.length} bestaande projecten gevonden.`);

  let created = 0;
  let skipped = 0;

  for (const p of projects) {
    if (existingNames.has(p.name)) {
      console.log(`  ⏭️  Skip (bestaat al): ${p.name}`);
      skipped++;
      continue;
    }

    const doc = {
      _type: "project",
      name: p.name,
      location: p.location,
      status: p.status,
      priceFrom: p.priceFrom,
      description: p.description,
      order: p.order,
      featured: p.order <= 6, // first 6 featured
      slug: { _type: "slug", current: slug(p.name) },
      ...(p.type && { type: p.type }),
      ...(p.units && { units: p.units }),
      ...(p.developer && { developer: p.developer }),
    };

    try {
      const result = await client.create(doc);
      console.log(`  ✅ Aangemaakt: ${p.name} (${result._id})`);
      created++;
    } catch (err) {
      console.error(`  ❌ Fout bij ${p.name}:`, err.message);
    }
  }

  console.log(`\n🎉 Klaar: ${created} aangemaakt, ${skipped} overgeslagen.\n`);
  console.log("💡 Vergeet niet om foto's toe te voegen via Sanity Studio: /studio");
}

importProjects().catch(console.error);
