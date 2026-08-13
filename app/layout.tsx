import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond, DM_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import CookieBanner from "@/components/CookieBanner";
import EditBar from "@/components/EditBar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Hairline display face voor het hero-wordmark (stand-in voor PP Neue Montreal Thin)
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["100", "200", "400", "500"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SOM Vastgoed — Uw vertrouwde makelaar in Limburg",
  description: "SOM Vastgoed — professioneel en persoonlijk vastgoed in Limburg. Koop, verkoop of verhuur uw woning met vertrouwen.",
  openGraph: {
    title: "SOM Vastgoed — Uw vertrouwde makelaar in Limburg",
    description: "Professioneel en persoonlijk vastgoed in heel Limburg.",
    type: "website",
    locale: "nl_BE",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const isAdmin = jar.get("som_admin")?.value === "1";

  return (
    <html lang="nl" className={`${cormorant.variable} ${dmSans.variable} ${archivo.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
        {children}
        {isAdmin && <EditBar />}
        <CookieBanner />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
