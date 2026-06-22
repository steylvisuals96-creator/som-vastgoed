"use client";

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import type { Property, TeamMember, SiteSettings, Project, Office } from "@/sanity/queries";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// SVG icon maps — replaces emoji for professional look
const USP_ICONS: Record<string, React.ReactNode> = {
  "🏆": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  "📍": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  "🤝": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  "⚡": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  "📞": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  "✉️": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  "📍": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

// ── Default fallback values (used before Sanity is connected)
const D = {
  hero: {
    tagline: "Vastgoed in Hasselt & omgeving",
    titleLine1: "Uw thuis vinden,",
    titleLine2Italic: "dat doen we samen.",
    subtitle: "Gevestigd makelaarskantoor met vestigingen in Hasselt en Genk. Persoonlijk begeleiding van A tot Z.",
    ctaPrimary: "Bekijk ons aanbod",
    ctaSecondary: "Gratis waardebepaling",
  },
  stats: [
    { value: "500+", label: "Panden verkocht" },
    { value: "3", label: "Vestigingen" },
    { value: "15+", label: "Jaar ervaring" },
    { value: "98%", label: "Tevreden klanten" },
  ],
  boldCta: {
    topLabel: "Welkom bij SOM Vastgoed",
    titleLine1: "Onroerend goed kopen",
    titleLine2: "verkopen?",
    titleLine3: "Ons team staat klaar.",
    subtitle: "We begeleiden u van A tot Z met persoonlijk advies en expertise.",
  },
  usps: [
    { icon: "🏆", title: "Gevestigd kantoor", sub: "Al meer dan 15 jaar actief in Limburg" },
    { icon: "📍", title: "3 vestigingen", sub: "Hasselt, Hasselt Nieuwbouw & Genk" },
    { icon: "🤝", title: "Persoonlijk", sub: "Eén makelaar van A tot Z" },
    { icon: "⚡", title: "Snel resultaat", sub: "Gemiddeld 45 dagen verkoop" },
  ],
  about: {
    title: "Uw vertrouwde partner",
    titleItalic: "in Limburgs vastgoed",
    text1: "Met SOM Vastgoed kiest u voor een gevestigd professioneel kantoor met vestigingen in de provincie Limburg in Hasselt en Genk. Wij begeleiden u persoonlijk — van eerste bezichtiging tot sleuteloverdracht.",
    text2: "Eerlijk advies, transparante communicatie en maximaal resultaat. Geen verrassingen — wel een makelaar die voor u gaat.",
    yearsLabel: "15+",
    cta: "Gratis waardebepaling",
  },
  contact: {
    title: "Klaar om te starten?",
    titleYellow: "Wij ook.",
    subtitle: "Neem contact op voor een vrijblijvend gesprek of gratis waardebepaling. Wij antwoorden binnen 24 uur.",
    phoneHasselt: "+32 11 36 34 32",
    phoneGenk: "+32 89 69 15 15",
    email: "info@somvastgoed.be",
    address: "Het Dorlik 16, 3500 Hasselt",
  },
};

type Props = {
  properties: Property[];
  team: TeamMember[];
  settings: SiteSettings | null;
  projects: Project[];
};

// Nav is now handled by the shared SiteNav component

// ── MARQUEE BANNER ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "500+ panden verkocht",
  "15 jaar ervaring",
  "Hasselt",
  "Genk",
  "Nieuwbouw & Projecten",
  "Persoonlijke begeleiding",
  "Gratis waardebepaling",
  "Limburg",
];

function MarqueeBanner() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ backgroundColor: Y, overflow: "hidden", position: "relative", height: "44px" }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track h-full items-center flex">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-4 whitespace-nowrap px-6"
            style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: B }}>
            {item}
            <span style={{ color: "rgba(17,17,17,0.35)", fontSize: "0.6rem" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ s, stats, featuredImg }: { s: SiteSettings["hero"] | typeof D.hero; stats: typeof D.stats; featuredImg?: string }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh", backgroundColor: B }}>
      {/* Right side editorial photo — desktop only */}
      {featuredImg && (
        <div className="hidden xl:block absolute right-0 top-0 bottom-0 overflow-hidden" style={{ width: "42%" }}>
          <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, #111111 0%, rgba(17,17,17,0.5) 50%, rgba(17,17,17,0.2) 100%)" }} />
          <motion.img
            src={featuredImg}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </div>
      )}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(250,203,4,0.07) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-px h-2/3" style={{ background: "linear-gradient(to top, transparent, rgba(250,203,4,0.15))" }} />
      </div>

      <div className="relative flex flex-col justify-end" style={{ minHeight: "100svh", padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,8vh,6rem)" }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-8">
          <div className="h-px w-10" style={{ backgroundColor: Y }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>{s.tagline}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="text-white mb-8"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem,7vw,6.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", maxWidth: "820px" }}>
          {s.titleLine1}<br />
          <em style={{ fontStyle: "italic", color: Y }}>{s.titleLine2Italic}</em>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mb-10 text-base font-light leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px" }}>
          {s.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="flex items-center gap-4 flex-wrap">
          <motion.a href="#aanbod"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
            style={{ backgroundColor: Y, color: B }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {s.ctaPrimary}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </motion.a>
          <motion.a href="/schatting"
            className="text-sm font-light rounded-full px-8 py-4 border text-white"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
            whileHover={{ borderColor: Y, color: Y }} whileTap={{ scale: 0.97 }}>
            {s.ctaSecondary}
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          className="flex gap-10 mt-16 pt-10 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 400, color: Y, lineHeight: 1 }}>{value}</p>
              <p className="text-xs font-light mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── PROPERTY CARD ─────────────────────────────────────────────────────────────
export function PropertyCard({ p, i }: { p: Property; i: number }) {
  const href = p.slug ? `/aanbod/${p.slug}` : "#";
  return (
    <motion.article key={p._id} layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
      className="group bg-white overflow-hidden cursor-pointer relative"
      style={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.13)" }}
      onClick={() => window.location.href = href}>
      {/* Yellow accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"
        style={{ backgroundColor: Y }} />
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <motion.div className="absolute inset-0" whileHover={{ scale: 1.07 }} transition={{ duration: 0.7 }}>
          <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="(min-width: 1024px) 400px, 90vw" />
        </motion.div>
        {/* Gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
        <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: Y, color: B }}>{p.status}</div>
        <div className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>{p.type}</div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-2 gap-3">
          <div className="min-w-0">
            <p className="truncate" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 500, color: B, lineHeight: 1.2 }}>{p.title}</p>
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: M }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {p.location}
            </p>
          </div>
          <p className="shrink-0" style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.45rem", fontWeight: 600, color: B, letterSpacing: "-0.01em" }}>{p.price}</p>
        </div>
        <div className="flex items-center gap-5 mt-4 pt-4 text-xs font-light" style={{ color: M, borderTop: "1px solid #f0f0f0" }}>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9" /><path d="M2 11l10-9 10 9" /><path d="M9 22V12h6v10" /></svg>
            {p.beds} slpk
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
            {p.area} m²
          </span>
          <motion.a href={href} className="ml-auto text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
            style={{ color: B, backgroundColor: "transparent", border: "1px solid #e8e8e8" }}
            whileHover={{ backgroundColor: Y, borderColor: Y, color: B }}
            onClick={e => e.stopPropagation()}>
            Meer info
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

// ── LISTINGS (homepage — 8 recentste panden) ──────────────────────────────────
function Listings({ properties }: { properties: Property[] }) {
  return (
    <section id="aanbod" style={{ backgroundColor: G, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: Y }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Huidig aanbod</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B, lineHeight: 1.1 }}>
            Een greep uit ons<br /><em style={{ color: M, fontStyle: "italic" }}>huidig aanbod</em>
          </h2>
        </div>
        <motion.a href="/aanbod"
          className="text-xs font-medium flex items-center gap-2"
          style={{ color: M }}
          whileHover={{ color: B }}>
          Volledig aanbod bekijken
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </motion.a>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        <AnimatePresence mode="popLayout">
          {properties.map((p, i) => <PropertyCard key={p._id} p={p} i={i} />)}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-14 flex-wrap">
        <motion.a href="/aanbod?status=koop"
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
          style={{ backgroundColor: B, color: W }}
          whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Te koop bekijken
        </motion.a>
        <motion.a href="/aanbod?status=huur"
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4 border"
          style={{ borderColor: B, color: B, backgroundColor: "transparent" }}
          whileHover={{ backgroundColor: B, color: W }} whileTap={{ scale: 0.97 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Te huur bekijken
        </motion.a>
      </div>
    </section>
  );
}

// ── VISUAL STRIP (editorial photo break) ─────────────────────────────────────
function VisualStrip({ imgUrl }: { imgUrl?: string }) {
  return (
    <section className="relative overflow-hidden" style={{ height: "clamp(320px, 46vh, 480px)" }}>
      {imgUrl && (
        <img src={imgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {!imgUrl && <div className="absolute inset-0" style={{ backgroundColor: "#1a1a18" }} />}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.6) 50%, rgba(17,17,17,0.25) 100%)" }} />
      <div className="relative h-full flex flex-col justify-center" style={{ padding: "0 clamp(1.5rem,6vw,5rem)" }}>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: Y }}>
          Uw thuis. Ons vak.
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }} className="text-white mb-8 max-w-2xl"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.4rem,5.5vw,4.8rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Persoonlijke begeleiding,<br /><em style={{ color: Y }}>van A tot Z.</em>
        </motion.h2>
        <motion.a href="/schatting" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4 self-start"
          style={{ backgroundColor: Y, color: B }}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          Gratis waardebepaling
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </motion.a>
      </div>
    </section>
  );
}

// ── SCHATTING TEASER ──────────────────────────────────────────────────────────
function SchattingTeaser() {
  const steps = [
    { nr: "01", title: "Vul uw gegevens in", sub: "Adres, type woning en oppervlakte — 2 minuten werk." },
    { nr: "02", title: "Onze experts analyseren", sub: "Wij vergelijken met recente verkopen in de buurt." },
    { nr: "03", title: "Ontvang uw schatting", sub: "Een eerlijke marktwaarde, zonder verplichtingen." },
  ];
  return (
    <section style={{ backgroundColor: "#fafaf8", padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Koptekst */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: Y }}>
              Gratis &amp; vrijblijvend
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4.5vw,3.6rem)", fontWeight: 500, color: B, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Wat is uw woning<br /><em style={{ color: "#555", fontWeight: 300 }}>waard vandaag?</em>
            </motion.h2>
          </div>
          <motion.a
            href="/schatting"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4 self-start md:self-auto flex-shrink-0"
            style={{ backgroundColor: B, color: "#fff" }}
            whileHover={{ backgroundColor: Y, color: B }}
          >
            Start gratis schatting
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.a>
        </div>

        {/* Stappen */}
        <div className="grid gap-px" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", backgroundColor: "#e5e5e0" }}>
          {steps.map(({ nr, title, sub }, i) => (
            <motion.div
              key={nr}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              style={{ backgroundColor: "#fafaf8", padding: "clamp(1.75rem,4vw,2.5rem)" }}
            >
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", fontWeight: 300, color: Y, lineHeight: 1, marginBottom: "1rem" }}>{nr}</p>
              <p style={{ fontWeight: 600, fontSize: "1rem", color: B, marginBottom: "0.5rem" }}>{title}</p>
              <p style={{ fontSize: "0.875rem", color: "#666", lineHeight: 1.6 }}>{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── BOLD CTA ──────────────────────────────────────────────────────────────────
function BoldCta({ s }: { s: SiteSettings["boldCta"] | typeof D.boldCta }) {
  return (
    <section style={{ backgroundColor: B, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-16 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: Y }}>
            {s.topLabel}
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }} className="text-white"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            {s.titleLine1}<br />
            of <span style={{ color: Y }}>{s.titleLine2}</span><br />
            {s.titleLine3}
          </motion.h2>
        </div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }} className="flex flex-col gap-8">
          <p className="text-base font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.subtitle}</p>
          <div className="flex gap-4 flex-wrap">
            <motion.a href="#aanbod"
              className="text-sm font-semibold rounded-full px-7 py-3.5 inline-flex items-center gap-2"
              style={{ backgroundColor: Y, color: B }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Bekijk aanbod
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.a>
            <motion.a href="#contact"
              className="text-sm font-light rounded-full px-7 py-3.5 border text-white"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
              whileHover={{ borderColor: Y, color: Y }} whileTap={{ scale: 0.97 }}>
              Gratis waardebepaling
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── USP STRIP ─────────────────────────────────────────────────────────────────
function UspStrip({ usps }: { usps: typeof D.usps }) {
  return (
    <section style={{ backgroundColor: B, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {usps.map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="flex items-start gap-4 p-6 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(250,203,4,0.12)", color: Y }}>
              {USP_ICONS[item.icon] ?? item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-1">{item.title}</p>
              <p className="text-xs font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About({ s }: { s: SiteSettings["about"] | typeof D.about }) {
  return (
    <section id="over-ons" style={{ backgroundColor: W, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-20 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }} className="relative">
          <div className="relative overflow-hidden" style={{ borderRadius: "24px", aspectRatio: "4/5" }}>
            <Image
              src={(s as SiteSettings["about"]).imageUrl ?? "/som-listings/listing-5.jpg"}
              alt="SOM Vastgoed"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 500px, 90vw"
            />
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="absolute -bottom-8 -right-8 p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: Y, maxWidth: "200px" }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.8rem", fontWeight: 300, color: B, lineHeight: 1 }}>{s.yearsLabel}</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-wide" style={{ color: B }}>Jaar<br />ervaring</p>
          </motion.div>
        </motion.div>

        <div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Over ons</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }} className="mb-6"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B, lineHeight: 1.1 }}>
            {s.title}<br /><em style={{ color: M }}>{s.titleItalic}</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-sm leading-loose mb-6" style={{ color: M }}>{s.text1}</motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="text-sm leading-loose mb-10" style={{ color: M }}>{s.text2}</motion.p>
          <motion.a href="#contact"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
            style={{ backgroundColor: B, color: W }}
            whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
            {s.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

// ── OFFICES ───────────────────────────────────────────────────────────────────
const FALLBACK_OFFICES: Office[] = [
  { name: "Vastgoedkantoor Hasselt", address: "Het Dorlik 16, 3500 Hasselt", phone: "+32 11 36 34 32" },
  { name: "Nieuwbouwkantoor Hasselt", address: "Het Dorlik 16, 3500 Hasselt", phone: "+32 11 36 34 32" },
  { name: "Vastgoedkantoor Genk", address: "Europalaan 30, 3600 Genk", phone: "+32 89 69 15 15" },
];

function Offices({ offices }: { offices: Office[] }) {
  const list = offices.length > 0 ? offices : FALLBACK_OFFICES;
  return (
    <section id="kantoren" style={{ backgroundColor: W, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="inline-flex items-center gap-3 mb-5">
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Onze kantoren</span>
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B }}>
          Dichtbij u in<br /><em style={{ color: M }}>Limburg</em>
        </motion.h2>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", maxWidth: "1100px", margin: "0 auto" }}>
        {list.map((office, i) => (
          <motion.div key={office.name}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            whileHover={{ y: -6 }}
            className="overflow-hidden"
            style={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.07)", backgroundColor: W }}>
            {/* Photo or placeholder */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "#f0ede8", position: "relative" }}>
              {office.imageUrl ? (
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.7 }}>
                  <Image src={office.imageUrl} alt={office.name} fill className="object-cover" sizes="(min-width: 1024px) 400px, 90vw" />
                </motion.div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <p className="text-xs" style={{ color: "#ccc", letterSpacing: "0.06em" }}>Foto volgt</p>
                </div>
              )}
              <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: Y, color: B }}>
                {i === 1 ? "Nieuwbouw" : "Vastgoed"}
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: B, lineHeight: 1.2, marginBottom: "0.75rem" }}>
                {office.name}
              </h3>
              <div className="flex flex-col gap-2.5">
                <p className="text-xs flex items-center gap-2" style={{ color: M }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {office.address}
                </p>
                <p className="text-xs flex items-center gap-2" style={{ color: M }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <a href={`tel:${office.phone}`} className="hover:underline">{office.phone}</a>
                </p>
              </div>
              <div className="mt-5 pt-5" style={{ borderTop: "1px solid #f0f0f0" }}>
                <motion.a href="#contact"
                  className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: B }}
                  whileHover={{ color: "#b89000" }}>
                  Maak een afspraak
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function Team({ members }: { members: TeamMember[] }) {
  return (
    <section id="team" style={{ backgroundColor: G, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="inline-flex items-center gap-3 mb-5">
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Ons team</span>
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B }}>
          Mensen die voor u<br /><em style={{ color: M }}>het verschil maken</em>
        </motion.h2>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {members.map((m, i) => (
          <motion.div key={m._id}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            whileHover={{ y: -6 }} className="bg-white overflow-hidden group"
            style={{ borderRadius: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}>
                <Image src={m.photoUrl} alt={m.name} fill className="object-cover" sizes="(min-width: 1024px) 280px, 50vw" />
              </motion.div>
            </div>
            <div className="p-5">
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.25rem", fontWeight: 500, color: B }}>{m.name}</p>
              <p className="text-xs font-light mt-1" style={{ color: M }}>{m.role}</p>
              <div className="mt-4 h-0.5 w-8 rounded-full" style={{ backgroundColor: Y }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact({ s }: { s: SiteSettings["contact"] | typeof D.contact }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await fetch("https://som-vastgoed-cms.vercel.app/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: fd.get("naam"),
          email: fd.get("email"),
          telefoon: fd.get("telefoon"),
          interesse: fd.get("interesse"),
          bericht: fd.get("bericht"),
        }),
      });
    } catch {}
    setSent(true);
    setLoading(false);
  }

  return (
    <section id="contact" style={{ backgroundColor: B, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-20 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ backgroundColor: Y }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>Contact</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.1 }}>
            {s.title}<br /><em style={{ color: Y }}>{s.titleYellow}</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm font-light leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "360px" }}>
            {s.subtitle}
          </motion.p>

          <div className="flex flex-col gap-5">
            {[
              { icon: "📞", label: "Hasselt", value: s.phoneHasselt },
              { icon: "📞", label: "Genk", value: s.phoneGenk },
              { icon: "✉️", label: "E-mail", value: s.email },
              { icon: "📍", label: "Adres", value: s.address },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(250,203,4,0.1)", color: Y }}>
                  {CONTACT_ICONS[c.icon as keyof typeof CONTACT_ICONS] ?? c.icon}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</p>
                  <p className="text-sm text-white">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center gap-5 py-20 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: Y }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 400, color: W }}>Bericht ontvangen!</h3>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>We nemen binnen 24 uur contact op.</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-8 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[["Naam", "text", "Jouw naam", "naam"], ["E-mail", "email", "jouw@email.be", "email"]].map(([label, type, ph, name]) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
                  <input type={type} name={name} placeholder={ph} required
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                    onFocus={e => (e.target.style.borderColor = Y)}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>Interesse</label>
              <select name="interesse" className="text-sm font-light outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: "rgba(255,255,255,0.6)", appearance: "none" }}>
                <option value="">Wat kan ik voor u doen?</option>
                <option>Woning kopen</option>
                <option>Woning verkopen</option>
                <option>Woning huren</option>
                <option>Gratis waardebepaling</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>Bericht</label>
              <textarea name="bericht" rows={4} placeholder="Vertel ons wat u zoekt..."
                className="text-sm font-light outline-none resize-none"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                onFocus={e => (e.target.style.borderColor = Y)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
            <motion.button type="submit" disabled={loading}
              className="text-sm font-semibold rounded-full py-4 mt-1 flex items-center justify-center gap-2"
              style={{ backgroundColor: Y, color: B, opacity: loading ? 0.7 : 1 }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
              {loading ? "Versturen..." : "Verstuur bericht"}
              {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}


// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SOMClient({ properties, team, settings, projects: _projects }: Props) {
  const hero = settings?.hero ?? D.hero;
  const stats = settings?.stats ?? D.stats;
  const boldCta = settings?.boldCta ?? D.boldCta;
  const usps = settings?.usps ?? D.usps;
  const contact = settings?.contact ?? D.contact;
  const offices = settings?.offices ?? [];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <SiteNav activePage="home" transparentAtTop />
      <Hero s={hero} stats={stats} featuredImg={properties[0]?.imageUrl} />
      <MarqueeBanner />
      <Listings properties={properties} />
      <VisualStrip imgUrl={properties[1]?.imageUrl} />
      <SchattingTeaser />
      <BoldCta s={boldCta} />
      <UspStrip usps={usps} />
      <Offices offices={offices} />
      {/* "Over ons" tijdelijk verborgen tot de about-tekst in Sanity is ingevuld.
          Heractiveren: <About s={settings?.about ?? D.about} /> */}
      <Team members={team} />
      <Contact s={contact} />
      <SiteFooter />
    </div>
  );
}

