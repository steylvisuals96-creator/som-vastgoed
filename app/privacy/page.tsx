import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid — SOM Vastgoed",
  description: "Lees het privacybeleid van SOM Vastgoed.",
};

const B = "#111111";
const Y = "#facb04";

export default function PrivacyPage() {
  return (
    <>
      <SiteNav activePage="" />
      <main style={{ backgroundColor: "#fafaf8", minHeight: "100vh", paddingTop: "6rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem" }}>

          <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: Y, fontWeight: 600, marginBottom: "1rem" }}>
            Juridisch
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, color: B, lineHeight: 1.15, marginBottom: "2.5rem" }}>
            Privacybeleid
          </h1>

          <div style={{ fontFamily: "var(--font-dm-sans)", color: "#333", lineHeight: 1.8, fontSize: "0.95rem" }}>

            <Section title="1. Wie zijn wij?">
              <p>SOM Vastgoed is een vastgoedkantoor gevestigd in Hasselt, België. Wij verwerken persoonsgegevens in het kader van onze dienstverlening als erkend vastgoedmakelaar.</p>
              <p style={{ marginTop: "0.75rem" }}>Contactgegevens: <a href="mailto:info@somvastgoed.be" style={{ color: Y }}>info@somvastgoed.be</a></p>
            </Section>

            <Section title="2. Welke gegevens verzamelen wij?">
              <p>Wij kunnen de volgende persoonsgegevens verwerken:</p>
              <ul style={{ paddingLeft: "1.25rem", marginTop: "0.5rem", listStyleType: "disc" }}>
                <li>Naam en contactgegevens (via contactformulieren of schatting-aanvragen)</li>
                <li>E-mailadres</li>
                <li>Telefoonnummer</li>
                <li>Informatie over uw vastgoedwensen</li>
                <li>Technische gegevens via cookies (zie Cookiebeleid)</li>
              </ul>
            </Section>

            <Section title="3. Waarom verwerken wij uw gegevens?">
              <ul style={{ paddingLeft: "1.25rem", listStyleType: "disc" }}>
                <li>Om uw aanvragen en vragen te beantwoorden</li>
                <li>Om een gratis waardebepaling te verstrekken</li>
                <li>Om u te informeren over passend vastgoedaanbod</li>
                <li>Om onze website te verbeteren via anonieme statistieken</li>
              </ul>
            </Section>

            <Section title="4. Hoe lang bewaren wij uw gegevens?">
              <p>Wij bewaren uw gegevens niet langer dan noodzakelijk. Gegevens uit contactformulieren worden maximaal 2 jaar bijgehouden, tenzij er een lopende samenwerking is.</p>
            </Section>

            <Section title="5. Uw rechten">
              <p>U heeft het recht op inzage, correctie, verwijdering en overdraagbaarheid van uw gegevens. U kunt uw toestemming op elk moment intrekken. Neem hiervoor contact op via <a href="mailto:info@somvastgoed.be" style={{ color: Y }}>info@somvastgoed.be</a>.</p>
              <p style={{ marginTop: "0.75rem" }}>U heeft ook het recht om klacht in te dienen bij de <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" style={{ color: Y }}>Gegevensbeschermingsautoriteit</a>.</p>
            </Section>

            <Section title="6. Cookies">
              <p>Wij gebruiken cookies voor noodzakelijke functies en anonieme analyse. Meer info vindt u in ons <Link href="/cookies" style={{ color: Y }}>Cookiebeleid</Link>.</p>
            </Section>

            <Section title="7. Wijzigingen">
              <p>Dit privacybeleid kan worden aangepast. De meest recente versie is altijd beschikbaar op deze pagina.</p>
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
