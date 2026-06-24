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

export type CMSNieuwsItem = {
  id: string;
  slug: string;
  titel: string;
  samenvatting?: string;
  afbeeldingUrl?: string;
  categorie?: string;
  publicatiedatum?: string;
  inhoud?: unknown;
  seo_titel?: string;
  seo_beschrijving?: string;
};

export type CMSTestimonial = {
  id: string;
  naam: string;
  type?: string;
  tekst: string;
  beoordeling?: string;
};

export async function getCMSNieuws(): Promise<CMSNieuwsItem[]> {
  try {
    const res = await fetch(
      `${CMS_BASE}/api/nieuws?limit=50&depth=1&where[gepubliceerd][equals]=true&sort=-publicatiedatum`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs ?? []).map((n: any) => ({
      id: n.id,
      slug: n.slug,
      titel: n.titel,
      samenvatting: n.samenvatting,
      afbeeldingUrl: mediaUrl(n.afbeelding?.url),
      categorie: n.categorie,
      publicatiedatum: n.publicatiedatum,
      inhoud: n.inhoud,
      seo_titel: n.seo_titel,
      seo_beschrijving: n.seo_beschrijving,
    }));
  } catch {
    return [];
  }
}

export async function getCMSNieuwsItem(slug: string): Promise<CMSNieuwsItem | null> {
  try {
    const res = await fetch(
      `${CMS_BASE}/api/nieuws?where[slug][equals]=${slug}&where[gepubliceerd][equals]=true&depth=1&limit=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const n = data.docs?.[0];
    if (!n) return null;
    return {
      id: n.id,
      slug: n.slug,
      titel: n.titel,
      samenvatting: n.samenvatting,
      afbeeldingUrl: mediaUrl(n.afbeelding?.url),
      categorie: n.categorie,
      publicatiedatum: n.publicatiedatum,
      inhoud: n.inhoud,
      seo_titel: n.seo_titel,
      seo_beschrijving: n.seo_beschrijving,
    };
  } catch {
    return null;
  }
}

export async function getCMSTestimonials(): Promise<CMSTestimonial[]> {
  try {
    const res = await fetch(
      `${CMS_BASE}/api/testimonials?limit=20&depth=0&where[goedgekeurd][equals]=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.docs ?? []).map((t: any) => ({
      id: t.id,
      naam: t.naam,
      type: t.type,
      tekst: t.tekst,
      beoordeling: t.beoordeling ?? "5",
    }));
  } catch {
    return [];
  }
}
