import { TagIcon } from "@sanity/icons";
import { useDocumentOperation, type DocumentActionComponent } from "sanity";

// Pull plain text out of a Portable Text array (summary or body).
function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b?._type === "block")
    .map((b: any) => (b.children || []).map((c: any) => c?.text ?? "").join(""))
    .join(" ");
}

// Derive a tidy set of tags from a memo's title, summary, and body.
// Heuristic and deterministic — no AI/API needed. Tuned for YIHP policy memos:
// bill numbers, geography, and the topic areas YIHP covers.
export function generateTags(doc: any): string[] {
  const text = [doc?.title, blocksToText(doc?.summary), blocksToText(doc?.body)]
    .filter(Boolean)
    .join("  ");
  if (!text.trim()) return Array.isArray(doc?.tags) ? doc.tags : [];

  const lower = text.toLowerCase();
  const found = new Set<string>();

  // 1) Bill numbers — H.680, S.2706, H680, "S 2706", etc.
  const billRe = /\b([HS])\.?\s?(\d{2,4})\b/g;
  let m: RegExpExecArray | null;
  while ((m = billRe.exec(text)) !== null) found.add(`${m[1].toUpperCase()}.${m[2]}`);

  // 2) Geography
  const geography: [RegExp, string][] = [
    [/massachusetts|\bmass\b/, "Massachusetts"],
    [/new york city|\bnyc\b/, "New York City"],
    [/virginia/, "Virginia"],
  ];
  for (const [re, tag] of geography) if (re.test(lower)) found.add(tag);

  // 3) Topic keywords → canonical tags
  const topics: [RegExp, string][] = [
    [/mental health/, "Mental Health"],
    [/counselor|counseling|psychologist/, "School Counselors"],
    [/substance|opioid|addiction|overdose/, "Substance Abuse"],
    [/housing|homeless/, "Housing"],
    [/criminal justice|incarcerat|juvenile/, "Criminal Justice"],
    [/\beducation\b|public school|students?\b/, "Education"],
    [/medicaid/, "Medicaid"],
    [/equity|disparit|inequalit/, "Health Equity"],
    [/funding|budget|appropriation/, "Funding"],
    [/legislation|legislature|\bbill\b/, "Legislation"],
  ];
  for (const [re, tag] of topics) if (re.test(lower)) found.add(tag);

  // Merge with any tags already on the document so manual ones aren't lost.
  const existing: string[] = Array.isArray(doc?.tags) ? doc.tags : [];
  return Array.from(new Set([...existing, ...found])).slice(0, 8);
}

// Studio document action: adds a "Generate Tags" button to policy memos.
export const GenerateTagsAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const doc = props.draft || props.published;

  return {
    label: "Generate Tags",
    icon: TagIcon,
    onHandle: () => {
      const tags = generateTags(doc);
      if (tags.length) patch.execute([{ set: { tags } }]);
      props.onComplete();
    },
  };
};
