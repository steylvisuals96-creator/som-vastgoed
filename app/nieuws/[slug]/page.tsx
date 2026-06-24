export const revalidate = 300;
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCMSNieuwsItem, getCMSNieuws } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { lexicalToHtml } from "@/lib/lexical";

const Y = "#facb04";
const B = "#111111";

const CATEGORIE_LABELS: Record<string, string> = {
  marktnieuws: "Marktnieuws",
  kooptips: "Kooptips",
  verkooptips: "Verkooptips",
  vastgoednieuws: "Vastgoed nieuws",
  bedrijfsnieuws: "Bedrijfsnieuws",
};

export async function generateStaticParams() {
  const items = await getCMSNieuws();
  return items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCMSNieuwsItem(slug);
  if (!item) return {};
  return {
    title: item.seo_titel || `${item.titel} | SOM Vastgoed`,
    description: item.seo_beschrijving || item.samenvatting,
    openGraph: {
      title: item.seo_titel || item.titel,
      description: item.seo_beschrijving || item.samenvatting,
      images: item.afbeeldingUrl ? [item.afbeeldingUrl] : [],
    },
  };
}

export default async function NieuwsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getCMSNieuwsItem(slug);
  if (!item) notFound();

  const inhoudHtml = item.inhoud ? lexicalToHtml(item.inhoud as any) : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.titel,
    description: item.samenvatting,
    image: item.afbeeldingUrl ? [item.afbeeldingUrl] : [],
    datePublished: item.publicatiedatum,
    publisher: {
      "@type": "Organization",
      name: "SOM Vastgoed",
      url: "https://som-vastgoed.vercel.app",
    },
  };

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", background: "#f7f7f5", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav activePage="nieuws" />

      {/* Hero */}
      <section style={{ background: B, padding: "clamp(6rem,12vh,9rem) clamp(1.5rem,6vw,5rem) clamp(3rem,5vh,4rem)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link href="/nieuws" style={{ color: "#888", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
            ← Terug naar nieuws
          </Link>
          {item.categorie && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: Y }}>
                {CATEGORIE_LABELS[item.categorie] ?? item.categorie}
              </span>
            </div>
          )}
          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}>
            {item.titel}
          </h1>
          {item.publicatiedatum && (
            <p style={{ color: "#888", fontSize: "0.85rem" }}>
              {new Date(item.publicatiedatum).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {item.afbeeldingUrl && (
            <div style={{ position: "relative", height: "clamp(240px,40vh,480px)", borderRadius: 12, overflow: "hidden", marginBottom: "2.5rem" }}>
              <Image src={item.afbeeldingUrl} alt={item.titel} fill style={{ objectFit: "cover" }} />
            </div>
          )}

          {item.samenvatting && (
            <p style={{ fontSize: "1.15rem", color: "#444", lineHeight: 1.7, marginBottom: "2rem", fontWeight: 500, borderLeft: `3px solid ${Y}`, paddingLeft: "1.25rem" }}>
              {item.samenvatting}
            </p>
          )}

          {inhoudHtml ? (
            <div
              className="nieuws-inhoud"
              style={{ color: "#333", fontSize: "1rem", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: inhoudHtml }}
            />
          ) : (
            <p style={{ color: "#888", fontStyle: "italic" }}>Geen inhoud beschikbaar.</p>
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e5e5e5" }}>
            <Link href="/nieuws" style={{ color: Y, fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
              ← Alle nieuwsberichten
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .nieuws-inhoud p { margin-bottom: 1.25em; }
        .nieuws-inhoud h2 { font-size: 1.5rem; font-weight: 700; color: #111; margin: 2em 0 0.75em; }
        .nieuws-inhoud h3 { font-size: 1.2rem; font-weight: 700; color: #111; margin: 1.5em 0 0.6em; }
        .nieuws-inhoud ul, .nieuws-inhoud ol { padding-left: 1.5em; margin-bottom: 1.25em; }
        .nieuws-inhoud li { margin-bottom: 0.4em; }
        .nieuws-inhoud a { color: #facb04; }
        .nieuws-inhoud strong { font-weight: 700; }
        .nieuws-inhoud blockquote { border-left: 3px solid #facb04; padding-left: 1em; color: #666; font-style: italic; margin: 1.5em 0; }
      `}</style>

      <SiteFooter />
    </div>
  );
}
