import type { MetadataRoute } from "next";
import { getCMSProperties, getCMSNieuws } from "@/lib/cms";

const BASE = "https://som-vastgoed.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [panden, nieuws] = await Promise.all([getCMSProperties(), getCMSNieuws()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/aanbod`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/nieuws`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/schatting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/nieuwbouw`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  const pandPages: MetadataRoute.Sitemap = panden.map((p) => ({
    url: `${BASE}/aanbod/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const nieuwsPages: MetadataRoute.Sitemap = nieuws.map((n) => ({
    url: `${BASE}/nieuws/${n.slug}`,
    lastModified: n.publicatiedatum ? new Date(n.publicatiedatum) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...pandPages, ...nieuwsPages];
}
