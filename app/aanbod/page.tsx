export const revalidate = 60;

import { getProperties } from "@/sanity/queries";
import { getCMSProperties } from "@/lib/cms";
import AanbodClient from "@/components/AanbodClient";

const FALLBACK_PROPERTIES = [
  { _id: "1", type: "Woning", title: "Uitzonderlijke woning", location: "Riemst", price: "€ 499.900", beds: 3, area: 184, status: "Te koop", imageUrl: "/som-listings/listing-1.jpg", featured: true },
  { _id: "2", type: "Woning", title: "Gezinswoning", location: "Hasselt", price: "€ 497.500", beds: 4, area: 317, status: "Te koop", imageUrl: "/som-listings/listing-2.jpg", featured: true },
  { _id: "3", type: "Appartement", title: "Appartement", location: "Hasselt", price: "€ 274.900", beds: 2, area: 90, status: "Te koop", imageUrl: "/som-listings/listing-3.jpg" },
  { _id: "4", type: "Penthouse", title: "Penthouse", location: "Diest", price: "€ 419.000", beds: 2, area: 122, status: "Te koop", imageUrl: "/som-listings/listing-4.jpg" },
  { _id: "5", type: "Eengezinswoning", title: "Eengezinswoning", location: "Genk", price: "€ 397.000", beds: 4, area: 173, status: "Te koop", imageUrl: "/som-listings/listing-5.jpg" },
  { _id: "6", type: "Appartement", title: "Appartement", location: "Maasmechelen", price: "€ 349.000", beds: 2, area: 100, status: "Te koop", imageUrl: "/som-listings/listing-6.jpg" },
];

export const metadata = {
  title: "Aanbod — SOM Vastgoed",
  description: "Volledig vastgoedaanbod van SOM Vastgoed in Hasselt, Genk en omgeving.",
};

export default async function AanbodPage() {
  const [cmsProperties, sanityProperties] = await Promise.all([
    getCMSProperties(),
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      ? getProperties().catch(() => [])
      : Promise.resolve([]),
  ]);

  // CMS-panden eerst, dan Sanity, dan fallback als alles leeg is
  const allProperties = [...cmsProperties, ...sanityProperties];
  const properties = allProperties.length > 0 ? allProperties : FALLBACK_PROPERTIES;

  return <AanbodClient properties={properties} />;
}
