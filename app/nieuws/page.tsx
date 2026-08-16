export const revalidate = 300;
import Image from "next/image";
import type { Metadata } from "next";
import { getCMSNieuws } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";

export const metadata: Metadata = {
  title: "Nieuws & Vastgoedtips | SOM Vastgoed",
  description: "Lees het laatste vastgoednieuws, kooptips en marktinformatie van SOM Vastgoed in Limburg.",
};

const CATEGORIE_LABELS: Record<string, string> = {
  marktnieuws:    "Marktnieuws",
  kooptips:       "Kooptips",
  verkooptips:    "Verkooptips",
  vastgoednieuws: "Vastgoed nieuws",
  bedrijfsnieuws: "Bedrijfsnieuws",
};

export default async function NieuwsPage() {
  const items = await getCMSNieuws();

  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM, minHeight: "100vh" }}>
      <style>{`
        .nieuws-card { transition: border-color 0.2s; }
        .nieuws-card:hover { border-color: ${SEPIA_SOFT} !important; }
        .nieuws-card:hover .nieuws-img { transform: scale(1.04); }
        .nieuws-img { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
      <SiteNav activePage="nieuws" />

      {/* Header */}
      <section style={{
        backgroundColor: SEPIA,
        padding: "clamp(7rem,14vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,7vh,5.5rem)",
      }}>
        <h1 style={{
          fontFamily: DISPLAY,
          fontSize: "clamp(2.5rem,5.5vw,4.75rem)",
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: CREAM,
          margin: 0,
        }}>
          Nieuws<br /><em style={{ fontStyle: "italic", color: Y }}>&amp; Vastgoedtips</em>
        </h1>
        <p style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", color: "rgba(239,231,216,0.5)", marginTop: "1.25rem", maxWidth: "480px" }}>
          Marktinformatie, kooptips en het laatste vastgoednieuws uit Limburg.
        </p>
      </section>

      {/* Grid */}
      <section style={{ padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {items.length === 0 ? (
            <p style={{ textAlign: "center", fontFamily: DISPLAY, color: SEPIA_SOFT, fontSize: "1.25rem", padding: "4rem 0" }}>
              Nog geen nieuwsberichten gepubliceerd. Kom binnenkort terug.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {items.map((item) => (
                <a key={item.id} href={`/nieuws/${item.slug}`} style={{ textDecoration: "none" }}>
                  <article className="nieuws-card" style={{
                    backgroundColor: CREAM_DEEP,
                    border: `1px solid ${LINE}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}>
                    <div style={{ position: "relative", height: 200, overflow: "hidden", backgroundColor: SEPIA }}>
                      {item.afbeeldingUrl ? (
                        <img src={item.afbeeldingUrl} alt={item.titel}
                          className="nieuws-img"
                          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.1)" }} />
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={SEPIA_SOFT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "1.5rem" }}>
                      {item.categorie && (
                        <span style={{
                          fontFamily: DISPLAY,
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: SEPIA_SOFT,
                          borderBottom: `1px solid ${LINE}`,
                          paddingBottom: "2px",
                          marginBottom: "0.75rem",
                          display: "inline-block",
                        }}>
                          {CATEGORIE_LABELS[item.categorie] ?? item.categorie}
                        </span>
                      )}
                      <h2 style={{ fontFamily: DISPLAY, fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.02em", color: SEPIA, margin: "0.5rem 0", lineHeight: 1.3 }}>
                        {item.titel}
                      </h2>
                      {item.samenvatting && (
                        <p style={{ fontFamily: DISPLAY, fontSize: "0.875rem", color: SEPIA_SOFT, lineHeight: 1.65, margin: "0.5rem 0 1rem" }}>
                          {item.samenvatting.length > 120 ? item.samenvatting.slice(0, 120) + "…" : item.samenvatting}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${LINE}`, paddingTop: "0.875rem" }}>
                        {item.publicatiedatum && (
                          <span style={{ fontFamily: DISPLAY, fontSize: "0.75rem", color: SEPIA_SOFT }}>
                            {new Date(item.publicatiedatum).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                        <span style={{ fontFamily: DISPLAY, fontSize: "0.75rem", fontWeight: 600, color: SEPIA, border: `1px solid ${LINE}`, padding: "3px 10px", borderRadius: "2px" }}>
                          Lees meer
                        </span>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
