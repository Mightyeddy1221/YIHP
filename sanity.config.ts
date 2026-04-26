import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  title: "YIHP",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("YIHP Content")
          .items([
            S.listItem().title("Mission Page").child(
              S.document().schemaType("missionPage").documentId("missionPage")
            ),
            S.divider(),
            S.documentTypeListItem("article").title("Articles"),
            S.documentTypeListItem("policyMemo").title("Policy Memos"),
            S.divider(),
            S.documentTypeListItem("policyDesk").title("Policy Desks"),
            S.documentTypeListItem("topicArea").title("Topic Areas"),
            S.divider(),
            S.documentTypeListItem("teamMember").title("Team Members"),
          ]),
    }),
  ],
});
