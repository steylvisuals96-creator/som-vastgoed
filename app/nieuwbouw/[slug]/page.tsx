export const revalidate = 300;
export const dynamicParams = true;

import { notFound } from "next/navigation";
import { getCMSNieuwbouw, getCMSNieuwbouwItem } from "@/lib/cms";
import NieuwbouwDetailClient from "@/components/NieuwbouwDetailClient";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = await getCMSNieuwbouw();
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getCMSNieuwbouwItem(slug);
  if (!project) return { title: "Project — SOM Vastgoed" };
  return {
    title: `${project.name} — SOM Vastgoed`,
    description: typeof project.description === "string"
      ? project.description.slice(0, 155)
      : `${project.name} — nieuwbouwproject in ${project.location}.`,
    openGraph: {
      title: `${project.name} — SOM Vastgoed`,
      images: project.imageUrl ? [project.imageUrl] : [],
      locale: "nl_BE",
    },
  };
}

export default async function NieuwbouwDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getCMSNieuwbouwItem(slug);
  if (!project) notFound();
  return <NieuwbouwDetailClient project={project} />;
}
