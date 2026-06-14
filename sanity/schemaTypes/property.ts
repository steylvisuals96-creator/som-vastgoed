import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Pand",
  type: "document",

  groups: [
    { name: "basis",        title: "🏠 Basisgegevens",       default: true },
    { name: "fotos",        title: "📸 Foto's & Video" },
    { name: "beschrijving", title: "✏️ Beschrijving" },
    { name: "locatie",      title: "📍 Locatie & Adres" },
    { name: "technisch",    title: "🔧 Technische info" },
    { name: "epc",          title: "⚡ EPC & Energie" },
    { name: "extra",        title: "📅 Extra (openhuisdag, PDF's)" },
    { name: "seo",          title: "🔍 Google (SEO)" },
    { name: "meta",         title: "🔗 URL" },
  ],

  fields: [
    // ── BASIS ──────────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      title: "Naam van het pand",
      type: "string",
      group: "basis",
      description: 'Verschijnt als titel op de website en in de pandkaart. Voorbeeld: "Charmante woning met tuin in Hasselt"',
      validation: (r) => r.required().error("Geef het pand een naam."),
    }),
    defineField({
      name: "type",
      title: "Soort pand",
      type: "string",
      group: "basis",
      description: "Selecteer het type woning of pand.",
      options: { list: ["Woning", "Appartement", "Penthouse", "Eengezinswoning", "Villa", "Grond", "Garage", "Handelspand"], layout: "radio" },
      validation: (r) => r.required().error("Selecteer het type pand."),
    }),
    defineField({
      name: "status",
      title: "Verkoopstatus",
      type: "string",
      group: "basis",
      initialValue: "Te koop",
      description: "🟢 Te koop / Te huur = zichtbaar in aanbod · 🟡 Onder bod = nog zichtbaar, badge toegevoegd · 🔴 Verkocht = verdwijnt uit actief aanbod",
      options: { list: ["Te koop", "Te huur", "Onder bod", "Verkocht"], layout: "radio" },
    }),
    defineField({
      name: "price",
      title: "Vraagprijs",
      type: "string",
      group: "basis",
      description: 'Verschijnt op de pandpagina en in de pandkaart. Voorbeeld: "€ 349.000" of "Prijs op aanvraag"',
      validation: (r) => r.required().error("Vul de vraagprijs in."),
    }),
    defineField({
      name: "location",
      title: "Gemeente",
      type: "string",
      group: "basis",
      description: 'Naam van de gemeente, verschijnt op de pandkaart. Voorbeeld: "Hasselt" of "Genk"',
      validation: (r) => r.required().error("Vul de gemeente in."),
    }),
    defineField({
      name: "beds",
      title: "Aantal slaapkamers",
      type: "number",
      group: "basis",
      description: "Verschijnt als icoon op de pandkaart.",
    }),
    defineField({
      name: "bathrooms",
      title: "Aantal badkamers",
      type: "number",
      group: "basis",
    }),
    defineField({
      name: "area",
      title: "Bewoonbare oppervlakte (m²)",
      type: "number",
      group: "basis",
      description: 'Voorbeeld: 145 (zonder m² te typen)',
    }),
    defineField({
      name: "featured",
      title: "Tonen op de homepage? ⭐",
      type: "boolean",
      group: "basis",
      initialValue: false,
      description: "Zet dit aan om het pand in de uitgelichte sectie op de homepage te tonen.",
    }),
    defineField({
      name: "order",
      title: "Volgorde op de homepage",
      type: "number",
      group: "basis",
      initialValue: 99,
      description: "Lager getal = eerder getoond. Pand nr. 1 staat bovenaan, pand nr. 10 staat lager. Werkt alleen als 'Tonen op homepage' aanstaat.",
    }),

    // ── FOTO'S & VIDEO ─────────────────────────────────────────────────────────
    defineField({
      name: "image",
      title: "Hoofdfoto (verplicht)",
      type: "image",
      group: "fotos",
      options: { hotspot: true },
      description: "De eerste foto die bezoekers zien. Gebruik een horizontale foto in goede kwaliteit (min. 1200px breed).",
      validation: (r) => r.required().error("Voeg minstens een hoofdfoto toe."),
    }),
    defineField({
      name: "gallery",
      title: "Bijkomende foto's (galerij)",
      type: "array",
      group: "fotos",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Voeg hier alle overige foto's toe. De volgorde in deze lijst bepaalt de volgorde in de galerij. Sleep om te herordenen.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube video (optioneel)",
      type: "url",
      group: "fotos",
      description: 'Plak de volledige YouTube link van de rondleidingsvideo. Voorbeeld: "https://www.youtube.com/watch?v=abcdef123". Tip: zet de video op \'Niet vermeld\' als u ze niet publiek wil.',
    }),

    // ── BESCHRIJVING ───────────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Beschrijving van het pand",
      type: "array",
      group: "beschrijving",
      description: "Schrijf een professionele beschrijving. Gebruik de opmaakopties bovenaan: Vet voor troeven, Koptekst voor secties. Aanbevolen: 100–200 woorden.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normaal", value: "normal" },
            { title: "Koptekst", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Vet", value: "strong" },
              { title: "Cursief", value: "em" },
            ],
          },
        },
      ],
    }),

    // ── LOCATIE & GPS ──────────────────────────────────────────────────────────
    defineField({
      name: "fullAddress",
      title: "Volledig adres (straat + gemeente)",
      type: "string",
      group: "locatie",
      description: 'Voorbeeld: "Dorpsstraat 12, 3500 Hasselt". Wordt getoond op de detailpagina van het pand.',
    }),
    defineField({
      name: "lat",
      title: "Latitude (GPS-coördinaat)",
      type: "number",
      group: "locatie",
      description: 'Gebruik Google Maps: zoek het adres op → klik met rechtermuisknop → kopieer de coördinaten. Eerste getal = latitude. Voorbeeld: 50.9308',
    }),
    defineField({
      name: "lng",
      title: "Longitude (GPS-coördinaat)",
      type: "number",
      group: "locatie",
      description: 'Tweede getal van de coördinaten. Voorbeeld: 5.3378',
    }),

    // ── TECHNISCHE INFO ────────────────────────────────────────────────────────
    defineField({
      name: "landArea",
      title: "Perceeloppervlakte (m²)",
      type: "number",
      group: "technisch",
      description: 'Totale oppervlakte van het terrein. Voorbeeld: 350',
    }),
    defineField({
      name: "buildYear",
      title: "Bouwjaar",
      type: "number",
      group: "technisch",
      description: 'Voorbeeld: 1985 of 2022',
    }),
    defineField({
      name: "bebouwing",
      title: "Type bebouwing",
      type: "string",
      group: "technisch",
      options: { list: ["Open bebouwing", "Halfopen bebouwing", "Gesloten bebouwing", "-"], layout: "radio" },
    }),
    defineField({
      name: "condition",
      title: "Algemene staat van het pand",
      type: "string",
      group: "technisch",
      options: { list: ["Instapklaar", "Zeer goede staat", "Goede staat", "Te renoveren", "Te slopen", "-"], layout: "radio" },
    }),

    // ── EPC ────────────────────────────────────────────────────────────────────
    defineField({
      name: "epcLabel",
      title: "EPC-label (energieklasse)",
      type: "string",
      group: "epc",
      description: "Selecteer het officiële EPC-label van het energieprestatiecertificaat.",
      options: { list: ["A+", "A", "B", "C", "D", "E", "F", "G"], layout: "radio" },
    }),
    defineField({
      name: "epc",
      title: "EPC-waarde (kWh/m²/jaar)",
      type: "number",
      group: "epc",
      description: 'Het getal van het EPC-certificaat. Voorbeeld: 210',
    }),

    // ── EXTRA ──────────────────────────────────────────────────────────────────
    defineField({
      name: "openHouseDate",
      title: "Openhuisdag — datum en uur",
      type: "datetime",
      group: "extra",
      description: "Als u een openhuisdag inplant, verschijnt er automatisch een badge op de detailpagina van dit pand.",
      options: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm" },
    }),
    defineField({
      name: "documents",
      title: "Documenten (PDF's voor de klant)",
      type: "array",
      group: "extra",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "label",
            title: "Naam van het document",
            type: "string",
            description: 'Voorbeeld: "EPC-certificaat" of "Grondplan"',
          }),
          defineField({
            name: "file",
            title: "PDF-bestand",
            type: "file",
            options: { accept: ".pdf" },
          }),
        ],
        preview: { select: { title: "label" } },
      }],
      description: "Klanten kunnen deze documenten downloaden op de detailpagina. Voorbeeld: EPC-certificaat, grondplan, lastenboek.",
    }),

    // ── SEO ────────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "Titel voor Google (optioneel)",
      type: "string",
      group: "seo",
      description: 'Wat Google toont als zoekresultaat. Laat leeg = automatisch de pand-titel. Max. 60 tekens. Voorbeeld: "Ruime villa met zwembad te koop in Hasselt"',
      validation: (r) => r.max(60).warning("Hou het onder 60 tekens voor beste resultaat in Google."),
    }),
    defineField({
      name: "seoDescription",
      title: "Beschrijving voor Google (optioneel)",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Kleine tekst onder de link in Google. Laat leeg = automatisch gegenereerd. Max. 155 tekens.",
      validation: (r) => r.max(155).warning("Hou het onder 155 tekens."),
    }),

    // ── META & URL ─────────────────────────────────────────────────────────────
    defineField({
      name: "slug",
      title: "Website-URL van dit pand",
      type: "slug",
      group: "meta",
      options: { source: "title" },
      description: '⚠️ Klik op "Generate" om de URL automatisch aan te maken vanuit de naam. VERPLICHT — zonder URL verschijnt het pand niet op de website.',
      validation: (r) => r.required().error('Klik op "Generate" om de URL aan te maken — dit is verplicht.'),
    }),
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
    { title: "Volgorde (homepage)", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Nieuwste eerst", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
    { title: "Prijs (hoog → laag)", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
  ],
});
