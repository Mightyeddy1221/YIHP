import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { deskBySlugQuery, articlesByDeskQuery, memosByDeskQuery, allDesksQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const desk = await client.fetch(deskBySlugQuery, { slug: params.slug });
  if (!desk) return { title: "Desk Not Found" };

  const url = `${SITE_URL}/desk/${params.slug}`;
  const title = `${desk.title} Policy Desk`;
  const description = desk.description || `YIHP's ${desk.title} policy desk — regional health policy research and memos.`;
  const ogImage = ogImageUrl({ title: desk.title, kicker: "Policy Desk" });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function DeskPage({ params }: { params: { slug: string } }) {
  const [desk, articles, memos, allDesks] = await Promise.all([
    client.fetch(deskBySlugQuery, { slug: params.slug }),
    client.fetch(articlesByDeskQuery, { slug: params.slug }),
    client.fetch(memosByDeskQuery, { slug: params.slug }),
    client.fetch(allDesksQuery),
  ]);

  if (!desk) notFound();

  return (
    <div>
      {/* desk nameplate — navy band for a sense of place */}
      <section className="-mt-px">
        <div className="band-navy">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
            <Link href="/articles" className="link-rule" style={{ color: "var(--brass-2)", borderColor: "rgba(246,241,231,0.4)" }}>&larr; All Desks</Link>
            <div className="kicker mt-6 mb-3">Policy Desk</div>
            <h1 className="serif-display text-[2.8rem] sm:text-[3.8rem] text-[color:var(--paper)]">{desk.title}</h1>
            {desk.description && <p className="mt-4 text-[1.1rem] leading-relaxed max-w-2xl" style={{ color: "rgba(246,241,231,0.78)", fontFamily: "var(--font-fraunces), serif" }}>{desk.description}</p>}
            {desk.location && <p className="mt-3 sans text-[0.66rem] uppercase tracking-[0.14em]" style={{ color: "rgba(246,241,231,0.5)" }}>{desk.location}</p>}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_15rem] gap-12">
          <div className="space-y-14">
            <section>
              <div className="flex items-baseline justify-between py-3">
                <h2 className="serif-display text-[1.5rem]">Articles</h2>
                <Link href="/articles" className="link-rule">All Articles</Link>
              </div>
              {articles?.length === 0 ? (
                <p className="dek py-4">No articles from this desk yet.</p>
              ) : (
                <ol>
                  {articles.map((a: any) => (
                    <li key={a._id}>
                      <Link href={`/articles/${a.slug.current}`} className="toc-row grid grid-cols-[1fr_8rem] items-baseline gap-4 py-5" style={{ borderTop: "1px solid var(--rule)" }}>
                        <div>
                          {a.topics?.[0] && <span className="kicker text-[0.6rem] block mb-1">{a.topics[0].title}</span>}
                          <h3 className="toc-head serif-display text-[1.25rem] leading-snug">{a.title}</h3>
                        </div>
                        <span className="text-right sans text-[0.66rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] nums">{fmt(a.date)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section>
              <div className="flex items-baseline justify-between py-3">
                <h2 className="serif-display text-[1.5rem]">Policy Memos</h2>
                <Link href="/policy-memos" className="link-rule">All Memos</Link>
              </div>
              {memos?.length === 0 ? (
                <p className="dek py-4">No memos from this desk yet.</p>
              ) : (
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
              )}
            </section>
          </div>

          <aside className="lg:pt-3">
            <div className="rule-thick mb-1" />
            <div className="kicker py-3">All Policy Desks</div>
            <ul className="space-y-2.5">
              {allDesks?.map((d: any) => {
                const active = params.slug === d.slug.current;
                return (
                  <li key={d._id}>
                    <Link
                      href={`/desk/${d.slug.current}`}
                      className="serif-display text-[1.05rem] flex items-baseline gap-2"
                      style={{ color: active ? "var(--brass)" : "var(--ink)" }}
                    >
                      {active && <span className="text-[color:var(--brass)]">—</span>}
                      {d.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
