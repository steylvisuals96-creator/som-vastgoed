import React from "react";

const Y = "#facb04";
const B = "#111111";

const steps = [
  {
    nr: "1",
    title: "Pand toevoegen",
    desc: "Klik op 'Panden' → '+ Nieuw document' → vul de velden in → klik 'Publish'.",
    icon: "🏠",
  },
  {
    nr: "2",
    title: "Tekst op de website wijzigen",
    desc: "Klik op 'Website Instellingen' → pas de tekst aan → klik 'Publish'. De website update automatisch.",
    icon: "✏️",
  },
  {
    nr: "3",
    title: "Foto's uploaden",
    desc: "Klik op 'Media' in de navigatie bovenaan. Alle foto's staan hier verzameld.",
    icon: "🖼️",
  },
  {
    nr: "4",
    title: "Nieuwbouwproject toevoegen",
    desc: "Klik op 'Nieuwbouw & Projecten' → '+ Nieuw document' → vul in → 'Publish'.",
    icon: "🏗️",
  },
];

const tips = [
  { icon: "📝", text: "Wijzigingen zijn pas zichtbaar op de website na het klikken op 'Publish'." },
  { icon: "👁️", text: "Wil je eerst bekijken hoe het eruitziet? Klik op 'Preview' voor je publiceert." },
  { icon: "↩️", text: "Fout gemaakt? Klik op het ... menu rechtsbovenaan → 'Discard changes'." },
  { icon: "🔴", text: "Pand verkocht? Verander de status naar 'Verkocht' — het pand verdwijnt van het actieve aanbod." },
  { icon: "⭐", text: "Zet 'Uitgelicht op homepage' aan voor panden die je op de homepage wil tonen." },
  { icon: "🔢", text: "Volgorde op de homepage: lagere nummers verschijnen eerst. Pand 1 staat bovenaan." },
];

export default function WelcomeDashboard() {
  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, sans-serif",
      maxWidth: "900px",
      margin: "0 auto",
      padding: "clamp(1.5rem, 4vw, 3rem)",
      color: "#1a1a1a",
    }}>

      {/* Header */}
      <div style={{
        backgroundColor: B,
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "200px", height: "200px",
          background: `radial-gradient(circle, ${Y}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            backgroundColor: Y, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>🏡</div>
          <div>
            <p style={{ color: Y, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
              SOM Vastgoed CMS
            </p>
          </div>
        </div>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, margin: "0 0 0.5rem" }}>
          Welkom! 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", margin: 0, maxWidth: "500px", lineHeight: 1.6 }}>
          Dit is het beheerpaneel van de SOM Vastgoed website. Van hieruit kan je alles aanpassen — panden, teksten, foto's en meer.
        </p>
      </div>

      {/* Snel starten */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: B, marginBottom: "1rem", marginTop: 0 }}>
        Wat wil je doen?
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0.75rem",
        marginBottom: "2rem",
      }}>
        {steps.map(s => (
          <div key={s.nr} style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: "12px",
            padding: "1.25rem",
          }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: B, margin: "0 0 0.4rem" }}>{s.title}</p>
            <p style={{ fontSize: "0.8rem", color: "#666", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Navigatie uitleg */}
      <div style={{
        backgroundColor: "#fffbea",
        border: `1px solid ${Y}55`,
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: B, margin: "0 0 1rem" }}>
          📌 Navigatie — wat staat waar?
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
          {[
            { label: "🏠 Panden", desc: "Alle woningen en appartementen te koop/huur" },
            { label: "🏗️ Nieuwbouw & Projecten", desc: "Nieuwbouwprojecten en grotere projecten" },
            { label: "👥 Team", desc: "Medewerkers die op de teampagina verschijnen" },
            { label: "⚙️ Website Instellingen", desc: "Teksten op de homepage: titel, contact, kantoren..." },
            { label: "🖼️ Media (bovenaan)", desc: "Alle geüploade foto's overzichtelijk per map" },
          ].map(item => (
            <div key={item.label}>
              <p style={{ fontWeight: 600, fontSize: "0.82rem", color: B, margin: "0 0 0.2rem" }}>{item.label}</p>
              <p style={{ fontSize: "0.78rem", color: "#666", margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: B, marginBottom: "1rem", marginTop: 0 }}>
        💡 Handige tips
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.6rem" }}>
        {tips.map((tip, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: "0.6rem",
            backgroundColor: "#f8f8f6",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
          }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>{tip.icon}</span>
            <p style={{ fontSize: "0.8rem", color: "#444", margin: 0, lineHeight: 1.5 }}>{tip.text}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e8e8e4",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <p style={{ fontSize: "0.78rem", color: "#aaa", margin: 0 }}>
          SOM Vastgoed CMS — gebouwd door SteylVisuals
        </p>
        <a href="mailto:steylvisuals96@gmail.com" style={{ fontSize: "0.78rem", color: Y, textDecoration: "none", fontWeight: 600 }}>
          Hulp nodig? Stuur een mail →
        </a>
      </div>
    </div>
  );
}
