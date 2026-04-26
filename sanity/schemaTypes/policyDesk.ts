import { defineField, defineType } from "sanity";

export default defineType({
  name: "policyDesk",
  title: "Policy Desk",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "color", title: "Accent Color (hex)", type: "string", initialValue: "#1B3A5C" }),
  ],
  preview: { select: { title: "title", subtitle: "location" } },
});
