export const revalidate = 300;
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCMSNieuws } from "@/lib/cms";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const CARD_STYLE = `
  .nieuws-card { transition: transform 0.2s, box-shadow 0.2s; }
  .nieuws-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important; }
`;

export const metadata: Metadata = {
  title: "Nieuws & Vastgoedtips | SOM Vastgoed",
  description: "Lees het laatste vastgoednieuws, kooptips en marktinformatie van SOM Vastgoed in Limburg.",
};

const CATEGORIE_LABELS: Record<string, string> = {
  marktnieuws: "Marktnieuws",
  kooptips: "Kooptips",
  verkooptips: "Verkooptips",
  vastgoednieuws: "Vastgoed nieuws",
  bedrijfsnieuws: "Bedrijfsnieuws",
};

const Y = "#facb04";
const B = "#111111";

export default async function NieuwsPage() {
  const items = await getCMSNieuws();

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", background: "#f7f7f5", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: CARD_STYLE }} />
      <SiteNav activePage="nieuws" />

      {/* Hero */}
      <section style={{ background: B, padding: "clamp(6rem,12vh,9rem) clamp(1.5rem,6vw,5rem) clamp(4rem,7vh,6rem)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: Y, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Vastgoedkennis
          </p>
          <h1 style={{ color: "#fff", fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1rem" }}>
            Nieuws & Vastgoedtips
          </h1>
          <p style={{ color: "#aaa", fontSize: "1.05rem", maxWidth: 560, margin: "0 auto" }}>
            Marktinformatie, kooptips en het laatste vastgoednieuws uit Limburg.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", fontSize: "1rem", padding: "4rem 0" }}>
              Nog geen nieuwsberichten gepubliceerd. Kom binnenkort terug.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
              {items.map((item) => (
                <Link key={item.id} href={`/nieuws/${item.slug}`} style={{ textDecoration: "none" }}>
                  <article className="nieuws-card" style={{
                    background: "#fff", borderRadius: 12, overflow: "hidden",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  }}>
                    {item.afbeeldingUrl ? (
                      <div style={{ position: "relative", height: 200, background: "#eee" }}>
                        <Image src={item.afbeeldingUrl} alt={item.titel} fill style={{ objectFit: "cover" }} />
                      </div>
                    ) : (
                      <div style={{ height: 200, background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: Y, fontSize: "2rem" }}>📰</span>
                      </div>
                    )}
                    <div style={{ padding: "1.5rem" }}>
                      {item.categorie && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: Y, background: "rgba(250,203,4,0.1)", padding: "3px 8px", borderRadius: 4, marginBottom: "0.75rem", display: "inline-block" }}>
                          {CATEGORIE_LABELS[item.categorie] ?? item.categorie}
                        </span>
                      )}
                      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: B, margin: "0.5rem 0", lineHeight: 1.3 }}>
                        {item.titel}
                      </h2>
                      {item.samenvatting && (
                        <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: 1.6, margin: "0.5rem 0 1rem" }}>
                          {item.samenvatting.length > 120 ? item.samenvatting.slice(0, 120) + "…" : item.samenvatting}
                        </p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {item.publicatiedatum && (
                          <span style={{ fontSize: "0.75rem", color: "#999" }}>
                            {new Date(item.publicatiedatum).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: Y }}>Lees meer →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
