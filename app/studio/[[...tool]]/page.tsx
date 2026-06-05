"use client";
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export default function StudioPage() {
  if (!projectId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui", background: "#101010", color: "#fff", gap: "1rem", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem" }}>⚙️</div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Studio niet geconfigureerd</h1>
        <p style={{ color: "#888", maxWidth: "400px" }}>
          Voeg <code style={{ background: "#222", padding: "2px 6px", borderRadius: "4px" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> toe als environment variable in Vercel en redeploy.
        </p>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
