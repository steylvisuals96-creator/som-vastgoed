export const revalidate = 60;

import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getProjectBySlug, getProjects } from "@/sanity/queries";
import NieuwbouwDetailClient from "@/components/NieuwbouwDetailClient";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  const projects = await getProjects().catch(() => []);
  return projects.filter(p => p.slug).map(p => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project) return { title: "Project — SOM Vastgoed" };
  return {
    title: `${project.name} — SOM Vastgoed`,
    description: project.description
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
  const { isEnabled: isDraft } = await draftMode();
  const hasSanity = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  const project = hasSanity
    ? await getProjectBySlug(slug, isDraft).catch(() => null)
    : null;

  if (!project) notFound();

  return <NieuwbouwDetailClient project={project} isDraft={isDraft} />;
}
