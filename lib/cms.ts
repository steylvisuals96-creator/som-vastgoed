import type { Property } from "@/sanity/queries";

const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL || "https://som-vastgoed-cms.vercel.app";

const TYPE_LABELS: Record<string, string> = {
  woning: "Woning",
  appartement: "Appartement",
  grond: "Grond",
  commercieel: "Commercieel",
  nieuwbouw: "Nieuwbouw",
};

const STATUS_LABELS: Record<string, string> = {
  koop: "Te koop",
  huur: "Te huur",
};

function mediaUrl(url: string | undefined): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${CMS_BASE}${url}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPand(p: any): Property {
  const imageUrl = mediaUrl(p.hoofdfoto?.url);
  const galleryUrls: string[] = (p.fotos ?? [])
    .map((f: any) => f.foto?.url)
    .filter(Boolean)
    .map(mediaUrl);

  const prijs = typeof p.prijs === "number"
    ? `€ ${p.prijs.toLocaleString("nl-BE")}`
    : String(p.prijs ?? "");

  return {
    _id: `cms-${p.id}`,
    title: p.titel ?? "",
    type: TYPE_LABELS[p.type] ?? p.type ?? "",
    location: p.gemeente ?? "",
    price: prijs,
    beds: p.slaapkamers ?? 0,
    area: p.bewoonbare_opp ?? 0,
    status: STATUS_LABELS[p.transactie] ?? p.transactie ?? "",
    imageUrl,
    featured: p.uitgelicht ?? false,
    slug: `cms-${p.id}`,
    description: p.beschrijving ?? "",
    galleryUrls,
    fullAddress: [p.adres, p.gemeente, p.postcode].filter(Boolean).join(", "),
    landArea: p.perceelgrootte,
    buildYear: p.bouwjaar,
    epcLabel: p.epc,
  };
}

export async function getCMSProperties(): Promise<Property[]> {
  try {
    const res = await fetch(
      `${CMS_BASE}/api/panden?limit=200&depth=1&where[status][not_equals]=verkocht&where[status][not_equals]=verhuurd`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs ?? []).map(mapPand);
  } catch {
    return [];
  }
}

export async function getCMSPropertyById(idOrSlug: string): Promise<Property | null> {
  try {
    // Strip "cms-" prefix if present
    const id = idOrSlug.startsWith("cms-") ? idOrSlug.slice(4) : idOrSlug;
    const res = await fetch(`${CMS_BASE}/api/panden/${id}?depth=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const p = await res.json();
    return mapPand(p);
  } catch {
    return null;
  }
}

export function isCMSSlug(slug: string): boolean {
  return slug.startsWith("cms-");
}
