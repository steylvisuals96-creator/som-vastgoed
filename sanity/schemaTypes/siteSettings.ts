import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Website Instellingen",
  type: "document",

  groups: [
    { name: "hero",     title: "🏠 Homepagina — bovenaan",  default: true },
    { name: "usps",     title: "✅ Waarom SOM Vastgoed?" },
    { name: "about",    title: "👥 Over ons sectie" },
    { name: "offices",  title: "📍 Onze kantoren" },
    { name: "contact",  title: "📞 Contactgegevens" },
    { name: "boldcta",  title: "📢 Promotieblok (donkere sectie)" },
  ],

  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "hero",
      title: "Openingssectie bovenaan de homepage",
      type: "object",
      group: "hero",
      description: "⬆️ Dit is het allereerste wat bezoekers zien wanneer ze op de website komen.",
      fields: [
        defineField({
          name: "tagline",
          title: "Klein label boven de titel",
          type: "string",
          description: 'Verschijnt klein boven de grote titel. Voorbeeld: "Uw vastgoedpartner in de regio"',
        }),
        defineField({
          name: "titleLine1",
          title: "Grote titel — regel 1 (zwart)",
          type: "string",
          description: 'De eerste regel van de grote hero-titel. Voorbeeld: "Thuis voelen"',
        }),
        defineField({
          name: "titleLine2Italic",
          title: "Grote titel — regel 2 (geel + cursief)",
          type: "string",
          description: 'Tweede regel, verschijnt in geel en cursief voor visueel accent. Voorbeeld: "begint hier."',
        }),
        defineField({
          name: "subtitle",
          title: "Subtekst onder de titel",
          type: "text",
          rows: 2,
          description: "Korte beschrijving, 1-2 zinnen. Voorbeeld: \"SOM Vastgoed begeleidt u bij elke stap van uw vastgoedproject in Hasselt en omgeving.\"",
        }),
        defineField({
          name: "ctaPrimary",
          title: "Gele knop (links)",
          type: "string",
          description: 'Tekst op de gele hoofdknop. Voorbeeld: "Bekijk ons aanbod"',
        }),
        defineField({
          name: "ctaSecondary",
          title: "Witte knop (rechts)",
          type: "string",
          description: 'Tekst op de witte knop naast de gele. Voorbeeld: "Gratis waardebepaling"',
        }),
      ],
    }),

    // ── STATS ─────────────────────────────────────────────────────────────────
    defineField({
      name: "stats",
      title: "Statistieken (cijferbalk onderaan hero)",
      type: "array",
      group: "hero",
      description: '📊 Vier cijfers die onderaan de openingssectie verschijnen. Voorbeeld: "500+" + "Panden verkocht". Voeg maximaal 4 toe.',
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "value",
            title: "Getal of waarde",
            type: "string",
            description: 'Voorbeeld: "500+" of "15 jaar"',
          }),
          defineField({
            name: "label",
            title: "Omschrijving van het getal",
            type: "string",
            description: 'Voorbeeld: "Panden verkocht" of "Actief in de regio"',
          }),
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      }],
    }),

    // ── USP'S ─────────────────────────────────────────────────────────────────
    defineField({
      name: "usps",
      title: "Troeven van SOM Vastgoed (zwarte balk)",
      type: "array",
      group: "usps",
      description: "✅ Maximaal 4 redenen waarom klanten voor SOM Vastgoed kiezen. Deze verschijnen in een zwarte balk op de homepage.",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "icon",
            title: "Emoji-icoon",
            type: "string",
            description: 'Kopieer een emoji als icoon. Voorbeelden: 🏆 🤝 📍 ⚡ 🔑 💼',
          }),
          defineField({
            name: "title",
            title: "Korte titel van de troef",
            type: "string",
            description: 'Voorbeeld: "Marktleider in Hasselt"',
          }),
          defineField({
            name: "sub",
            title: "Toelichting (1 zin)",
            type: "string",
            description: 'Voorbeeld: "Al 15 jaar de meest vertrouwde naam in de regio."',
          }),
        ],
        preview: { select: { title: "title", subtitle: "sub" } },
      }],
    }),

    // ── OVER ONS ──────────────────────────────────────────────────────────────
    defineField({
      name: "about",
      title: "Over ons tekst (halverwege de homepage)",
      type: "object",
      group: "about",
      description: "👥 Sectie die vertelt wie SOM Vastgoed is en wat jullie aanpak is. Verschijnt halverwege de homepage.",
      fields: [
        defineField({
          name: "title",
          title: "Titel — eerste deel (zwart)",
          type: "string",
          description: 'Voorbeeld: "Wij geloven in"',
        }),
        defineField({
          name: "titleItalic",
          title: "Titel — tweede deel (cursief, lichter)",
          type: "string",
          description: 'Voorbeeld: "persoonlijke service."',
        }),
        defineField({
          name: "text1",
          title: "Eerste alinea tekst",
          type: "text",
          rows: 4,
          description: "Eerste paragraaf over het kantoor of de visie.",
        }),
        defineField({
          name: "text2",
          title: "Tweede alinea tekst",
          type: "text",
          rows: 4,
          description: "Tweede paragraaf, aanvullende informatie.",
        }),
        defineField({
          name: "yearsLabel",
          title: "Aantal jaar ervaring (getal)",
          type: "string",
          description: 'Verschijnt als groot getal in de sectie. Voorbeeld: "15"',
        }),
        defineField({
          name: "cta",
          title: "Knoptekst",
          type: "string",
          description: 'Voorbeeld: "Maak kennis met ons team"',
        }),
        defineField({
          name: "image",
          title: "Foto (kantoor, team of sfeerfoto)",
          type: "image",
          options: { hotspot: true },
          description: "Foto die naast de tekst verschijnt. Gebruik een professionele sfeerfoto.",
        }),
      ],
    }),

    // ── KANTOREN ──────────────────────────────────────────────────────────────
    defineField({
      name: "offices",
      title: "Vestigingen van SOM Vastgoed",
      type: "array",
      group: "offices",
      description: "📍 Alle kantoren die op de website verschijnen. Klik op '+ Toevoegen' om een kantoor toe te voegen.",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "name",
            title: "Naam van het kantoor",
            type: "string",
            description: 'Voorbeeld: "SOM Vastgoed Hasselt"',
          }),
          defineField({
            name: "address",
            title: "Volledig adres",
            type: "string",
            description: 'Voorbeeld: "Grote Markt 1, 3500 Hasselt"',
          }),
          defineField({
            name: "phone",
            title: "Telefoonnummer",
            type: "string",
            description: 'Voorbeeld: "+32 11 22 33 44"',
          }),
          defineField({
            name: "image",
            title: "Foto van het kantoor (gevel of interieur)",
            type: "image",
            options: { hotspot: true },
          }),
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
      description: "📞 Gegevens die in de contactsectie én in de footer van de website verschijnen.",
      fields: [
        defineField({
          name: "title",
          title: "Sectietitel — eerste regel (zwart)",
          type: "string",
          description: 'Voorbeeld: "Neem contact"',
        }),
        defineField({
          name: "titleYellow",
          title: "Sectietitel — tweede regel (geel, cursief)",
          type: "string",
          description: 'Voorbeeld: "met ons op."',
        }),
        defineField({
          name: "subtitle",
          title: "Korte inleidende tekst",
          type: "text",
          rows: 2,
          description: 'Voorbeeld: "Wij staan klaar om al uw vragen te beantwoorden."',
        }),
        defineField({
          name: "phoneHasselt",
          title: "Telefoonnummer Hasselt",
          type: "string",
          description: 'Voorbeeld: "+32 11 22 33 44"',
        }),
        defineField({
          name: "phoneGenk",
          title: "Telefoonnummer Genk",
          type: "string",
          description: 'Voorbeeld: "+32 89 55 66 77"',
        }),
        defineField({
          name: "email",
          title: "E-mailadres",
          type: "string",
          description: 'Voorbeeld: "info@somvastgoed.be"',
        }),
        defineField({
          name: "address",
          title: "Adres hoofdvestiging",
          type: "string",
          description: 'Voorbeeld: "Grote Markt 1, 3500 Hasselt"',
        }),
      ],
    }),

    // ── BOLD CTA ──────────────────────────────────────────────────────────────
    defineField({
      name: "boldCta",
      title: "Promotieblok (grote donkere sectie onderaan)",
      type: "object",
      group: "boldcta",
      description: "📢 Grote zwarte sectie met een krachtige boodschap. Verschijnt vlak voor de contactsectie.",
      fields: [
        defineField({
          name: "topLabel",
          title: "Klein label bovenaan",
          type: "string",
          description: 'Verschijnt klein boven de grote tekst. Voorbeeld: "Klaar om te starten?"',
        }),
        defineField({
          name: "titleLine1",
          title: "Grote tekst — regel 1 (wit)",
          type: "string",
          description: 'Voorbeeld: "Uw woning"',
        }),
        defineField({
          name: "titleLine2",
          title: "Grote tekst — regel 2 (geel woord)",
          type: "string",
          description: 'Dit woord of deze zin verschijnt in het geel. Voorbeeld: "verkopen"',
        }),
        defineField({
          name: "titleLine3",
          title: "Grote tekst — regel 3 (wit)",
          type: "string",
          description: 'Voorbeeld: "zonder zorgen?"',
        }),
        defineField({
          name: "subtitle",
          title: "Subtekst",
          type: "text",
          rows: 2,
          description: '1-2 zinnen extra toelichting. Voorbeeld: "Wij begeleiden u van begin tot einde."',
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "⚙️ Website Instellingen" };
    },
  },
});
