import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website Instellingen",
  type: "document",
  fields: [
    // ── Hero
    defineField({
      name: "hero",
      title: "Hero sectie",
      type: "object",
      fields: [
        defineField({ name: "tagline", title: "Tagline (boven de titel)", type: "string" }),
        defineField({ name: "titleLine1", title: "Titel regel 1", type: "string" }),
        defineField({ name: "titleLine2Italic", title: "Titel regel 2 (cursief, geel)", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitel", type: "text", rows: 2 }),
        defineField({ name: "ctaPrimary", title: "CTA knop tekst", type: "string" }),
        defineField({ name: "ctaSecondary", title: "Secundaire knop tekst", type: "string" }),
      ],
    }),

    // ── Stats
    defineField({
      name: "stats",
      title: "Statistieken (hero onderaan)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Waarde (bv. 500+)", type: "string" }),
          defineField({ name: "label", title: "Label (bv. Panden verkocht)", type: "string" }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      }],
    }),

    // ── Bold CTA sectie
    defineField({
      name: "boldCta",
      title: "Bold CTA sectie",
      type: "object",
      fields: [
        defineField({ name: "topLabel", title: "Label bovenaan", type: "string" }),
        defineField({ name: "titleLine1", title: "Titel regel 1", type: "string" }),
        defineField({ name: "titleLine2", title: "Titel regel 2 (geel woord)", type: "string" }),
        defineField({ name: "titleLine3", title: "Titel regel 3", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitel", type: "text", rows: 2 }),
      ],
    }),

    // ── USPs
    defineField({
      name: "usps",
      title: "USP's (zwarte balk)",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Emoji icoon", type: "string" }),
          defineField({ name: "title", title: "Titel", type: "string" }),
          defineField({ name: "sub", title: "Omschrijving", type: "string" }),
        ],
        preview: { select: { title: "title", subtitle: "sub" } },
      }],
    }),

    // ── Over ons
    defineField({
      name: "about",
      title: "Over ons sectie",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Titel", type: "string" }),
        defineField({ name: "titleItalic", title: "Tweede deel (cursief, grijs)", type: "string" }),
        defineField({ name: "text1", title: "Alinea 1", type: "text", rows: 4 }),
        defineField({ name: "text2", title: "Alinea 2", type: "text", rows: 4 }),
        defineField({ name: "yearsLabel", title: "Jaren ervaring (getal)", type: "string" }),
        defineField({ name: "cta", title: "CTA knop tekst", type: "string" }),
        defineField({ name: "image", title: "Foto (links in de sectie)", type: "image", options: { hotspot: true } }),
      ],
    }),

    // ── Kantoren
    defineField({
      name: "offices",
      title: "Kantoren",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Naam", type: "string" }),
          defineField({ name: "address", title: "Adres", type: "string" }),
          defineField({ name: "phone", title: "Telefoon", type: "string" }),
          defineField({ name: "image", title: "Foto kantoor", type: "image", options: { hotspot: true } }),
        ],
        preview: { select: { title: "name", subtitle: "address" } },
      }],
    }),

    // ── Contact
    defineField({
      name: "contact",
      title: "Contactgegevens",
      type: "object",
      fields: [
        defineField({ name: "phoneHasselt", title: "Telefoon Hasselt", type: "string" }),
        defineField({ name: "phoneGenk", title: "Telefoon Genk", type: "string" }),
        defineField({ name: "email", title: "E-mailadres", type: "string" }),
        defineField({ name: "address", title: "Adres (hoofdvestiging)", type: "string" }),
        defineField({ name: "title", title: "Sectietitel regel 1", type: "string" }),
        defineField({ name: "titleYellow", title: "Sectietitel regel 2 (geel, cursief)", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitel", type: "text", rows: 2 }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Website Instellingen" };
    },
  },
});
