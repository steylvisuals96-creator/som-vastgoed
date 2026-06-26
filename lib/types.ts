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
