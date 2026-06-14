"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

export default function EditBar({ isDraft }: { isDraft: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editOn, setEditOn] = useState(isDraft);

  function toggleEdit() {
    startTransition(() => {
      if (editOn) {
        router.push(`/api/draft-mode/disable?redirectTo=${encodeURIComponent(pathname)}`);
      } else {
        router.push(`/api/draft-mode/enable?redirectTo=${encodeURIComponent(pathname)}`);
      }
      setEditOn(!editOn);
    });
  }

  function logout() {
    router.push(`/api/admin/logout?redirectTo=${encodeURIComponent(pathname)}`);
  }

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
      border: "1px solid #333",
      borderRadius: "999px",
      padding: "0.5rem 0.75rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      fontFamily: "system-ui, sans-serif",
      fontSize: "0.8rem",
      color: "#fff",
      userSelect: "none",
      whiteSpace: "nowrap",
    }}>
      {/* Status dot */}
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
        backgroundColor: editOn ? "#22c55e" : "#6b7280",
        boxShadow: editOn ? "0 0 6px #22c55e" : "none",
      }} />

      <span style={{ color: "#aaa", marginRight: "0.25rem" }}>SOM Admin</span>

      {/* Toggle knop */}
      <button
        onClick={toggleEdit}
        disabled={pending}
        style={{
          backgroundColor: editOn ? "#facb04" : "#222",
          color: editOn ? "#111" : "#fff",
          border: editOn ? "none" : "1px solid #444",
          borderRadius: "999px",
          padding: "0.3rem 0.85rem",
          fontSize: "0.78rem",
          fontWeight: 700,
          cursor: pending ? "default" : "pointer",
          opacity: pending ? 0.6 : 1,
          transition: "all 0.2s",
        }}
      >
        {pending ? "..." : editOn ? "✏️ Bewerken AAN" : "✏️ Bewerken UIT"}
      </button>

      {/* Naar Studio */}
      <a
        href="/studio"
        style={{
          color: "#aaa",
          textDecoration: "none",
          padding: "0.3rem 0.6rem",
          borderRadius: "999px",
          fontSize: "0.75rem",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "#aaa")}
      >
        Studio →
      </a>

      {/* Scheidingslijn */}
      <span style={{ width: "1px", height: "16px", backgroundColor: "#333", flexShrink: 0 }} />

      {/* Uitloggen */}
      <button
        onClick={logout}
        style={{
          background: "none",
          border: "none",
          color: "#666",
          fontSize: "0.75rem",
          cursor: "pointer",
          padding: "0.3rem 0.4rem",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#ff6b6b")}
        onMouseLeave={e => (e.currentTarget.style.color = "#666")}
      >
        Uitloggen
      </button>
    </div>
  );
}
