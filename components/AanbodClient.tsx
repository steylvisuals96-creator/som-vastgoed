"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { Property } from "@/sanity/queries";
import { PropertyCard } from "./SOMClient";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

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

// Nav handled by SiteNav

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      onClick={onRemove}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer"
      style={{ backgroundColor: "#111", color: "#fff" }}
      whileHover={{ backgroundColor: "#333" }}
      whileTap={{ scale: 0.95 }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </motion.button>
  );
}

const ALL_TYPES = ["Alle types", "Woning", "Villa", "Appartement", "Penthouse", "Eengezinswoning", "Grond", "Garage", "Handelspand"];

// Parse "€ 419.000" → 419000, or null for "Prijs op aanvraag" etc.
function parsePrice(s: string): number | null {
  const cleaned = s.replace(/[€\s.]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

// ── Inner component that reads searchParams (needs Suspense) ──────────────────
function AanbodInner({ properties, isDraft }: { properties: Property[]; isDraft?: boolean }) {
  const searchParams = useSearchParams();

  // Filters
  const [gemeente, setGemeente] = useState("Alle gemeenten");
  const [type, setType] = useState("Alle types");
  const [activeStatus, setActiveStatus] = useState("Alles");
  const [minPrijs, setMinPrijs] = useState("");
  const [maxPrijs, setMaxPrijs] = useState("");
  const [sort, setSort] = useState<"recent" | "prijs-asc" | "prijs-desc" | "gemeente">("recent");

  const [view, setView] = useState<"list" | "map">("list");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "koop") setActiveStatus("Te koop");
    else if (status === "huur") setActiveStatus("Te huur");
  }, [searchParams]);

  useEffect(() => {
    if (selectedProperty && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProperty]);

  // Unique gemeenten from data
  const gemeenten = ["Alle gemeenten", ...Array.from(new Set(properties.map(p => p.location))).sort()];
  const types = ALL_TYPES.filter(t => t === "Alle types" || properties.some(p => p.type === t));
  const statusFilters = ["Alles", "Te koop", "Te huur"];

  const minVal = minPrijs ? parseFloat(minPrijs.replace(/\./g, "").replace(",", ".")) : null;
  const maxVal = maxPrijs ? parseFloat(maxPrijs.replace(/\./g, "").replace(",", ".")) : null;

  const filtered = properties.filter(p => {
    if (gemeente !== "Alle gemeenten" && p.location !== gemeente) return false;
    if (type !== "Alle types" && p.type !== type) return false;
    if (activeStatus !== "Alles" && !p.status.startsWith(activeStatus)) return false;
    if (minVal !== null || maxVal !== null) {
      const price = parsePrice(p.price ?? "");
      if (price === null) return true; // keep "Prijs op aanvraag"
      if (minVal !== null && price < minVal) return false;
      if (maxVal !== null && price > maxVal) return false;
    }
    return true;
  });

  const shown = [...filtered].sort((a, b) => {
    if (sort === "prijs-asc") {
      const pa = parsePrice(a.price ?? "") ?? Infinity;
      const pb = parsePrice(b.price ?? "") ?? Infinity;
      return pa - pb;
    }
    if (sort === "prijs-desc") {
      const pa = parsePrice(a.price ?? "") ?? -Infinity;
      const pb = parsePrice(b.price ?? "") ?? -Infinity;
      return pb - pa;
    }
    if (sort === "gemeente") return (a.location ?? "").localeCompare(b.location ?? "");
    return 0; // recent = server order
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

      <SiteNav activePage="aanbod" />

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

      {/* Filter bar */}
      <section style={{ backgroundColor: W, borderBottom: "1px solid #ebebeb", position: "sticky", top: "80px", zIndex: 40 }}>
        {/* Main filter row */}
        <div style={{ padding: "1rem clamp(1.5rem,6vw,5rem)" }}>
          <div className="flex items-center gap-3 flex-wrap">

            {/* Gemeente dropdown */}
            <div className="relative">
              <select
                value={gemeente}
                onChange={e => setGemeente(e.target.value)}
                className="appearance-none text-sm font-medium pr-8 pl-4 py-2.5 rounded-xl border cursor-pointer outline-none"
                style={{ backgroundColor: gemeente !== "Alle gemeenten" ? B : W, color: gemeente !== "Alle gemeenten" ? W : B, borderColor: gemeente !== "Alle gemeenten" ? B : "#e0e0e0", minWidth: "160px" }}>
                {gemeenten.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={gemeente !== "Alle gemeenten" ? W : M} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            {/* Type dropdown */}
            <div className="relative">
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="appearance-none text-sm font-medium pr-8 pl-4 py-2.5 rounded-xl border cursor-pointer outline-none"
                style={{ backgroundColor: type !== "Alle types" ? B : W, color: type !== "Alle types" ? W : B, borderColor: type !== "Alle types" ? B : "#e0e0e0", minWidth: "140px" }}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={type !== "Alle types" ? W : M} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            {/* Price range */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Min. prijs"
                value={minPrijs}
                onChange={e => setMinPrijs(e.target.value)}
                className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                style={{ width: "120px", borderColor: "#e0e0e0", color: B }}
              />
              <span className="text-xs" style={{ color: "#ccc" }}>—</span>
              <input
                type="text"
                placeholder="Max. prijs"
                value={maxPrijs}
                onChange={e => setMaxPrijs(e.target.value)}
                className="text-sm px-4 py-2.5 rounded-xl border outline-none"
                style={{ width: "120px", borderColor: "#e0e0e0", color: B }}
              />
            </div>

            {/* Status pills */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
              {statusFilters.map(s => (
                <motion.button key={s} onClick={() => setActiveStatus(s)}
                  className="text-xs font-medium px-4 py-2 rounded-lg cursor-pointer"
                  animate={{ backgroundColor: activeStatus === s ? B : "transparent", color: activeStatus === s ? W : M }}
                  whileTap={{ scale: 0.96 }}>
                  {s}
                </motion.button>
              ))}
            </div>

            {/* Reset — only shown when filters are active */}
            {(gemeente !== "Alle gemeenten" || type !== "Alle types" || minPrijs || maxPrijs || activeStatus !== "Alles") && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setGemeente("Alle gemeenten"); setType("Alle types"); setMinPrijs(""); setMaxPrijs(""); setActiveStatus("Alles"); }}
                className="text-xs font-medium px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors hover:bg-red-50"
                style={{ color: "#e53e3e", border: "1px solid #fed7d7" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Wissen
              </motion.button>
            )}

            {/* Spacer */}
            <div className="flex-1 hidden md:block" />

            {/* Sort */}
            <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: M }}>
              <span className="font-medium">Sortering:</span>
              {(["recent", "prijs-asc", "prijs-desc", "gemeente"] as const).map((s, i) => {
                const labels = { "recent": "Recent", "prijs-asc": "Prijs ↑", "prijs-desc": "Prijs ↓", "gemeente": "Gemeente" };
                return (
                  <button key={s} onClick={() => setSort(s)}
                    className="cursor-pointer transition-colors"
                    style={{ color: sort === s ? Y : M, fontWeight: sort === s ? 600 : 400 }}>
                    {labels[s]}{i < 3 ? <span style={{ color: "#ddd" }}> · </span> : null}
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
              <motion.button onClick={() => setView("list")}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg cursor-pointer"
                animate={{ backgroundColor: view === "list" ? B : "transparent", color: view === "list" ? W : M }}
                whileTap={{ scale: 0.96 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
                Lijst
              </motion.button>
              <motion.button onClick={() => setView("map")}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg cursor-pointer"
                animate={{ backgroundColor: view === "map" ? B : "transparent", color: view === "map" ? W : M }}
                whileTap={{ scale: 0.96 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
                </svg>
                Kaart
              </motion.button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(gemeente !== "Alle gemeenten" || type !== "Alle types" || minPrijs || maxPrijs || activeStatus !== "Alles") && (
          <div style={{ padding: "0 clamp(1.5rem,6vw,5rem) 0.75rem" }} className="flex gap-2 flex-wrap">
            {gemeente !== "Alle gemeenten" && (
              <FilterChip label={gemeente} onRemove={() => setGemeente("Alle gemeenten")} />
            )}
            {type !== "Alle types" && (
              <FilterChip label={type} onRemove={() => setType("Alle types")} />
            )}
            {activeStatus !== "Alles" && (
              <FilterChip label={activeStatus} onRemove={() => setActiveStatus("Alles")} />
            )}
            {minPrijs && (
              <FilterChip label={`Min. €${minPrijs}`} onRemove={() => setMinPrijs("")} />
            )}
            {maxPrijs && (
              <FilterChip label={`Max. €${maxPrijs}`} onRemove={() => setMaxPrijs("")} />
            )}
          </div>
        )}
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

      <SiteFooter />
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
