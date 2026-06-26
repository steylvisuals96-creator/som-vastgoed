export const revalidate = 60;

import NieuwbouwClient from "@/components/NieuwbouwClient";

export const metadata = {
  title: "Nieuwbouw & Projecten — SOM Vastgoed",
  description: "Ontdek alle nieuwbouwprojecten van SOM Vastgoed in Hasselt, Genk en omgeving.",
};

export default function NieuwbouwPage() {
  return <NieuwbouwClient projects={[]} />;
}
