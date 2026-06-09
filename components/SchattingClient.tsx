"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SiteFooter from "./SiteFooter";

const Y = "#facb04";
const B = "#111111";
const W = "#ffffff";
const G = "#f7f7f5";
const M = "#888";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ── Types ─────────────────────────────────────────────────────────────────────
type FormData = {
  // Step 1 — type
  propertyType: string;
  // Step 2 — locatie
  gemeente: string;
  straat: string;
  nummer: string;
  // Step 3 — kenmerken
  bewoonbaarOpp: string;
  perceelOpp: string;
  bouwjaar: string;
  slaapkamers: string;
  badkamers: string;
  // Step 4 — extra
  garage: string;
  tuin: boolean;
  terras: boolean;
  epc: string;
  staat: string;
  // Step 5 — contact
  naam: string;
  email: string;
  telefoon: string;
  opmerking: string;
};

const INITIAL: FormData = {
  propertyType: "", gemeente: "", straat: "", nummer: "",
  bewoonbaarOpp: "", perceelOpp: "", bouwjaar: "", slaapkamers: "", badkamers: "",
  garage: "Geen", tuin: false, terras: false, epc: "", staat: "",
  naam: "", email: "", telefoon: "", opmerking: "",
};

const STEPS = ["Type", "Locatie", "Kenmerken", "Extra's", "Contact"];

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20"
      style={{ backgroundColor: "rgba(17,17,17,0.97)", backdropFilter: "blur(20px)", paddingLeft: "clamp(1.5rem,5vw,4rem)", paddingRight: "clamp(1.5rem,5vw,4rem)" }}>
      <a href="/">
        <img src="/som-project-logo-white.svg" alt="SOM Vastgoed" style={{ height: "40px", width: "auto" }} />
      </a>
      <div className="hidden md:flex items-center gap-8">
        <a href="/aanbod" className="text-sm font-light text-white/70 hover:text-white transition-colors">Aanbod</a>
        <a href="/nieuwbouw" className="text-sm font-light text-white/70 hover:text-white transition-colors">Nieuwbouw</a>
        <a href="/#over-ons" className="text-sm font-light text-white/70 hover:text-white transition-colors">Over ons</a>
        <motion.a href="/#contact" className="text-sm font-semibold px-6 py-2.5 rounded-full"
          style={{ backgroundColor: Y, color: B }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          Contact
        </motion.a>
      </div>
    </nav>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5" style={{ flex: 1 }}>
            <div className="w-full flex items-center">
              {i > 0 && (
                <div className="h-0.5 flex-1" style={{ backgroundColor: i <= step ? Y : "#e0e0e0", transition: "background-color 0.4s" }} />
              )}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-400"
                style={{
                  backgroundColor: i < step ? Y : i === step ? B : "#e0e0e0",
                  color: i < step ? B : i === step ? W : M,
                  border: i === step ? `2px solid ${B}` : "none",
                }}>
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (i + 1)}
              </div>
              {i < total - 1 && (
                <div className="h-0.5 flex-1" style={{ backgroundColor: i < step ? Y : "#e0e0e0", transition: "background-color 0.4s" }} />
              )}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: i === step ? B : M, fontWeight: i === step ? 600 : 400 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Option card ───────────────────────────────────────────────────────────────
function OptionCard({ icon, label, selected, onClick }: { icon: React.ReactNode; label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button type="button" onClick={onClick}
      whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all"
      style={{
        border: selected ? `2px solid ${B}` : "2px solid #e8e8e8",
        backgroundColor: selected ? B : W,
        color: selected ? W : B,
        minWidth: "110px",
        boxShadow: selected ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
      }}>
      <div style={{ color: selected ? Y : M }}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: M }}>{label}{required && <span style={{ color: Y }}> *</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="text-sm outline-none rounded-xl px-4 py-3 transition-all"
        style={{ border: "1.5px solid #e8e8e8", color: B, backgroundColor: W }}
        onFocus={e => (e.target.style.borderColor = B)}
        onBlur={e => (e.target.style.borderColor = "#e8e8e8")} />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: M }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-sm outline-none rounded-xl px-4 py-3"
        style={{ border: "1.5px solid #e8e8e8", color: B, backgroundColor: W, appearance: "none" }}>
        <option value="">Kies…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer transition-all"
      style={{ border: `1.5px solid ${value ? B : "#e8e8e8"}`, backgroundColor: value ? B : W }}>
      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: value ? Y : "#f0f0f0" }}>
        {value && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span className="text-sm font-medium" style={{ color: value ? W : B }}>{label}</span>
    </button>
  );
}

// ── STEP CONTENT ──────────────────────────────────────────────────────────────
function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  const types = [
    { label: "Woning", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { label: "Appartement", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg> },
    { label: "Villa", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22v-7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7"/><line x1="12" y1="2" x2="12" y2="6"/></svg> },
    { label: "Grond", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22l10-10 3 3 7-7"/><path d="M22 22H2"/></svg> },
    { label: "Handelspand", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M3 9l2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg> },
    { label: "Garage", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M7 13h10M7 17h10"/></svg> },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Wat wilt u laten schatten?
      </h2>
      <p className="text-sm mb-8" style={{ color: M }}>Selecteer het type eigendom voor een nauwkeurige schatting.</p>
      <div className="flex flex-wrap gap-3">
        {types.map(t => (
          <OptionCard key={t.label} icon={t.icon} label={t.label}
            selected={data.propertyType === t.label}
            onClick={() => set("propertyType", t.label)} />
        ))}
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  const gemeenten = [
    "Hasselt", "Genk", "Tongeren", "Sint-Truiden", "Maaseik", "Lommel", "Bilzen",
    "Diepenbeek", "Beringen", "Heusden-Zolder", "Herk-de-Stad", "Lummen", "Alken",
    "Wellen", "Borgloon", "Nieuwerkerken", "Gingelom", "Zoutleeuw", "Landen",
    "Riemst", "Maasmechelen", "Lanaken", "Dilsen-Stokkem", "Peer", "Houthalen-Helchteren",
    "Leopoldsburg", "Ham", "Tessenderlo", "Diest", "Andere",
  ].sort();
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Waar is de woning gelegen?
      </h2>
      <p className="text-sm mb-8" style={{ color: M }}>Geef het adres van de te schatten eigendom.</p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        <Select label="Gemeente" value={data.gemeente} onChange={v => set("gemeente", v)} options={gemeenten} />
        <Input label="Straat" value={data.straat} onChange={v => set("straat", v)} placeholder="Dorpstraat" required />
        <Input label="Huisnummer" value={data.nummer} onChange={v => set("nummer", v)} placeholder="12A" />
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  const bedrooms = ["1", "2", "3", "4", "5", "6+"];
  const bathrooms = ["1", "2", "3+"];
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Kenmerken van de woning
      </h2>
      <p className="text-sm mb-8" style={{ color: M }}>Vul de belangrijkste kenmerken in voor een nauwkeurige schatting.</p>

      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        <Input label="Bewoonbare opp. (m²)" value={data.bewoonbaarOpp} onChange={v => set("bewoonbaarOpp", v)} placeholder="150" type="number" required />
        <Input label="Perceeloppervlakte (m²)" value={data.perceelOpp} onChange={v => set("perceelOpp", v)} placeholder="400" type="number" />
        <Input label="Bouwjaar" value={data.bouwjaar} onChange={v => set("bouwjaar", v)} placeholder="1985" type="number" />
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: M }}>Slaapkamers</p>
        <div className="flex gap-2 flex-wrap">
          {bedrooms.map(n => (
            <motion.button key={n} type="button" onClick={() => set("slaapkamers", n)}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ border: `1.5px solid ${data.slaapkamers === n ? B : "#e8e8e8"}`, backgroundColor: data.slaapkamers === n ? B : W, color: data.slaapkamers === n ? W : B }}>
              {n}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: M }}>Badkamers</p>
        <div className="flex gap-2 flex-wrap">
          {bathrooms.map(n => (
            <motion.button key={n} type="button" onClick={() => set("badkamers", n)}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ border: `1.5px solid ${data.badkamers === n ? B : "#e8e8e8"}`, backgroundColor: data.badkamers === n ? B : W, color: data.badkamers === n ? W : B }}>
              {n}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  const epcOptions = ["A+", "A", "B", "C", "D", "E", "F", "Onbekend"];
  const staaten = ["Uitstekend — instapklaar", "Goed — lichte opfrissing", "Matig — renovatie nodig", "Slecht — grondige renovatie"];
  const garageOptions = ["Geen", "1 garage", "2 garages", "Carport", "Garage + carport"];
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Extra kenmerken
      </h2>
      <p className="text-sm mb-8" style={{ color: M }}>Meer details zorgen voor een nauwkeurigere schatting.</p>

      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        <Select label="Garage / parking" value={data.garage} onChange={v => set("garage", v)} options={garageOptions} />
        <Select label="EPC-label" value={data.epc} onChange={v => set("epc", v)} options={epcOptions} />
        <Select label="Staat van de woning" value={data.staat} onChange={v => set("staat", v)} options={staaten} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: M }}>Aanwezig</p>
        <div className="flex gap-3 flex-wrap">
          <Toggle label="Tuin" value={data.tuin} onChange={v => set("tuin", v)} />
          <Toggle label="Terras" value={data.terras} onChange={v => set("terras", v)} />
        </div>
      </div>
    </div>
  );
}

function Step5({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Uw contactgegevens
      </h2>
      <p className="text-sm mb-8" style={{ color: M }}>Onze expert neemt binnen <strong>24 uur</strong> contact op met uw gratis schatting.</p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        <Input label="Naam" value={data.naam} onChange={v => set("naam", v)} placeholder="Jan Janssen" required />
        <Input label="E-mailadres" value={data.email} onChange={v => set("email", v)} placeholder="jan@email.be" type="email" required />
        <Input label="Telefoonnummer" value={data.telefoon} onChange={v => set("telefoon", v)} placeholder="+32 4xx xx xx xx" type="tel" required />
      </div>
      <div className="flex flex-col gap-1.5 mt-5">
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: M }}>Opmerkingen (optioneel)</label>
        <textarea value={data.opmerking} onChange={e => set("opmerking", e.target.value)}
          rows={3} placeholder="Eventuele extra informatie over de woning…"
          className="text-sm outline-none rounded-xl px-4 py-3 resize-none"
          style={{ border: "1.5px solid #e8e8e8", color: B }}
          onFocus={e => (e.target.style.borderColor = B)}
          onBlur={e => (e.target.style.borderColor = "#e8e8e8")} />
      </div>

      {/* Privacy */}
      <p className="text-xs mt-5 leading-relaxed" style={{ color: M }}>
        Door dit formulier in te dienen gaat u akkoord dat SOM Vastgoed uw gegevens gebruikt om contact met u op te nemen voor de gevraagde schatting. Uw gegevens worden niet gedeeld met derden.
      </p>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function Success({ data, schatting }: { data: FormData; schatting: { min: number; max: number } | null }) {
  function fmt(n: number) {
    return "€ " + n.toLocaleString("nl-BE");
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center text-center py-8 px-4">

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: Y }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </motion.div>

      <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: B, lineHeight: 1.1, marginBottom: "0.75rem" }}>
        Uw schatting is klaar!
      </h2>
      <p className="text-sm font-light mb-8" style={{ color: M, maxWidth: "400px" }}>
        Gebaseerd op actuele marktprijzen in <strong style={{ color: B }}>{data.gemeente}</strong> voor een {data.propertyType.toLowerCase()} van{" "}
        {data.bewoonbaarOpp ? <><strong style={{ color: B }}>{data.bewoonbaarOpp} m²</strong></> : "uw eigendom"}.
      </p>

      {/* Prijsvork — het hoofdelement */}
      {schatting ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          className="w-full max-w-md rounded-3xl p-8 mb-6"
          style={{ backgroundColor: B, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            Geschatte marktwaarde
          </p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.2rem,5vw,3.2rem)", fontWeight: 300, color: W, lineHeight: 1.1 }}>
            {fmt(schatting.min)}<br />
            <span style={{ color: Y }}>— {fmt(schatting.max)}</span>
          </p>
          <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
            ✦ Indicatieve schatting op basis van Limburgse marktdata · Een exacte waardebepaling volgt na bezoek ter plaatse
          </p>
        </motion.div>
      ) : (
        <div className="w-full max-w-md rounded-2xl p-6 mb-6" style={{ backgroundColor: G, border: "1px solid #e8e8e8" }}>
          <p className="text-sm" style={{ color: M }}>Onze expert neemt contact op met uw persoonlijke schatting.</p>
        </div>
      )}

      {/* Bevestiging */}
      <p className="text-sm font-light mb-8" style={{ color: M }}>
        De details zijn verstuurd naar ons team. We nemen zo snel mogelijk contact op via{" "}
        <strong style={{ color: B }}>{data.email}</strong> of <strong style={{ color: B }}>{data.telefoon}</strong>.
      </p>

      {/* Samenvatting */}
      <div className="w-full max-w-md rounded-2xl p-5 mb-8 text-left" style={{ backgroundColor: G, border: "1px solid #ebebeb" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: M }}>Samenvatting</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {([
            ["Type", data.propertyType],
            ["Locatie", `${data.gemeente}${data.straat ? `, ${data.straat}` : ""}`],
            data.bewoonbaarOpp ? ["Opp.", `${data.bewoonbaarOpp} m²`] : null,
            data.slaapkamers ? ["Slaapkamers", data.slaapkamers] : null,
            data.bouwjaar ? ["Bouwjaar", data.bouwjaar] : null,
            data.staat ? ["Staat", data.staat.split("—")[0].trim()] : null,
          ] as ([string, string] | null)[]).filter((x): x is [string, string] => x !== null).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs" style={{ color: M }}>{k}</p>
              <p className="text-sm font-medium" style={{ color: B }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <motion.a href="/" className="text-sm font-semibold rounded-full px-7 py-3.5 inline-flex items-center gap-2"
          style={{ backgroundColor: B, color: W }} whileHover={{ backgroundColor: Y, color: B }} whileTap={{ scale: 0.97 }}>
          Terug naar home
        </motion.a>
        <motion.a href="/aanbod" className="text-sm font-medium rounded-full px-7 py-3.5 border"
          style={{ borderColor: "#e0e0e0", color: B }} whileHover={{ borderColor: B }} whileTap={{ scale: 0.97 }}>
          Bekijk ons aanbod
        </motion.a>
      </div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SchattingClient() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [schatting, setSchatting] = useState<{ min: number; max: number } | null>(null);

  function set(key: keyof FormData, value: string | boolean) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function canNext() {
    if (step === 0) return !!data.propertyType;
    if (step === 1) return !!data.gemeente;
    if (step === 2) return !!data.bewoonbaarOpp;
    if (step === 3) return true;
    if (step === 4) return !!data.naam && !!data.email && !!data.telefoon;
    return true;
  }

  async function handleSubmit() {
    setSending(true);
    try {
      const res = await fetch("/api/schatting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.schatting) setSchatting(json.schatting);
    } catch { /* best effort */ }
    setSending(false);
    setSubmitted(true);
  }

  const steps = [
    <Step1 key={0} data={data} set={set} />,
    <Step2 key={1} data={data} set={set} />,
    <Step3 key={2} data={data} set={set} />,
    <Step4 key={3} data={data} set={set} />,
    <Step5 key={4} data={data} set={set} />,
  ];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}>
      <Nav />

      {/* Hero strip */}
      <section style={{ backgroundColor: B, paddingTop: "clamp(7rem,13vh,10rem)", paddingBottom: "clamp(3rem,5vh,4rem)", paddingLeft: "clamp(1.5rem,6vw,5rem)", paddingRight: "clamp(1.5rem,6vw,5rem)" }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-3 mb-5">
          <div className="h-px w-10" style={{ backgroundColor: Y }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: Y }}>Gratis & vrijblijvend</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="text-white"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
          Hoeveel is uw woning<br /><em style={{ color: Y }}>waard?</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-3 text-sm font-light max-w-md" style={{ color: "rgba(255,255,255,0.45)" }}>
          Vul het formulier in en ontvang binnen 24 uur een professionele schatting van onze experts — volledig gratis en vrijblijvend.
        </motion.p>
      </section>

      {/* Form card */}
      <section style={{ backgroundColor: G, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="mx-auto" style={{ maxWidth: "760px" }}>
          {submitted ? (
            <div className="bg-white rounded-3xl p-8 md:p-12" style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}>
              <Success data={data} schatting={schatting} />
            </div>
          ) : (
            <motion.div className="bg-white rounded-3xl p-8 md:p-12" style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>

              <ProgressBar step={step} total={STEPS.length} />

              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE }}>
                  {steps[step]}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: "1px solid #f0f0f0" }}>
                <motion.button type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="text-sm font-medium flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer"
                  style={{ color: step === 0 ? "#ccc" : M, border: `1px solid ${step === 0 ? "#eee" : "#d0d0d0"}` }}
                  disabled={step === 0}
                  whileTap={step > 0 ? { scale: 0.97 } : {}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Vorige
                </motion.button>

                <span className="text-xs" style={{ color: M }}>{step + 1} / {STEPS.length}</span>

                {step < STEPS.length - 1 ? (
                  <motion.button type="button"
                    onClick={() => canNext() && setStep(s => s + 1)}
                    className="text-sm font-semibold flex items-center gap-2 px-7 py-3 rounded-full cursor-pointer"
                    style={{ backgroundColor: canNext() ? B : "#e0e0e0", color: canNext() ? W : M }}
                    whileHover={canNext() ? { backgroundColor: "#333" } : {}}
                    whileTap={canNext() ? { scale: 0.97 } : {}}>
                    Volgende
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </motion.button>
                ) : (
                  <motion.button type="button"
                    onClick={() => canNext() && handleSubmit()}
                    disabled={!canNext() || sending}
                    className="text-sm font-semibold flex items-center gap-2 px-7 py-3 rounded-full cursor-pointer"
                    style={{ backgroundColor: canNext() ? Y : "#e0e0e0", color: canNext() ? B : M }}
                    whileHover={canNext() ? { opacity: 0.9 } : {}}
                    whileTap={canNext() ? { scale: 0.97 } : {}}>
                    {sending ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: B, borderTopColor: "transparent" }} />
                        Verzenden…
                      </>
                    ) : (
                      <>
                        Gratis schatting aanvragen
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      {!submitted && (
        <section style={{ backgroundColor: B, padding: "clamp(3rem,5vh,4rem) clamp(1.5rem,6vw,5rem)" }}>
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: "Schatting binnen 24 uur" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "100% gratis & vrijblijvend" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: "Ervaren lokale experten" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: "Uw gegevens zijn veilig" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-light" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
