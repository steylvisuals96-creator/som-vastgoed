"use client";

import { motion } from "framer-motion";
import type { Project } from "@/sanity/queries";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "In verkoop": { bg: Y, text: B },
  "Binnenkort": { bg: "rgba(255,255,255,0.15)", text: W },
  "In ontwikkeling": { bg: "rgba(17,17,17,0.7)", text: W },
  "Uitverkocht": { bg: "#e0e0e0", text: M },
};

// Nav handled by SiteNav

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const status = STATUS_COLORS[p.status] ?? STATUS_COLORS["In verkoop"];
  const href = p.slug ? `/nieuwbouw/${p.slug}` : "#";

  return (
    <motion.a href={href}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
      className="group block bg-white overflow-hidden cursor-pointer"
      style={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}
      whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.14)" }}>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {p.imageUrl ? (
          <motion.img src={p.imageUrl} alt={p.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }} transition={{ duration: 0.7 }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#e8e8e8" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: status.bg, color: status.text }}>{p.status}</div>
        {p.type && (
          <div className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>{p.type}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500, color: B, lineHeight: 1.2 }}>{p.name}</h3>
        <p className="text-xs mt-1 flex items-center gap-1.5 mb-4" style={{ color: M }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          {p.location}
        </p>

        <div className="flex gap-6 mb-4 pt-4" style={{ borderTop: "1px solid #f0f0f0" }}>
          {p.units && (
            <div>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 400, color: B }}>{p.units}</p>
              <p className="text-xs" style={{ color: M }}>units</p>
            </div>
          )}
          {p.priceFrom && (
            <div>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 400, color: B }}>{p.priceFrom}</p>
              <p className="text-xs" style={{ color: M }}>vanaf</p>
            </div>
          )}
          {p.completionDate && (
            <div>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.3rem", fontWeight: 400, color: B }}>{p.completionDate}</p>
              <p className="text-xs" style={{ color: M }}>oplevering</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {p.developer && <p className="text-xs font-light" style={{ color: M }}>{p.developer}</p>}
          <motion.span className="ml-auto text-xs font-semibold flex items-center gap-1" style={{ color: B }}
            whileHover={{ color: "#b89000" }}>
            Meer info
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </motion.span>
        </div>
      </div>
    </motion.a>
  );
}

export default function NieuwbouwClient({ projects, isDraft }: { projects: Project[]; isDraft?: boolean }) {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2 text-xs font-semibold"
          style={{ backgroundColor: "#0070f3", color: "#fff" }}>
          <span>✏️ Voorbeeldmodus</span>
          <a href="/api/draft-mode/disable" className="underline opacity-80">Sluiten</a>
        </div>
      )}

      <SiteNav activePage="nieuwbouw" />

      {/* Header */}
      <section style={{ backgroundColor: B, paddingTop: "clamp(8rem,15vh,11rem)", paddingBottom: "clamp(4rem,7vh,6rem)", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-6">
          <div className="h-px w-10" style={{ backgroundColor: Y }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>SOM Vastgoed</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="text-white"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Nieuwbouw<br />
          <em style={{ color: Y }}>& Projecten</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-sm font-light" style={{ color: "rgba(255,255,255,0.4)", maxWidth: "480px" }}>
          Ontdek onze selectie van nieuwbouwprojecten in Hasselt, Genk en omgeving. Van appartement tot villa — wij begeleiden u van A tot Z.
        </motion.p>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: G, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.5rem", fontWeight: 300, color: M }}>
              Binnenkort nieuwe projecten
            </p>
            <p className="text-sm mt-3 mb-8" style={{ color: M }}>Schrijf u in voor onze nieuwsbrief en ontvang als eerste info over nieuwe projecten.</p>
            <motion.a href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
              style={{ backgroundColor: B, color: W }}
              whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
              Blijf op de hoogte
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.a>
          </motion.div>
        ) : (
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", maxWidth: "1400px", margin: "0 auto" }}>
            {projects.map((p, i) => <ProjectCard key={p._id} p={p} i={i} />)}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section style={{ backgroundColor: B, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-wrap" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: Y }}>Interesse in nieuwbouw?</p>
            <h2 className="text-white" style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300 }}>
              Wij begeleiden u van A tot Z.
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap">
            <motion.a href="/#contact"
              className="text-sm font-semibold rounded-full px-7 py-3.5 inline-flex items-center gap-2"
              style={{ backgroundColor: Y, color: B }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Neem contact op
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
