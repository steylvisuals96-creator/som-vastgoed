"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Property } from "@/sanity/queries";
import { PropertyCard } from "./SOMClient";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function AanbodNav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(17,17,17,0.95)", "rgba(17,17,17,0.97)"]);
  const blur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(20px)"]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20"
      style={{ backgroundColor: bg, backdropFilter: blur, paddingLeft: "clamp(1.5rem,5vw,4rem)", paddingRight: "clamp(1.5rem,5vw,4rem)" }}
    >
      <a href="/" style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1rem", fontWeight: 700, color: W, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        SOM <span style={{ color: Y }}>Vastgoed</span>
      </a>

      <div className="hidden md:flex items-center gap-8">
        <a href="/aanbod" className="text-sm font-semibold" style={{ color: Y }}>Aanbod</a>
        <a href="/nieuwbouw" className="text-sm font-light text-white/70 hover:text-white transition-colors">Nieuwbouw</a>
        <a href="/#over-ons" className="text-sm font-light text-white/70 hover:text-white transition-colors">Over ons</a>
        <a href="/#team" className="text-sm font-light text-white/70 hover:text-white transition-colors">Team</a>
        <motion.a href="/#contact"
          className="text-sm font-semibold px-6 py-2.5 rounded-full"
          style={{ backgroundColor: Y, color: B }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Contact
        </motion.a>
      </div>
    </motion.nav>
  );
}

const ALL_FILTERS = ["Alles", "Woning", "Villa", "Appartement", "Penthouse", "Eengezinswoning", "Grond"];

export default function AanbodClient({ properties, isDraft }: { properties: Property[]; isDraft?: boolean }) {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Alles");
  const [activeStatus, setActiveStatus] = useState("Alles");

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "koop") setActiveStatus("Te koop");
    else if (status === "huur") setActiveStatus("Te huur");
  }, [searchParams]);

  const typeFilters = ALL_FILTERS.filter(f => f === "Alles" || properties.some(p => p.type === f));
  const statusFilters = ["Alles", "Te koop", "Te huur"];

  const shown = properties.filter(p => {
    const typeMatch = activeFilter === "Alles" || p.type === activeFilter;
    const statusMatch = activeStatus === "Alles" || p.status.startsWith(activeStatus);
    return typeMatch && statusMatch;
  });

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-6 py-2 text-xs font-semibold"
          style={{ backgroundColor: "#0070f3", color: "#fff" }}>
          <span>✏️ Voorbeeldmodus</span>
          <a href="/api/draft-mode/disable" className="underline opacity-80 hover:opacity-100">Sluiten</a>
        </div>
      )}

      <AanbodNav />

      {/* Page header */}
      <section style={{ backgroundColor: B, paddingTop: "clamp(8rem,15vh,11rem)", paddingBottom: "clamp(4rem,7vh,6rem)", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-6">
          <div className="h-px w-10" style={{ backgroundColor: Y }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>Actueel aanbod</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="text-white"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(3rem,6vw,5.5rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Panden in Limburg<br />
          <em style={{ fontStyle: "italic", color: Y }}>& omgeving</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-sm font-light" style={{ color: "rgba(255,255,255,0.4)" }}>
          {properties.length} panden beschikbaar
        </motion.p>
      </section>

      {/* Filters */}
      <section style={{ backgroundColor: W, padding: "1.5rem clamp(1.5rem,6vw,5rem)", borderBottom: "1px solid #f0f0f0", position: "sticky", top: "80px", zIndex: 40 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            {typeFilters.map(f => (
              <motion.button key={f} onClick={() => setActiveFilter(f)}
                className="text-xs font-medium px-4 py-2 rounded-full border transition-colors"
                animate={{
                  backgroundColor: activeFilter === f ? B : "transparent",
                  color: activeFilter === f ? W : M,
                  borderColor: activeFilter === f ? B : "#e0e0e0",
                }}
                whileTap={{ scale: 0.96 }}>
                {f}
              </motion.button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-2 p-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
            {statusFilters.map(s => (
              <motion.button key={s} onClick={() => setActiveStatus(s)}
                className="text-xs font-medium px-4 py-1.5 rounded-full"
                animate={{ backgroundColor: activeStatus === s ? B : "transparent", color: activeStatus === s ? W : M }}
                whileTap={{ scale: 0.96 }}>
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: G, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        {shown.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 400, color: M }}>Geen panden gevonden</p>
            <p className="text-sm mt-2" style={{ color: M }}>Pas de filters aan om meer resultaten te zien.</p>
          </motion.div>
        ) : (
          <>
            <p className="text-xs font-medium mb-8" style={{ color: M }}>{shown.length} pand{shown.length !== 1 ? "en" : ""} gevonden</p>
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => <PropertyCard key={p._id} p={p} i={i} />)}
              </AnimatePresence>
            </div>
          </>
        )}
      </section>

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
