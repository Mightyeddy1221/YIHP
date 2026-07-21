import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Full Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role / Title", type: "string" }),
    defineField({ name: "bio", title: "Short Bio (team card)", type: "text", rows: 4, description: "One or two sentences shown on the team-page card." }),
    defineField({ name: "fullBio", title: "Full Bio (individual page)", type: "text", rows: 10, description: "~150–200 words, written in the third person (e.g. \"Ian is a junior at Phillips Academy…\"). Shown on this person's own page. Leave a blank line between paragraphs." }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "desk", title: "Policy Desk", type: "reference", to: [{ type: "policyDesk" }] }),
    defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 99 }),
  ],
  orderings: [{ title: "Display Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
