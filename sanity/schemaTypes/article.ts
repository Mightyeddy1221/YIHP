import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, fields: [
      defineField({ name: "alt", title: "Alt Text", type: "string" }),
    ]}),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "teamMember" }] }),
    defineField({ name: "date", title: "Publication Date", type: "date", initialValue: () => new Date().toISOString().split("T")[0] }),
    defineField({ name: "desk", title: "Policy Desk", type: "reference", to: [{ type: "policyDesk" }] }),
    defineField({ name: "topics", title: "Topics", type: "array", of: [{ type: "reference", to: [{ type: "topicArea" }] }] }),
    defineField({ name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block", styles: [
          { title: "Normal", value: "normal" },
          { title: "Heading 2", value: "h2" },
          { title: "Heading 3", value: "h3" },
          { title: "Quote", value: "blockquote" },
        ]},
        { type: "image", options: { hotspot: true }, fields: [
          defineField({ name: "alt", title: "Alt Text", type: "string" }),
          defineField({ name: "caption", title: "Caption", type: "string" }),
        ]},
      ],
    }),
  ],
  orderings: [{ title: "Date, Newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "date", media: "heroImage" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ?? "No date", media };
    },
  },
});
