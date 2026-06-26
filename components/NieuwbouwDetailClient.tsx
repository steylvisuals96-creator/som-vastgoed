"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/types";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import PortableText from "./PortableText";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "In verkoop":     { bg: Y,                          text: B },
  "Binnenkort":     { bg: "rgba(255,255,255,0.15)",   text: W },
  "In ontwikkeling":{ bg: "rgba(17,17,17,0.7)",       text: W },
  "Uitverkocht":    { bg: "#e0e0e0",                  text: M },
};

/* ── Lightbox ───────────────────────────────────────────────────────────────── */
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer z-10"
        style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={W} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </>
      )}

      {/* Image */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative"
        style={{ maxWidth: "90vw", maxHeight: "85vh", width: "1200px", aspectRatio: "16/10" }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={images[idx]}
          alt={`Foto ${idx + 1}`}
          fill
          className="object-contain"
          sizes="90vw"
        />
      </motion.div>

      {/* Counter */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium"
        style={{ color: "rgba(255,255,255,0.4)" }}>
        {idx + 1} / {images.length}
      </p>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function NieuwbouwDetailClient({ project: p }: { project: Project }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const status = STATUS_COLORS[p.status] ?? STATUS_COLORS["In verkoop"];
  const allImages = [p.imageUrl, ...(p.galleryUrls ?? [])].filter(Boolean) as string[];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <SiteNav activePage="nieuwbouw" />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "80vh", backgroundColor: B }}>
        {/* Background image */}
        {p.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={p.imageUrl}
              alt={p.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,17,17,0.92) 40%, rgba(17,17,17,0.45) 100%)" }} />
          </div>
        )}

        {/* Back button */}
        <div className="relative z-10" style={{ paddingTop: "clamp(6rem,12vh,9rem)", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
          <motion.a
            href="/nieuwbouw"
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-medium mb-10 cursor-pointer"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => (e.currentTarget.style.color = W)}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Terug naar nieuwbouw
          </motion.a>

          {/* Status + type */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: status.bg, color: status.text }}>{p.status}</span>
            {p.type && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>{p.type}</span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", maxWidth: "780px" }}>
            {p.name}
          </motion.h1>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-2 mt-4 pb-16"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {p.location}
          </motion.p>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: Y }}>
        <div
          className="flex flex-wrap gap-0"
          style={{ maxWidth: "1400px", margin: "0 auto", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
          {[
            p.units       && { label: "Units",      value: String(p.units) },
            p.priceFrom   && { label: "Vanaf",       value: p.priceFrom },
            p.completionDate && { label: "Oplevering", value: p.completionDate },
            p.developer   && { label: "Ontwikkelaar", value: p.developer },
          ].filter(Boolean).map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col py-7 pr-10"
              style={{ borderRight: "1px solid rgba(17,17,17,0.12)" }}>
              <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 400, color: B, lineHeight: 1 }}>
                {(stat as { label: string; value: string }).value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1.5" style={{ color: "rgba(17,17,17,0.55)" }}>
                {(stat as { label: string; value: string }).label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── DESCRIPTION ───────────────────────────────────────────────────── */}
      {p.description && (
        <section style={{ backgroundColor: W, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
          <div className="grid gap-16 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Over dit project</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 300, color: B, lineHeight: 1.1 }}>
                {p.name}<br /><em style={{ color: M }}>in {p.location}</em>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-sm leading-loose"
              style={{ color: M }}>
              <PortableText value={p.description} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── GALLERY ───────────────────────────────────────────────────────── */}
      {allImages.length > 1 && (
        <section style={{ backgroundColor: G, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-3 mb-10">
              <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Fotogalerij</span>
            </motion.div>

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
              {allImages.map((url, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  onClick={() => setLightboxIdx(i)}
                  className="relative overflow-hidden cursor-pointer"
                  style={{ aspectRatio: i === 0 ? "16/9" : "4/3", borderRadius: "16px" }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Image
                    src={url}
                    alt={`${p.name} foto ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 450px, 90vw"
                  />
                  {/* hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: "rgba(17,17,17,0.35)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={W} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: B, padding: "clamp(4rem,8vh,6rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 flex-wrap"
          style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: Y }}>
              Interesse in {p.name}?
            </p>
            <h2 className="text-white"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300, lineHeight: 1.1 }}>
              Vrijblijvend meer informatie<br />
              <em style={{ color: Y }}>of een afspraak maken?</em>
            </h2>
          </div>
          <div className="flex gap-4 flex-wrap">
            <motion.a
              href="/#contact"
              className="text-sm font-semibold rounded-full px-7 py-3.5 inline-flex items-center gap-2"
              style={{ backgroundColor: Y, color: B }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Neem contact op
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </motion.a>
            <motion.a
              href="tel:+3211363432"
              className="text-sm font-light rounded-full px-7 py-3.5 border text-white inline-flex items-center gap-2"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
              whileHover={{ borderColor: Y, color: Y }} whileTap={{ scale: 0.97 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              011 36 34 32
            </motion.a>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={allImages}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
