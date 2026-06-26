import { zabunGet } from "./client";
import type { ZabunProperty, ZabunPropertiesResponse } from "./types";
import type { Property } from "@/lib/types";

// Status mapping: Zabun → display label
const STATUS_MAP: Record<string, string> = {
  available: "Te koop",
  option: "Onder bod",
  sold: "Verkocht",
  rented: "Verhuurd",
  under_offer: "Onder bod",
};

// Transaction + head_type mapping → display label
const TYPE_MAP: Record<string, string> = {
  house: "Woning",
  apartment: "Appartement",
  penthouse: "Penthouse",
  villa: "Villa",
  land: "Grond",
  commercial: "Commercieel",
  office: "Kantoor",
  garage: "Garage",
};

function mapZabunProperty(p: ZabunProperty): Property {
  const mainPhoto = p.media.find((m) => m.type === "photo" && m.order === 1) ?? p.media.find((m) => m.type === "photo");
  const priceValue = p.price ?? p.rent_price;
  const formattedPrice = priceValue
    ? `€ ${priceValue.toLocaleString("nl-BE")}`
    : "Prijs op aanvraag";

  const transactionLabel = p.transaction === "rent" ? "Te huur" : STATUS_MAP[p.status] ?? "Te koop";

  return {
    _id: String(p.id),
    title: p.title?.nl ?? p.reference,
    type: TYPE_MAP[p.type?.toLowerCase()] ?? p.head_type ?? "Woning",
    location: p.location.city,
    price: formattedPrice,
    beds: p.features.bedrooms ?? 0,
    area: p.features.surface_livable ?? p.features.surface_total ?? 0,
    status: transactionLabel,
    imageUrl: mainPhoto?.url ?? "",
  };
}

export async function getZabunProperties(): Promise<Property[]> {
  try {
    // Fetch all available properties — adjust filters as needed
    const data = await zabunGet<ZabunPropertiesResponse>(
      "api/v1/properties?status=available&per_page=50",
      { revalidate: 300 }
    );
    return data.data.map(mapZabunProperty);
  } catch (err) {
    console.error("[Zabun] getZabunProperties failed:", err);
    return [];
  }
}

export async function getZabunProperty(id: string): Promise<ZabunProperty | null> {
  try {
    return await zabunGet<ZabunProperty>(`api/v1/properties/${id}`, { revalidate: 300 });
  } catch (err) {
    console.error(`[Zabun] getZabunProperty(${id}) failed:`, err);
    return null;
  }
}

export async function getZabunPropertyImages(id: string): Promise<string[]> {
  const property = await getZabunProperty(id);
  if (!property) return [];
  return property.media
    .filter((m) => m.type === "photo")
    .sort((a, b) => a.order - b.order)
    .map((m) => m.url);
}
