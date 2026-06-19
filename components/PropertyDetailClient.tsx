"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import type { Property } from "@/sanity/queries";
import SiteNav from "./SiteNav";
import PortableText from "./PortableText";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function PropertyDetailClient({ property: p }: { property: Property }) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const allPhotos = [p.imageUrl, ...(p.galleryUrls ?? [])].filter(Boolean);

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <SiteNav activePage="aanbod" transparentAtTop />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "78vh", minHeight: "520px" }}>
        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.7) 0%, rgba(17,17,17,0.1) 60%, transparent 100%)" }} />

        {/* Back button */}
        <motion.a href="/aanbod" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="absolute top-24 left-8 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: W, border: "1px solid rgba(255,255,255,0.2)" }}
          whileHover={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Terug naar aanbod
        </motion.a>

        {/* Status & type badges */}
        <div className="absolute top-24 right-8 flex gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: Y, color: B }}>{p.status}</span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>{p.type}</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0" style={{ padding: "0 clamp(1.5rem,6vw,5rem) 2.5rem" }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}
            className="text-white mb-1"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 300, lineHeight: 1.05 }}>
            {p.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-1.5 text-sm font-light" style={{ color: "rgba(255,255,255,0.65)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {p.fullAddress ?? p.location}
          </motion.p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ backgroundColor: G, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="grid gap-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Left: details */}
          <div>
            {/* Price */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
              className="mb-8 pb-8" style={{ borderBottom: "1px solid #e8e8e8" }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: M }}>Vraagprijs</p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 400, color: B, lineHeight: 1 }}>{p.price}</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="grid grid-cols-3 gap-6 mb-8 pb-8" style={{ borderBottom: "1px solid #e8e8e8" }}>
              {[
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9" /><path d="M2 11l10-9 10 9" /><path d="M9 22V12h6v10" /></svg>, label: "Slaapkamers", value: p.beds },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>, label: "Oppervlakte", value: p.area ? `${p.area} m²` : "—" },
                { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, label: "Type", value: p.type },
              ].map(item => (
                <div key={item.label} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-white"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                  <div style={{ color: M }}>{item.icon}</div>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: B, lineHeight: 1 }}>{item.value ?? "—"}</p>
                  <p className="text-xs font-light" style={{ color: M }}>{item.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Specs grid */}
            {(p.landArea || p.buildYear || p.condition || p.bebouwing || p.epc || p.epcLabel) && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mb-8 pb-8" style={{ borderBottom: "1px solid #e8e8e8" }}>
                <p className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: M }}>Specificaties</p>
                <div className="grid grid-cols-2 gap-3">
                  {p.landArea && (
                    <div className="flex flex-col gap-0.5 p-4 rounded-2xl bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <p className="text-xs font-light" style={{ color: M }}>Perceel</p>
                      <p className="text-sm font-medium" style={{ color: B }}>{p.landArea} m²</p>
                    </div>
                  )}
                  {p.buildYear && (
                    <div className="flex flex-col gap-0.5 p-4 rounded-2xl bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <p className="text-xs font-light" style={{ color: M }}>Bouwjaar</p>
                      <p className="text-sm font-medium" style={{ color: B }}>{p.buildYear}</p>
                    </div>
                  )}
                  {p.bebouwing && p.bebouwing !== "-" && (
                    <div className="flex flex-col gap-0.5 p-4 rounded-2xl bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <p className="text-xs font-light" style={{ color: M }}>Bebouwing</p>
                      <p className="text-sm font-medium" style={{ color: B }}>{p.bebouwing}</p>
                    </div>
                  )}
                  {p.condition && p.condition !== "-" && (
                    <div className="flex flex-col gap-0.5 p-4 rounded-2xl bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <p className="text-xs font-light" style={{ color: M }}>Staat</p>
                      <p className="text-sm font-medium" style={{ color: B }}>{p.condition}</p>
                    </div>
                  )}
                  {(p.epc || p.epcLabel) && (
                    <div className="flex flex-col gap-0.5 p-4 rounded-2xl bg-white col-span-2" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
                      <p className="text-xs font-light" style={{ color: M }}>EPC</p>
                      <div className="flex items-center gap-3">
                        {p.epcLabel && (
                          <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{
                            backgroundColor: p.epcLabel === "A" ? "#22c55e" : p.epcLabel === "B" ? "#86efac" : p.epcLabel === "C" ? "#fde68a" : p.epcLabel === "D" ? "#fdba74" : p.epcLabel === "E" ? "#f97316" : "#ef4444",
                            color: ["A", "B"].includes(p.epcLabel ?? "") ? "#166534" : "#fff"
                          }}>{p.epcLabel}</span>
                        )}
                        {p.epc && <p className="text-sm font-medium" style={{ color: B }}>{p.epc} kWh/m²/jaar</p>}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Description */}
            {p.description && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
                <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: M }}>Beschrijving</p>
                <div className="text-sm" style={{ color: "#555" }}><PortableText value={p.description} /></div>
              </motion.div>
            )}
          </div>

          {/* Right: contact card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="p-8 rounded-3xl self-start"
            style={{ backgroundColor: B, position: "sticky", top: "100px" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: Y }}>Interesse in dit pand?</p>
            <h3 className="text-white mb-6" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 300, lineHeight: 1.2 }}>
              Neem contact op<br /><em style={{ color: Y }}>met ons team.</em>
            </h3>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { label: "Hasselt", value: "+32 11 36 34 32", href: "tel:+3211363432" },
                { label: "Genk", value: "+32 89 69 15 15", href: "tel:+3289691515" },
                { label: "E-mail", value: "info@somvastgoed.be", href: "mailto:info@somvastgoed.be" },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-3 text-sm font-light hover:opacity-80 transition-opacity"
                  style={{ color: "rgba(255,255,255,0.7)" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0"
                    style={{ backgroundColor: "rgba(250,203,4,0.1)", color: Y }}>
                    {c.label === "E-mail" ? "✉" : "☎"}
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide block" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</span>
                    {c.value}
                  </div>
                </a>
              ))}
            </div>
            <motion.a href={`mailto:info@somvastgoed.be?subject=Interesse in ${p.title} — ${p.location}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold rounded-full py-4 w-full"
              style={{ backgroundColor: Y, color: B }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
              Stuur een bericht
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Gallery */}
      {allPhotos.length > 1 && (
        <section style={{ backgroundColor: W, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#b89000" }}>Fotogalerij</p>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {allPhotos.map((url, i) => (
                <motion.div key={i} className="overflow-hidden cursor-pointer group relative"
                  style={{ borderRadius: "16px", aspectRatio: i === 0 ? "16/9" : "4/3", gridColumn: i === 0 ? "1 / -1" : undefined }}
                  whileHover={{ scale: 1.01 }} transition={{ duration: 0.35 }}
                  onClick={() => setActivePhoto(url)}>
                  <img src={url} alt={`${p.title} foto ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Lightbox */}
      {activePhoto && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setActivePhoto(null)}>
          <motion.img src={activePhoto} alt="" initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="max-w-full max-h-full object-contain rounded-2xl"
            style={{ maxHeight: "90vh" }} />
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: W }}
            onClick={() => setActivePhoto(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <footer style={{ backgroundColor: "#0a0a0a", padding: "2.5rem clamp(1.5rem,6vw,5rem)" }}>
        <div className="flex items-center justify-between flex-wrap gap-6">
          <a href="/" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
            SOM <span style={{ color: Y }}>Vastgoed</span>
          </a>
          <div className="flex gap-8 text-xs font-light flex-wrap" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span>Het Dorlik 16, 3500 Hasselt</span>
            <span>+32 11 36 34 32</span>
            <span>info@somvastgoed.be</span>
          </div>
          <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
            Website door <span style={{ color: Y }}>SteylVisuals</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
