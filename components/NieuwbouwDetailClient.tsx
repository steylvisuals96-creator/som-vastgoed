"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
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

const STATUS: Record<string, { bg: string; text: string }> = {
  "In verkoop":     { bg: Y,                       text: SEPIA },
  "Binnenkort":     { bg: "rgba(239,231,216,0.15)", text: CREAM },
  "In ontwikkeling":{ bg: "rgba(42,36,28,0.7)",    text: CREAM },
  "Uitverkocht":    { bg: CREAM_DEEP,              text: SEPIA_SOFT },
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ backgroundColor: "rgba(10,8,6,0.96)" }}
      onClick={onClose}>
      <button className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center cursor-pointer z-10"
        style={{ backgroundColor: "rgba(239,231,216,0.1)", border: "1px solid rgba(239,231,216,0.2)", borderRadius: "2px" }}
        onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-pointer z-10"
            style={{ backgroundColor: "rgba(239,231,216,0.1)", border: "1px solid rgba(239,231,216,0.2)", borderRadius: "2px" }}
            onClick={e => { e.stopPropagation(); prev(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center cursor-pointer z-10"
            style={{ backgroundColor: "rgba(239,231,216,0.1)", border: "1px solid rgba(239,231,216,0.2)", borderRadius: "2px" }}
            onClick={e => { e.stopPropagation(); next(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}

      <motion.div key={idx}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative"
        style={{ maxWidth: "90vw", maxHeight: "85vh", width: "1200px", aspectRatio: "16/10" }}
        onClick={e => e.stopPropagation()}>
        <Image src={images[idx]} alt={`Foto ${idx + 1}`} fill className="object-contain" sizes="90vw" />
      </motion.div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs"
        style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.35)" }}>
        {idx + 1} / {images.length}
      </p>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function NieuwbouwDetailClient({ project: p }: { project: Project }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const status = STATUS[p.status] ?? STATUS["In verkoop"];
  const allImages = [p.imageUrl, ...(p.galleryUrls ?? [])].filter(Boolean) as string[];

  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM }}>
      <SiteNav activePage="nieuwbouw" />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "80vh", backgroundColor: SEPIA }}>
        {p.imageUrl && (
          <div className="absolute inset-0">
            <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="100vw" priority
              style={{ filter: "sepia(0.15) saturate(1.05)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(42,36,28,0.92) 40%, rgba(42,36,28,0.45) 100%)" }} />
          </div>
        )}

        <div className="relative z-10" style={{ paddingTop: "clamp(6rem,12vh,9rem)", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
          <motion.a href="/nieuwbouw"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-medium mb-10 cursor-pointer transition-opacity hover:opacity-70"
            style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.5)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Terug naar nieuwbouw
          </motion.a>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1.5"
              style={{ backgroundColor: status.bg, color: status.text, borderRadius: "2px" }}>{p.status}</span>
            {p.type && (
              <span className="text-xs font-medium px-3 py-1.5"
                style={{ backgroundColor: "rgba(42,36,28,0.7)", color: CREAM, borderRadius: "2px" }}>{p.type}</span>
            )}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5.5vw,4.75rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: CREAM, margin: 0, maxWidth: "780px" }}>
            {p.name}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-2 mt-4 pb-16"
            style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.5)", fontSize: "0.875rem" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {p.location}
          </motion.p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: Y }}>
        <div className="flex flex-wrap gap-0"
          style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
          {[
            p.units          && { label: "Units",        value: String(p.units) },
            p.priceFrom      && { label: "Vanaf",         value: p.priceFrom },
            p.completionDate && { label: "Oplevering",    value: p.completionDate },
            p.developer      && { label: "Ontwikkelaar",  value: p.developer },
          ].filter(Boolean).map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col py-7 pr-10"
              style={{ borderRight: `1px solid rgba(42,36,28,0.12)` }}>
              <span style={{ fontFamily: DISPLAY, fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA, lineHeight: 1 }}>
                {(stat as { label: string; value: string }).value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1.5" style={{ fontFamily: DISPLAY, color: "rgba(42,36,28,0.55)" }}>
                {(stat as { label: string; value: string }).label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Description ──────────────────────────────────────────────────────── */}
      {p.description && (
        <section style={{ backgroundColor: CREAM, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
          <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1 }}>
                {p.name}<br /><em style={{ fontStyle: "italic", color: SEPIA_SOFT }}>in {p.location}</em>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", lineHeight: 1.8, color: SEPIA_SOFT }}>
              <PortableText value={p.description} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────────────────────── */}
      {allImages.length > 1 && (
        <section style={{ backgroundColor: CREAM_DEEP, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: SEPIA_SOFT, marginBottom: "2rem" }}>
              Fotogalerij
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
              {allImages.map((url, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  onClick={() => setLightboxIdx(i)}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: i === 0 ? "16/9" : "4/3", borderRadius: "2px" }}
                  whileHover={{ scale: 1.005 }}>
                  <Image src={url} alt={`${p.name} foto ${i + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 450px, 90vw"
                    style={{ filter: "sepia(0.1)" }} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: "rgba(42,36,28,0.3)" }}>
                    <div className="w-10 h-10 flex items-center justify-center"
                      style={{ backgroundColor: "rgba(239,231,216,0.15)", border: "1px solid rgba(239,231,216,0.3)", borderRadius: "2px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: SEPIA, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-wrap" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1, color: CREAM }}>
              Vrijblijvend meer informatie<br />
              <em style={{ fontStyle: "italic", color: Y }}>of een afspraak maken?</em>
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap">
            <a href="/schatting"
              className="text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              style={{ fontFamily: DISPLAY, backgroundColor: Y, color: SEPIA, borderRadius: "2px" }}>
              Gratis waardebepaling
            </a>
            <a href="tel:+3211363432"
              className="text-sm px-7 py-3.5 border inline-flex items-center gap-2 transition-colors"
              style={{ fontFamily: DISPLAY, color: CREAM, borderColor: "rgba(239,231,216,0.25)", borderRadius: "2px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = Y; e.currentTarget.style.color = Y; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(239,231,216,0.25)"; e.currentTarget.style.color = CREAM; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              011 36 34 32
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox images={allImages} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
