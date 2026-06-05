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
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photoUrl: string;
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
  };
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
    `*[_type == "property"] | order(order asc) { _id, title, type, location, price, beds, area, status, featured, image }`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  )) as unknown as any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
  }));
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
  return c.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`,
    {},
    { perspective, filterResponse: true } as unknown as Parameters<typeof c.fetch>[2]
  ) as unknown as Promise<SiteSettings | null>;
}
