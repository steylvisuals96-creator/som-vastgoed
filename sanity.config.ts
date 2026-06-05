import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

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
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhoud")
          .items([
            S.listItem()
              .title("Website Instellingen")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            S.documentTypeListItem("property").title("Panden"),
            S.documentTypeListItem("teamMember").title("Team"),
          ]),
    }),
    visionTool(),
  ],
});
