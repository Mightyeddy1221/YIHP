// Central SEO configuration and helpers for YIHP.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://youthihp.org").replace(/\/$/, "");
export const SITE_NAME = "Youth Institute for Health Policy";
export const SITE_SHORT = "YIHP";
export const SITE_DESCRIPTION =
  "Rigorous, accessible health policy research and analysis advancing health equity across Massachusetts, New York City, Virginia, and beyond.";

export const SITE_KEYWORDS = [
  "health policy",
  "health equity",
  "youth policy research",
  "mental health policy",
  "substance abuse policy",
  "housing policy",
  "criminal justice reform",
  "education policy",
  "think tank",
  "policy memos",
];

/** Build an absolute URL from a path. */
export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** URL for a dynamically generated, branded social-share card. */
export function ogImageUrl({ title, kicker }: { title: string; kicker?: string }): string {
  const params = new URLSearchParams({ title: title.slice(0, 160) });
  if (kicker) params.set("kicker", kicker);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Reusable Organization node for JSON-LD, referenced by @id across pages. */
export const ORGANIZATION_LD = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: SITE_SHORT,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  knowsAbout: [
    "Mental Health Policy",
    "Substance Abuse Policy",
    "Housing Policy",
    "Criminal Justice Reform",
    "Education Policy",
    "Health Equity",
  ],
  logo: {
    "@type": "ImageObject",
    url: ogImageUrl({ title: SITE_SHORT, kicker: SITE_NAME }),
  },
};
