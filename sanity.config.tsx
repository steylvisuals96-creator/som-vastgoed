import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemaTypes";
import WelcomeDashboard from "./studio/WelcomeDashboard";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// ── SVG icons voor de sidebar ─────────────────────────────────────────────────
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "SOM Vastgoed CMS",
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      previewUrl: {
        origin:
          typeof location !== "undefined"
            ? location.origin.replace("/studio", "")
            : "https://som-vastgoed.vercel.app",
        preview: "/",
        draftMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        mainDocuments: (params) => {
          const { pathname } = params;

          if (pathname === "/") {
            return [{ type: "siteSettings", id: "siteSettings" }];
          }

          const aanbodMatch = pathname.match(/^\/aanbod\/([^/]+)/);
          if (aanbodMatch) {
            return [{ type: "property", slug: { current: aanbodMatch[1] } }];
          }

          if (pathname === "/aanbod") {
            return [{ type: "siteSettings", id: "siteSettings" }];
          }

          const nieuwbouwMatch = pathname.match(/^\/nieuwbouw\/([^/]+)/);
          if (nieuwbouwMatch) {
            return [{ type: "project", slug: { current: nieuwbouwMatch[1] } }];
          }

          if (pathname === "/nieuwbouw") {
            return [{ type: "siteSettings", id: "siteSettings" }];
          }

          return [];
        },
        locations: {
          siteSettings: (doc) => [
            { title: "Home", href: "/" },
            { title: "Aanbod", href: "/aanbod" },
            { title: "Nieuwbouw", href: "/nieuwbouw" },
          ],
          property: (doc) => {
            const slug = (doc as { slug?: { current?: string } })?.slug?.current;
            return slug
              ? [
                  { title: doc.title as string ?? "Pand", href: `/aanbod/${slug}` },
                  { title: "Aanbod overzicht", href: "/aanbod" },
                ]
              : [];
          },
          project: (doc) => {
            const slug = (doc as { slug?: { current?: string } })?.slug?.current;
            return slug
              ? [
                  { title: doc.title as string ?? "Project", href: `/nieuwbouw/${slug}` },
                  { title: "Nieuwbouw overzicht", href: "/nieuwbouw" },
                ]
              : [];
          },
          teamMember: () => [{ title: "Home", href: "/" }],
        },
      },
    }),

    structureTool({
      structure: (S) =>
        S.list()
          .title("SOM Vastgoed")
          .items([

            // ── WELKOM ─────────────────────────────────────────────────────────
            S.listItem()
              .title("🏡 Startscherm")
              .id("welcome")
              .child(
                S.component(WelcomeDashboard)
                  .title("Welkom bij SOM Vastgoed CMS")
              ),

            S.divider(),

            // ── PANDEN ─────────────────────────────────────────────────────────
            S.listItem()
              .title("Panden")
              .icon(HomeIcon)
              .child(
                S.list()
                  .title("Panden")
                  .items([
                    S.listItem()
                      .title("Alle panden")
                      .icon(ListIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Alle panden")
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),

                    S.divider(),

                    S.listItem()
                      .title("Te koop")
                      .icon(TagIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Te koop")
                          .filter('_type == "property" && status == "Te koop"')
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),

                    S.listItem()
                      .title("Te huur")
                      .icon(TagIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Te huur")
                          .filter('_type == "property" && status == "Te huur"')
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),

                    S.listItem()
                      .title("Onder bod")
                      .icon(TagIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Onder bod")
                          .filter('_type == "property" && status == "Onder bod"')
                      ),

                    S.listItem()
                      .title("Verkocht")
                      .icon(CheckIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Verkocht")
                          .filter('_type == "property" && status == "Verkocht"')
                      ),

                    S.divider(),

                    S.listItem()
                      .title("Uitgelicht (homepage)")
                      .icon(StarIcon)
                      .child(
                        S.documentTypeList("property")
                          .title("Uitgelicht op homepage")
                          .filter('_type == "property" && featured == true')
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                      ),
                  ])
              ),

            // ── NIEUWBOUW ──────────────────────────────────────────────────────
            S.listItem()
              .title("Nieuwbouw & Projecten")
              .icon(BuildingIcon)
              .child(
                S.documentTypeList("project").title("Nieuwbouw & Projecten")
              ),

            S.divider(),

            // ── TEAM ───────────────────────────────────────────────────────────
            S.listItem()
              .title("Team")
              .icon(UsersIcon)
              .child(
                S.documentTypeList("teamMember").title("Team")
              ),

            S.divider(),

            // ── WEBSITE INSTELLINGEN ───────────────────────────────────────────
            S.listItem()
              .title("Website Instellingen")
              .icon(SettingsIcon)
              .child(
                S.document()
                  .title("Website Instellingen")
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
          ]),
    }),

    visionTool(),
    media(),
  ],
});
