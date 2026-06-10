import { client, previewClient } from "./client";
import { urlFor } from "./image";

export type Property = {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: string;
  beds: number;
  area: number;
  status: string;
  imageUrl: string;
  featured?: boolean;
  slug?: string;
  description?: string;
  galleryUrls?: string[];
  fullAddress?: string;
  lat?: number;
  lng?: number;
  landArea?: number;
  buildYear?: number;
  condition?: string;
  bebouwing?: string;
  epc?: number;
  epcLabel?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photoUrl: string;
};

export type Project = {
  _id: string;
  name: string;
  developer?: string;
  location: string;
  type?: string;
  units?: number;
  priceFrom?: string;
  status: string;
  completionDate?: string;
  imageUrl: string;
  galleryUrls?: string[];
  description?: string;
  slug?: string;
  featured?: boolean;
};

export type Office = {
  name: string;
  address: string;
  phone: string;
  imageUrl?: string;
};

export type Stat = { value: string; label: string };
export type Usp = { icon: string; title: string; sub: string };

export type SiteSettings = {
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2Italic: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: Stat[];
  boldCta: {
    topLabel: string;
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
  };
  usps: Usp[];
  about: {
    title: string;
    titleItalic: string;
    text1: string;
    text2: string;
    yearsLabel: string;
    cta: string;
    imageUrl?: string;
  };
  offices?: Office[];
  contact: {
    phoneHasselt: string;
    phoneGenk: string;
    email: string;
    address: string;
    title: string;
    titleYellow: string;
    subtitle: string;
  };
};

function getClient(draft = false) {
  return draft ? (previewClient ?? client) : client;
}

export async function getProperties(draft = false): Promise<Property[]> {
  const c = getClient(draft);
  if (!c) return [];

  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "property"] | order(order asc) { _id, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(1200).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getPropertyBySlug(slug: string, draft = false): Promise<Property | null> {
  const c = getClient(draft);
  if (!c) return null;

  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "property" && slug.current == $slug][0] { _id, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
    { slug },
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any;

  if (!raw) return null;
  return {
    ...raw,
    imageUrl: raw.image ? urlFor(raw.image).width(1200).url() : "",
    galleryUrls: (raw.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  };
}

export async function getRecentProperties(limit = 8, draft = false): Promise<Property[]> {
  const c = getClient(draft);
  if (!c) return [];
  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "property" && !(status in ["Verkocht", "Verhuurd", "Onder compromis", "Onder bod", "Verkoopblokkering"])] | order(order asc) [0..${limit - 1}] { _id, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getProjects(draft = false): Promise<Project[]> {
  const c = getClient(draft);
  if (!c) return [];
  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "project"] | order(order asc) { _id, name, developer, location, type, units, priceFrom, status, completionDate, featured, "slug": slug.current, image, gallery, description }`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getProjectBySlug(slug: string, draft = false): Promise<Project | null> {
  const c = getClient(draft);
  if (!c) return null;
  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "project" && slug.current == $slug][0] { _id, name, developer, location, type, units, priceFrom, status, completionDate, featured, "slug": slug.current, image, gallery, description }`,
    { slug },
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any;
  if (!raw) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return {
    ...raw,
    imageUrl: raw.image ? urlFor(raw.image).width(1400).url() : "",
    galleryUrls: (raw.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  };
}

export async function getTeamMembers(draft = false): Promise<TeamMember[]> {
  const c = getClient(draft);
  if (!c) return [];

  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (await c.fetch(
    `*[_type == "teamMember"] | order(order asc) { _id, name, role, photo, photoUrl }`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((m: any) => ({
    _id: m._id,
    name: m.name,
    role: m.role,
    photoUrl: m.photo
      ? urlFor(m.photo).width(350).height(467).url()
      : (m.photoUrl ?? ""),
  }));
}

export async function getSiteSettings(draft = false): Promise<SiteSettings | null> {
  const c = getClient(draft);
  if (!c) return null;

  const perspective = draft ? "previewDrafts" : "published";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await c.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  ) as unknown as any;

  if (!raw) return null;
  return {
    ...raw,
    about: raw.about ? {
      ...raw.about,
      imageUrl: raw.about.image ? urlFor(raw.about.image).width(900).url() : undefined,
    } : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offices: (raw.offices ?? []).map((o: any) => ({
      name: o.name,
      address: o.address,
      phone: o.phone,
      imageUrl: o.image ? urlFor(o.image).width(600).height(400).url() : undefined,
    })),
  } as SiteSettings;
}
