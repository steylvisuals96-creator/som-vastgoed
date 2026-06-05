import { zabunPost } from "./client";
import type { ZabunContactMessagePayload, ZabunContactRequestPayload } from "./types";

export interface ContactFormData {
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: number;
  mailingOptIn?: boolean;
}

// Stuur een bericht over een specifiek pand (of algemeen contact)
export async function sendContactMessage(data: ContactFormData): Promise<void> {
  const payload: ZabunContactMessagePayload = {
    contact: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      language: "nl",
      mailing_opt_in: data.mailingOptIn ?? false,
      marketing_opt_in: false,
    },
    message: {
      text: data.message,
      ...(data.propertyId ? { property_id: data.propertyId } : {}),
    },
  };

  await zabunPost("api/v1/contactmessage", payload);
}

// Stuur een zoekprofiel (iemand die op zoek is naar een pand)
export async function sendContactRequest(
  data: ContactFormData & {
    priceMin?: number;
    priceMax?: number;
    bedroomsMin?: number;
    cities?: string[];
    types?: string[];
  }
): Promise<void> {
  const payload: ZabunContactRequestPayload = {
    contact: {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      language: "nl",
      mailing_opt_in: data.mailingOptIn ?? false,
      marketing_opt_in: false,
      question: data.message,
    },
    request: {
      ...(data.priceMin || data.priceMax
        ? { price: { min: data.priceMin, max: data.priceMax } }
        : {}),
      ...(data.bedroomsMin ? { bedrooms: { min: data.bedroomsMin } } : {}),
      ...(data.cities?.length ? { cities: data.cities } : {}),
      ...(data.types?.length ? { types: data.types } : {}),
      transactions: ["sale"],
    },
  };

  await zabunPost("api/v1/contactrequest", payload);
}
