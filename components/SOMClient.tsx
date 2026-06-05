"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

const Y = "#facb04";      // yellow
const B = "#111111";      // near-black
const W = "#ffffff";
const G = "#f7f7f5";      // warm off-white
const M = "#888";         // muted

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const listings = [
  { id: 1, type: "Woning", title: "Uitzonderlijke woning", location: "Riemst", price: "€ 499.900", beds: 3, area: 184, image: "/som-listings/listing-1.jpg" },
  { id: 2, type: "Woning", title: "Gezinswoning", location: "Hasselt", price: "€ 497.500", beds: 4, area: 317, image: "/som-listings/listing-2.jpg" },
  { id: 3, type: "Appartement", title: "Appartement", location: "Hasselt", price: "€ 274.900", beds: 2, area: 90, image: "/som-listings/listing-3.jpg" },
  { id: 4, type: "Penthouse", title: "Penthouse", location: "Diest", price: "€ 419.000", beds: 2, area: 122, image: "/som-listings/listing-4.jpg" },
  { id: 5, type: "Eengezinswoning", title: "Eengezinswoning", location: "Genk", price: "€ 397.000", beds: 4, area: 173, image: "/som-listings/listing-5.jpg" },
  { id: 6, type: "Appartement", title: "Appartement", location: "Maasmechelen", price: "€ 349.000", beds: 2, area: 100, image: "/som-listings/listing-6.jpg" },
];

const team = [
  { name: "Tom Muermans", role: "Bestuurder", img: "https://somvastgoed.be/cms-assets/entities/people/4751fd89-f781-4b68-9daa-fc6f3c4160e1/photo?hash=2bcfb37b38087af62a41269c90d7e9bab1b7c34a14a0956f4f41e835787b76fca2a3ee1ed40f01af462428b464128503a51423ab4bf67144c6b760baf6196e66&v=C350x350" },
  { name: "Maxime Vanoppen", role: "Office Manager & Makelaar", img: "https://somvastgoed.be/cms-assets/entities/people/ed7b76c1-50b1-45cb-a9b2-cabe0b1be386/photo?hash=0666424198239e93a486275c41b1276dbde95a281f12012abe86f3ad57b2e5db94d79c6a2da8f5ba6fa2ddcb5fbeae161a9569e973531389ce83457033ab80f9&v=C350x350" },
  { name: "Larissa Fluder", role: "Vastgoedmakelaar", img: "https://somvastgoed.be/cms-assets/entities/people/f9424cb6-00ad-41a9-9e4a-94f9c8416154/photo?hash=6a735b756e8f754a66ded3e85dc67cba1f04644fb6216a8cceea68b486770a10cb4b3e3f788f094f4b0023aecd7f29532235113b03b896298548dcb58b7c54a3&v=C350x350" },
  { name: "Raf Zels", role: "Vastgoedmakelaar", img: "https://somvastgoed.be/cms-assets/entities/people/39779c66-4835-4476-9aeb-601d1994b9b7/photo?hash=4b8d60aba75936b237703b8f67de26391faed61d70b98afc7d152cd5fcc608a5ce95103f5d01e9d281a2f731e8b1cb9f5c9d19a24bc03879cb13a7a3b780cdb3&v=C350x350" },
  { name: "Kathleen Penders", role: "Vastgoedexpert", img: "https://somvastgoed.be/cms-assets/entities/people/84fccdbb-b496-4f1f-8d5f-f60e6102970b/photo?hash=c5f97c4e2506403845081ed015e134bbadde1468ae5fe3ea7e0eeb9394555129d3c04bb045af7f7a0a81de2c41802857ea4cff527221c504426eb5f26802650e&v=C350x350" },
  { name: "Chaniz Gielen", role: "Marketing Consultant", img: "https://somvastgoed.be/cms-assets/entities/people/f51962bd-8dfe-4c32-9ea9-96549649afc9/photo?hash=f86cbbb863d380a5d5de9f2af2e030f085b886b8c5778d37101f28e78c3b8c45be5064da37910f54cdf1c43e60d319ff274f31e138b8cba6c3bad2091641b04d&v=C350x350" },
];

/* ─── NAV ─── */
function Nav() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(17,17,17,0)", "rgba(17,17,17,0.97)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 border-b border-transparent"
      style={{ backgroundColor: bg, backdropFilter: blur, paddingLeft: "clamp(1.5rem,5vw,4rem)", paddingRight: "clamp(1.5rem,5vw,4rem)" }}
    >
      <Image src="/som-logo.png" alt="SOM Vastgoed" width={120} height={84} className="h-10 w-auto" />

      {/* Demo badge */}
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

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100svh", backgroundColor: B }}>
      {/* Clean geometric accent */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: "radial-gradient(ellipse at 80% 30%, rgba(250,203,4,0.07) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-px h-2/3" style={{ background: "linear-gradient(to top, transparent, rgba(250,203,4,0.15))" }} />
      </div>

      <div className="relative flex flex-col justify-end" style={{ minHeight: "100svh", padding: "0 clamp(1.5rem,6vw,5rem) clamp(3rem,8vh,6rem)" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-10" style={{ backgroundColor: Y }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>
            Vastgoed in Hasselt & omgeving
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="text-white mb-8"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3.5rem,7vw,6.5rem)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-0.02em", maxWidth: "820px" }}
        >
          Uw thuis vinden,<br />
          <em style={{ fontStyle: "italic", color: Y }}>dat doen we samen.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mb-10 text-base font-light leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", maxWidth: "480px" }}
        >
          Gevestigd makelaarskantoor met vestigingen in Hasselt, Sint-Truiden en Genk.
          Persoonlijk begeleiding van A tot Z.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="flex items-center gap-4 flex-wrap"
        >
          <motion.a href="#aanbod"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
            style={{ backgroundColor: Y, color: B }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Bekijk ons aanbod
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </motion.a>
          <motion.a href="#contact"
            className="text-sm font-light rounded-full px-8 py-4 border text-white"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
            whileHover={{ borderColor: Y, color: Y }} whileTap={{ scale: 0.97 }}>
            Gratis waardebepaling
          </motion.a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex gap-10 mt-16 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          {[["500+", "Panden verkocht"], ["3", "Vestigingen"], ["15+", "Jaar ervaring"], ["98%", "Tevreden klanten"]].map(([n, l]) => (
            <div key={l}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 400, color: Y, lineHeight: 1 }}>{n}</p>
              <p className="text-xs font-light mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{l}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── LISTINGS ─── */
function Listings() {
  const [active, setActive] = useState("Alles");
  const filters = ["Alles", "Woning", "Appartement"];
  const shown = active === "Alles" ? listings : listings.filter(l => l.type.toLowerCase().includes(active.toLowerCase()));

  return (
    <section id="aanbod" style={{ backgroundColor: G, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      {/* Header */}
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

      {/* Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="group bg-white overflow-hidden cursor-pointer"
              style={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.13)" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <motion.img src={p.image} alt={p.title}
                  className="w-full h-full object-cover"
                  transition={{ duration: 0.7 }}
                  whileHover={{ scale: 1.07 }} />
                {/* Status pill */}
                <div className="absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: Y, color: B }}>
                  Te koop
                </div>
                {/* Type pill */}
                <div className="absolute top-4 right-4 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(17,17,17,0.65)", color: W }}>
                  {p.type}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 500, color: B, lineHeight: 1.2 }}>{p.title}</p>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: M }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {p.location}
                    </p>
                  </div>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", fontWeight: 500, color: B }}>{p.price}</p>
                </div>

                <div className="flex items-center gap-5 mt-4 pt-4 text-xs font-light" style={{ color: M, borderTop: "1px solid #f0f0f0" }}>
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9"/><path d="M2 11l10-9 10 9"/><path d="M9 22V12h6v10"/></svg>
                    {p.beds} slpk
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    {p.area} m²
                  </span>
                  <motion.span
                    className="ml-auto text-xs font-semibold flex items-center gap-1"
                    style={{ color: B }}
                    whileHover={{ color: "#b89000" }}>
                    Meer info
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </motion.span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="text-center mt-14">
        <motion.a href="https://somvastgoed.be/nl/te-koop" target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
          style={{ backgroundColor: B, color: W }}
          whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
          Volledig aanbod bekijken
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </motion.a>
      </div>
    </section>
  );
}

/* ─── USP STRIP ─── */
function UspStrip() {
  const items = [
    { icon: "🏆", title: "Gevestigd kantoor", sub: "Al meer dan 15 jaar actief in Limburg" },
    { icon: "📍", title: "3 vestigingen", sub: "Hasselt, Sint-Truiden & Genk" },
    { icon: "🤝", title: "Persoonlijk", sub: "Eén makelaar van A tot Z" },
    { icon: "⚡", title: "Snel resultaat", sub: "Gemiddeld 45 dagen verkoop" },
  ];
  return (
    <section style={{ backgroundColor: B, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {items.map((item, i) => (
          <motion.div key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="flex items-start gap-4 p-6 rounded-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
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

/* ─── ABOUT ─── */
function About() {
  return (
    <section id="over-ons" style={{ backgroundColor: W, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-20 items-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="relative"
        >
          <div className="overflow-hidden" style={{ borderRadius: "24px", aspectRatio: "4/5" }}>
            <img src="/som-listings/listing-5.jpg" alt="SOM Vastgoed" className="w-full h-full object-cover" />
          </div>
          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="absolute -bottom-8 -right-8 p-6 rounded-2xl shadow-2xl"
            style={{ backgroundColor: Y, maxWidth: "200px" }}
          >
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.8rem", fontWeight: 300, color: B, lineHeight: 1 }}>15+</p>
            <p className="text-xs font-bold mt-1 uppercase tracking-wide" style={{ color: B }}>Jaar<br />ervaring</p>
          </motion.div>
        </motion.div>

        {/* Text side */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Over ons</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B, lineHeight: 1.1 }}
          >
            Uw vertrouwde partner<br /><em style={{ color: M }}>in Limburgs vastgoed</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-sm leading-loose mb-6"
            style={{ color: M }}
          >
            Met SOM Vastgoed kiest u voor een gevestigd professioneel kantoor met vestigingen in de provincie Limburg in Hasselt, Sint-Truiden en Genk. Wij begeleiden u persoonlijk — van eerste bezichtiging tot sleuteloverdracht.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="text-sm leading-loose mb-10"
            style={{ color: M }}
          >
            Eerlijk advies, transparante communicatie en maximaal resultaat. Geen verrassingen — wel een makelaar die voor u gaat.
          </motion.p>

          <motion.a
            href="#contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-8 py-4"
            style={{ backgroundColor: B, color: W }}
            whileHover={{ backgroundColor: Y, color: B }}
            whileTap={{ scale: 0.97 }}>
            Gratis waardebepaling
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

/* ─── TEAM ─── */
function Team() {
  return (
    <section id="team" style={{ backgroundColor: G, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 mb-5"
        >
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#b89000" }}>Ons team</span>
          <div className="h-px w-8" style={{ backgroundColor: "#b89000" }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: B }}
        >
          Mensen die voor u<br /><em style={{ color: M }}>het verschil maken</em>
        </motion.h2>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {team.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            whileHover={{ y: -6 }}
            className="bg-white overflow-hidden group"
            style={{ borderRadius: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <motion.img src={m.img} alt={m.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }} />
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

/* ─── CONTACT ─── */
function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" style={{ backgroundColor: B, padding: "clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-20 items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-px w-8" style={{ backgroundColor: Y }} />
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>Contact</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 text-white"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, lineHeight: 1.1 }}
          >
            Klaar om te starten?<br /><em style={{ color: Y }}>Wij ook.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-sm font-light leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: "360px" }}
          >
            Neem contact op voor een vrijblijvend gesprek of gratis waardebepaling. Wij antwoorden binnen 24 uur.
          </motion.p>

          {/* Contact details */}
          <div className="flex flex-col gap-5">
            {[
              { icon: "📞", label: "Hasselt", value: "+32 11 36 34 32" },
              { icon: "📞", label: "Genk", value: "+32 89 69 15 15" },
              { icon: "✉️", label: "E-mail", value: "info@somvastgoed.be" },
              { icon: "📍", label: "Adres", value: "Het Dorlik 16, 3500 Hasselt" },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: "rgba(250,203,4,0.1)" }}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</p>
                  <p className="text-sm text-white">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center gap-5 py-20 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: Y }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 400, color: W }}>Bericht ontvangen!</h3>
            <p className="text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>We nemen binnen 24 uur contact op.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="flex flex-col gap-5 p-8 rounded-3xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {[["Naam", "text", "Jouw naam"], ["E-mail", "email", "jouw@email.be"]].map(([label, type, ph]) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
                  <input type={type} placeholder={ph} required
                    className="text-sm font-light outline-none transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                    onFocus={e => (e.target.style.borderColor = Y)}
                    onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
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
                className="text-sm font-light outline-none resize-none transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.85rem 1rem", color: W }}
                onFocus={e => (e.target.style.borderColor = Y)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <motion.button type="submit"
              className="text-sm font-semibold rounded-full py-4 mt-1 flex items-center justify-center gap-2"
              style={{ backgroundColor: Y, color: B }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.97 }}>
              Verstuur bericht
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", padding: "2.5rem clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        <Image src="/som-logo.png" alt="SOM Vastgoed" width={100} height={70} className="h-9 w-auto opacity-90" />
        <div className="flex gap-8 text-xs font-light" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>Het Dorlik 16 — Hasselt</span>
          <span>+32 11 36 34 32</span>
          <span>info@somvastgoed.be</span>
        </div>
        <p className="text-xs font-light" style={{ color: "rgba(255,255,255,0.2)" }}>
          Website door <span style={{ color: Y }}>SteylVisuals</span>
        </p>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function SOMClient() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {/* Floating demo badge */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 pointer-events-none"
        style={{ backgroundColor: Y, color: B, boxShadow: `0 8px 30px rgba(250,203,4,0.4)` }}>
        ✦ Dit is een demo — gemaakt door SteylVisuals
      </div>
      <Nav />
      <Hero />
      <Listings />
      <UspStrip />
      <About />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
