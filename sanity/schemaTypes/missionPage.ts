import { defineField, defineType } from "sanity";

export default defineType({
  name: "missionPage",
  title: "Mission Page",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheadline", title: "Sub-headline", type: "text", rows: 2 }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Value Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Mission Page" }) },
});
