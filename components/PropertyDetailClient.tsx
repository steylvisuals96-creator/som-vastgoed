"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Property } from "@/lib/types";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import PortableText from "./PortableText";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const EPC_COLORS: Record<string, { bg: string; text: string }> = {
  "A+": { bg: "#16a34a", text: "#fff" }, A: { bg: "#22c55e", text: "#fff" },
  B:  { bg: "#86efac", text: "#166534" }, C: { bg: "#fde68a", text: "#854d0e" },
  D:  { bg: "#fdba74", text: "#7c2d12" }, E: { bg: "#f97316", text: "#fff" },
  F:  { bg: "#ef4444", text: "#fff" },
};

export default function PropertyDetailClient({ property: p }: { property: Property }) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const allPhotos = [p.imageUrl, ...(p.galleryUrls ?? [])].filter(Boolean) as string[];

  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM }}>
      <SiteNav activePage="aanbod" transparentAtTop />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "78vh", minHeight: "520px" }}>
        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover"
          style={{ filter: "sepia(0.12) saturate(1.05)" }} />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(42,36,28,0.85) 0%, rgba(42,36,28,0.2) 55%, transparent 100%)" }} />

        {/* Back */}
        <motion.a href="/aanbod"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="absolute top-24 left-8 flex items-center gap-2 text-xs font-medium px-4 py-2 transition-colors"
          style={{ backgroundColor: "rgba(239,231,216,0.12)", color: CREAM, border: "1px solid rgba(239,231,216,0.2)", borderRadius: "2px" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(239,231,216,0.22)"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "rgba(239,231,216,0.12)"; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Terug naar aanbod
        </motion.a>

        {/* Badges */}
        <div className="absolute top-24 right-8 flex gap-2">
          <span className="text-xs font-semibold px-3 py-1.5"
            style={{ backgroundColor: Y, color: SEPIA, borderRadius: "2px" }}>{p.status}</span>
          <span className="text-xs font-medium px-3 py-1.5"
            style={{ backgroundColor: "rgba(42,36,28,0.7)", color: CREAM, borderRadius: "2px" }}>{p.type}</span>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: "0 clamp(1.5rem,6vw,5rem) 3rem" }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
            style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: CREAM, margin: 0 }}>
            {p.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center gap-1.5 mt-2"
            style={{ fontFamily: DISPLAY, fontSize: "0.875rem", color: "rgba(239,231,216,0.6)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {p.fullAddress ?? p.location}
          </motion.p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: CREAM, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="grid gap-16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Left */}
          <div>
            {/* Price */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
              className="mb-8 pb-8" style={{ borderBottom: `1px solid ${LINE}` }}>
              <p style={{ fontFamily: DISPLAY, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: SEPIA_SOFT, marginBottom: "0.5rem" }}>Vraagprijs</p>
              <p style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1 }}>{p.price}</p>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="grid grid-cols-3 mb-8 pb-8" style={{ borderBottom: `1px solid ${LINE}` }}>
              {[
                { label: "Slaapkamers", value: p.beds },
                { label: "Oppervlakte", value: p.area ? `${p.area} m²` : "—" },
                { label: "Type", value: p.type },
              ].map((item, i) => (
                <div key={item.label} className="flex flex-col gap-1 py-3"
                  style={{ borderRight: i < 2 ? `1px solid ${LINE}` : "none", paddingRight: i < 2 ? "1.5rem" : 0, paddingLeft: i > 0 ? "1.5rem" : 0 }}>
                  <p style={{ fontFamily: DISPLAY, fontSize: "1.5rem", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA, lineHeight: 1 }}>{item.value ?? "—"}</p>
                  <p style={{ fontFamily: DISPLAY, fontSize: "0.7rem", color: SEPIA_SOFT }}>{item.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Specs */}
            {(p.landArea || p.buildYear || p.condition || p.bebouwing || p.epc || p.epcLabel) && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mb-8 pb-8" style={{ borderBottom: `1px solid ${LINE}` }}>
                <p style={{ fontFamily: DISPLAY, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: SEPIA_SOFT, marginBottom: "1.25rem" }}>Specificaties</p>
                <div className="flex flex-col">
                  {[
                    p.landArea   && ["Perceel",   `${p.landArea} m²`],
                    p.buildYear  && ["Bouwjaar",  String(p.buildYear)],
                    p.bebouwing && p.bebouwing !== "-" && ["Bebouwing", p.bebouwing],
                    p.condition && p.condition !== "-" && ["Staat",     p.condition],
                  ].filter((x): x is [string, string] => !!x).map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between py-3"
                      style={{ borderBottom: `1px solid ${LINE}` }}>
                      <p style={{ fontFamily: DISPLAY, fontSize: "0.8125rem", color: SEPIA_SOFT }}>{k}</p>
                      <p style={{ fontFamily: DISPLAY, fontSize: "0.875rem", fontWeight: 500, color: SEPIA }}>{v}</p>
                    </div>
                  ))}
                  {(p.epc || p.epcLabel) && (
                    <div className="flex items-center justify-between py-3">
                      <p style={{ fontFamily: DISPLAY, fontSize: "0.8125rem", color: SEPIA_SOFT }}>EPC</p>
                      <div className="flex items-center gap-3">
                        {p.epcLabel && (
                          <span className="text-sm font-bold px-2.5 py-1"
                            style={{ backgroundColor: EPC_COLORS[p.epcLabel]?.bg ?? "#888", color: EPC_COLORS[p.epcLabel]?.text ?? "#fff", borderRadius: "2px" }}>
                            {p.epcLabel}
                          </span>
                        )}
                        {p.epc && <p style={{ fontFamily: DISPLAY, fontSize: "0.875rem", fontWeight: 500, color: SEPIA }}>{p.epc} kWh/m²/jaar</p>}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description */}
            {p.description && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
                <p style={{ fontFamily: DISPLAY, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: SEPIA_SOFT, marginBottom: "1rem" }}>Beschrijving</p>
                <div style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", lineHeight: 1.75, color: SEPIA_SOFT }}>
                  <PortableText value={p.description} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: contact */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="p-8 self-start"
            style={{ backgroundColor: SEPIA, position: "sticky", top: "100px", borderRadius: "2px" }}>
            <h3 style={{ fontFamily: DISPLAY, fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.15, color: CREAM, marginBottom: "1.5rem" }}>
              Interesse in<br /><em style={{ fontStyle: "italic", color: Y }}>dit pand?</em>
            </h3>
            <div className="flex flex-col gap-4 mb-6">
              {[
                { label: "Hasselt", value: "+32 11 36 34 32", href: "tel:+3211363432" },
                { label: "Genk",    value: "+32 89 69 15 15", href: "tel:+3289691515" },
                { label: "E-mail",  value: "info@somvastgoed.be", href: "mailto:info@somvastgoed.be" },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-start gap-3 text-sm transition-opacity hover:opacity-70"
                  style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.65)" }}>
                  <div>
                    <span className="block text-xs uppercase tracking-wider mb-0.5" style={{ color: "rgba(239,231,216,0.35)" }}>{c.label}</span>
                    {c.value}
                  </div>
                </a>
              ))}
            </div>
            <a href={`mailto:info@somvastgoed.be?subject=Interesse in ${p.title} — ${p.location}`}
              className="flex items-center justify-center text-sm font-semibold py-4 w-full transition-colors"
              style={{ backgroundColor: Y, color: SEPIA, borderRadius: "2px" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
              Stuur een bericht
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      {allPhotos.length > 1 && (
        <section style={{ backgroundColor: CREAM_DEEP, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: SEPIA_SOFT, marginBottom: "2rem" }}>
              Fotogalerij
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {allPhotos.map((url, i) => (
                <motion.div key={i} className="overflow-hidden cursor-pointer group relative"
                  style={{ borderRadius: "2px", aspectRatio: i === 0 ? "16/9" : "4/3", gridColumn: i === 0 ? "1 / -1" : undefined }}
                  whileHover={{ scale: 1.005 }} transition={{ duration: 0.35 }}
                  onClick={() => setActivePhoto(url)}>
                  <img src={url} alt={`${p.title} foto ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "sepia(0.1)" }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(239,231,216,0.15)", border: "1px solid rgba(239,231,216,0.3)", borderRadius: "2px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {activePhoto && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,8,6,0.95)" }}
          onClick={() => setActivePhoto(null)}>
          <motion.img src={activePhoto} alt="" initial={{ scale: 0.94 }} animate={{ scale: 1 }}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: "90vh", borderRadius: "2px" }} />
          <button className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: "rgba(239,231,216,0.1)", border: "1px solid rgba(239,231,216,0.2)", color: CREAM, borderRadius: "2px" }}
            onClick={() => setActivePhoto(null)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </motion.div>
      )}

      <SiteFooter />
    </div>
  );
}
