import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { recentArticlesQuery, allTopicsQuery } from "@/sanity/lib/queries";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Articles",
  description: "Long-form health policy analysis from YIHP researchers on mental health, substance abuse, housing, criminal justice, and education.",
  alternates: { canonical: `${SITE_URL}/articles` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/articles`,
    title: "Articles",
    description: "Long-form health policy analysis from YIHP researchers.",
    images: [{ url: ogImageUrl({ title: "Articles", kicker: "Youth Institute for Health Policy" }), width: 1200, height: 630 }],
  },
};
export const revalidate = 60;

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function ArticlesPage() {
  const [articles, topics] = await Promise.all([
    client.fetch(recentArticlesQuery),
    client.fetch(allTopicsQuery),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      {/* title block */}
      <header>
        <div className="kicker mb-3">The Publication</div>
        <h1 className="serif-display text-[3rem] sm:text-[4rem]">Articles</h1>
        <p className="dek mt-4 text-[1.2rem] measure-wide">
          Long-form analysis and original research from our desks — on the policies
          shaping mental health, housing, substance use, and justice.
        </p>
      </header>

      {/* filter run */}
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

      {/* index */}
      {articles?.length === 0 ? (
        <p className="py-20 text-center dek text-lg">
          No articles have been published yet. Add the first in the{" "}
          <Link href="/studio" className="link-rule">Studio</Link>.
        </p>
      ) : (
        <ol>
          {articles?.map((a: any, i: number) => (
            <li key={a._id}>
              <article
                className="toc-row grid grid-cols-1 md:grid-cols-[4rem_1fr_11rem] gap-x-8 gap-y-2 py-9"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--rule)" }}
              >
                {/* number */}
                <div className="serif-display text-[1.6rem] text-[color:var(--brass)] tnums leading-none hidden md:block pt-1">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* main */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 mb-2">
                    {a.topics?.[0] && (
                      <Link href={`/topic/${a.topics[0].slug.current}`} className="kicker hover:text-[color:var(--ink)]">{a.topics[0].title}</Link>
                    )}
                    {a.desk && (
                      <Link href={`/desk/${a.desk.slug.current}`} className="kicker kicker-ink hover:text-[color:var(--ink)]">{a.desk.title} Desk</Link>
                    )}
                  </div>
                  <Link href={`/articles/${a.slug.current}`} className="lead-link block">
                    <h2 className="lead-head serif-display text-[1.9rem] leading-[1.06] text-balance">{a.title}</h2>
                  </Link>
                  {a.excerpt && <p className="mt-3 text-[1.02rem] leading-relaxed measure-wide" style={{ color: "var(--ink-2)", fontFamily: "var(--font-fraunces), serif" }}>{a.excerpt}</p>}
                  <div className="mt-4 sans text-[0.68rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)]">
                    {a.author?.name ? `By ${a.author.name}` : "YIHP Staff"}
                  </div>
                </div>

                {/* date column */}
                <div className="md:text-right sans text-[0.7rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)] nums md:pt-1">
                  {fmt(a.date)}
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
