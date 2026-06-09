"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const STORAGE_KEY = "som_cookie_consent";

type ConsentValue = "all" | "necessary" | null;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value ?? "necessary");
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-0 left-0 right-0 z-[9999] md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
          style={{ padding: "0" }}
        >
          <div
            style={{
              backgroundColor: "rgba(17,17,17,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0",
              padding: "clamp(1.25rem,4vw,1.75rem)",
            }}
            className="md:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(250,203,4,0.15)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: W, fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
                >
                  Cookiebeleid
                </p>
              </div>
            </div>

            {/* Body */}
            <p className="text-xs leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              Wij gebruiken cookies om uw ervaring te verbeteren en het verkeer op onze website te analyseren.
            </p>

            {/* Details toggle */}
            <button
              onClick={() => setShowDetails(v => !v)}
              className="text-xs mb-4 cursor-pointer"
              style={{ color: "rgba(250,203,4,0.8)", textDecoration: "underline", background: "none", border: "none", padding: 0 }}
            >
              {showDetails ? "Minder info" : "Meer info"}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mb-4 space-y-2">
                    {/* Necessary */}
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: Y }}
                      >
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: W }}>Noodzakelijk</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Sessie, beveiliging, formulieren. Altijd actief.</p>
                      </div>
                    </div>
                    {/* Analytics */}
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                      <div
                        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 6 5 9 10 3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold mb-0.5" style={{ color: W }}>Analytisch</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Vercel Analytics &amp; Speed Insights — anoniem verkeer.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <motion.button
                onClick={() => save("all")}
                className="w-full text-xs font-semibold py-3 rounded-full cursor-pointer"
                style={{ backgroundColor: Y, color: B, border: "none" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Alles accepteren
              </motion.button>
              <motion.button
                onClick={() => save("necessary")}
                className="w-full text-xs font-medium py-3 rounded-full cursor-pointer"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.12)", color: W }}
                whileTap={{ scale: 0.97 }}
              >
                Alleen noodzakelijke
              </motion.button>
            </div>

            {/* Legal */}
            <p className="text-center mt-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              <a href="/privacy" className="underline" style={{ color: "rgba(255,255,255,0.35)" }}>Privacybeleid</a>
              {" · "}
              <a href="/cookies" className="underline" style={{ color: "rgba(255,255,255,0.35)" }}>Cookiebeleid</a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
