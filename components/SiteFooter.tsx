"use client";

const Y = "#facb04";
const W = "#ffffff";

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", paddingTop: "3rem", paddingBottom: "2rem", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
      {/* Main footer row */}
      <div className="flex items-start justify-between flex-wrap gap-10 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>

        {/* Brand */}
        <div>
          <a href="/" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.95rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
            SOM <span style={{ color: Y }}>Vastgoed</span>
          </a>
          <p className="text-xs font-light mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.25)", maxWidth: "220px" }}>
            Uw vertrouwde vastgoedmakelaar in Limburg — persoonlijk van A tot Z.
          </p>
        </div>

        {/* Kantoren */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Kantoren</p>
          <div className="flex flex-col gap-3 text-xs font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
            <div>
              <p className="text-white/60 font-medium">Vastgoedkantoor Hasselt</p>
              <p>Het Dorlik 16, 3500 Hasselt</p>
              <a href="tel:+3211363432" className="hover:text-white transition-colors">+32 11 36 34 32</a>
              <span className="ml-2 opacity-50">· BTW BE 0640.980.651</span>
            </div>
            <div>
              <p className="text-white/60 font-medium">Vastgoedkantoor Genk</p>
              <p>Europalaan 30, 3600 Genk</p>
              <a href="tel:+3289691515" className="hover:text-white transition-colors">+32 89 69 15 15</a>
              <span className="ml-2 opacity-50">· BTW BE 0668.417.892</span>
            </div>
          </div>
        </div>

        {/* Navigatie */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Navigatie</p>
          <div className="flex flex-col gap-2">
            {[
              ["Aanbod", "/aanbod"],
              ["Nieuwbouw", "/nieuwbouw"],
              ["Over ons", "/#over-ons"],
              ["Team", "/#team"],
              ["Contact", "/#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="text-xs font-light hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Contact</p>
          <div className="flex flex-col gap-2 text-xs font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
            <a href="mailto:info@somvastgoed.be" className="hover:text-white transition-colors">info@somvastgoed.be</a>
            <a href="https://www.somvastgoed.be" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">www.somvastgoed.be</a>
          </div>
        </div>
      </div>

      {/* BIV compliance strip */}
      <div className="pt-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-light" style={{ color: "rgba(255,255,255,0.22)" }}>
          <span>
            <span style={{ color: "rgba(255,255,255,0.4)" }} className="font-medium">BIV-erkenningsnummers:</span>{" "}
            508035 · 514941 · 517687
          </span>
          <span>
            <span style={{ color: "rgba(255,255,255,0.4)" }} className="font-medium">Beroepsaansprakelijkheid & borgstelling:</span>{" "}
            NV AXA Belgium · Polisnr. 730.390.160
          </span>
          <span>
            <span style={{ color: "rgba(255,255,255,0.4)" }} className="font-medium">Toezicht:</span>{" "}
            BIV, Luxemburgstraat 16B, 1000 Brussel · Tel. 02 505 38 50 · <a href="https://www.biv.be" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50 transition-colors">www.biv.be</a>
          </span>
          <span>
            Erkend <a href="https://www.cib.be" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50 transition-colors">CIB</a>-lid · KB 27 september 2006
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.15)" }}>
            © {new Date().getFullYear()} SOM Vastgoed. Alle rechten voorbehouden.
          </p>
          <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.15)" }}>
            Website door <span style={{ color: Y }}>SteylVisuals</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
