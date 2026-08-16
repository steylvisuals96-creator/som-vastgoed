"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { Property } from "@/lib/types";
import { PropertyCard } from "./SOMClient";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center" style={{ height: 600, backgroundColor: CREAM_DEEP }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border border-t-transparent animate-spin" style={{ borderColor: SEPIA_SOFT, borderTopColor: "transparent", borderRadius: "50%" }} />
        <p style={{ fontFamily: DISPLAY, fontSize: "0.8125rem", color: SEPIA_SOFT }}>Kaart laden…</p>
      </div>
    </div>
  ),
});

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      onClick={onRemove}
      className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 cursor-pointer transition-colors"
      style={{ fontFamily: DISPLAY, backgroundColor: SEPIA, color: CREAM, borderRadius: "2px" }}>
      {label}
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </motion.button>
  );
}

const ALL_TYPES = ["Alle types", "Woning", "Villa", "Appartement", "Penthouse", "Eengezinswoning", "Grond", "Garage", "Handelspand"];

function parsePrice(s: string): number | null {
  const cleaned = s.replace(/[€\s.]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function SelectField({ value, onChange, options, minWidth = "150px" }: {
  value: string; onChange: (v: string) => void; options: string[]; minWidth?: string;
}) {
  const active = value !== options[0];
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none text-sm cursor-pointer outline-none pl-3 pr-8 py-2 transition-colors"
        style={{
          fontFamily: DISPLAY,
          backgroundColor: active ? SEPIA : "transparent",
          color: active ? CREAM : SEPIA,
          border: `1px solid ${active ? SEPIA : LINE}`,
          borderRadius: "2px",
          minWidth,
        }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={active ? CREAM : SEPIA_SOFT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

function AanbodInner({ properties }: { properties: Property[] }) {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();

  const [gemeente, setGemeente]     = useState("Alle gemeenten");
  const [type, setType]             = useState("Alle types");
  const [activeStatus, setActiveStatus] = useState("Alles");
  const [minPrijs, setMinPrijs]     = useState("");
  const [maxPrijs, setMaxPrijs]     = useState("");
  const [sort, setSort]             = useState<"recent" | "prijs-asc" | "prijs-desc" | "gemeente">("recent");
  const [view, setView]             = useState<"list" | "map">("list");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredId, setHoveredId]   = useState<string | null>(null);
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
      if (price === null) return true;
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
    return 0;
  });

  const hasFilters = gemeente !== "Alle gemeenten" || type !== "Alle types" || minPrijs || maxPrijs || activeStatus !== "Alles";
  const inputStyle: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: "0.875rem",
    width: "110px",
    border: `1px solid ${LINE}`,
    borderRadius: "2px",
    backgroundColor: "transparent",
    color: SEPIA,
    padding: "0.5rem 0.75rem",
    outline: "none",
  };

  return (
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM }}>
      <SiteNav activePage="aanbod" />

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: SEPIA,
        padding: "clamp(7rem,14vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,7vh,5.5rem)",
      }}>
        <motion.h1
          initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            fontFamily: DISPLAY,
            fontSize: "clamp(2.5rem,5.5vw,4.75rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: CREAM,
            margin: 0,
          }}>
          Panden in Limburg,<br />
          <em style={{ fontStyle: "italic", color: Y }}>&amp; omgeving</em>
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: DISPLAY, fontSize: "0.875rem", color: "rgba(239,231,216,0.55)", marginTop: "1.25rem" }}>
          {properties.length} panden beschikbaar
        </motion.p>
      </section>

      {/* ── Filter bar ───────────────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: CREAM_DEEP,
        borderBottom: `1px solid ${LINE}`,
        position: "sticky",
        top: "72px",
        zIndex: 40,
      }}>
        {/* Main row */}
        <div style={{ padding: "0.875rem clamp(1.5rem,6vw,5rem)" }}>
          <div className="flex items-center gap-4 flex-wrap">

            {/* Gemeente */}
            <SelectField value={gemeente} onChange={setGemeente} options={gemeenten} minWidth="160px" />

            {/* Type */}
            <SelectField value={type} onChange={setType} options={types} minWidth="140px" />

            {/* Prijs */}
            <div className="flex items-center gap-2">
              <input
                type="text" placeholder="Min. prijs" value={minPrijs}
                onChange={e => setMinPrijs(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = SEPIA_SOFT; }}
                onBlur={e => { e.target.style.borderColor = LINE; }}
              />
              <span style={{ color: LINE, fontSize: "0.75rem" }}>—</span>
              <input
                type="text" placeholder="Max. prijs" value={maxPrijs}
                onChange={e => setMaxPrijs(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = SEPIA_SOFT; }}
                onBlur={e => { e.target.style.borderColor = LINE; }}
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-1" style={{ borderLeft: `1px solid ${LINE}`, paddingLeft: "1rem" }}>
              {statusFilters.map(s => (
                <button key={s} onClick={() => setActiveStatus(s)}
                  className="text-sm cursor-pointer transition-colors px-2 py-1"
                  style={{
                    fontFamily: DISPLAY,
                    color: activeStatus === s ? SEPIA : SEPIA_SOFT,
                    fontWeight: activeStatus === s ? 600 : 400,
                    borderBottom: activeStatus === s ? `1px solid ${SEPIA}` : "1px solid transparent",
                  }}>
                  {s}
                </button>
              ))}
            </div>

            {/* Reset */}
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => { setGemeente("Alle gemeenten"); setType("Alle types"); setMinPrijs(""); setMaxPrijs(""); setActiveStatus("Alles"); }}
                className="text-xs cursor-pointer transition-colors flex items-center gap-1.5"
                style={{ fontFamily: DISPLAY, color: SEPIA_SOFT, borderBottom: `1px solid ${LINE}`, paddingBottom: "1px" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Filters wissen
              </motion.button>
            )}

            <div className="flex-1 hidden md:block" />

            {/* Sort */}
            <div className="hidden md:flex items-center gap-3" style={{ borderRight: `1px solid ${LINE}`, paddingRight: "1rem" }}>
              {(["recent", "prijs-asc", "prijs-desc", "gemeente"] as const).map(s => {
                const labels = { recent: "Recent", "prijs-asc": "Prijs ↑", "prijs-desc": "Prijs ↓", gemeente: "Gemeente" };
                return (
                  <button key={s} onClick={() => setSort(s)}
                    className="text-xs cursor-pointer transition-colors"
                    style={{
                      fontFamily: DISPLAY,
                      color: sort === s ? SEPIA : SEPIA_SOFT,
                      fontWeight: sort === s ? 600 : 400,
                      borderBottom: sort === s ? `1px solid ${SEPIA}` : "1px solid transparent",
                      paddingBottom: "1px",
                    }}>
                    {labels[s]}
                  </button>
                );
              })}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-3">
              {([
                { id: "list", label: "Lijst", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
                { id: "map",  label: "Kaart", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg> },
              ] as const).map(({ id, label, icon }) => (
                <button key={id} onClick={() => setView(id)}
                  className="flex items-center gap-1.5 text-xs cursor-pointer transition-colors"
                  style={{
                    fontFamily: DISPLAY,
                    color: view === id ? SEPIA : SEPIA_SOFT,
                    fontWeight: view === id ? 600 : 400,
                    borderBottom: view === id ? `1px solid ${SEPIA}` : "1px solid transparent",
                    paddingBottom: "1px",
                  }}>
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div style={{ padding: "0 clamp(1.5rem,6vw,5rem) 0.75rem" }} className="flex gap-2 flex-wrap">
            <AnimatePresence>
              {gemeente !== "Alle gemeenten" && <FilterChip key="g" label={gemeente} onRemove={() => setGemeente("Alle gemeenten")} />}
              {type !== "Alle types" && <FilterChip key="t" label={type} onRemove={() => setType("Alle types")} />}
              {activeStatus !== "Alles" && <FilterChip key="s" label={activeStatus} onRemove={() => setActiveStatus("Alles")} />}
              {minPrijs && <FilterChip key="min" label={`Min. €${minPrijs}`} onRemove={() => setMinPrijs("")} />}
              {maxPrijs && <FilterChip key="max" label={`Max. €${maxPrijs}`} onRemove={() => setMaxPrijs("")} />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {view === "map" ? (
          <motion.div key="map"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: CREAM }}>
            <div className="flex" style={{ minHeight: "calc(100vh - 160px)" }}>
              {/* Map */}
              <div style={{ flex: 1, minWidth: 0, position: "sticky", top: "160px", height: "calc(100vh - 160px)", overflow: "hidden" }}>
                <PropertyMap
                  properties={shown}
                  onSelect={p => setSelectedProperty(p)}
                  hoveredId={hoveredId}
                />
              </div>

              {/* Sidebar */}
              <div style={{
                width: "340px", flexShrink: 0, overflowY: "auto",
                backgroundColor: CREAM, padding: "1.5rem",
                height: "calc(100vh - 160px)",
                borderLeft: `1px solid ${LINE}`,
              }}>
                <p style={{ fontFamily: DISPLAY, fontSize: "0.75rem", color: SEPIA_SOFT, marginBottom: "1rem" }}>
                  {shown.length} pand{shown.length !== 1 ? "en" : ""} op kaart
                </p>
                <div className="flex flex-col gap-3">
                  {shown.map((p, i) => {
                    const isSelected = selectedProperty?._id === p._id;
                    const href = p.slug ? `/aanbod/${p.slug}` : "#";
                    return (
                      <motion.a
                        key={p._id}
                        href={href}
                        ref={isSelected ? (selectedRef as React.RefObject<HTMLAnchorElement>) : null}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                        className="block overflow-hidden transition-colors"
                        style={{
                          backgroundColor: isSelected ? CREAM_DEEP : CREAM,
                          border: `1px solid ${isSelected || hoveredId === p._id ? Y : LINE}`,
                          borderRadius: "2px",
                          color: SEPIA,
                        }}
                        onMouseEnter={() => setHoveredId(p._id)}
                        onMouseLeave={() => setHoveredId(null)}>
                        {p.imageUrl && (
                          <div className="relative overflow-hidden" style={{ aspectRatio: "16/8" }}>
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" style={{ filter: "sepia(0.12)" }} />
                            <span className="absolute left-0 bottom-0 px-3 py-1"
                              style={{ backgroundColor: CREAM, color: SEPIA, fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: DISPLAY }}>
                              {p.status}
                            </span>
                          </div>
                        )}
                        <div style={{ padding: "0.875rem" }}>
                          <p style={{ fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 500, color: SEPIA, lineHeight: 1.2, marginBottom: "2px" }}>{p.title}</p>
                          <p style={{ fontFamily: DISPLAY, fontSize: "0.75rem", color: SEPIA_SOFT, marginBottom: "0.625rem" }}>{p.location}</p>
                          <div className="flex items-center justify-between">
                            <p style={{ fontFamily: DISPLAY, fontSize: "1rem", fontWeight: 500, color: SEPIA }}>{p.price}</p>
                            <div className="flex gap-3" style={{ fontFamily: DISPLAY, fontSize: "0.75rem", color: SEPIA_SOFT }}>
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
          </motion.div>
        ) : (
          <motion.section key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: CREAM, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
            {shown.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                <p style={{ fontFamily: DISPLAY, fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA_SOFT }}>
                  Geen panden gevonden
                </p>
                <p style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", color: SEPIA_SOFT, marginTop: "0.5rem" }}>
                  Pas de filters aan om meer resultaten te zien.
                </p>
              </motion.div>
            ) : (
              <>
                <p style={{ fontFamily: DISPLAY, fontSize: "0.75rem", color: SEPIA_SOFT, marginBottom: "2rem" }}>
                  {shown.length} pand{shown.length !== 1 ? "en" : ""} gevonden
                </p>
                <div className="grid gap-x-8 gap-y-14" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
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

export default function AanbodClient(props: { properties: Property[] }) {
  return (
    <Suspense fallback={null}>
      <AanbodInner {...props} />
    </Suspense>
  );
}
