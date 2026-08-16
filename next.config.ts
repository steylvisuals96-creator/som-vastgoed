import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "files.zabun.be" },
      // FALLBACK_TEAM in SOMClient gebruikt teamfoto's van de huidige site;
      // zonder deze host crasht de pagina zodra het CMS geen team teruggeeft.
      { protocol: "https", hostname: "somvastgoed.be" },
      // Teamfoto's redirecten via somvastgoed.be naar Google Storage
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
