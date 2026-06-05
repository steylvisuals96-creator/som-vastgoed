// ── Zabun CMS API types
// Base URL: https://public.api-cms.zabun.be/
// Swagger:  https://gateway-cmsapi.v2.zabun.be/swagger/index.html?urls.primaryName=Zabun+1+CmsApi+-+v1

// ── Auth credentials (set in .env.local)
export interface ZabunConfig {
  xClientId: string;
  apiKey: string;
  clientId: string;
  serverId: string;
}

// ── Property (pand) as returned by Zabun API
export interface ZabunProperty {
  id: number;
  reference: string;
  status: ZabunPropertyStatus;
  transaction: ZabunTransaction;
  head_type: string;
  type: string;
  sub_type: string | null;
  price: number | null;
  rent_price: number | null;
  title: ZabunLocalizedString;
  description: ZabunLocalizedString;
  location: ZabunLocation;
  features: ZabunFeatures;
  media: ZabunMedia[];
  published_at: string;
  updated_at: string;
}

export type ZabunPropertyStatus =
  | "available"
  | "option"
  | "sold"
  | "rented"
  | "under_offer";

export type ZabunTransaction = "sale" | "rent" | "sale_or_rent";

export interface ZabunLocalizedString {
  nl?: string;
  fr?: string;
  en?: string;
}

export interface ZabunLocation {
  city: string;
  zip: string;
  street: string | null;
  number: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface ZabunFeatures {
  bedrooms: number | null;
  bathrooms: number | null;
  surface_livable: number | null;
  surface_total: number | null;
  surface_garden: number | null;
  garages: number | null;
  construction_year: number | null;
  epc: string | null;
}

export interface ZabunMedia {
  id: number;
  type: "photo" | "plan" | "document" | "video";
  url: string;
  thumbnail_url: string | null;
  order: number;
  title: ZabunLocalizedString | null;
}

// ── Paginated list response
export interface ZabunPropertiesResponse {
  data: ZabunProperty[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// ── Contact message (vraag over een specifiek pand)
export interface ZabunContactMessagePayload {
  contact: ZabunContactPayload;
  message: {
    text?: string;
    property_id?: number;
    info?: Record<string, string>;
  };
}

// ── Contact request (zoekprofiel)
export interface ZabunContactRequestPayload {
  contact: ZabunContactPayload;
  request: {
    bedrooms?: { min?: number; max?: number };
    bathrooms?: { min?: number; max?: number };
    price?: { min?: number; max?: number };
    surface?: { min?: number; max?: number };
    cities?: string[];
    transactions?: ZabunTransaction[];
    headtypes?: string[];
    types?: string[];
    description?: string;
    media_id?: number;
    sales_rep?: number;
  };
}

export interface ZabunContactPayload {
  first_name?: string;
  last_name: string;
  email?: string;
  phone?: string;
  phone_cc?: string;
  mobile?: string;
  mobile_cc?: string;
  language?: string;
  mailing_opt_in?: boolean;
  marketing_opt_in?: boolean;
  question?: string;
}
