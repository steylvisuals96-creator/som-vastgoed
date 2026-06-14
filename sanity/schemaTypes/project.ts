import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Nieuwbouwproject",
  type: "document",

  groups: [
    { name: "basis",        title: "🏗️ Basisgegevens",        default: true },
    { name: "fotos",        title: "📸 Foto's & Video" },
    { name: "beschrijving", title: "✏️ Beschrijving" },
    { name: "technisch",    title: "🔧 Details & Status" },
    { name: "seo",          title: "🔍 Google (SEO)" },
    { name: "meta",         title: "🔗 URL" },
  ],

  fields: [
    // ── BASIS ──────────────────────────────────────────────────────────────────
    defineField({
      name: "name",
      title: "Naam van het project",
      type: "string",
      group: "basis",
      description: 'Voorbeeld: "Residentie De Linde" of "Project Centrum Hasselt"',
      validation: (r) => r.required().error("Geef het project een naam."),
    }),
    defineField({
      name: "developer",
      title: "Naam van de promotor (optioneel)",
      type: "string",
      group: "basis",
      description: 'Voorbeeld: "Immo-XYZ Promotors". Laat leeg als er geen externe promotor is.',
    }),
    defineField({
      name: "location",
      title: "Gemeente",
      type: "string",
      group: "basis",
      description: 'Voorbeeld: "Hasselt" of "Sint-Truiden"',
      validation: (r) => r.required().error("Vul de gemeente in."),
    }),
    defineField({
      name: "status",
      title: "Projectstatus",
      type: "string",
      group: "basis",
      initialValue: "In verkoop",
      description: "🟢 In verkoop = actief · 🟡 Binnenkort = aankomend · 🔵 In ontwikkeling = in uitvoering · 🔴 Uitverkocht = volledig verkocht",
      options: { list: ["In verkoop", "Binnenkort", "In ontwikkeling", "Uitverkocht"], layout: "radio" },
    }),
    defineField({
      name: "priceFrom",
      title: "Prijs vanaf",
      type: "string",
      group: "basis",
      description: 'Voorbeeld: "€ 249.000" of "Prijs op aanvraag"',
    }),
    defineField({
      name: "featured",
      title: "Tonen op de homepage? ⭐",
      type: "boolean",
      group: "basis",
      initialValue: false,
      description: "Zet dit aan om het project in de uitgelichte sectie op de homepage te tonen.",
    }),
    defineField({
      name: "order",
      title: "Volgorde op de website",
      type: "number",
      group: "basis",
      initialValue: 99,
      description: "Lager getal = eerder getoond. Project nr. 1 staat bovenaan.",
    }),

    // ── FOTO'S & VIDEO ─────────────────────────────────────────────────────────
    defineField({
      name: "image",
      title: "Hoofdafbeelding (render of foto)",
      type: "image",
      group: "fotos",
      options: { hotspot: true },
      description: "De eerste afbeelding die bezoekers zien. Gebruik een render of sfeerfoto in goede kwaliteit.",
      validation: (r) => r.required().error("Voeg een hoofdafbeelding toe."),
    }),
    defineField({
      name: "gallery",
      title: "Bijkomende afbeeldingen (renders, plannen, sfeerbeelden)",
      type: "array",
      group: "fotos",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Sleep de afbeeldingen in de gewenste volgorde voor de galerij.",
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube video (projectvideo, optioneel)",
      type: "url",
      group: "fotos",
      description: 'Plak de volledige YouTube link van de projectvideo. Voorbeeld: "https://www.youtube.com/watch?v=abcdef123"',
    }),

    // ── BESCHRIJVING ───────────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Projectbeschrijving",
      type: "array",
      group: "beschrijving",
      description: "Beschrijf het project: ligging, architectuur, wat maakt het uniek? Gebruik Vet voor troeven. Aanbevolen: 80–150 woorden.",
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

    // ── DETAILS & STATUS ───────────────────────────────────────────────────────
    defineField({
      name: "type",
      title: "Soort wooneenheden",
      type: "string",
      group: "technisch",
      options: { list: ["Appartementen", "Woningen", "Gemengd", "Commercieel"], layout: "radio" },
    }),
    defineField({
      name: "units",
      title: "Totaal aantal eenheden",
      type: "number",
      group: "technisch",
      description: 'Totaal aantal appartementen of woningen in het project. Voorbeeld: 24',
    }),
    defineField({
      name: "completionDate",
      title: "Verwachte oplevering",
      type: "string",
      group: "technisch",
      description: 'Voorbeeld: "Q3 2026" of "Begin 2027"',
    }),
    defineField({
      name: "documents",
      title: "Documenten (PDF's voor de klant)",
      type: "array",
      group: "technisch",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "label",
            title: "Naam van het document",
            type: "string",
            description: 'Voorbeeld: "Lastenboek" of "Grondplannen"',
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
      description: "Klanten kunnen deze documenten downloaden op de projectpagina.",
    }),

    // ── SEO ────────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "Titel voor Google (optioneel)",
      type: "string",
      group: "seo",
      description: "Laat leeg = automatisch de projectnaam. Max. 60 tekens.",
      validation: (r) => r.max(60).warning("Hou het onder 60 tekens."),
    }),
    defineField({
      name: "seoDescription",
      title: "Beschrijving voor Google (optioneel)",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Kleine tekst onder de link in Google. Laat leeg = automatisch. Max. 155 tekens.",
      validation: (r) => r.max(155).warning("Hou het onder 155 tekens."),
    }),

    // ── META & URL ─────────────────────────────────────────────────────────────
    defineField({
      name: "slug",
      title: "Website-URL van dit project",
      type: "slug",
      group: "meta",
      options: { source: "name" },
      description: '⚠️ Klik op "Generate" om de URL automatisch aan te maken vanuit de projectnaam. VERPLICHT.',
      validation: (r) => r.required().error('Klik op "Generate" om de URL aan te maken — dit is verplicht.'),
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "location", media: "image", status: "status" },
    prepare({ title, subtitle, media, status }) {
      const statusEmoji = status === "Uitverkocht" ? "🔴" : status === "Binnenkort" ? "🟡" : "🟢";
      return {
        title: `${statusEmoji} ${title}`,
        subtitle,
        media,
      };
    },
  },

  orderings: [
    { title: "Volgorde", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Nieuwste eerst", name: "createdDesc", by: [{ field: "_createdAt", direction: "desc" }] },
  ],
});
