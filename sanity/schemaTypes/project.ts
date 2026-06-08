import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Nieuwbouwproject",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Projectnaam", type: "string", validation: (r) => r.required() }),
    defineField({ name: "developer", title: "Promotor", type: "string" }),
    defineField({ name: "location", title: "Locatie (gemeente)", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: ["Appartementen", "Woningen", "Gemengd", "Commercieel"] },
    }),
    defineField({ name: "units", title: "Aantal units", type: "number" }),
    defineField({ name: "priceFrom", title: "Prijs vanaf (bv. € 249.000)", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "In verkoop",
      options: { list: ["In verkoop", "Binnenkort", "In ontwikkeling", "Uitverkocht"] },
    }),
    defineField({ name: "completionDate", title: "Oplevering (bv. Q3 2026)", type: "string" }),
    defineField({
      name: "image",
      title: "Hoofdafbeelding (render of foto)",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Fotogalerij",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "description", title: "Beschrijving", type: "text", rows: 5 }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "name" } }),
    defineField({ name: "featured", title: "Uitgelicht op homepage", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Volgorde", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "name", subtitle: "location", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
