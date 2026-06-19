import { client } from "./client";
import { urlFor } from "./image";

export type PortableTextBlock = {
  _type: string;
  _key: string;
  style?: string;
  children?: { _key: string; _type: string; text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string }[];
};

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
  description?: PortableTextBlock[] | string;
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
  description?: PortableTextBlock[] | string;
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

export async function getProperties(): Promise<Property[]> {
  if (!client) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any[]>(
    `*[_type == "property"] | order(order asc) { _id, _type, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(1200).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!client) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any>(
    `*[_type == "property" && slug.current == $slug][0] { _id, _type, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
    { slug },
  );
  if (!raw) return null;
  return {
    ...raw,
    imageUrl: raw.image ? urlFor(raw.image).width(1200).url() : "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    galleryUrls: (raw.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  };
}

export async function getRecentProperties(limit = 8): Promise<Property[]> {
  if (!client) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any[]>(
    `*[_type == "property" && !(status in ["Verkocht", "Verhuurd", "Onder compromis", "Onder bod", "Verkoopblokkering"])] | order(order asc) [0..${limit - 1}] { _id, _type, title, type, location, price, beds, area, status, featured, "slug": slug.current, image, gallery, description, fullAddress, lat, lng, landArea, buildYear, condition, bebouwing, epc, epcLabel }`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getProjects(): Promise<Project[]> {
  if (!client) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any[]>(
    `*[_type == "project"] | order(order asc) { _id, _type, name, developer, location, type, units, priceFrom, status, completionDate, featured, "slug": slug.current, image, gallery, description }`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
    galleryUrls: (p.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  }));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!client) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any>(
    `*[_type == "project" && slug.current == $slug][0] { _id, _type, name, developer, location, type, units, priceFrom, status, completionDate, featured, "slug": slug.current, image, gallery, description }`,
    { slug },
  );
  if (!raw) return null;
  return {
    ...raw,
    imageUrl: raw.image ? urlFor(raw.image).width(1400).url() : "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    galleryUrls: (raw.gallery ?? []).map((g: any) => urlFor(g).width(1200).url()),
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!client) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any[]>(
    `*[_type == "teamMember"] | order(order asc) { _id, _type, name, role, photo, photoUrl }`,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((m: any) => ({
    _id: m._id,
    name: m.name,
    role: m.role,
    photoUrl: m.photo ? urlFor(m.photo).width(350).height(467).url() : (m.photoUrl ?? ""),
  }));
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await client.fetch<any>(`*[_type == "siteSettings"][0]`);
  if (!raw) return null;
  return {
    ...raw,
    about: raw.about ? {
      ...raw.about,
      imageUrl: raw.about.image ? urlFor(raw.about.image).width(900).url() : undefined,
    } : undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offices: (raw.offices ?? []).map((o: any) => ({
      ...o,
      imageUrl: o.image ? urlFor(o.image).width(600).height(400).url() : undefined,
    })),
  } as SiteSettings;
}
