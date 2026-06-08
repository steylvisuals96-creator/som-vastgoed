export const revalidate = 60;

import { draftMode } from "next/headers";
import { getProjects } from "@/sanity/queries";
import NieuwbouwClient from "@/components/NieuwbouwClient";

export const metadata = {
  title: "Nieuwbouw & Projecten — SOM Vastgoed",
  description: "Ontdek alle nieuwbouwprojecten van SOM Vastgoed in Hasselt, Genk en omgeving.",
};

export default async function NieuwbouwPage() {
  const { isEnabled: isDraft } = await draftMode();
  const hasSanity = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  const projects = hasSanity
    ? await getProjects(isDraft).catch(() => [])
    : [];

  return <NieuwbouwClient projects={projects} isDraft={isDraft} />;
}
