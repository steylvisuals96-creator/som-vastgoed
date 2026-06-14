import { defineField, defineType } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Teamlid",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Volledige naam",
      type: "string",
      description: 'Voorbeeld: "Maxime Janssen"',
      validation: (r) => r.required().error("Vul de naam in."),
    }),
    defineField({
      name: "role",
      title: "Functietitel",
      type: "string",
      description: 'Verschijnt onder de naam op de teampagina. Voorbeeld: "Vastgoedmakelaar" of "Office Manager"',
      validation: (r) => r.required().error("Vul de functie in."),
    }),
    defineField({
      name: "bio",
      title: "Korte bio (optioneel)",
      type: "text",
      rows: 3,
      description: "1–3 zinnen over dit teamlid. Voorbeeld: \"Maxime werkt al 5 jaar bij SOM Vastgoed en is gespecialiseerd in woningen in Hasselt.\"",
    }),
    defineField({
      name: "phone",
      title: "Telefoonnummer (optioneel)",
      type: "string",
      description: 'Voorbeeld: "+32 11 22 33 44"',
    }),
    defineField({
      name: "email",
      title: "E-mailadres (optioneel)",
      type: "string",
      description: 'Voorbeeld: "maxime@somvastgoed.be"',
    }),
    defineField({
      name: "photo",
      title: "Profielfoto",
      type: "image",
      options: { hotspot: true },
      description: "Gebruik een professionele portretfoto (vierkant formaat werkt het best).",
    }),
    defineField({
      name: "order",
      title: "Volgorde op de teampagina",
      type: "number",
      initialValue: 99,
      description: "Lager getal = eerder getoond. Teamlid nr. 1 staat bovenaan.",
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },

  orderings: [
    { title: "Volgorde", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
