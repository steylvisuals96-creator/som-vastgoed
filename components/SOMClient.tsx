"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import type { Property, TeamMember, SiteSettings } from "@/sanity/queries";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ── Default fallback values (used before Sanity is connected)
const D = {
  hero: {
    tagline: "Vastgoed in Hasselt & omgeving",
    titleLine1: "Uw thuis vinden,",
    titleLine2Italic: "dat doen we samen.",
    subtitle: "Gevestigd makelaarskantoor met vestigingen in Hasselt, Sint-Truiden en Genk. Persoonlijk begeleiding van A tot Z.",
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
    { icon: "📍", title: "3 vestigingen", sub: "Hasselt, Sint-Truiden & Genk" },
    { icon: "🤝", title: "Persoonlijk", sub: "Eén makelaar van A tot Z" },
    { icon: "⚡", title: "Snel resultaat", sub: "Gemiddeld 45 dagen verkoop" },
  ],
  about: {
    title: "Uw vertrouwde partner",
    titleItalic: "in Limburgs vastgoed",
    text1: "Met SOM Vastgoed kiest u voor een gevestigd professioneel kantoor met vestigingen in de provincie Limburg in Hasselt, Sint-Truiden en Genk. Wij begeleiden u persoonlijk — van eerste bezichtiging tot sleuteloverdracht.",
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
  isDraft?: boolean;
};

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(17,17,17,0)", "rgba(17,17,17,0.97)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20"
      style={{ backgroundColor: bg, backdropFilter: blur, paddingLeft: "clamp(1.5rem,5vw,4rem)", paddingRight: "clamp(1.5rem,5vw,4rem)" }}
    >
      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        SOM <span style={{ color: Y }}>Vastgoed</span>
      </span>

      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex">
        <span className="text-xs font-semibold px-4 py-1.5 rounded-full" style={{ backgroundColor: Y, color: B }}>
          ✦ DEMO — SteylVisuals
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Aanbod", "Over ons", "Team"].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
            className="text-sm font-light text-white/70 hover:text-white transition-colors">
            {l}
          </a>
        ))}
        <motion.a href="#contact"
          className="text-sm font-semibold px-6 py-2.5 rounded-full"
          style={{ backgroundColor: Y, color: B }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Contact
        </motion.a>
      </div>
    </motion.nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ s, stats }: { s: SiteSettings["hero"] | typeof D.hero; stats: typeof D.stats }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh", backgroundColor: B }}>
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
          <motion.a href="#contact"
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

// ── LISTINGS ─────────────────────────────────────────────────────────────────
function Listings({ properties }: { properties: Property[] }) {
  const [active, setActive] = useState("Alles");
  const filters = ["Alles", "Woning", "Appartement"];
  const shown = active === "Alles" ? properties : properties.filter(p => p.type.toLowerCase().includes(active.toLowerCase()));

  return (
    <section id="aanbod" style={{ backgroundColor: G, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: Y }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Actueel aanbod</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B, lineHeight: 1.1 }}>
            Panden in Limburg<br /><em style={{ color: M, fontStyle: "italic" }}>& omgeving</em>
          </h2>
        </div>
        <div className="flex gap-2 p-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.07)" }}>
          {filters.map(f => (
            <motion.button key={f} onClick={() => setActive(f)}
              className="text-xs font-medium px-5 py-2 rounded-full transition-colors"
              animate={{ backgroundColor: active === f ? B : "transparent", color: active === f ? W : M }}
              whileTap={{ scale: 0.96 }}>
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.article key={p._id} layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="group bg-white overflow-hidden cursor-pointer"
              style={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.13)" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <motion.img src={p.imageUrl} alt={p.title}
                  className="w-full h-full object-cover"
                  transition={{ duration: 0.7 }}
                  whileHover={{ scale: 1.07 }} />
                <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: Y, color: B }}>{p.status}</div>
                <div className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>{p.type}</div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 500, color: B, lineHeight: 1.2 }}>{p.title}</p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: M }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {p.location}
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: B }}>{p.price}</p>
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
                  <motion.span className="ml-auto text-xs font-semibold flex items-center gap-1" style={{ color: B }} whileHover={{ color: "#b89000" }}>
                    Meer info
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </motion.span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-14">
        <motion.a href="https://somvastgoed.be/nl/te-koop" target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
          style={{ backgroundColor: B, color: W }}
          whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
          Volledig aanbod bekijken
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </motion.a>
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: "rgba(250,203,4,0.12)" }}>
              {item.icon}
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
          <div className="overflow-hidden" style={{ borderRadius: "24px", aspectRatio: "4/5" }}>
            <img src="/som-listings/listing-5.jpg" alt="SOM Vastgoed" className="w-full h-full object-cover" />
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
            <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <motion.img src={m.photoUrl} alt={m.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
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
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: "rgba(250,203,4,0.1)" }}>{c.icon}</div>
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
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="flex flex-col gap-5 p-8 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[["Naam", "text", "Jouw naam"], ["E-mail", "email", "jouw@email.be"]].map(([label, type, ph]) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
                  <input type={type} placeholder={ph} required
                    className="text-sm font-light outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                    onFocus={e => (e.target.style.borderColor = Y)}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>Interesse</label>
              <select className="text-sm font-light outline-none"
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
              <textarea rows={4} placeholder="Vertel ons wat u zoekt..."
                className="text-sm font-light outline-none resize-none"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                onFocus={e => (e.target.style.borderColor = Y)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
            <motion.button type="submit"
              className="text-sm font-semibold rounded-full py-4 mt-1 flex items-center justify-center gap-2"
              style={{ backgroundColor: Y, color: B }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
              Verstuur bericht
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ contact }: { contact: typeof D.contact }) {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", padding: "2.5rem clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "0.9rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.9 }}>
          SOM <span style={{ color: Y }}>Vastgoed</span>
        </span>
        <div className="flex gap-8 text-xs font-light flex-wrap" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>{contact.address}</span>
          <span>{contact.phoneHasselt}</span>
          <span>{contact.email}</span>
        </div>
        <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
          Website door <span style={{ color: Y }}>SteylVisuals</span>
        </p>
      </div>
    </footer>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SOMClient({ properties, team, settings, isDraft }: Props) {
  const hero = settings?.hero ?? D.hero;
  const stats = settings?.stats ?? D.stats;
  const boldCta = settings?.boldCta ?? D.boldCta;
  const usps = settings?.usps ?? D.usps;
  const about = settings?.about ?? D.about;
  const contact = settings?.contact ?? D.contact;

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {/* Draft mode banner */}
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2 text-xs font-semibold"
          style={{ backgroundColor: "#0070f3", color: "#fff" }}>
          <span>✏️ Voorbeeldmodus — wijzigingen zijn nog niet gepubliceerd</span>
          <a href="/api/draft-mode/disable" className="underline opacity-80 hover:opacity-100">Sluiten</a>
        </div>
      )}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 pointer-events-none"
        style={{ backgroundColor: Y, color: B, boxShadow: `0 8px 30px rgba(250,203,4,0.4)` }}>
        ✦ Dit is een demo — gemaakt door SteylVisuals
      </div>
      <Nav />
      <Hero s={hero} stats={stats} />
      <Listings properties={properties} />
      <BoldCta s={boldCta} />
      <UspStrip usps={usps} />
      <About s={about} />
      <Team members={team} />
      <Contact s={contact} />
      <Footer contact={contact} />
    </div>
  );
}

