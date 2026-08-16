"use client";

import { motion, AnimatePresence } from "framer-motion";
import SiteNav from "./SiteNav";
import { useState } from "react";
import SiteFooter from "./SiteFooter";

const CREAM      = "#EFE7D8";
const CREAM_DEEP = "#E6DCC8";
const SEPIA      = "#2A241C";
const SEPIA_SOFT = "#6E5A3E";
const LINE       = "rgba(110,90,62,0.22)";
const Y          = "#facb04";
const DISPLAY    = "var(--font-archivo), Archivo, sans-serif";
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type FormData = {
  propertyType: string;
  postcode: string; gemeente: string; straat: string; nummer: string;
  bewoonbaarOpp: string; perceelOpp: string; bouwjaar: string;
  slaapkamers: string; badkamers: string;
  garage: string; tuin: boolean; terras: boolean; epc: string; staat: string;
  naam: string; email: string; telefoon: string; opmerking: string;
};

const INITIAL: FormData = {
  propertyType: "", postcode: "", gemeente: "", straat: "", nummer: "",
  bewoonbaarOpp: "", perceelOpp: "", bouwjaar: "", slaapkamers: "", badkamers: "",
  garage: "Geen", tuin: false, terras: false, epc: "", staat: "",
  naam: "", email: "", telefoon: "", opmerking: "",
};

const STEPS = ["Type", "Locatie", "Kenmerken", "Extra's", "Contact"];

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full mb-10">
      <div className="relative h-px mb-5" style={{ backgroundColor: LINE }}>
        <div className="absolute top-0 left-0 h-px transition-all duration-500"
          style={{ backgroundColor: Y, width: `${(step / (total - 1)) * 100}%` }} />
      </div>
      <div className="flex items-start justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center" style={{ flex: 1 }}>
            <span className="hidden sm:block text-xs transition-colors"
              style={{
                fontFamily: DISPLAY,
                color: i === step ? SEPIA : i < step ? SEPIA_SOFT : "rgba(110,90,62,0.35)",
                fontWeight: i === step ? 600 : 400,
              }}>
              {label}
            </span>
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
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-3 p-5 cursor-pointer transition-all"
      style={{
        border: `1px solid ${selected ? SEPIA : LINE}`,
        backgroundColor: selected ? SEPIA : "transparent",
        color: selected ? CREAM : SEPIA,
        minWidth: "110px",
        borderRadius: "2px",
        fontFamily: DISPLAY,
      }}>
      <div style={{ color: selected ? Y : SEPIA_SOFT }}>{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

// ── Field styles ──────────────────────────────────────────────────────────────
const fieldStyle: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: "0.9375rem",
  border: `1px solid ${LINE}`,
  color: SEPIA,
  backgroundColor: "transparent",
  borderRadius: "2px",
  padding: "0.75rem 1rem",
  outline: "none",
  width: "100%",
};

function Input({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide"
        style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
        {label}{required && <span style={{ color: Y }}> *</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        style={fieldStyle}
        onFocus={e => { e.target.style.borderColor = SEPIA_SOFT; }}
        onBlur={e => { e.target.style.borderColor = LINE; }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide"
        style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ ...fieldStyle, appearance: "none", paddingRight: "2.5rem" }}>
          <option value="">Kies…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SEPIA_SOFT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center gap-3 py-3 px-4 cursor-pointer transition-all"
      style={{
        fontFamily: DISPLAY,
        border: `1px solid ${value ? SEPIA : LINE}`,
        backgroundColor: value ? SEPIA : "transparent",
        borderRadius: "2px",
      }}>
      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: value ? Y : CREAM_DEEP, borderRadius: "2px" }}>
        {value && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SEPIA} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span className="text-sm font-medium" style={{ color: value ? CREAM : SEPIA }}>{label}</span>
    </button>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
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
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Wat wilt u laten schatten?
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Selecteer het type eigendom voor een nauwkeurige schatting.</p>
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
  return (
    <div>
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Waar is de woning gelegen?
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Geef het adres van de te schatten eigendom — overal in België.</p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        <Input label="Postcode" value={data.postcode} onChange={v => set("postcode", v.replace(/\D/g, "").slice(0, 4))} placeholder="3500" required />
        <Input label="Gemeente" value={data.gemeente} onChange={v => set("gemeente", v)} placeholder="Hasselt" required />
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
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Kenmerken van de woning
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Vul de belangrijkste kenmerken in voor een nauwkeurige schatting.</p>
      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        <Input label="Bewoonbare opp. (m²)" value={data.bewoonbaarOpp} onChange={v => set("bewoonbaarOpp", v)} placeholder="150" type="number" required />
        <Input label="Perceeloppervlakte (m²)" value={data.perceelOpp} onChange={v => set("perceelOpp", v)} placeholder="400" type="number" />
        <Input label="Bouwjaar" value={data.bouwjaar} onChange={v => set("bouwjaar", v)} placeholder="1985" type="number" />
      </div>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Slaapkamers</p>
        <div className="flex gap-2 flex-wrap">
          {bedrooms.map(n => (
            <motion.button key={n} type="button" onClick={() => set("slaapkamers", n)}
              whileTap={{ scale: 0.96 }}
              className="w-11 h-11 text-sm font-semibold cursor-pointer transition-all"
              style={{
                fontFamily: DISPLAY,
                border: `1px solid ${data.slaapkamers === n ? SEPIA : LINE}`,
                backgroundColor: data.slaapkamers === n ? SEPIA : "transparent",
                color: data.slaapkamers === n ? CREAM : SEPIA,
                borderRadius: "2px",
              }}>
              {n}
            </motion.button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Badkamers</p>
        <div className="flex gap-2 flex-wrap">
          {bathrooms.map(n => (
            <motion.button key={n} type="button" onClick={() => set("badkamers", n)}
              whileTap={{ scale: 0.96 }}
              className="w-11 h-11 text-sm font-semibold cursor-pointer transition-all"
              style={{
                fontFamily: DISPLAY,
                border: `1px solid ${data.badkamers === n ? SEPIA : LINE}`,
                backgroundColor: data.badkamers === n ? SEPIA : "transparent",
                color: data.badkamers === n ? CREAM : SEPIA,
                borderRadius: "2px",
              }}>
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
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Extra kenmerken
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Meer details zorgen voor een nauwkeurigere schatting.</p>
      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        <SelectField label="Garage / parking" value={data.garage} onChange={v => set("garage", v)} options={garageOptions} />
        <SelectField label="EPC-label" value={data.epc} onChange={v => set("epc", v)} options={epcOptions} />
        <SelectField label="Staat van de woning" value={data.staat} onChange={v => set("staat", v)} options={staaten} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Aanwezig</p>
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
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.75rem,3vw,2.5rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.5rem" }}>
        Uw contactgegevens
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
        Onze expert neemt binnen <strong style={{ color: SEPIA }}>24 uur</strong> contact op met uw gratis schatting.
      </p>
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
        <Input label="Naam" value={data.naam} onChange={v => set("naam", v)} placeholder="Jan Janssen" required />
        <Input label="E-mailadres" value={data.email} onChange={v => set("email", v)} placeholder="jan@email.be" type="email" required />
        <Input label="Telefoonnummer" value={data.telefoon} onChange={v => set("telefoon", v)} placeholder="+32 4xx xx xx xx" type="tel" required />
      </div>
      <div className="flex flex-col gap-1.5 mt-5">
        <label className="text-xs font-medium uppercase tracking-wide" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Opmerkingen (optioneel)</label>
        <textarea value={data.opmerking} onChange={e => set("opmerking", e.target.value)}
          rows={3} placeholder="Eventuele extra informatie over de woning…"
          className="resize-none outline-none"
          style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", border: `1px solid ${LINE}`, color: SEPIA, backgroundColor: "transparent", borderRadius: "2px", padding: "0.75rem 1rem" }}
          onFocus={e => { e.target.style.borderColor = SEPIA_SOFT; }}
          onBlur={e => { e.target.style.borderColor = LINE; }} />
      </div>
      <p className="text-xs mt-5 leading-relaxed" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
        Door dit formulier in te dienen gaat u akkoord dat SOM Vastgoed uw gegevens gebruikt om contact met u op te nemen. Uw gegevens worden niet gedeeld met derden.
      </p>
    </div>
  );
}

// ── Success ───────────────────────────────────────────────────────────────────
function Success({ data, schatting }: { data: FormData; schatting: { min: number; max: number } | null }) {
  function fmt(n: number) { return "€ " + n.toLocaleString("nl-BE"); }
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex flex-col items-center text-center py-8 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="w-20 h-20 flex items-center justify-center mb-6"
        style={{ backgroundColor: Y, borderRadius: "2px" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={SEPIA} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </motion.div>
      <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.03em", color: SEPIA, lineHeight: 1.1, marginBottom: "0.75rem" }}>
        Uw schatting is klaar!
      </h2>
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT, maxWidth: "400px" }}>
        Gebaseerd op actuele marktprijzen in <strong style={{ color: SEPIA }}>{data.gemeente}</strong> voor een {data.propertyType.toLowerCase()}
        {data.bewoonbaarOpp ? <> van <strong style={{ color: SEPIA }}>{data.bewoonbaarOpp} m²</strong></> : ""}.
      </p>
      {schatting ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
          className="w-full max-w-md p-8 mb-6" style={{ backgroundColor: SEPIA, borderRadius: "2px" }}>
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.4)" }}>
            Geschatte marktwaarde
          </p>
          <p style={{ fontFamily: DISPLAY, fontSize: "clamp(2.2rem,5vw,3.2rem)", fontWeight: 400, letterSpacing: "-0.03em", color: CREAM, lineHeight: 1.1 }}>
            {fmt(schatting.min)}<br />
            <em style={{ fontStyle: "italic", color: Y }}>— {fmt(schatting.max)}</em>
          </p>
          <p className="text-xs mt-4" style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.3)" }}>
            Indicatieve schatting op basis van lokale marktdata. Een exacte waardebepaling volgt na bezoek ter plaatse.
          </p>
        </motion.div>
      ) : (
        <div className="w-full max-w-md p-6 mb-6" style={{ backgroundColor: CREAM_DEEP, border: `1px solid ${LINE}`, borderRadius: "2px" }}>
          <p className="text-sm" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Onze expert neemt contact op met uw persoonlijke schatting.</p>
        </div>
      )}
      <p className="text-sm mb-8" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>
        Details verstuurd naar ons team. We nemen zo snel mogelijk contact op via{" "}
        <strong style={{ color: SEPIA }}>{data.email}</strong>.
      </p>
      <div className="w-full max-w-md p-5 mb-8 text-left" style={{ backgroundColor: CREAM_DEEP, border: `1px solid ${LINE}`, borderRadius: "2px" }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>Samenvatting</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {([
            ["Type", data.propertyType],
            ["Locatie", `${data.postcode ? `${data.postcode} ` : ""}${data.gemeente}${data.straat ? `, ${data.straat}` : ""}`],
            data.bewoonbaarOpp ? ["Opp.", `${data.bewoonbaarOpp} m²`] : null,
            data.slaapkamers ? ["Slaapkamers", data.slaapkamers] : null,
            data.bouwjaar ? ["Bouwjaar", data.bouwjaar] : null,
            data.staat ? ["Staat", data.staat.split("—")[0].trim()] : null,
          ] as ([string, string] | null)[]).filter((x): x is [string, string] => x !== null).map(([k, v]) => (
            <div key={k}>
              <p className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>{k}</p>
              <p className="text-sm font-medium" style={{ fontFamily: DISPLAY, color: SEPIA }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        <a href="/" className="text-sm font-semibold px-7 py-3.5 inline-flex items-center gap-2 transition-colors"
          style={{ fontFamily: DISPLAY, backgroundColor: SEPIA, color: CREAM, borderRadius: "2px" }}>
          Terug naar home
        </a>
        <a href="/aanbod" className="text-sm font-medium px-7 py-3.5 border transition-colors"
          style={{ fontFamily: DISPLAY, borderColor: LINE, color: SEPIA, borderRadius: "2px" }}>
          Bekijk ons aanbod
        </a>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
    if (step === 1) return data.postcode.length === 4 && !!data.gemeente;
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
    <div style={{ fontFamily: DISPLAY, backgroundColor: CREAM }}>
      <SiteNav activePage="schatting" />

      {/* Hero */}
      <section style={{
        backgroundColor: SEPIA,
        padding: "clamp(7rem,14vh,11rem) clamp(1.5rem,6vw,5rem) clamp(3.5rem,7vh,5.5rem)",
      }}>
        <motion.h1 initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{ fontFamily: DISPLAY, fontSize: "clamp(2.5rem,5.5vw,4.75rem)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: CREAM, margin: 0 }}>
          Hoeveel is uw woning<br /><em style={{ fontStyle: "italic", color: Y }}>waard?</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-5 max-w-md" style={{ fontFamily: DISPLAY, fontSize: "0.9375rem", color: "rgba(239,231,216,0.5)" }}>
          Vul het formulier in en ontvang binnen 24 uur een professionele schatting van onze experts — volledig gratis en vrijblijvend.
        </motion.p>
      </section>

      {/* Form */}
      <section style={{ backgroundColor: CREAM, padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,6vw,5rem)" }}>
        <div className="mx-auto" style={{ maxWidth: "760px" }}>
          {submitted ? (
            <div style={{ backgroundColor: CREAM_DEEP, border: `1px solid ${LINE}`, borderRadius: "2px", padding: "clamp(2rem,5vw,4rem)" }}>
              <Success data={data} schatting={schatting} />
            </div>
          ) : (
            <motion.div style={{ backgroundColor: CREAM_DEEP, border: `1px solid ${LINE}`, borderRadius: "2px", padding: "clamp(2rem,5vw,4rem)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>

              <ProgressBar step={step} total={STEPS.length} />

              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: EASE }}>
                  {steps[step]}
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
                <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                  className="text-sm font-medium flex items-center gap-2 px-5 py-2.5 cursor-pointer transition-colors"
                  style={{
                    fontFamily: DISPLAY,
                    color: step === 0 ? "rgba(110,90,62,0.3)" : SEPIA_SOFT,
                    border: `1px solid ${step === 0 ? LINE : SEPIA_SOFT}`,
                    borderRadius: "2px",
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Vorige
                </button>

                <span className="text-xs" style={{ fontFamily: DISPLAY, color: SEPIA_SOFT }}>{step + 1} / {STEPS.length}</span>

                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={() => canNext() && setStep(s => s + 1)}
                    className="text-sm font-semibold flex items-center gap-2 px-7 py-3 cursor-pointer transition-all"
                    style={{
                      fontFamily: DISPLAY,
                      backgroundColor: canNext() ? SEPIA : CREAM_DEEP,
                      color: canNext() ? CREAM : SEPIA_SOFT,
                      border: `1px solid ${canNext() ? SEPIA : LINE}`,
                      borderRadius: "2px",
                    }}>
                    Volgende
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                ) : (
                  <button type="button" onClick={() => canNext() && handleSubmit()} disabled={!canNext() || sending}
                    className="text-sm font-semibold flex items-center gap-2 px-7 py-3 cursor-pointer transition-all"
                    style={{
                      fontFamily: DISPLAY,
                      backgroundColor: canNext() ? Y : CREAM_DEEP,
                      color: canNext() ? SEPIA : SEPIA_SOFT,
                      border: `1px solid ${canNext() ? Y : LINE}`,
                      borderRadius: "2px",
                    }}>
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent animate-spin" style={{ borderColor: SEPIA, borderTopColor: "transparent", borderRadius: "50%" }} />
                        Verzenden…
                      </>
                    ) : "Gratis schatting aanvragen"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      {!submitted && (
        <section style={{ backgroundColor: SEPIA, padding: "clamp(3rem,5vh,4rem) clamp(1.5rem,6vw,5rem)" }}>
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: "Schatting binnen 24 uur" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "100% gratis & vrijblijvend" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: "Ervaren lokale experten" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={Y} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: "Uw gegevens zijn veilig" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                {icon}
                <span className="text-sm" style={{ fontFamily: DISPLAY, color: "rgba(239,231,216,0.55)" }}>{text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
