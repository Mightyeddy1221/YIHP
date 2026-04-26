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
      name: "summary",
      title: "Executive Summary",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
  ],
  orderings: [{ title: "Date, Newest", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date" } },
});
