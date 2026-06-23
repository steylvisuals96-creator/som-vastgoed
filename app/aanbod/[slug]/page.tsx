export const revalidate = 60;
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { getPropertyBySlug, getProperties } from "@/sanity/queries";
import { getCMSProperties, getCMSPropertyById, isCMSSlug } from "@/lib/cms";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateStaticParams() {
  const [sanityProps, cmsProps] = await Promise.all([
    getProperties().catch(() => []),
    getCMSProperties(),
  ]);

  const sanityParams = sanityProps
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));

  const cmsParams = cmsProps
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));

  return [...cmsParams, ...sanityParams];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = isCMSSlug(slug)
    ? await getCMSPropertyById(slug)
    : await getPropertyBySlug(slug).catch(() => null);
  if (!property) return {};
  return {
    title: `${property.title} — ${property.location} | SOM Vastgoed`,
    description: `${property.type} in ${property.location} — ${property.price}`,
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const property = isCMSSlug(slug)
    ? await getCMSPropertyById(slug)
    : await getPropertyBySlug(slug).catch(() => null);

  if (!property) notFound();

  return <PropertyDetailClient property={property} />;
}
