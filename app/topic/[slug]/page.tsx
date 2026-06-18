import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { topicBySlugQuery, articlesByTopicQuery, memosByTopicQuery, allTopicsQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = await client.fetch(topicBySlugQuery, { slug: params.slug });
  if (!topic) return { title: "Topic Not Found" };

  const url = `${SITE_URL}/topic/${params.slug}`;
  const title = `${topic.title} — Research`;
  const description = topic.description || `YIHP research and policy memos on ${topic.title}.`;
  const ogImage = ogImageUrl({ title: topic.title, kicker: "Research Area" });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: [{ url: ogImage, width: 1200, height: 630, alt: topic.title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const [topic, articles, memos, allTopics] = await Promise.all([
    client.fetch(topicBySlugQuery, { slug: params.slug }),
    client.fetch(articlesByTopicQuery, { slug: params.slug }),
    client.fetch(memosByTopicQuery, { slug: params.slug }),
    client.fetch(allTopicsQuery),
  ]);

  if (!topic) notFound();

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      <Link href="/articles" className="link-rule" style={{ borderColor: "var(--rule-2)" }}>&larr; All Articles</Link>

      <header className="mt-8">
        <div className="kicker mb-3">Research Area</div>
        <h1 className="serif-display text-[2.8rem] sm:text-[3.8rem]">{topic.title}</h1>
        {topic.description && <p className="dek mt-4 text-[1.2rem] measure-wide">{topic.description}</p>}
      </header>

      <div className="rule-double mt-8 mb-2" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_15rem] gap-12">
        <div className="space-y-14">
          <section>
            <div className="flex items-baseline justify-between py-3">
              <h2 className="serif-display text-[1.5rem]">Articles</h2>
              <Link href="/articles" className="link-rule">All Articles</Link>
            </div>
            {articles?.length === 0 ? (
              <p className="dek py-4">No articles on this topic yet.</p>
            ) : (
              <ol>
                {articles.map((a: any, i: number) => (
                  <li key={a._id}>
                    <Link href={`/articles/${a.slug.current}`} className="toc-row grid grid-cols-[1fr_8rem] items-baseline gap-4 py-5" style={{ borderTop: "1px solid var(--rule)" }}>
                      <div>
                        {a.desk && <span className="kicker kicker-ink text-[0.6rem] block mb-1">{a.desk.title} Desk</span>}
                        <h3 className="toc-head serif-display text-[1.25rem] leading-snug">{a.title}</h3>
                      </div>
                      <span className="text-right sans text-[0.66rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] nums">{fmt(a.date)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {memos?.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between py-3">
                <h2 className="serif-display text-[1.5rem]">Policy Memos</h2>
                <Link href="/policy-memos" className="link-rule">All Memos</Link>
              </div>
              <ol>
                {memos.map((m: any) => (
                  <li key={m._id}>
                    <Link href={`/policy-memos/${m.slug.current}`} className="toc-row grid grid-cols-[1fr_8rem] items-baseline gap-4 py-5" style={{ borderTop: "1px solid var(--rule)" }}>
                      <h3 className="toc-head serif-display text-[1.2rem] leading-snug">{m.title}</h3>
                      <span className="text-right sans text-[0.66rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] nums">{fmt(m.date)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="lg:pt-3">
          <div className="rule-thick mb-1" />
          <div className="kicker py-3">All Research Areas</div>
          <ul className="space-y-2.5">
            {allTopics?.map((t: any) => {
              const active = params.slug === t.slug.current;
              return (
                <li key={t._id}>
                  <Link
                    href={`/topic/${t.slug.current}`}
                    className="serif-display text-[1.05rem] flex items-baseline gap-2"
                    style={{ color: active ? "var(--brass)" : "var(--ink)" }}
                  >
                    {active && <span className="text-[color:var(--brass)]">—</span>}
                    {t.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
