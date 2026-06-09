"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import type { Property } from "@/sanity/queries";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(17,17,17,0)", "rgba(17,17,17,0.97)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20"
      style={{ backgroundColor: bg, backdropFilter: blur, paddingLeft: "clamp(1.5rem,5vw,4rem)", paddingRight: "clamp(1.5rem,5vw,4rem)" }}>
      <a href="/" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        SOM <span style={{ color: Y }}>Vastgoed</span>
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="/aanbod" className="text-sm font-light text-white/70 hover:text-white transition-colors">Aanbod</a>
        <a href="/#over-ons" className="text-sm font-light text-white/70 hover:text-white transition-colors">Over ons</a>
        <a href="/#team" className="text-sm font-light text-white/70 hover:text-white transition-colors">Team</a>
        <motion.a href="/#contact" className="text-sm font-semibold px-6 py-2.5 rounded-full"
          style={{ backgroundColor: Y, color: B }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Contact
        </motion.a>
      </div>
    </motion.nav>
  );
}

export default function PropertyDetailClient({ property: p, isDraft }: { property: Property; isDraft?: boolean }) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const allPhotos = [p.imageUrl, ...(p.galleryUrls ?? [])].filter(Boolean);

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2 text-xs font-semibold"
          style={{ backgroundColor: "#0070f3", color: "#fff" }}>
          <span>✏️ Voorbeeldmodus</span>
          <a href="/api/draft-mode/disable" className="underline opacity-80 hover:opacity-100">Sluiten</a>
        </div>
      )}

      <Nav />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "70vh", minHeight: "480px" }}>
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

            {/* Description */}
            {p.description && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}>
                <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: M }}>Beschrijving</p>
                <p className="text-sm leading-loose whitespace-pre-line" style={{ color: "#555" }}>{p.description}</p>
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
                <motion.div key={i} className="overflow-hidden cursor-pointer"
                  style={{ borderRadius: "16px", aspectRatio: "4/3" }}
                  whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
                  onClick={() => setActivePhoto(url)}>
                  <img src={url} alt={`${p.title} foto ${i + 1}`} className="w-full h-full object-cover" />
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
