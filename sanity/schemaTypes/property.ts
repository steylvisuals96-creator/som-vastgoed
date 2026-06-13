import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Pand",
  type: "document",

  groups: [
    { name: "basis",      title: "Basis",            default: true },
    { name: "fotos",      title: "Foto's" },
    { name: "beschrijving", title: "Beschrijving" },
    { name: "locatie",    title: "Locatie & GPS" },
    { name: "technisch",  title: "Technische info" },
    { name: "epc",        title: "EPC" },
    { name: "meta",       title: "URL & Volgorde" },
  ],

  fields: [
    // ── BASIS ──────────────────────────────────────────────────────────────────
    defineField({ name: "title",    title: "Titel",             type: "string", group: "basis", validation: (r) => r.required() }),
    defineField({
      name: "type", title: "Type pand", type: "string", group: "basis",
      options: { list: ["Woning", "Appartement", "Penthouse", "Eengezinswoning", "Villa", "Grond", "Garage", "Handelspand"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status", title: "Status", type: "string", group: "basis",
      initialValue: "Te koop",
      options: { list: ["Te koop", "Te huur", "Onder bod", "Verkocht"], layout: "radio" },
    }),
    defineField({ name: "price",    title: "Prijs (bv. € 499.900 of 'Prijs op aanvraag')", type: "string", group: "basis", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Gemeente",          type: "string", group: "basis", validation: (r) => r.required() }),
    defineField({ name: "beds",     title: "Slaapkamers",       type: "number", group: "basis" }),
    defineField({ name: "bathrooms", title: "Badkamers",        type: "number", group: "basis" }),
    defineField({ name: "area",     title: "Bewoonbare opp. (m²)", type: "number", group: "basis" }),
    defineField({ name: "featured", title: "Uitgelicht op homepage", type: "boolean", group: "basis", initialValue: false }),
    defineField({ name: "order",    title: "Volgorde (laag = bovenaan)", type: "number", group: "basis", initialValue: 99,
      description: "Panden met lagere nummers verschijnen eerst op de homepage (1 = eerste)." }),

    // ── FOTO'S ─────────────────────────────────────────────────────────────────
    defineField({
      name: "image", title: "Hoofdfoto", type: "image", group: "fotos",
      options: { hotspot: true }, validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery", title: "Fotogalerij (extra foto's)", type: "array", group: "fotos",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Voeg hier alle overige foto's toe. De volgorde bepaalt de galerij-volgorde.",
    }),

    // ── BESCHRIJVING ───────────────────────────────────────────────────────────
    defineField({
      name: "description", title: "Beschrijving", type: "text", group: "beschrijving", rows: 8,
      description: "Schrijf een pakkende, professionele beschrijving. Aanbevolen: 100–150 woorden.",
    }),

    // ── LOCATIE & GPS ──────────────────────────────────────────────────────────
    defineField({ name: "fullAddress", title: "Volledig adres (straat + gemeente)", type: "string", group: "locatie",
      description: "Bv. 'Dorpsstraat 12, 3500 Hasselt'" }),
    defineField({ name: "lat", title: "Latitude (GPS)", type: "number", group: "locatie",
      description: "Bv. 50.9308 — wordt gebruikt voor de kaartweergave." }),
    defineField({ name: "lng", title: "Longitude (GPS)", type: "number", group: "locatie",
      description: "Bv. 5.3378" }),

    // ── TECHNISCHE INFO ────────────────────────────────────────────────────────
    defineField({ name: "landArea",   title: "Perceel oppervlakte (m²)", type: "number", group: "technisch" }),
    defineField({ name: "buildYear",  title: "Bouwjaar",                 type: "number", group: "technisch" }),
    defineField({
      name: "bebouwing", title: "Bebouwing", type: "string", group: "technisch",
      options: { list: ["Open bebouwing", "Halfopen bebouwing", "Gesloten bebouwing", "-"], layout: "radio" },
    }),
    defineField({
      name: "condition", title: "Algemene staat", type: "string", group: "technisch",
      options: { list: ["Instapklaar", "Zeer goede staat", "Goede staat", "Te renoveren", "Te slopen", "-"], layout: "radio" },
    }),

    // ── EPC ────────────────────────────────────────────────────────────────────
    defineField({
      name: "epcLabel", title: "EPC label", type: "string", group: "epc",
      options: { list: ["A+", "A", "B", "C", "D", "E", "F", "G"], layout: "radio" },
    }),
    defineField({ name: "epc", title: "EPC waarde (kWh/m²/jaar)", type: "number", group: "epc",
      description: "Bv. 210" }),

    // ── META & URL ─────────────────────────────────────────────────────────────
    defineField({ name: "slug", title: "URL slug", type: "slug", group: "meta",
      options: { source: "title" },
      description: "Klik 'Generate' om automatisch aan te maken vanuit de titel." }),
  ],

  preview: {
    select: { title: "title", subtitle: "location", media: "image", status: "status", price: "price" },
    prepare({ title, subtitle, media, status, price }) {
      const statusEmoji = status === "Verkocht" ? "🔴" : status === "Onder bod" ? "🟡" : "🟢";
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${subtitle} · ${price}`,
        media,
      };
    },
  },

  orderings: [
    { title: "Volgorde (homepage)", name: "orderAsc",  by: [{ field: "order",  direction: "asc" }] },
    { title: "Nieuwste eerst",      name: "createdDesc",by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Prijs (hoog → laag)", name: "priceDesc", by: [{ field: "price",  direction: "desc" }] },
  ],
});
