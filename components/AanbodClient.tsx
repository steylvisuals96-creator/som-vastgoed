"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { Property } from "@/sanity/queries";
import { PropertyCard } from "./SOMClient";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Leaflet is SSR-incompatible — load only on client
const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false, loading: () => (
  <div className="w-full flex items-center justify-center" style={{ height: 600, backgroundColor: "#f0ede8" }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: Y, borderTopColor: "transparent" }} />
      <p className="text-xs" style={{ color: M }}>Kaart laden…</p>
    </div>
  </div>
)});

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

// ── Inner component that reads searchParams (needs Suspense) ──────────────────
function AanbodInner({ properties, isDraft }: { properties: Property[]; isDraft?: boolean }) {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("Alles");
  const [activeStatus, setActiveStatus] = useState("Alles");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "koop") setActiveStatus("Te koop");
    else if (status === "huur") setActiveStatus("Te huur");
  }, [searchParams]);

  // Scroll to selected property card when pin clicked
  useEffect(() => {
    if (selectedProperty && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProperty]);

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

      {/* Filters + view toggle */}
      <section style={{ backgroundColor: W, padding: "1.25rem clamp(1.5rem,6vw,5rem)", borderBottom: "1px solid #f0f0f0", position: "sticky", top: "80px", zIndex: 40 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type filter */}
            <div className="flex gap-2 flex-wrap">
              {typeFilters.map(f => (
                <motion.button key={f} onClick={() => setActiveFilter(f)}
                  className="text-xs font-medium px-4 py-2 rounded-full border transition-colors cursor-pointer"
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

            {/* Divider */}
            <div className="h-5 w-px hidden md:block" style={{ backgroundColor: "#e0e0e0" }} />

            {/* Status filter */}
            <div className="flex gap-1 p-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
              {statusFilters.map(s => (
                <motion.button key={s} onClick={() => setActiveStatus(s)}
                  className="text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer"
                  animate={{ backgroundColor: activeStatus === s ? B : "transparent", color: activeStatus === s ? W : M }}
                  whileTap={{ scale: 0.96 }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* View toggle — list / map */}
          <div className="flex gap-1 p-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
            <motion.button onClick={() => setView("list")}
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer"
              animate={{ backgroundColor: view === "list" ? B : "transparent", color: view === "list" ? W : M }}
              whileTap={{ scale: 0.96 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Lijst
            </motion.button>
            <motion.button onClick={() => setView("map")}
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-full cursor-pointer"
              animate={{ backgroundColor: view === "map" ? B : "transparent", color: view === "map" ? W : M }}
              whileTap={{ scale: 0.96 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              Kaart
            </motion.button>
          </div>
        </div>
      </section>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === "map" ? (
          <motion.section key="map"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: G }}>
            {/* Map + sidebar layout */}
            <div className="flex" style={{ minHeight: "calc(100vh - 160px)" }}>
              {/* Map */}
              <div style={{ flex: 1, minWidth: 0, position: "sticky", top: "160px", height: "calc(100vh - 160px)", overflow: "hidden" }}>
                <PropertyMap
                  properties={shown}
                  onSelect={(p) => setSelectedProperty(p)}
                  hoveredId={hoveredId}
                />
              </div>

              {/* Sidebar — scrollable list */}
              <div style={{ width: "360px", flexShrink: 0, overflowY: "auto", backgroundColor: G, padding: "1.5rem", height: "calc(100vh - 160px)", borderLeft: "1px solid #e8e8e8" }}>
                <p className="text-xs font-medium mb-4" style={{ color: M }}>{shown.length} pand{shown.length !== 1 ? "en" : ""} op kaart</p>
                <div className="flex flex-col gap-4">
                  {shown.map((p, i) => {
                    const isSelected = selectedProperty?._id === p._id;
                    const href = p.slug ? `/aanbod/${p.slug}` : "#";
                    return (
                      <motion.a
                        key={p._id}
                        href={href}
                        ref={isSelected ? selectedRef : null}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                        className="block bg-white overflow-hidden cursor-pointer"
                        style={{
                          borderRadius: "16px",
                          boxShadow: isSelected || hoveredId === p._id
                            ? `0 0 0 2px ${Y}, 0 8px 24px rgba(0,0,0,0.1)`
                            : "0 2px 12px rgba(0,0,0,0.06)",
                          transition: "box-shadow 0.2s",
                        }}
                        onMouseEnter={() => setHoveredId(p._id)}
                        onMouseLeave={() => setHoveredId(null)}
                        whileHover={{ y: -2 }}>
                        {p.imageUrl && (
                          <div className="relative overflow-hidden" style={{ aspectRatio: "16/8" }}>
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: p.status.toLowerCase().includes("koop") ? Y : "#3b82f6", color: p.status.toLowerCase().includes("koop") ? B : W }}>
                              {p.status}
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontWeight: 500, color: B, lineHeight: 1.2, marginBottom: "2px" }}>{p.title}</p>
                          <p className="text-xs flex items-center gap-1 mb-3" style={{ color: M }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {p.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", fontWeight: 500, color: B }}>{p.price}</p>
                            <div className="flex gap-3 text-xs" style={{ color: M }}>
                              <span>{p.beds} slpk</span>
                              <span>{p.area} m²</span>
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: G, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
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
          </motion.section>
        )}
      </AnimatePresence>

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

// Wrap in Suspense for useSearchParams
export default function AanbodClient(props: { properties: Property[]; isDraft?: boolean }) {
  return (
    <Suspense fallback={null}>
      <AanbodInner {...props} />
    </Suspense>
  );
}
