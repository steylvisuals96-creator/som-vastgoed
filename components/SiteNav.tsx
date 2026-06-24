"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Aanbod",    href: "/aanbod" },
  { label: "Nieuwbouw", href: "/nieuwbouw" },
  { label: "Nieuws",    href: "/nieuws" },
  { label: "Schatting", href: "/schatting" },
  { label: "Over ons",  href: "/#over-ons" },
  { label: "Team",      href: "/#team" },
];

type Props = {
  activePage?: "aanbod" | "nieuwbouw" | "schatting" | "home" | "nieuws";
  /** true = transparent at top, fills on scroll (homepage) */
  transparentAtTop?: boolean;
};

export default function SiteNav({ activePage, transparentAtTop = false }: Props) {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  // Background: transparent → dark on scroll (only on homepage hero)
  const bgColor = useTransform(
    scrollY,
    [0, 80],
    transparentAtTop
      ? ["rgba(17,17,17,0)", "rgba(17,17,17,0.97)"]
      : ["rgba(17,17,17,0.97)", "rgba(17,17,17,0.97)"]
  );
  const blurVal = useTransform(
    scrollY,
    [0, 80],
    transparentAtTop ? ["blur(0px)", "blur(20px)"] : ["blur(20px)", "blur(20px)"]
  );

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on route change / resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────────────────────── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20"
        style={{
          backgroundColor: open ? "rgba(17,17,17,0.99)" : bgColor,
          backdropFilter: open ? "blur(20px)" : blurVal,
          paddingLeft:  "clamp(1.5rem,5vw,4rem)",
          paddingRight: "clamp(1.5rem,5vw,4rem)",
        }}
      >
        {/* Logo */}
        <a href="/" onClick={() => setOpen(false)}>
          <Image
            src="/som-logo.png"
            alt="SOM Vastgoed"
            width={160}
            height={56}
            style={{ height: "44px", width: "auto", filter: "invert(1) hue-rotate(180deg)" }}
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activePage && href.includes(activePage);
            return (
              <a
                key={label}
                href={href}
                className="text-sm font-light transition-colors"
                style={{ color: isActive ? Y : "rgba(255,255,255,0.7)" }}
                onMouseEnter={e => (e.currentTarget.style.color = W)}
                onMouseLeave={e => (e.currentTarget.style.color = isActive ? Y : "rgba(255,255,255,0.7)")}
              >
                {label}
              </a>
            );
          })}
          <motion.a
            href="/#contact"
            className="text-sm font-semibold px-6 py-2.5 rounded-full"
            style={{ backgroundColor: Y, color: B }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact
          </motion.a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 cursor-pointer relative z-[60]"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
        >
          <motion.span
            className="block h-px rounded-full"
            style={{ backgroundColor: W, width: "24px", transformOrigin: "center" }}
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block h-px rounded-full"
            style={{ backgroundColor: W, width: "24px" }}
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-px rounded-full"
            style={{ backgroundColor: W, width: "24px", transformOrigin: "center" }}
            animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </motion.nav>

      {/* ── Mobile overlay menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ backgroundColor: "rgba(17,17,17,0.99)", backdropFilter: "blur(20px)" }}
          >
            {/* Links — vertically centered */}
            <div className="flex flex-col items-center justify-center flex-1 gap-2 px-8">
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = activePage && href.includes(activePage);
                return (
                  <motion.a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: EASE }}
                    className="w-full text-center py-4 text-3xl font-light tracking-tight transition-colors"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      color: isActive ? Y : "rgba(255,255,255,0.85)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {label}
                  </motion.a>
                );
              })}

              {/* Contact CTA */}
              <motion.a
                href="/#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                className="mt-6 w-full text-center py-4 rounded-full text-base font-semibold"
                style={{ backgroundColor: Y, color: B }}
              >
                Contact opnemen
              </motion.a>
            </div>

            {/* Bottom — offices */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="px-8 pb-10 flex justify-center gap-10"
            >
              <div className="text-center">
                <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Hasselt</p>
                <a href="tel:+3211363432" className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>011 36 34 32</a>
              </div>
              <div className="w-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
              <div className="text-center">
                <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Genk</p>
                <a href="tel:+3289691515" className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>089 69 15 15</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
