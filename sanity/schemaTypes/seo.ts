import { defineField, defineType } from "sanity";

// Optional per-document SEO overrides. Every field is optional and falls back
// to sensible defaults (the document's title, excerpt/summary, and an
// auto-generated branded social card) when left blank.
export default defineType({
  name: "seo",
  title: "SEO & Social Sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Overrides the title shown in Google results and the browser tab. Leave blank to use the title above. Best kept under ~60 characters.",
      validation: (r) => r.max(70).warning("Titles longer than 70 characters may be cut off by Google."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "The grey summary line shown under the title in Google results. Leave blank to use the excerpt / executive summary. Aim for 120–160 characters.",
      validation: (r) => r.max(180).warning("Descriptions longer than ~160 characters may be cut off by Google."),
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description:
        "Custom image shown when this page is shared on LinkedIn, X, Facebook, etc. (1200×630 recommended). Leave blank to auto-generate a branded YIHP card.",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),
    defineField({
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      description:
        "Turn ON to keep this page out of Google and other search engines. Most pages should leave this OFF.",
      initialValue: false,
    }),
  ],
});
