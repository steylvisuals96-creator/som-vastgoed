import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Teamlid",
  type: "document",

  fields: [
    defineField({ name: "name", title: "Naam", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Functie (bv. Vastgoedmakelaar)", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "bio", title: "Korte bio", type: "text", rows: 3,
      description: "Optioneel: een korte beschrijving over dit teamlid (1–3 zinnen).",
    }),
    defineField({ name: "phone", title: "Telefoonnummer", type: "string" }),
    defineField({ name: "email", title: "E-mailadres", type: "string" }),
    defineField({
      name: "photo", title: "Profiel­foto", type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "order", title: "Volgorde (laag = eerst)", type: "number", initialValue: 99,
      description: "Bepaalt de volgorde op de teampagina.",
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },

  orderings: [
    { title: "Volgorde", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
