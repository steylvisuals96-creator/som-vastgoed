export const revalidate = 60;

import { draftMode } from "next/headers";
import SOMClient from "@/components/SOMClient";
import { getProperties, getTeamMembers, getSiteSettings } from "@/sanity/queries";

const FALLBACK_PROPERTIES = [
  { _id: "1", type: "Woning", title: "Uitzonderlijke woning", location: "Riemst", price: "€ 499.900", beds: 3, area: 184, status: "Te koop", imageUrl: "/som-listings/listing-1.jpg" },
  { _id: "2", type: "Woning", title: "Gezinswoning", location: "Hasselt", price: "€ 497.500", beds: 4, area: 317, status: "Te koop", imageUrl: "/som-listings/listing-2.jpg" },
  { _id: "3", type: "Appartement", title: "Appartement", location: "Hasselt", price: "€ 274.900", beds: 2, area: 90, status: "Te koop", imageUrl: "/som-listings/listing-3.jpg" },
  { _id: "4", type: "Penthouse", title: "Penthouse", location: "Diest", price: "€ 419.000", beds: 2, area: 122, status: "Te koop", imageUrl: "/som-listings/listing-4.jpg" },
  { _id: "5", type: "Eengezinswoning", title: "Eengezinswoning", location: "Genk", price: "€ 397.000", beds: 4, area: 173, status: "Te koop", imageUrl: "/som-listings/listing-5.jpg" },
  { _id: "6", type: "Appartement", title: "Appartement", location: "Maasmechelen", price: "€ 349.000", beds: 2, area: 100, status: "Te koop", imageUrl: "/som-listings/listing-6.jpg" },
];

const FALLBACK_TEAM = [
  { _id: "1", name: "Tom Muermans", role: "Bestuurder", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/4751fd89-f781-4b68-9daa-fc6f3c4160e1/photo?hash=2bcfb37b38087af62a41269c90d7e9bab1b7c34a14a0956f4f41e835787b76fca2a3ee1ed40f01af462428b464128503a51423ab4bf67144c6b760baf6196e66&v=C350x350" },
  { _id: "2", name: "Maxime Vanoppen", role: "Office Manager & Makelaar", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/ed7b76c1-50b1-45cb-a9b2-cabe0b1be386/photo?hash=0666424198239e93a486275c41b1276dbde95a281f12012abe86f3ad57b2e5db94d79c6a2da8f5ba6fa2ddcb5fbeae161a9569e973531389ce83457033ab80f9&v=C350x350" },
  { _id: "3", name: "Larissa Fluder", role: "Vastgoedmakelaar", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/f9424cb6-00ad-41a9-9e4a-94f9c8416154/photo?hash=6a735b756e8f754a66ded3e85dc67cba1f04644fb6216a8cceea68b486770a10cb4b3e3f788f094f4b0023aecd7f29532235113b03b896298548dcb58b7c54a3&v=C350x350" },
  { _id: "4", name: "Raf Zels", role: "Vastgoedmakelaar", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/39779c66-4835-4476-9aeb-601d1994b9b7/photo?hash=4b8d60aba75936b237703b8f67de26391faed61d70b98afc7d152cd5fcc608a5ce95103f5d01e9d281a2f731e8b1cb9f5c9d19a24bc03879cb13a7a3b780cdb3&v=C350x350" },
  { _id: "5", name: "Kathleen Penders", role: "Vastgoedexpert", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/84fccdbb-b496-4f1f-8d5f-f60e6102970b/photo?hash=c5f97c4e2506403845081ed015e134bbadde1468ae5fe3ea7e0eeb9394555129d3c04bb045af7f7a0a81de2c41802857ea4cff527221c504426eb5f26802650e&v=C350x350" },
  { _id: "6", name: "Chaniz Gielen", role: "Marketing Consultant", photoUrl: "https://somvastgoed.be/cms-assets/entities/people/f51962bd-8dfe-4c32-9ea9-96549649afc9/photo?hash=f86cbbb863d380a5d5de9f2af2e030f085b886b8c5778d37101f28e78c3b8c45be5064da37910f54cdf1c43e60d319ff274f31e138b8cba6c3bad2091641b04d&v=C350x350" },
];

export default async function Home() {
  const { isEnabled: isDraft } = await draftMode();
  const hasSanity = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

  const [properties, team, settings] = hasSanity
    ? await Promise.all([
        getProperties(isDraft).catch(() => FALLBACK_PROPERTIES),
        getTeamMembers(isDraft).catch(() => FALLBACK_TEAM),
        getSiteSettings(isDraft).catch(() => null),
      ])
    : [FALLBACK_PROPERTIES, FALLBACK_TEAM, null];

  return (
    <SOMClient
      properties={properties}
      team={team}
      settings={settings}
      isDraft={isDraft}
    />
  );
}
