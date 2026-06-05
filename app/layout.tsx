import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "SOM Vastgoed — Uw thuis in Hasselt",
  description: "SOM Vastgoed — professioneel en persoonlijk vastgoed in Hasselt en omgeving. Koop, verkoop of verhuur uw woning met vertrouwen.",
  openGraph: {
    title: "SOM Vastgoed — Uw thuis in Hasselt",
    description: "Professioneel en persoonlijk vastgoed in Hasselt, Sint-Truiden en Genk.",
    type: "website",
    locale: "nl_BE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
