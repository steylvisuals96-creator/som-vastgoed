import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Pand",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: ["Woning", "Appartement", "Penthouse", "Eengezinswoning", "Villa", "Grond"],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "location", title: "Locatie (gemeente)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Prijs (bv. € 499.900)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "beds", title: "Slaapkamers", type: "number" }),
    defineField({ name: "area", title: "Bewoonbare oppervlakte (m²)", type: "number" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "Te koop",
      options: { list: ["Te koop", "Te huur", "Onder bod", "Verkocht"] },
    }),
    defineField({ name: "featured", title: "Uitgelicht op homepage", type: "boolean", initialValue: false }),
    defineField({
      name: "image",
      title: "Hoofdfoto",
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
    defineField({ name: "fullAddress", title: "Volledig adres (straat + gemeente)", type: "string" }),
    defineField({ name: "lat", title: "Latitude (GPS)", type: "number" }),
    defineField({ name: "lng", title: "Longitude (GPS)", type: "number" }),
    defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source: "title" } }),
    defineField({ name: "order", title: "Volgorde (laag = eerst)", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
  orderings: [
    { title: "Volgorde", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Prijs (hoog-laag)", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
  ],
});
