"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    if (!inIframe) setVisible(true);
  }, [pathname]);

  if (!visible) return null;

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
      <span style={{
        width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
        backgroundColor: "#facb04",
        boxShadow: "0 0 5px #facb04",
      }} />
      <span style={{ color: "#888", fontSize: "0.75rem" }}>SOM Admin</span>
      <span style={{ width: "1px", height: "14px", backgroundColor: "#2a2a2a", flexShrink: 0 }} />
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
