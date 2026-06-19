import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

export const client = projectId
  ? createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: true })
  : null;

// Draft-mode client: perspective op previewDrafts + stega encoding voor de Presentation tool
// Alleen aanmaken als er een token is — anders valt draft mode terug op de gewone client
export const previewClient = projectId && token
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      token,
      perspective: "previewDrafts",
      stega: {
        enabled: true,
        studioUrl: "/studio",
      },
    })
  : null;
