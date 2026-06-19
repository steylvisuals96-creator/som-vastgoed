export const revalidate = 60;
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { getPropertyBySlug, getProperties } from "@/sanity/queries";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateStaticParams() {
  const properties = await getProperties().catch(() => []);
  return properties
    .filter(p => p.slug)
    .map(p => ({ slug: p.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  if (!property) return {};
  return {
    title: `${property.title} — ${property.location} | SOM Vastgoed`,
    description: property.description ?? `${property.type} in ${property.location} — ${property.price}`,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}
