"use client";

import { PortableText as SanityPortableText } from "@portabletext/react";

type Block = {
  _type: string;
  _key: string;
  style?: string;
  children?: { _key: string; _type: string; text: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string }[];
};

const components = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: "1em", lineHeight: 1.75, color: "inherit" }}>{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.35rem", fontWeight: 600, marginBottom: "0.5em", marginTop: "1.25em" }}>{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em>{children}</em>
    ),
  },
};

export default function PortableText({ value }: { value: Block[] | string | null | undefined }) {
  if (!value) return null;

  // Backwards compat: als het nog een plain string is
  if (typeof value === "string") {
    return (
      <div>
        {value.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: "1em", lineHeight: 1.75 }}>{para}</p>
        ))}
      </div>
    );
  }

  return <SanityPortableText value={value} components={components} />;
}
