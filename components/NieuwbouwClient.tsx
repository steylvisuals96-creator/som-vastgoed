"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATUS: Record<string, { bg: string; text: string }> = {
  "In verkoop":     { bg: Y,                       text: SEPIA },
  "Binnenkort":     { bg: "rgba(239,231,216,0.15)", text: CREAM },
  "In ontwikkeling":{ bg: "rgba(42,36,28,0.7)",    text: CREAM },
  "Uitverkocht":    { bg: CREAM_DEEP,              text: SEPIA_SOFT },
};

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const status = STATUS[p.status] ?? STATUS["In verkoop"];
  const href = p.slug ? `/nieuwbouw/${p.slug}` : "#";

  return (
    <motion.a href={href}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
      className="group block overflow-hidden"
      style={{ backgroundColor: CREAM, border: `1px solid ${LINE}`, borderRadius: "2px", color: SEPIA }}>

      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {p.imageUrl ? (
          <motion.div className="absolute inset-0" whileHover={{ scale: 1.04 }} transition={{ duration: 0.7 }}>
            <Image src={p.imageUrl} alt={p.name} fill className="object-cover"
              sizes="(min-width: 1024px) 400px, 90vw"
              style={{ filter: "sepia(0.1) saturate(1.05)" }} />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: CREAM_DEEP }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
        )}
        <span className="absolute left-0 bottom-0 px-3 py-1.5 text-xs font-semibold"
          style={{ backgroundColor: status.bg, color: status.text }}>{p.status}</span>
        {p.type && (
          <span className="absolute right-0 bottom-0 px-3 py-1.5 text-xs font-medium"
            style={{ backgroundColor: "rgba(42,36,28,0.7)", color: CREAM }}>{p.type}</span>
        )}
      </div>

      <div className="p-6">
        <h3 style={{ fontFamily: DISPLAY, fontSize: "1.4rem", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA, lineHeight: 1.2, marginBottom: "0.25rem" }}>
          {p.name}
        </h3>
        <p className="text-xs mt-1 flex items-center gap-1.5 mb-4" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {p.location}
        </p>

        <div className="flex gap-6 pt-4 mb-4" style={{ borderTop: `1px solid ${LINE}` }}>
          {p.units && (
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "1.25rem", fontWeight: 400, color: SEPIA }}>{p.units}</p>
              <p className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>units</p>
            </div>
          )}
          {p.priceFrom && (
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "1.25rem", fontWeight: 400, color: SEPIA }}>{p.priceFrom}</p>
              <p className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>vanaf</p>
            </div>
          )}
          {p.completionDate && (
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "1.25rem", fontWeight: 400, color: SEPIA }}>{p.completionDate}</p>
              <p className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>oplevering</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${LINE}` }}>
          {p.developer && <p className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>{p.developer}</p>}
          <span className="ml-auto text-xs font-medium px-3 py-1.5 transition-colors group-hover:opacity-70"
            style={{ fontFamily: DISPLAY, color: SEPIA, border: `1px solid ${LINE}`, borderRadius: "2px" }}>
            Meer info
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function NieuwbouwClient({ projects }: { projects: Project[] }) {
  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM }}>
      <SiteNav activePage="nieuwbouw" />

      {/* Header */}
      <section style={{
        backgroundColor: SEPIA,
        padding: "clamp(7rem,14vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,7vh,5.5rem)",
      }}>
        <motion.h1 initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5.5vw,4.75rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: CREAM, margin: 0 }}>
          Nieuwbouw<br /><em style={{ fontStyle: "italic", color: Y }}>&amp; Projecten</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-5 max-w-lg" style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", color: "rgba(239,231,216,0.5)" }}>
          Ontdek onze selectie van nieuwbouwprojecten in Limburg en omgeving. Van appartement tot villa — wij begeleiden u van A tot Z.
        </motion.p>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: CREAM, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <p style={{ fontFamily: DISPLAY, fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA_SOFT }}>
              Binnenkort nieuwe projecten
            </p>
            <p className="text-sm mt-3 mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
              Schrijf u in voor onze nieuwsbrief en ontvang als eerste info over nieuwe projecten.
            </p>
            <a href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 transition-opacity hover:opacity-80"
              style={{ fontFamily: DISPLAY, backgroundColor: SEPIA, color: CREAM, borderRadius: "2px" }}>
              Blijf op de hoogte
            </a>
          </motion.div>
        ) : (
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", maxWidth: "1400px", margin: "0 auto" }}>
            {projects.map((p, i) => <ProjectCard key={p._id} p={p} i={i} />)}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section style={{ backgroundColor: SEPIA, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-wrap" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.03em", color: CREAM, lineHeight: 1.1 }}>
              Wij begeleiden u<br /><em style={{ fontStyle: "italic", color: Y }}>van A tot Z.</em>
            </h2>
          </div>
          <a href="/schatting"
            className="text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            style={{ fontFamily: DISPLAY, backgroundColor: Y, color: SEPIA, borderRadius: "2px" }}>
            Gratis waardebepaling
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
