import { defineField, defineType } from "sanity";

export default defineType({
  name: "topicArea",
  title: "Topic Area",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "color", title: "Color (hex)", type: "string", initialValue: "#1B3A5C" }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
