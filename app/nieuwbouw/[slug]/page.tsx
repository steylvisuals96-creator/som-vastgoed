export const revalidate = 60;

import { notFound } from "next/navigation";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return [];
}

export async function generateMetadata() {
  return { title: "Project — SOM Vastgoed" };
}

export default async function NieuwbouwDetailPage() {
  notFound();
}
