"use client";

import { usePathname, useRouter } from "next/navigation";

export default function EditBar({ isDraft }: { isDraft: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    router.push(`/api/admin/logout?redirectTo=${encodeURIComponent(pathname)}`);
  }

  // Open de Presentation tool op de huidige pagina
  const presentationUrl = `/studio/presentation?preview=${encodeURIComponent(pathname)}`;

  return (
    <div style={{
      position: "fixed",
      bottom: "1.25rem",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: "#111111",
      border: "1px solid #2a2a2a",
      borderRadius: "999px",
      padding: "0.45rem 0.85rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.55)",
      fontFamily: "system-ui, sans-serif",
      fontSize: "0.8rem",
      color: "#fff",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}>

      {/* Status indicator */}
      <span style={{
        width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
        backgroundColor: isDraft ? "#22c55e" : "#facb04",
        boxShadow: isDraft ? "0 0 5px #22c55e" : "0 0 5px #facb04",
      }} />

      <span style={{ color: "#888", fontSize: "0.75rem" }}>SOM Admin</span>

      {/* Scheidingslijn */}
      <span style={{ width: "1px", height: "14px", backgroundColor: "#2a2a2a", flexShrink: 0 }} />

      {/* Bewerken knop → gaat naar Presentation tool */}
      <a
        href={presentationUrl}
        style={{
          backgroundColor: "#facb04",
          color: "#111",
          borderRadius: "999px",
          padding: "0.3rem 0.9rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Bewerken
      </a>

      {/* Voorvertoning toggle */}
      <a
        href={isDraft
          ? `/api/draft-mode/disable?redirectTo=${encodeURIComponent(pathname)}`
          : `/api/draft-mode/enable?redirectTo=${encodeURIComponent(pathname)}`}
        style={{
          color: isDraft ? "#22c55e" : "#666",
          textDecoration: "none",
          fontSize: "0.73rem",
          padding: "0.25rem 0.5rem",
          borderRadius: "999px",
          border: isDraft ? "1px solid #22c55e33" : "1px solid #2a2a2a",
          transition: "all 0.15s",
        }}
        title={isDraft ? "Voorvertoning uitschakelen" : "Voorvertoning inschakelen (ongepubliceerde wijzigingen)"}
        onMouseEnter={e => (e.currentTarget.style.color = isDraft ? "#4ade80" : "#aaa")}
        onMouseLeave={e => (e.currentTarget.style.color = isDraft ? "#22c55e" : "#666")}
      >
        {isDraft ? "👁️ Voorbeeld AAN" : "👁️ Voorbeeld"}
      </a>

      {/* Scheidingslijn */}
      <span style={{ width: "1px", height: "14px", backgroundColor: "#2a2a2a", flexShrink: 0 }} />

      {/* Uitloggen */}
      <button
        onClick={logout}
        style={{
          background: "none",
          border: "none",
          color: "#555",
          fontSize: "0.72rem",
          cursor: "pointer",
          padding: "0.25rem 0.35rem",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ff6b6b")}
        onMouseLeave={e => (e.currentTarget.style.color = "#555")}
      >
        Uitloggen
      </button>
    </div>
  );
}
