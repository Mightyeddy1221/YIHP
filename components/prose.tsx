import type { PortableTextComponents } from "@portabletext/react";

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "section"
  );
}

export function blockText(value: any): string {
  return Array.isArray(value?.children) ? value.children.map((c: any) => c.text || "").join("") : "";
}

export type Heading = { id: string; text: string; level: number };

/** Pull h2/h3 headings out of a PortableText array for a table-of-contents. */
export function extractHeadings(blocks: any): Heading[] {
  if (!Array.isArray(blocks)) return [];
  const out: Heading[] = [];
  for (const b of blocks) {
    if (b?._type === "block" && (b.style === "h2" || b.style === "h3")) {
      const text = blockText(b).trim();
      if (!text) continue;
      out.push({ id: slugify(text), text, level: b.style === "h2" ? 2 : 3 });
    }
  }
  return out;
}

/** PortableText renderer that stamps stable ids on headings so the TOC can anchor to them. */
export const proseComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={slugify(blockText(value))} className="scroll-mt-24">{children}</h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugify(blockText(value))} className="scroll-mt-24">{children}</h3>
    ),
  },
};
