export const revalidate = 300;
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getCMSNieuwsItem, getCMSNieuws } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { lexicalToHtml } from "@/lib/lexical";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";

const CATEGORIE_LABELS: Record<string, string> = {
  marktnieuws:    "Marktnieuws",
  kooptips:       "Kooptips",
  verkooptips:    "Verkooptips",
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
    publisher: { "@type": "Organization", name: "SOM Vastgoed", url: "https://som-vastgoed.vercel.app" },
  };

  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM, minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav activePage="nieuws" />

      {/* Header */}
      <section style={{
        backgroundColor: SEPIA,
        padding: "clamp(7rem,14vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,7vh,5.5rem)",
      }}>
        <div style={{ maxWidth: 800 }}>
          <a href="/nieuws" style={{
            fontFamily: DISPLAY,
            color: "rgba(239,231,216,0.45)",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "1.75rem",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Terug naar nieuws
          </a>

          {item.categorie && (
            <p style={{
              fontFamily: DISPLAY,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: Y,
              marginBottom: "1rem",
            }}>
              {CATEGORIE_LABELS[item.categorie] ?? item.categorie}
            </p>
          )}

          <h1 style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(1.75rem,4vw,3rem)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: CREAM,
            margin: "0 0 1rem",
          }}>
            {item.titel}
          </h1>

          {item.publicatiedatum && (
            <p style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.4)", fontSize: "0.8125rem" }}>
              {new Date(item.publicatiedatum).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {item.afbeeldingUrl && (
            <div style={{ position: "relative", height: "clamp(240px,40vh,480px)", borderRadius: "2px", overflow: "hidden", marginBottom: "2.5rem" }}>
              <Image src={item.afbeeldingUrl} alt={item.titel} fill style={{ objectFit: "cover", filter: "sepia(0.1)" }} />
            </div>
          )}

          {item.samenvatting && (
            <p style={{
              fontFamily: DISPLAY,
              fontSize: "1.1rem",
              fontWeight: 500,
              color: SEPIA,
              lineHeight: 1.7,
              marginBottom: "2rem",
              paddingBottom: "2rem",
              borderBottom: `1px solid ${LINE}`,
            }}>
              {item.samenvatting}
            </p>
          )}

          {inhoudHtml ? (
            <div className="nieuws-inhoud" style={{ color: SEPIA_SOFT, fontSize: "1rem", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: inhoudHtml }} />
          ) : (
            <p style={{ fontFamily: DISPLAY, color: SEPIA_SOFT, fontStyle: "italic" }}>Geen inhoud beschikbaar.</p>
          )}

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
            <a href="/nieuws" style={{
              fontFamily: DISPLAY,
              color: SEPIA,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.875rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderBottom: `1px solid ${LINE}`,
              paddingBottom: "2px",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Alle nieuwsberichten
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .nieuws-inhoud p { margin-bottom: 1.25em; font-family: ${DISPLAY}; }
        .nieuws-inhoud h2 { font-family: ${DISPLAY}; font-size: 1.5rem; font-weight: 500; letter-spacing: -0.02em; color: ${SEPIA}; margin: 2em 0 0.75em; }
        .nieuws-inhoud h3 { font-family: ${DISPLAY}; font-size: 1.2rem; font-weight: 500; color: ${SEPIA}; margin: 1.5em 0 0.6em; }
        .nieuws-inhoud ul, .nieuws-inhoud ol { padding-left: 1.5em; margin-bottom: 1.25em; }
        .nieuws-inhoud li { margin-bottom: 0.4em; }
        .nieuws-inhoud a { color: ${SEPIA}; text-decoration: underline; }
        .nieuws-inhoud strong { font-weight: 600; color: ${SEPIA}; }
        .nieuws-inhoud blockquote { border-left: 1px solid ${LINE}; padding-left: 1.25em; color: ${SEPIA_SOFT}; font-style: italic; margin: 1.5em 0; }
      `}</style>

      <SiteFooter />
    </div>
  );
}
