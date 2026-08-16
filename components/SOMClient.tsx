"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Property, TeamMember, SiteSettings, Project, Office } from "@/lib/types";
import type { CMSTestimonial } from "@/lib/cms";
import SiteFooter from "./SiteFooter";
import SiteNav from "./SiteNav";

// ── PALET — richting "Gouden Uur", zie DESIGN.md ──────────────────────────────
const CREAM = "#EFE7D8";      // bg
const CREAM_DEEP = "#E6DCC8"; // tweede band, geeft ritme zonder wit
const SEPIA = "#2A241C";      // ink
const SEPIA_SOFT = "#6E5A3E"; // ink-soft
const LINE = "rgba(110,90,62,0.22)";
const Y = "#facb04";          // klantaccent — behouden
const B = "#111111";
const W = "#ffffff";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const DISPLAY = "var(--font-archivo), Archivo, sans-serif";
const HERO_IMG = "/som-hero/gouden-uur-villa.jpg";

// SVG icon maps — replaces emoji for professional look
const USP_ICONS: Record<string, React.ReactNode> = {
  "🏆": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  "📍": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  "🤝": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  "⚡": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
};

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  "📞": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  "✉️": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  "📍": (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

// ── Default fallback values (gebruikt tot het CMS gevuld is) ──────────────────
const D = {
  hero: {
    tagline: "Wij begeleiden u van A tot Z met persoonlijk advies en expertise.",
    titleLine1: "Vastgoed in Limburg,",
    titleLine2Italic: "gemiddeld 45 dagen.",
    subtitle: "Eén makelaar begeleidt u van eerste bezichtiging tot sleuteloverdracht — voor kopers én verkopers.",
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
    { icon: "📍", title: "3 vestigingen", sub: "Actief in heel Limburg" },
    { icon: "🤝", title: "Persoonlijk", sub: "Eén makelaar van A tot Z" },
    { icon: "⚡", title: "Snel resultaat", sub: "Gemiddeld 45 dagen verkoop" },
  ],
  about: {
    title: "Uw vertrouwde partner",
    titleItalic: "in Limburgs vastgoed",
    text1: "Met SOM Vastgoed kiest u voor een gevestigd professioneel kantoor actief in heel de provincie Limburg. Wij begeleiden u persoonlijk — van eerste bezichtiging tot sleuteloverdracht.",
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
  testimonials?: CMSTestimonial[];
};

// ── GEDEELDE BOUWSTENEN ───────────────────────────────────────────────────────

/** Het spierdunne wordmark. Eén bron voor zowel het intro-gordijn als de hero. */
function WordMark({ tone }: { tone: "sepia" | "light" }) {
  return (
    <span
      style={{
        fontFamily: DISPLAY,
        fontWeight: 100,
        lineHeight: 0.86,
        letterSpacing: "-0.02em",
        display: "block",
        textAlign: "center",
        whiteSpace: "nowrap",
        color: tone === "sepia" ? SEPIA : "rgba(255,246,225,0.92)",
      }}>
      <span className="hidden md:block" style={{ fontSize: "10.9vw" }}>SOM VASTGOED</span>
      <span className="block md:hidden" style={{ fontSize: "16.8vw", whiteSpace: "normal" }}>SOM<br />VASTGOED</span>
    </span>
  );
}

/** Sectie-index in de kantlijn — de case-study-structuur van de richting.
 *  Bewust géén kleine uppercase kicker boven elke titel. */
function SectionIndex({ nr }: { nr: string }) {
  return (
    <span aria-hidden style={{
      fontFamily: DISPLAY, fontWeight: 100, fontSize: "clamp(2.5rem,5vw,4.5rem)",
      lineHeight: 1, color: SEPIA_SOFT, opacity: 0.4, letterSpacing: "-0.03em",
    }}>{nr}</span>
  );
}

/** Kop die achter een masker vandaan komt. Één beweging, hergebruikt. */
function MaskedHeading({ children, delay = 0, color = SEPIA, size = "clamp(2rem,4.4vw,3.6rem)" }: {
  children: React.ReactNode; delay?: number; color?: string; size?: string;
}) {
  const reduce = useReducedMotion();
  // De trigger moet op de wrapper staan, niet op de kop zelf: de kop begint
  // 104% naar beneden geschoven en valt daardoor volledig buiten zijn eigen
  // overflow-masker — dan is het intersectie-rechthoek leeg en vuurt
  // whileInView nooit. De wrapper staat wel gewoon in beeld.
  return (
    <motion.div
      style={{ overflow: "hidden" }}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}>
      <motion.h2
        variants={{ hidden: { y: "104%" }, show: { y: 0 } }}
        transition={{ duration: 1, delay, ease: EASE }}
        style={{
          fontFamily: DISPLAY, fontSize: size, fontWeight: 400,
          letterSpacing: "-0.03em", lineHeight: 1.04, color, margin: 0,
        }}>
        {children}
      </motion.h2>
    </motion.div>
  );
}

/** Hoekige knop — geen pill, geen pijltje. */
function Button({ href, children, variant = "solid", onDark = false }: {
  href: string; children: React.ReactNode; variant?: "solid" | "outline"; onDark?: boolean;
}) {
  const solid = variant === "solid";
  const base = onDark ? CREAM : SEPIA;
  return (
    <a
      href={href}
      className="inline-flex items-center px-8 py-4 text-sm font-medium transition-colors duration-200"
      style={{
        borderRadius: "2px",
        backgroundColor: solid ? Y : "transparent",
        color: solid ? SEPIA : base,
        border: solid ? "1px solid transparent" : `1px solid ${onDark ? "rgba(239,231,216,0.35)" : "rgba(42,36,28,0.35)"}`,
      }}
      onMouseEnter={e => {
        if (solid) { e.currentTarget.style.backgroundColor = base; e.currentTarget.style.color = solid && onDark ? SEPIA : CREAM; }
        else { e.currentTarget.style.borderColor = base; }
      }}
      onMouseLeave={e => {
        if (solid) { e.currentTarget.style.backgroundColor = Y; e.currentTarget.style.color = SEPIA; }
        else { e.currentTarget.style.borderColor = onDark ? "rgba(239,231,216,0.35)" : "rgba(42,36,28,0.35)"; }
      }}
      onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${Y}`; }}
      onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}>
      {children}
    </a>
  );
}

// ── INTRO — gordijn dat opent ─────────────────────────────────────────────────
// Crème vlak met het wordmark; splitst horizontaal open en onthult de hero.
// Speelt één keer per sessie, en helemaal niet bij prefers-reduced-motion.
function IntroCurtain({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "play" | "skip">("idle");
  const [finished, setFinished] = useState(false);
  // React StrictMode draait effects in dev twee keer. Zonder deze guard zag de
  // tweede run de zojuist gezette sessievlag en sloeg de intro meteen over.
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    const seen = sessionStorage.getItem("som_intro_seen") === "1";
    if (seen || reduce) { setPhase("skip"); onDone(); return; }
    sessionStorage.setItem("som_intro_seen", "1");
    // Wachten tot Archivo geladen is: de intro is de eerste paint, dus zonder dit
    // staat het wordmark er even in de fallback-font — en juist het haarlijn-
    // gewicht is de hele zet. Het gordijn dekt de wachttijd toch al af.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    const ready = fonts?.ready ?? Promise.resolve();
    let cancelled = false;
    const timeout = new Promise(r => setTimeout(r, 1200)); // nooit langer blijven hangen
    Promise.race([ready, timeout]).then(() => { if (!cancelled) setPhase("play"); });
    return () => { cancelled = true; };
  }, [reduce, onDone]);

  // Scroll vastzetten zolang het gordijn dicht is — en weer vrijgeven zodra het
  // volledig open is, anders blijft de pagina permanent geblokkeerd.
  useEffect(() => {
    if (phase === "skip" || finished) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase, finished]);

  if (phase === "skip" || finished) return null;

  const HOLD = 1.05;
  const SPLIT = { duration: 1.15, delay: HOLD, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] };
  const half = (side: "top" | "bottom") => (
    <motion.div
      className={`absolute inset-x-0 ${side === "top" ? "top-0" : "bottom-0"} overflow-hidden`}
      style={{ height: "50%" }}
      initial={{ y: 0 }}
      animate={phase === "play" ? { y: side === "top" ? "-100%" : "100%" } : { y: 0 }}
      transition={SPLIT}
      onAnimationComplete={side === "bottom" ? () => { onDone(); setFinished(true); } : undefined}>
      {/* Binnenvlak is een volle viewport hoog en tegen de deelnaad verankerd,
          zodat het wordmark over beide helften één geheel vormt. */}
      <div
        className={`absolute inset-x-0 ${side === "top" ? "top-0" : "bottom-0"} flex flex-col items-center justify-center`}
        style={{ height: "100svh", backgroundColor: CREAM }}>
        <WordMark tone="sepia" />
        {/* Voortgangslijn — alleen zichtbaar in de onderste helft */}
        <div className="mt-8" style={{ width: "min(52vw, 420px)", height: "1px", backgroundColor: LINE }}>
          <motion.div
            style={{ height: "100%", backgroundColor: SEPIA_SOFT, transformOrigin: "left center" }}
            initial={{ scaleX: 0 }}
            animate={phase === "play" ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: HOLD, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: phase === "play" ? "none" : "auto" }} aria-hidden>
      {half("top")}
      {half("bottom")}
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
/** Micro-label in een hoek van het beeldvlak — case-study-cachet uit de richting.
 *  Volle dekking + zachte schaduw: 11px op een foto haalt anders geen AA-contrast. */
function CornerLabel({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 1.1, delay, ease: "linear" }}
      className={`absolute z-20 hidden sm:block ${className}`}
      style={{
        fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#FFFBF2", textShadow: "0 1px 14px rgba(20,14,8,0.85), 0 0 3px rgba(20,14,8,0.5)",
      }}>
      {children}
    </motion.span>
  );
}

function Hero({ s, stats, start }: { s: SiteSettings["hero"] | typeof D.hero; stats: typeof D.stats; start: boolean }) {
  // Bij prefers-reduced-motion staat alles meteen op de eindstaat; de hiërarchie
  // van de hero zit in de typografie, niet in de beweging, dus er gaat niets verloren.
  const reduce = useReducedMotion();
  const go = start || reduce;
  return (
    <section className="relative" style={{ backgroundColor: CREAM }}>
      {/* ── BEELDVLAK ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "clamp(400px, 64svh, 700px)", backgroundColor: SEPIA, isolation: "isolate" }}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.14 }}
          animate={go ? { scale: 1 } : { scale: 1.14 }}
          transition={{ duration: 2.6, ease: [0.22, 0.61, 0.36, 1] }}>
          <Image
            src={HERO_IMG} alt="" fill priority sizes="100vw"
            className="object-cover"
            style={{ filter: "sepia(0.34) saturate(1.15) contrast(1.04) brightness(0.92)" }}
          />
        </motion.div>

        {/* Warme gouden-uur grade + leesbaarheidsvignet */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(200deg, rgba(250,203,4,0.20) 0%, rgba(201,140,40,0.10) 38%, rgba(42,36,28,0.38) 100%)" }} />
        <div className="absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(to bottom, rgba(17,17,17,0.55), transparent)" }} />
        {/* Lichte sepia-scrim onderaan — genoeg om de hoeklabels te dragen, niet
            zoveel dat het gouden uur eronder verdwijnt. */}
        <div className="absolute inset-x-0 bottom-0" style={{ height: "40%", background: "linear-gradient(to top, rgba(30,24,16,0.42) 0%, rgba(30,24,16,0.16) 60%, transparent 100%)" }} />

        {/* RISICO-zet: spierdun, manshoog, de zon schijnt er doorheen.
            `screen` i.p.v. `overlay`: overlay keert wit om naar zwart op het
            donkere metselwerk, screen laat het gloeien en brandt weg in de zon. */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "clamp(2rem,6vh,4.5rem)" }}>
          <motion.h1
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={go ? { clipPath: "inset(0 0 0% 0)" } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 1.5, delay: 0.1, ease: EASE }}
            className="w-full"
            style={{ margin: 0, mixBlendMode: "screen" }}>
            <WordMark tone="light" />
          </motion.h1>
        </div>

        <CornerLabel className="bottom-6 left-6 lg:left-10" delay={1.1}>{s.tagline}</CornerLabel>
        <CornerLabel className="bottom-6 right-6 lg:right-10" delay={1.3}>Immo met een plus</CornerLabel>
      </div>

      {/* ── CRÈME BAND ────────────────────────────────────────────────────── */}
      <div style={{ padding: "clamp(3rem,7vh,5.5rem) clamp(1.5rem,6vw,5rem) clamp(2.5rem,6vh,4.5rem)" }}>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <div style={{ overflow: "hidden" }}>
              <motion.p
                initial={reduce ? false : { y: "104%" }}
                animate={go ? { y: 0 } : { y: "104%" }}
                transition={{ duration: 1.05, delay: 0.15, ease: EASE }}
                style={{
                  fontFamily: DISPLAY, fontSize: "clamp(2rem,4.4vw,3.75rem)", fontWeight: 400,
                  letterSpacing: "-0.03em", lineHeight: 1.04, color: SEPIA, maxWidth: "16ch", margin: 0,
                }}>
                {s.titleLine1}{" "}
                <span style={{ color: SEPIA_SOFT }}>{s.titleLine2Italic}</span>
              </motion.p>
            </div>

            <motion.p
              initial={reduce ? false : { opacity: 0 }} animate={{ opacity: go ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.75 }}
              className="mt-7 leading-relaxed"
              style={{ color: SEPIA_SOFT, fontSize: "1rem", maxWidth: "44ch" }}>
              {s.subtitle}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0 }} animate={{ opacity: go ? 1 : 0 }}
              transition={{ duration: 0.9, delay: 0.95 }}
              className="mt-10 flex flex-wrap items-stretch gap-3">
              <Button href="/schatting">{s.ctaSecondary}</Button>
              <Button href="#aanbod" variant="outline">{s.ctaPrimary}</Button>
            </motion.div>
          </div>

          {/* Statistieken als dunne editorial-rij, geen kaarten */}
          <motion.dl
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: go ? 1 : 0 }}
            transition={{ duration: 1.4, delay: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-x-10 gap-y-6 lg:gap-y-0"
            style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1.75rem" }}>
            {stats.map(({ value, label }) => (
              <div key={label} className="lg:py-3">
                <dt className="sr-only">{label}</dt>
                <dd style={{ margin: 0 }}>
                  <span style={{
                    fontFamily: DISPLAY, fontSize: "clamp(1.75rem,2.6vw,2.4rem)", fontWeight: 200,
                    color: SEPIA, letterSpacing: "-0.02em", lineHeight: 1,
                  }}>{value}</span>
                  <span className="block mt-1.5" style={{ fontSize: "12px", color: SEPIA_SOFT, letterSpacing: "0.02em" }}>{label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}

// ── PROPERTY CARD (gebruikt door /aanbod — bewust ongewijzigd) ────────────────
export function PropertyCard({ p, i }: { p: Property; i: number }) {
  const href = p.slug ? `/aanbod/${p.slug}` : "#";
  return (
    <motion.article key={p._id} layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
      className="group overflow-hidden cursor-pointer"
      style={{ backgroundColor: CREAM, borderTop: `1px solid ${LINE}` }}
      onClick={() => window.location.href = href}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <motion.div className="absolute inset-0"
          whileHover={{ scale: 1.04 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <Image src={p.imageUrl} alt={p.title} fill className="object-cover"
            sizes="(min-width: 1024px) 400px, 90vw"
            style={{ filter: "sepia(0.15) contrast(1.02)" }} />
        </motion.div>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="text-xs font-medium px-2.5 py-1"
            style={{ backgroundColor: Y, color: SEPIA, letterSpacing: "0.06em" }}>{p.status}</span>
          <span className="text-xs font-medium px-2.5 py-1"
            style={{ backgroundColor: SEPIA, color: CREAM, letterSpacing: "0.06em" }}>{p.type}</span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="truncate" style={{ fontFamily: DISPLAY, fontSize: "1.125rem", fontWeight: 500, color: SEPIA, lineHeight: 1.25 }}>{p.title}</p>
            <p className="text-xs mt-1 flex items-center gap-1" style={{ color: SEPIA_SOFT }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {p.location}
            </p>
          </div>
          <p className="shrink-0" style={{ fontFamily: DISPLAY, fontSize: "1.1875rem", fontWeight: 500, color: SEPIA, letterSpacing: "-0.01em" }}>{p.price}</p>
        </div>
        <div className="flex items-center gap-5 pt-4 text-xs" style={{ color: SEPIA_SOFT, borderTop: `1px solid ${LINE}` }}>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22v-9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9" /><path d="M2 11l10-9 10 9" /><path d="M9 22V12h6v10" /></svg>
            {p.beds} slpk
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
            {p.area} m²
          </span>
          <a href={href} className="ml-auto text-xs font-medium px-3 py-1.5 transition-colors"
            style={{ color: SEPIA, border: `1px solid ${LINE}`, borderRadius: "2px" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = Y; e.currentTarget.style.borderColor = Y; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = LINE; }}
            onClick={e => e.stopPropagation()}>
            Meer info
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ── PANDKAART (homepage — Gouden Uur) ─────────────────────────────────────────
function PandKaart({ p, i }: { p: Property; i: number }) {
  const href = p.slug ? `/aanbod/${p.slug}` : "/aanbod";
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: i * 0.07 }}
      className="group block"
      style={{ color: SEPIA }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", backgroundColor: CREAM_DEEP }}>
        <Image
          src={p.imageUrl} alt={p.title} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 420px, 90vw"
          style={{ filter: "sepia(0.18) saturate(1.05)" }}
        />
        <span
          className="absolute left-0 bottom-0 px-4 py-2"
          style={{ backgroundColor: CREAM, color: SEPIA, fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {p.status}
        </span>
      </div>

      <div className="pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 style={{ fontFamily: DISPLAY, fontSize: "1.3rem", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0 }}
            className="truncate">
            {p.title}
          </h3>
          <span style={{ fontFamily: DISPLAY, fontSize: "1.15rem", fontWeight: 500, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
            {p.price}
          </span>
        </div>
        <p className="mt-1.5" style={{ fontSize: "0.875rem", color: SEPIA_SOFT }}>{p.location} · {p.type}</p>
        <div className="mt-4 pt-4 flex items-center gap-6" style={{ borderTop: `1px solid ${LINE}`, fontSize: "0.8125rem", color: SEPIA_SOFT }}>
          <span>{p.beds} slaapkamers</span>
          <span>{p.area} m²</span>
          <span className="ml-auto transition-opacity duration-200 opacity-0 group-hover:opacity-100" style={{ color: SEPIA, fontWeight: 500 }}>
            Bekijken
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// ── AANBOD ────────────────────────────────────────────────────────────────────
function Aanbod({ properties }: { properties: Property[] }) {
  return (
    <section id="aanbod" style={{ backgroundColor: CREAM, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
        <div className="flex items-end gap-6">
          <SectionIndex nr="01" />
          <MaskedHeading>Een greep uit ons<br />huidig aanbod</MaskedHeading>
        </div>
        <a href="/aanbod" className="text-sm font-medium pb-2 transition-colors duration-200"
          style={{ color: SEPIA_SOFT, borderBottom: `1px solid ${LINE}` }}
          onMouseEnter={e => { e.currentTarget.style.color = SEPIA; e.currentTarget.style.borderBottomColor = SEPIA; }}
          onMouseLeave={e => { e.currentTarget.style.color = SEPIA_SOFT; e.currentTarget.style.borderBottomColor = LINE; }}>
          Volledig aanbod bekijken
        </a>
      </div>

      <div className="grid gap-x-8 gap-y-14" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        <AnimatePresence mode="popLayout">
          {properties.map((p, i) => <PandKaart key={p._id} p={p} i={i} />)}
        </AnimatePresence>
        {properties.length === 0 && (
          <p style={{ color: SEPIA_SOFT, fontSize: "0.9375rem", gridColumn: "1/-1" }}>
            Bekijk ons <a href="/aanbod" style={{ color: SEPIA, borderBottom: `1px solid ${LINE}` }}>volledig aanbod</a> voor de meest actuele panden.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-16">
        <Button href="/aanbod?status=koop">Te koop bekijken</Button>
        <Button href="/aanbod?status=huur" variant="outline">Te huur bekijken</Button>
      </div>
    </section>
  );
}

// ── TASK / SOLUTION — de case-study-structuur van de richting ─────────────────
function TaskSolution() {
  const rows = [
    {
      k: "Verkopen",
      t: "U wilt de juiste prijs, zonder maandenlang wachten.",
      s: "Wij bepalen de waarde op basis van recente verkopen in uw straat, brengen uw pand professioneel in beeld en voeren zelf de gesprekken. Gemiddeld staat een pand 45 dagen te koop.",
    },
    {
      k: "Kopen",
      t: "U zoekt een thuis, geen lijst met adressen.",
      s: "Eén makelaar volgt uw dossier van eerste bezichtiging tot sleuteloverdracht, kent het aanbod in de regio van binnenuit, en zegt ook wanneer een pand níets voor u is.",
    },
  ];
  return (
    <section style={{ backgroundColor: CREAM_DEEP, padding: "clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end gap-6 mb-16">
        <SectionIndex nr="02" />
        <MaskedHeading>Persoonlijke begeleiding,<br />van A tot Z.</MaskedHeading>
      </div>

      <div className="flex flex-col">
        {rows.map(({ k, t, s }, i) => (
          <div key={k}
            className="grid gap-x-12 gap-y-5 py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]"
            style={{ borderTop: `1px solid ${LINE}`, borderBottom: i === rows.length - 1 ? `1px solid ${LINE}` : undefined }}>
            <div>
              <p style={{ fontFamily: DISPLAY, fontWeight: 100, fontSize: "clamp(2.75rem,6.5vw,5.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em", color: SEPIA, margin: 0 }}>
                {k}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: DISPLAY, fontSize: "clamp(1.25rem,2.2vw,1.75rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.25, color: SEPIA, margin: 0 }}>
                {t}
              </p>
              <p className="mt-5 leading-relaxed" style={{ color: SEPIA_SOFT, fontSize: "0.9375rem", maxWidth: "58ch" }}>
                {s}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button href="/schatting">Gratis waardebepaling</Button>
      </div>
    </section>
  );
}

// ── SCHATTING — drie stappen ──────────────────────────────────────────────────
function SchattingTeaser() {
  const steps = [
    { nr: "01", title: "Vul uw gegevens in", sub: "Adres, type woning en oppervlakte — twee minuten werk." },
    { nr: "02", title: "Onze experts analyseren", sub: "Wij vergelijken met recente verkopen in de buurt." },
    { nr: "03", title: "Ontvang uw schatting", sub: "Een eerlijke marktwaarde, zonder verplichtingen." },
  ];
  const reduce = useReducedMotion();
  return (
    <section style={{ backgroundColor: CREAM, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex flex-wrap items-end justify-between gap-8 mb-14">
        <div className="flex items-end gap-6">
          <SectionIndex nr="03" />
          <MaskedHeading>Wat is uw woning<br />waard vandaag?</MaskedHeading>
        </div>
        <Button href="/schatting">Start gratis schatting</Button>
      </div>

      <div className="grid gap-x-12 gap-y-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {steps.map(({ nr, title, sub }, i) => (
          <motion.div key={nr}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.14 }}
            style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem" }}>
            <p style={{ fontFamily: DISPLAY, fontWeight: 100, fontSize: "2.75rem", lineHeight: 1, color: SEPIA_SOFT, opacity: 0.75, margin: 0 }}>{nr}</p>
            <p className="mt-5" style={{ fontFamily: DISPLAY, fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.01em", color: SEPIA }}>{title}</p>
            <p className="mt-2 leading-relaxed" style={{ fontSize: "0.9rem", color: SEPIA_SOFT }}>{sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── SEPIA STATEMENT (voorheen BoldCta) ────────────────────────────────────────
function Statement({ s }: { s: SiteSettings["boldCta"] | typeof D.boldCta }) {
  return (
    <section style={{ backgroundColor: SEPIA, padding: "clamp(5rem,11vh,9rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <MaskedHeading color={CREAM} size="clamp(2.25rem,5.5vw,4.75rem)">
            {s.titleLine1}<br />
            of <span style={{ color: Y }}>{s.titleLine2}</span><br />
            {s.titleLine3}
          </MaskedHeading>
        </div>
        <div>
          <p className="leading-relaxed" style={{ color: "rgba(239,231,216,0.66)", fontSize: "1rem", maxWidth: "42ch" }}>
            {s.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/aanbod" onDark>Bekijk aanbod</Button>
            <Button href="#contact" variant="outline" onDark>Neem contact op</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── USP — dunne editorial-rij, geen kaarten ──────────────────────────────────
function UspStrip({ usps }: { usps: typeof D.usps }) {
  const reduce = useReducedMotion();
  return (
    <section style={{ backgroundColor: CREAM, padding: "clamp(3.5rem,7vh,5.5rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-x-10 gap-y-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {usps.map((item, i) => (
          <motion.div key={item.title}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.09 }}
            style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem" }}>
            <span style={{ color: SEPIA_SOFT }}>{USP_ICONS[item.icon] ?? item.icon}</span>
            <p className="mt-4" style={{ fontFamily: DISPLAY, fontSize: "1.0625rem", fontWeight: 500, letterSpacing: "-0.01em", color: SEPIA }}>{item.title}</p>
            <p className="mt-1.5 leading-relaxed" style={{ fontSize: "0.875rem", color: SEPIA_SOFT }}>{item.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── KANTOREN ──────────────────────────────────────────────────────────────────
const FALLBACK_OFFICES: Office[] = [
  { name: "Vastgoedkantoor Hasselt", address: "Het Dorlik 16, 3500 Hasselt", phone: "+32 11 36 34 32" },
  { name: "Nieuwbouwkantoor Hasselt", address: "Het Dorlik 16, 3500 Hasselt", phone: "+32 11 36 34 32" },
  { name: "Vastgoedkantoor Genk", address: "Europalaan 30, 3600 Genk", phone: "+32 89 69 15 15" },
];

function Offices({ offices }: { offices: Office[] }) {
  const list = offices.length > 0 ? offices : FALLBACK_OFFICES;
  const reduce = useReducedMotion();
  return (
    <section id="kantoren" style={{ backgroundColor: CREAM_DEEP, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end gap-6 mb-14">
        <SectionIndex nr="04" />
        <MaskedHeading>Dichtbij u<br />in Limburg</MaskedHeading>
      </div>

      <div className="grid gap-x-8 gap-y-12" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
        {list.map((office, i) => (
          <motion.div key={office.name}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}>
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", backgroundColor: "rgba(110,90,62,0.12)" }}>
              {office.imageUrl ? (
                <Image src={office.imageUrl} alt={office.name} fill className="object-cover" sizes="(min-width: 1024px) 400px, 90vw" style={{ filter: "sepia(0.18)" }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={SEPIA_SOFT} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="mt-5" style={{ fontFamily: DISPLAY, fontSize: "1.25rem", fontWeight: 400, letterSpacing: "-0.02em", color: SEPIA, margin: 0 }}>
              {office.name}
            </h3>
            <p className="mt-2" style={{ fontSize: "0.875rem", color: SEPIA_SOFT }}>{office.address}</p>
            <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="inline-block mt-1 transition-colors duration-200"
              style={{ fontSize: "0.875rem", color: SEPIA_SOFT }}
              onMouseEnter={e => (e.currentTarget.style.color = SEPIA)}
              onMouseLeave={e => (e.currentTarget.style.color = SEPIA_SOFT)}>
              {office.phone}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── TEAM ──────────────────────────────────────────────────────────────────────
function Team({ members }: { members: TeamMember[] }) {
  const reduce = useReducedMotion();
  return (
    <section id="team" style={{ backgroundColor: CREAM, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end gap-6 mb-14">
        <SectionIndex nr="06" />
        <MaskedHeading>Mensen die voor u<br />het verschil maken</MaskedHeading>
      </div>

      <div className="grid gap-x-6 gap-y-10" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
        {members.map((m, i) => (
          <motion.div key={m._id}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="group">
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", backgroundColor: CREAM_DEEP }}>
              <Image src={m.photoUrl} alt={m.name} fill unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 260px, 45vw"
                style={{ filter: "sepia(0.22) contrast(1.02)" }} />
            </div>
            <p className="mt-4" style={{ fontFamily: DISPLAY, fontSize: "1.0625rem", fontWeight: 500, letterSpacing: "-0.01em", color: SEPIA }}>{m.name}</p>
            <p className="mt-0.5" style={{ fontSize: "0.8125rem", color: SEPIA_SOFT }}>{m.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── OVER ONS ──────────────────────────────────────────────────────────────────
function OverOns({ a }: { a: typeof D.about }) {
  const reduce = useReducedMotion();
  return (
    <section id="over-ons" style={{ backgroundColor: CREAM_DEEP, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[auto_1fr]" style={{ alignItems: "start" }}>
        {/* Left: index + heading */}
        <div className="flex flex-col gap-6">
          <SectionIndex nr="05" />
          <div>
            <MaskedHeading>{a.title}</MaskedHeading>
            <MaskedHeading delay={0.08}>
              <em style={{ fontStyle: "italic" }}>{a.titleItalic}</em>
            </MaskedHeading>
          </div>
        </div>

        {/* Right: copy + accent + cta */}
        <motion.div
          className="flex flex-col gap-8 pt-2"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}>
          <p style={{ fontSize: "clamp(1rem,1.8vw,1.125rem)", lineHeight: 1.65, color: SEPIA, maxWidth: "52ch" }}>
            {a.text1}
          </p>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: SEPIA_SOFT, maxWidth: "50ch" }}>
            {a.text2}
          </p>

          {/* Years accent */}
          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem", display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
            <span style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 100, letterSpacing: "-0.04em", lineHeight: 1, color: SEPIA }}>
              {a.yearsLabel}
            </span>
            <span style={{ fontSize: "0.875rem", color: SEPIA_SOFT }}>jaar ervaring in Limburg</span>
          </div>

          <Button href="/schatting">{a.cta}</Button>
        </motion.div>
      </div>
    </section>
  );
}

// ── GETUIGENISSEN ─────────────────────────────────────────────────────────────
function Getuigenissen({ items }: { items: CMSTestimonial[] }) {
  const reduce = useReducedMotion();
  if (!items.length) return null;
  return (
    <section style={{ backgroundColor: CREAM_DEEP, padding: "clamp(4rem,9vh,7rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="flex items-end gap-6 mb-14">
        <SectionIndex nr="07" />
        <MaskedHeading>Wat klanten<br />over ons zeggen</MaskedHeading>
      </div>

      <div className="grid gap-x-10 gap-y-12" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {items.map((t, i) => (
          <motion.figure key={t.id}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.09 }}
            style={{ borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem", margin: 0 }}>
            <blockquote style={{ margin: 0 }}>
              <p style={{ fontFamily: DISPLAY, fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.55, letterSpacing: "-0.01em", color: SEPIA }}>
                &ldquo;{t.tekst}&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-5" style={{ fontSize: "0.8125rem", color: SEPIA_SOFT }}>
              {t.naam}{t.type ? ` · ${t.type}` : ""}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact({ s }: { s: SiteSettings["contact"] | typeof D.contact }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setSubmitError(false);
    try {
      const res = await fetch("https://som-vastgoed-cms.vercel.app/api/contact", {
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
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle: React.CSSProperties = {
    backgroundColor: "rgba(239,231,216,0.06)",
    border: "1px solid rgba(239,231,216,0.22)",
    borderRadius: "2px",
    padding: "0.85rem 1rem",
    color: CREAM,
    fontSize: "0.9375rem",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: "12px", fontWeight: 500, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(239,231,216,0.82)",
  };

  return (
    <section id="contact" style={{ backgroundColor: SEPIA, padding: "clamp(4rem,10vh,8rem) clamp(1.5rem,6vw,5rem)" }}>
      <div className="grid gap-x-16 gap-y-14" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div>
          <div className="flex items-end gap-6 mb-10">
            <SectionIndex nr="08" />
            <MaskedHeading color={CREAM}>
              {s.title}<br /><span style={{ color: Y }}>{s.titleYellow}</span>
            </MaskedHeading>
          </div>
          <p className="leading-relaxed mb-12" style={{ color: "rgba(239,231,216,0.6)", fontSize: "1rem", maxWidth: "40ch" }}>
            {s.subtitle}
          </p>

          <div className="flex flex-col">
            {[
              { icon: "📞", label: "Hasselt", value: s.phoneHasselt, href: `tel:${s.phoneHasselt.replace(/\s/g, "")}` },
              { icon: "📞", label: "Genk", value: s.phoneGenk, href: `tel:${s.phoneGenk.replace(/\s/g, "")}` },
              { icon: "✉️", label: "E-mail", value: s.email, href: `mailto:${s.email}` },
              { icon: "📍", label: "Adres", value: s.address, href: undefined },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-4 py-4" style={{ borderTop: "1px solid rgba(239,231,216,0.16)" }}>
                <span style={{ color: Y }}>{CONTACT_ICONS[c.icon as keyof typeof CONTACT_ICONS] ?? c.icon}</span>
                <span style={{ ...labelStyle, minWidth: "5.5rem" }}>{c.label}</span>
                {c.href
                  ? <a href={c.href} style={{ color: CREAM, fontSize: "0.9375rem" }} className="hover:underline">{c.value}</a>
                  : <span style={{ color: CREAM, fontSize: "0.9375rem" }}>{c.value}</span>}
              </div>
            ))}
          </div>
        </div>

        {sent ? (
          <div aria-live="polite" className="flex flex-col justify-center gap-4 py-16 px-8"
            style={{ border: "1px solid rgba(239,231,216,0.22)", borderRadius: "2px" }}>
            <p style={{ fontFamily: DISPLAY, fontSize: "1.75rem", fontWeight: 400, letterSpacing: "-0.02em", color: CREAM }}>
              Bericht ontvangen.
            </p>
            <p style={{ color: "rgba(239,231,216,0.6)", fontSize: "0.9375rem" }}>We nemen binnen 24 uur contact op.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8"
            style={{ border: "1px solid rgba(239,231,216,0.22)", borderRadius: "2px" }}>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              {([["Naam", "text", "Uw naam", "naam"], ["E-mail", "email", "uw@email.be", "email"], ["Telefoon", "tel", "+32 ...", "telefoon"]] as const).map(([label, type, ph, name]) => (
                <div key={name} className="flex flex-col gap-2">
                  <label htmlFor={`c-${name}`} style={labelStyle}>{label}</label>
                  <input id={`c-${name}`} type={type} name={name} placeholder={ph} required={name !== "telefoon"}
                    style={fieldStyle}
                    onFocus={e => { e.target.style.borderColor = Y; e.target.style.boxShadow = `0 0 0 2px ${Y}40`; e.target.style.outline = "none"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(239,231,216,0.22)"; e.target.style.boxShadow = "none"; }} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-interesse" style={labelStyle}>Interesse</label>
              <select id="c-interesse" name="interesse"
                style={{ ...fieldStyle, appearance: "none" }}
                onFocus={e => { e.currentTarget.style.borderColor = Y; e.currentTarget.style.boxShadow = `0 0 0 2px ${Y}40`; e.currentTarget.style.outline = "none"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(239,231,216,0.22)"; e.currentTarget.style.boxShadow = "none"; }}>
                <option value="">Wat kunnen wij voor u doen?</option>
                <option>Woning kopen</option>
                <option>Woning verkopen</option>
                <option>Woning huren</option>
                <option>Gratis waardebepaling</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="c-bericht" style={labelStyle}>Bericht</label>
              <textarea id="c-bericht" name="bericht" rows={4} placeholder="Vertel ons wat u zoekt..."
                className="resize-none" style={fieldStyle}
                onFocus={e => { e.target.style.borderColor = Y; e.target.style.boxShadow = `0 0 0 2px ${Y}40`; e.target.style.outline = "none"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(239,231,216,0.22)"; e.target.style.boxShadow = "none"; }} />
            </div>
            {submitError && (
              <p role="alert" style={{ fontSize: "0.875rem", color: "#f5a623", padding: "0.75rem 1rem", border: "1px solid rgba(245,166,35,0.35)", borderRadius: "2px" }}>
                Er liep iets mis. Bel ons op <a href={`tel:${D.contact.phoneHasselt.replace(/\s/g, "")}`} style={{ color: Y, textDecoration: "underline" }}>{D.contact.phoneHasselt}</a> of mail naar <a href={`mailto:${D.contact.email}`} style={{ color: Y, textDecoration: "underline" }}>{D.contact.email}</a>.
              </p>
            )}
            <button type="submit" disabled={loading}
              className="text-sm font-medium py-4 mt-1 transition-colors duration-200"
              style={{ backgroundColor: Y, color: SEPIA, borderRadius: "2px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Versturen…" : "Verstuur bericht"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SOMClient({ properties, team, settings, projects: _projects, testimonials = [] }: Props) {
  const hero = settings?.hero ?? D.hero;
  const stats = settings?.stats ?? D.stats;
  const boldCta = settings?.boldCta ?? D.boldCta;
  const usps = settings?.usps ?? D.usps;
  const contact = settings?.contact ?? D.contact;
  const about = D.about;
  const offices = settings?.offices ?? [];

  // De hero begint pas te bewegen als het gordijn open is, zodat de reveal
  // niet achter het gordijn "opgebruikt" wordt.
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif", backgroundColor: CREAM }}>
      <IntroCurtain onDone={() => setRevealed(true)} />
      <SiteNav activePage="home" transparentAtTop />
      <Hero s={hero} stats={stats} start={revealed} />
      <Aanbod properties={properties} />
      <TaskSolution />
      <SchattingTeaser />
      <Statement s={boldCta} />
      <UspStrip usps={usps} />
      <Offices offices={offices} />
      <OverOns a={about} />
      <Team members={team} />
      <Getuigenissen items={testimonials} />
      <Contact s={contact} />
      <SiteFooter />
    </div>
  );
}
