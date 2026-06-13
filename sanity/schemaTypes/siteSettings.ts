import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website Instellingen",
  type: "document",

  groups: [
    { name: "hero",     title: "🏠 Homepagina hero",    default: true },
    { name: "usps",     title: "✅ USP's" },
    { name: "about",    title: "👥 Over ons" },
    { name: "offices",  title: "📍 Kantoren" },
    { name: "contact",  title: "📞 Contact" },
    { name: "boldcta",  title: "📢 Promotieblok" },
  ],

  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      title: "Hero sectie",
      type: "object",
      group: "hero",
      description: "De grote openingsruimte bovenaan de homepage.",
      fields: [
        defineField({ name: "tagline",       title: "Tagline (klein label boven de titel)", type: "string" }),
        defineField({ name: "titleLine1",    title: "Hoofdtitel — regel 1", type: "string" }),
        defineField({ name: "titleLine2Italic", title: "Hoofdtitel — regel 2 (cursief, geel)", type: "string" }),
        defineField({ name: "subtitle",      title: "Subtitel / korte beschrijving", type: "text", rows: 2 }),
        defineField({ name: "ctaPrimary",    title: "Primaire knop tekst (bv. 'Bekijk ons aanbod')", type: "string" }),
        defineField({ name: "ctaSecondary",  title: "Secundaire knop tekst (bv. 'Gratis waardebepaling')", type: "string" }),
      ],
    }),

    // ── STATS ─────────────────────────────────────────────────────────────────
    defineField({
      name: "stats",
      title: "Statistieken (hero — onderste balk)",
      type: "array",
      group: "hero",
      description: "Cijfers die onderaan de hero verschijnen, bv. '500+ Panden verkocht'.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Getal / waarde (bv. 500+)", type: "string" }),
          defineField({ name: "label", title: "Omschrijving (bv. Panden verkocht)", type: "string" }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      }],
    }),

    // ── USP'S ─────────────────────────────────────────────────────────────────
    defineField({
      name: "usps",
      title: "USP's (zwarte balk — waarom SOM Vastgoed)",
      type: "array",
      group: "usps",
      description: "Maximaal 4 troeven die SOM Vastgoed onderscheidt. Gebruik emoji als icoon: 🏆 📍 🤝 ⚡",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon",  title: "Emoji icoon (bv. 🏆)", type: "string" }),
          defineField({ name: "title", title: "Titel (bv. Marktleider in Hasselt)", type: "string" }),
          defineField({ name: "sub",   title: "Korte omschrijving", type: "string" }),
        ],
        preview: { select: { title: "title", subtitle: "sub" } },
      }],
    }),

    // ── OVER ONS ──────────────────────────────────────────────────────────────
    defineField({
      name: "about",
      title: "Over ons sectie",
      type: "object",
      group: "about",
      description: "Sectie halverwege de homepage over het kantoor en de aanpak.",
      fields: [
        defineField({ name: "title",       title: "Titel — deel 1 (zwart)", type: "string" }),
        defineField({ name: "titleItalic", title: "Titel — deel 2 (cursief, grijs)", type: "string" }),
        defineField({ name: "text1",       title: "Eerste alinea", type: "text", rows: 4 }),
        defineField({ name: "text2",       title: "Tweede alinea", type: "text", rows: 4 }),
        defineField({ name: "yearsLabel",  title: "Aantal jaar ervaring (getal)", type: "string" }),
        defineField({ name: "cta",         title: "Knop tekst (bv. 'Maak kennis met ons team')", type: "string" }),
        defineField({ name: "image",       title: "Achtergrond- of teamfoto", type: "image", options: { hotspot: true } }),
      ],
    }),

    // ── KANTOREN ──────────────────────────────────────────────────────────────
    defineField({
      name: "offices",
      title: "Kantoren",
      type: "array",
      group: "offices",
      description: "De vestigingen van SOM Vastgoed. Elke vestiging verschijnt als een kaart op de website.",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name",    title: "Naam (bv. SOM Vastgoed Hasselt)", type: "string" }),
          defineField({ name: "address", title: "Adres", type: "string" }),
          defineField({ name: "phone",   title: "Telefoonnummer", type: "string" }),
          defineField({ name: "image",   title: "Foto van het kantoor", type: "image", options: { hotspot: true } }),
        ],
        preview: { select: { title: "name", subtitle: "address" } },
      }],
    }),

    // ── CONTACTGEGEVENS ───────────────────────────────────────────────────────
    defineField({
      name: "contact",
      title: "Contactgegevens",
      type: "object",
      group: "contact",
      description: "Gegevens die in de contactsectie en footer verschijnen.",
      fields: [
        defineField({ name: "title",       title: "Sectietitel — regel 1", type: "string" }),
        defineField({ name: "titleYellow", title: "Sectietitel — regel 2 (geel, cursief)", type: "string" }),
        defineField({ name: "subtitle",    title: "Inleidende tekst", type: "text", rows: 2 }),
        defineField({ name: "phoneHasselt", title: "Telefoon Hasselt", type: "string" }),
        defineField({ name: "phoneGenk",   title: "Telefoon Genk", type: "string" }),
        defineField({ name: "email",       title: "E-mailadres", type: "string" }),
        defineField({ name: "address",     title: "Adres (hoofdvestiging)", type: "string" }),
      ],
    }),

    // ── BOLD CTA ──────────────────────────────────────────────────────────────
    defineField({
      name: "boldCta",
      title: "Promotieblok (grote dark sectie)",
      type: "object",
      group: "boldcta",
      description: "Grote donkere sectie met een krachtige boodschap en call-to-action.",
      fields: [
        defineField({ name: "topLabel",   title: "Klein label bovenaan (bv. 'Neem contact op')", type: "string" }),
        defineField({ name: "titleLine1", title: "Titel — regel 1", type: "string" }),
        defineField({ name: "titleLine2", title: "Titel — regel 2 (geel woord)", type: "string" }),
        defineField({ name: "titleLine3", title: "Titel — regel 3", type: "string" }),
        defineField({ name: "subtitle",   title: "Subtitel / extra toelichting", type: "text", rows: 2 }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Website Instellingen" };
    },
  },
});
