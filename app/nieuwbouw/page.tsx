export const revalidate = 300;

import NieuwbouwClient from "@/components/NieuwbouwClient";
import { getCMSNieuwbouw } from "@/lib/cms";

export const metadata = {
  title: "Nieuwbouw & Projecten — SOM Vastgoed",
  description: "Ontdek alle nieuwbouwprojecten van SOM Vastgoed in Hasselt, Genk en omgeving.",
};

export default async function NieuwbouwPage() {
  const projects = await getCMSNieuwbouw();
  return <NieuwbouwClient projects={projects} />;
}
