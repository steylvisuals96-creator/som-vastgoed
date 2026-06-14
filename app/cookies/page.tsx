import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookiebeleid — SOM Vastgoed",
  description: "Lees het cookiebeleid van SOM Vastgoed.",
};

const Y = "#facb04";
const B = "#111111";

export default function CookiesPage() {
  return (
    <>
      <SiteNav activePage="" />
      <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", paddingTop: "6rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem" }}>

          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: Y, fontWeight: 600, marginBottom: "1rem" }}>
            Juridisch
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, color: B, lineHeight: 1.15, marginBottom: "2.5rem" }}>
            Cookiebeleid
          </h1>

          <div style={{ fontFamily: "var(--font-dm-sans)", color: "#333", lineHeight: 1.8, fontSize: "0.95rem" }}>

            <Section title="Wat zijn cookies?">
              <p>Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons de website correct te laten werken en het gebruik anoniem te analyseren.</p>
            </Section>

            <Section title="Welke cookies gebruiken wij?">
              <CookieRow
                name="Noodzakelijke cookies"
                always
                examples="Cookievoorkeur (som_cookie_consent)"
                purpose="Onthouden van uw cookievoorkeur. Altijd actief, geen toestemming vereist."
              />
              <CookieRow
                name="Analytische cookies"
                always={false}
                examples="Vercel Analytics, Vercel Speed Insights"
                purpose="Anonieme statistieken over paginabezoeken en laadtijden. Geen persoonsgegevens. Alleen actief na uw toestemming."
              />
            </Section>

            <Section title="Toestemming beheren">
              <p>Bij uw eerste bezoek vragen wij uw toestemming via de cookiebanner. U kunt uw keuze op elk moment aanpassen door uw browsercookies te wissen en de pagina te herladen — de banner verschijnt dan opnieuw.</p>
            </Section>

            <Section title="Cookies van derden">
              <p>Wij maken geen gebruik van tracking cookies van sociale media of advertentienetwerken. Als een pand een YouTube-video bevat, kan YouTube eigen cookies plaatsen wanneer u de video afspeelt. Dit valt onder het cookiebeleid van Google/YouTube.</p>
            </Section>

            <Section title="Meer informatie">
              <p>
                Voor vragen kunt u ons bereiken via{" "}
                <a href="mailto:info@somvastgoed.be" style={{ color: Y }}>info@somvastgoed.be</a>.
                Meer over uw privacyrechten leest u in ons{" "}
                <Link href="/privacy" style={{ color: Y }}>Privacybeleid</Link>.
              </p>
              <p style={{ marginTop: "0.5rem", color: "#999", fontSize: "0.85rem" }}>Laatste update: juni 2025</p>
            </Section>

          </div>

          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e5e5e5" }}>
            <Link href="/" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.85rem", color: "#666", textDecoration: "none" }}>
              ← Terug naar de homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 600, color: "#111", marginBottom: "0.6rem" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function CookieRow({ name, always, examples, purpose }: { name: string; always: boolean; examples: string; purpose: string }) {
  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: "12px", padding: "1.25rem", marginBottom: "0.75rem", backgroundColor: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
        <span style={{ fontWeight: 600, color: B }}>{name}</span>
        {always ? (
          <span style={{ fontSize: "0.7rem", backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "999px", padding: "0.1rem 0.5rem", fontWeight: 600 }}>
            Altijd actief
          </span>
        ) : (
          <span style={{ fontSize: "0.7rem", backgroundColor: "#fefce8", color: "#ca8a04", border: "1px solid #fde68a", borderRadius: "999px", padding: "0.1rem 0.5rem", fontWeight: 600 }}>
            Optioneel
          </span>
        )}
      </div>
      <p style={{ fontSize: "0.82rem", color: "#666", marginBottom: "0.25rem" }}><strong>Voorbeelden:</strong> {examples}</p>
      <p style={{ fontSize: "0.82rem", color: "#666" }}><strong>Doel:</strong> {purpose}</p>
    </div>
  );
}
