import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Teamlid",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Naam", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Functie", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "photoUrl", title: "Of foto via URL", type: "url" }),
    defineField({ name: "order", title: "Volgorde (laag = eerst)", type: "number", initialValue: 99 }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
  orderings: [
    { title: "Volgorde", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
