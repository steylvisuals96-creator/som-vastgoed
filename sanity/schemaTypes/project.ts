import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Nieuwbouwproject",
  type: "document",

  groups: [
    { name: "basis",       title: "Basis",           default: true },
    { name: "fotos",       title: "Foto's & Video" },
    { name: "beschrijving", title: "Beschrijving" },
    { name: "technisch",   title: "Details & Status" },
    { name: "seo",         title: "SEO" },
    { name: "meta",        title: "URL & Volgorde" },
  ],

  fields: [
    // ── BASIS ──────────────────────────────────────────────────────────────────
    defineField({ name: "name", title: "Projectnaam", type: "string", group: "basis", validation: (r) => r.required() }),
    defineField({ name: "developer", title: "Promotor", type: "string", group: "basis" }),
    defineField({ name: "location", title: "Locatie (gemeente)", type: "string", group: "basis", validation: (r) => r.required() }),
    defineField({
      name: "status", title: "Status", type: "string", group: "basis",
      initialValue: "In verkoop",
      options: { list: ["In verkoop", "Binnenkort", "In ontwikkeling", "Uitverkocht"], layout: "radio" },
    }),
    defineField({ name: "priceFrom", title: "Prijs vanaf (bv. € 249.000)", type: "string", group: "basis" }),
    defineField({ name: "featured", title: "Uitgelicht op homepage", type: "boolean", group: "basis", initialValue: false }),
    defineField({ name: "order", title: "Volgorde (laag = bovenaan)", type: "number", group: "basis", initialValue: 99 }),

    // ── FOTO'S & VIDEO ─────────────────────────────────────────────────────────
    defineField({
      name: "image", title: "Hoofdafbeelding (render of foto)", type: "image", group: "fotos",
      options: { hotspot: true }, validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery", title: "Fotogalerij", type: "array", group: "fotos",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Renders, plannen, sfeerbeelden — de volgorde bepaalt de galerij.",
    }),
    defineField({
      name: "youtubeUrl", title: "YouTube video (projectvideo)", type: "url", group: "fotos",
      description: "Plak hier de YouTube link van de projectvideo of rondleiding.",
    }),

    // ── BESCHRIJVING ───────────────────────────────────────────────────────────
    defineField({
      name: "description",
      title: "Beschrijving",
      type: "array",
      group: "beschrijving",
      description: "Beschrijf het project: ligging, architectuur, troeven. Aanbevolen: 80–120 woorden.",
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
      name: "type", title: "Type", type: "string", group: "technisch",
      options: { list: ["Appartementen", "Woningen", "Gemengd", "Commercieel"], layout: "radio" },
    }),
    defineField({ name: "units", title: "Aantal units", type: "number", group: "technisch" }),
    defineField({ name: "completionDate", title: "Oplevering (bv. Q3 2026)", type: "string", group: "technisch" }),
    defineField({
      name: "documents", title: "Documenten (PDF)", type: "array", group: "technisch",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "label", title: "Naam (bv. Lastenboek, Plannen)", type: "string" }),
          defineField({ name: "file", title: "PDF bestand", type: "file", options: { accept: ".pdf" } }),
        ],
        preview: { select: { title: "label" } },
      }],
      description: "Voeg PDF-documenten toe zoals lastenboek, grondplan of technische fiche.",
    }),

    // ── SEO ────────────────────────────────────────────────────────────────────
    defineField({
      name: "seoTitle", title: "SEO Titel", type: "string", group: "seo",
      description: "Titel voor Google (max. 60 tekens). Laat leeg om de projectnaam te gebruiken.",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "seoDescription", title: "SEO Beschrijving", type: "text", group: "seo", rows: 3,
      description: "Beschrijving voor Google (max. 155 tekens).",
      validation: (r) => r.max(155),
    }),

    // ── META & URL ─────────────────────────────────────────────────────────────
    defineField({
      name: "slug", title: "URL slug", type: "slug", group: "meta",
      options: { source: "name" },
      validation: (r) => r.required().error("Klik op 'Generate' om de URL aan te maken — dit is verplicht."),
      description: "Klik 'Generate' om automatisch aan te maken vanuit de projectnaam. VERPLICHT.",
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
