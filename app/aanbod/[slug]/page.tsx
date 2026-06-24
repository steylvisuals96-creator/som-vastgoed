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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: typeof property.description === "string" ? property.description : undefined,
    url: `https://som-vastgoed.vercel.app/aanbod/${slug}`,
    image: property.imageUrl ? [property.imageUrl] : [],
    offers: {
      "@type": "Offer",
      price: property.price?.replace(/[^0-9]/g, "") || undefined,
      priceCurrency: "EUR",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "BE",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PropertyDetailClient property={property} />
    </>
  );
}
