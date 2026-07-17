import { defineField, defineType } from "sanity";

export default defineType({
  name: "policyMemo",
  title: "Policy Memo",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "date", initialValue: () => new Date().toISOString().split("T")[0] }),
    defineField({ name: "authors", title: "Authors", type: "array", of: [{ type: "reference", to: [{ type: "teamMember" }] }] }),
    defineField({ name: "desk", title: "Policy Desk", type: "reference", to: [{ type: "policyDesk" }] }),
    defineField({ name: "topics", title: "Topics", type: "array", of: [{ type: "reference", to: [{ type: "topicArea" }] }] }),
    defineField({ name: "pdfFile", title: "PDF File", type: "file", options: { accept: ".pdf" } }),
    defineField({
      name: "videoUrl",
      title: "Video (YouTube link)",
      type: "url",
      description: "Paste a YouTube link (unlisted recommended). It plays directly on the memo page in a custom YIHP-styled player — visitors never see YouTube's interface or leave the site.",
    }),
    defineField({
      name: "summary",
      title: "Executive Summary",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "body",
      title: "Full Memo (Body)",
      description: "Optional. The full text of the memo, shown on the page below the summary. Use this for longer pieces or multi-author collections; leave blank for summary-plus-PDF memos.",
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
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "seo", title: "SEO & Social Sharing", type: "seo" }),
  ],
  orderings: [{ title: "Date, Newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date" } },
});
