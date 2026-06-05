import { client } from "./client";
import { urlFor } from "./image";
import { getZabunProperties } from "@/lib/zabun/properties";

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

export async function getProperties(): Promise<Property[]> {
  // Zabun heeft voorrang als credentials aanwezig zijn
  if (process.env.ZABUN_API_KEY) {
    return getZabunProperties();
  }

  // Fallback: Sanity
  if (!client) return [];
  const raw = await client.fetch(
    `*[_type == "property"] | order(order asc) { _id, title, type, location, price, beds, area, status, image }`
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return raw.map((p: any) => ({
    ...p,
    imageUrl: p.image ? urlFor(p.image).width(800).url() : "",
  }));
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!client) return [];
  const raw = await client.fetch(
    `*[_type == "teamMember"] | order(order asc) { _id, name, role, photo, photoUrl }`
  );
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

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!client) return null;
  return client.fetch(`*[_type == "siteSettings" && _id == "siteSettings"][0]`);
}
