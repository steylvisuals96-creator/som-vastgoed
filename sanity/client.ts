import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

export const client = projectId
  ? createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: true })
  : null;

// Draft-mode client met stega encoding voor visual editing
export const previewClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      token,
      stega: {
        enabled: true,
        studioUrl: "/studio",
      },
    })
  : null;
