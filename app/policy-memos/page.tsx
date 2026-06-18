import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allMemosQuery, allTopicsQuery } from "@/sanity/lib/queries";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Policy Memos",
  description: "Targeted, evidence-based policy memos from YIHP intended to inform legislative and administrative decisions on health policy.",
  alternates: { canonical: `${SITE_URL}/policy-memos` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/policy-memos`,
    title: "Policy Memos",
    description: "Targeted, evidence-based policy memos from YIHP.",
    images: [{ url: ogImageUrl({ title: "Policy Memos", kicker: "Youth Institute for Health Policy" }), width: 1200, height: 630 }],
  },
};
export const revalidate = 60;

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function PolicyMemosPage() {
  const [memos, topics] = await Promise.all([
    client.fetch(allMemosQuery),
    client.fetch(allTopicsQuery),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      <header>
        <div className="kicker mb-3">The Archive</div>
        <h1 className="serif-display text-[3rem] sm:text-[4rem]">Policy Memos</h1>
        <p className="dek mt-4 text-[1.2rem] measure-wide">
          Focused briefs and recommendations written to inform a specific legislative or
          administrative decision — for policymakers, advocates, and the public.
        </p>
      </header>

      {topics?.length > 0 && (
        <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="kicker">Filter by topic</span>
          {topics.map((t: any, i: number) => (
            <span key={t._id} className="flex items-baseline">
              {i > 0 && <span className="text-[color:var(--rule-2)] mr-3">&middot;</span>}
              <Link href={`/topic/${t.slug.current}`} className="link-ink sans text-[0.82rem] uppercase tracking-[0.08em] hover:text-[color:var(--brass)]">
                {t.title}
              </Link>
            </span>
          ))}
        </div>
      )}

      <div className="rule-double mt-8 mb-2" />

      {memos?.length === 0 ? (
        <p className="py-20 text-center dek text-lg">
          No memos have been published yet. Add the first in the{" "}
          <Link href="/studio" className="link-rule">Studio</Link>.
        </p>
      ) : (
        <ol>
          {memos?.map((memo: any, i: number) => (
            <li key={memo._id}>
              <article
                className="toc-row grid grid-cols-1 md:grid-cols-[4rem_1fr_11rem] gap-x-8 gap-y-3 py-9"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--rule)" }}
              >
                <div className="serif-display text-[1.6rem] text-[color:var(--brass)] tnums leading-none hidden md:block pt-1">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                    {memo.topics?.[0] && (
                      <Link href={`/topic/${memo.topics[0].slug.current}`} className="kicker hover:text-[color:var(--ink)]">{memo.topics[0].title}</Link>
                    )}
                    {memo.desk && (
                      <Link href={`/desk/${memo.desk.slug.current}`} className="kicker kicker-ink hover:text-[color:var(--ink)]">{memo.desk.title} Desk</Link>
                    )}
                  </div>
                  <Link href={`/policy-memos/${memo.slug.current}`} className="lead-link block">
                    <h2 className="lead-head serif-display text-[1.7rem] leading-[1.08] text-balance">{memo.title}</h2>
                  </Link>
                  {memo.authors?.length > 0 && (
                    <p className="mt-3 sans text-[0.68rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)]">
                      By {memo.authors.map((a: any) => a.name).join(", ")}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link href={`/policy-memos/${memo.slug.current}`} className="link-rule">Read Summary</Link>
                    {memo.pdfFile?.asset && (
                      <a href={memo.pdfFile.asset.url} target="_blank" rel="noopener noreferrer" className="sans text-[0.7rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)] hover:text-[color:var(--ink)] transition-colors">
                        Download PDF &darr;
                      </a>
                    )}
                  </div>
                </div>

                <div className="md:text-right sans text-[0.7rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)] nums md:pt-1">
                  {fmt(memo.date)}
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
      <div className="rule-hair" />
    </div>
  );
}
