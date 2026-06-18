import Link from "next/link";
import { client } from "@/sanity/lib/client";
import {
  featuredArticlesQuery,
  recentArticlesQuery,
  recentMemosQuery,
  allTopicsQuery,
  allDesksQuery,
} from "@/sanity/lib/queries";

export const revalidate = 60;

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtShort(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function HomePage() {
  const [featured, allRecent, memos, topics, desks] = await Promise.all([
    client.fetch(featuredArticlesQuery),
    client.fetch(recentArticlesQuery),
    client.fetch(recentMemosQuery),
    client.fetch(allTopicsQuery),
    client.fetch(allDesksQuery),
  ]);

  const pool: any[] = featured?.length ? featured : allRecent ?? [];
  const merged: any[] = [
    ...(pool ?? []),
    ...((allRecent ?? []).filter((a: any) => !(pool ?? []).some((p: any) => p._id === a._id))),
  ];

  const lead = merged[0];
  const subLeads = merged.slice(1, 3);
  const railArticles = merged.slice(3, 7);

  const artHref = (a: any) => `/articles/${a?.slug?.current ?? ""}`;
  const memoHref = (m: any) => `/policy-memos/${m?.slug?.current ?? ""}`;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8">
      {/* ============ FRONT PAGE LEAD ============ */}
      {lead ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10 pt-10">
          {/* lead story */}
          <div className="lg:col-span-8 lg:pr-10" style={{ borderRight: "1px solid var(--rule)" }}>
            <div className="kicker mb-4">
              {lead.topics?.[0]?.title ?? "Featured Analysis"}
              {lead.desk && <span className="kicker-ink"> &nbsp;/&nbsp; {lead.desk.title} Desk</span>}
            </div>

            <Link href={artHref(lead)} className="lead-link block">
              <h1 className="lead-head serif-display text-[2.5rem] sm:text-[3.4rem] md:text-[3.9rem] text-balance">
                {lead.title}
              </h1>
            </Link>

            {lead.excerpt && (
              <div className="dek mt-5 text-[1.18rem] sm:text-[1.3rem] measure-wide dropcap">
                <p>{lead.excerpt}</p>
              </div>
            )}

            <div className="mt-6 sans text-[0.74rem] uppercase tracking-[0.13em] text-[color:var(--ink-2)] flex flex-wrap items-center gap-x-3 gap-y-1">
              {lead.author?.name && <span>By {lead.author.name}</span>}
              {lead.author?.name && lead.date && <span className="text-[color:var(--rule-2)]">&middot;</span>}
              {lead.date && <span className="nums">{fmt(lead.date)}</span>}
            </div>

            {/* two secondary leads under the main one */}
            {subLeads.length > 0 && (
              <div className="mt-10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8" style={{ borderTop: "1px solid var(--rule)" }}>
                {subLeads.map((a: any, i: number) => (
                  <div key={a._id} className={i === 1 ? "sm:pl-8 sm:border-l" : ""} style={i === 1 ? { borderColor: "var(--rule)" } : {}}>
                    {a.topics?.[0] && <div className="kicker mb-2 text-[0.6rem]">{a.topics[0].title}</div>}
                    <Link href={artHref(a)} className="lead-link block">
                      <h2 className="lead-head serif-display text-[1.5rem] leading-[1.08] text-balance">{a.title}</h2>
                    </Link>
                    {a.excerpt && <p className="dek mt-2.5 text-[0.98rem] line-clamp-3">{a.excerpt}</p>}
                    <div className="mt-3 sans text-[0.66rem] uppercase tracking-[0.12em] text-[color:var(--ink-3)] nums">
                      {a.author?.name ? `${a.author.name} · ` : ""}{fmtShort(a.date)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* right rail — From the Desks */}
          <aside className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="kicker mb-1">From the Desks</div>
            <div className="rule-mid mb-1" />
            <div className="rule-hair mb-4" />

            <div className="divide-y" style={{ borderColor: "var(--rule)" }}>
              {railArticles.map((a: any) => (
                <Link key={a._id} href={artHref(a)} className="toc-row block py-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    {a.topics?.[0] && <span className="kicker text-[0.58rem]">{a.topics[0].title}</span>}
                    <span className="sans text-[0.62rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] nums ml-auto">{fmtShort(a.date)}</span>
                  </div>
                  <h3 className="toc-head serif-display text-[1.06rem] leading-[1.12] text-[color:var(--ink)]">{a.title}</h3>
                </Link>
              ))}
              {railArticles.length === 0 && (
                <p className="py-4 dek text-[0.95rem]">More analysis is on the way.</p>
              )}
            </div>

            {/* memos teaser inside rail */}
            {memos?.length > 0 && (
              <div className="mt-8">
                <div className="kicker mb-3" style={{ color: "var(--brass)" }}>Latest Memos</div>
                <ul className="space-y-3">
                  {memos.slice(0, 3).map((m: any) => (
                    <li key={m._id}>
                      <Link href={memoHref(m)} className="link-ink block">
                        <span className="serif-display text-[0.98rem] leading-snug">{m.title}</span>
                        <span className="block sans text-[0.62rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] mt-1 nums">{fmtShort(m.date)}{m.desk ? ` · ${m.desk.title}` : ""}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>
      ) : (
        <div className="py-24 text-center dek text-lg">No analysis has been published yet.</div>
      )}

      {/* ============ RESEARCH AREAS (numbered) ============ */}
      {topics?.length > 0 && (
        <section id="research" className="mt-20 scroll-mt-24">
          <div className="rule-thick mb-1" />
          <div className="flex items-baseline justify-between py-3 mb-2">
            <h2 className="serif-display text-[1.7rem]">Research Areas</h2>
            <span className="kicker">Five Domains of Inquiry</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t: any, i: number) => (
              <Link
                key={t._id}
                href={`/topic/${t.slug.current}`}
                className="toc-row group block p-6"
                style={{
                  borderTop: "1px solid var(--rule)",
                  borderLeft: i % 3 === 0 ? "none" : "1px solid var(--rule)",
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="serif-display text-[1.4rem] text-[color:var(--brass)] tnums leading-none pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="toc-head serif-display text-[1.25rem] leading-snug">{t.title}</h3>
                    {t.description && <p className="mt-2 text-[0.92rem] leading-relaxed" style={{ color: "var(--ink-2)", fontFamily: "var(--font-fraunces), serif" }}>{t.description}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="rule-hair" />
        </section>
      )}

      {/* ============ POLICY MEMOS — table of contents ============ */}
      {memos?.length > 0 && (
        <section id="memos" className="mt-20 scroll-mt-24">
          <div className="rule-thick mb-1" />
          <div className="flex items-baseline justify-between py-3">
            <h2 className="serif-display text-[1.7rem]">Policy Memos</h2>
            <Link href="/policy-memos" className="link-rule">Full Archive</Link>
          </div>
          <div className="rule-mid" />
          <ol>
            {memos.map((m: any, i: number) => (
              <li key={m._id}>
                <Link href={memoHref(m)} className="toc-row grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_7rem_1fr_auto] items-baseline gap-x-4 py-4" style={{ borderTop: i === 0 ? "none" : "1px solid var(--rule)" }}>
                  <span className="serif-display text-[color:var(--ink-3)] tnums text-[0.95rem]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="hidden sm:block sans text-[0.66rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)] nums">{fmt(m.date)}</span>
                  <h3 className="toc-head serif-display text-[1.15rem] leading-snug col-span-1">{m.title}</h3>
                  <span className="hidden sm:block kicker text-[0.6rem] self-center text-right">{m.desk?.title ?? "Policy Brief"}</span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="rule-hair" />
        </section>
      )}

      {/* ============ POLICY DESKS — navy band ============ */}
      {desks?.length > 0 && (
        <section id="desks" className="mt-20 scroll-mt-24 -mx-5 sm:-mx-8">
          <div className="band-navy">
            <div className="px-5 sm:px-8 py-16">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-4">
                    <div className="kicker mb-3">Policy Desks</div>
                    <h2 className="serif-display text-[2rem] text-[color:var(--paper)]">Reporting from the ground</h2>
                    <p className="mt-4 text-[0.98rem] leading-relaxed" style={{ color: "rgba(246,241,231,0.72)", fontFamily: "var(--font-fraunces), serif" }}>
                      Each desk grounds its analysis in local legislation, agencies, and the
                      communities a policy actually touches.
                    </p>
                  </div>
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3">
                    {desks.map((d: any, i: number) => (
                      <Link
                        key={d._id}
                        href={`/desk/${d.slug.current}`}
                        className="group block py-5 sm:py-2 sm:px-6"
                        style={{ borderTop: "1px solid rgba(246,241,231,0.18)", borderLeft: i % 3 === 0 ? "none" : "1px solid rgba(246,241,231,0.14)" }}
                      >
                        <h3 className="serif-display text-[1.4rem] text-[color:var(--paper)] group-hover:text-[color:var(--brass-2)] transition-colors">{d.title}</h3>
                        {d.description && <p className="mt-2 text-[0.85rem] line-clamp-3" style={{ color: "rgba(246,241,231,0.6)", fontFamily: "var(--font-fraunces), serif" }}>{d.description}</p>}
                        <span className="link-rule mt-4 inline-block" style={{ color: "var(--brass-2)", borderColor: "rgba(246,241,231,0.4)" }}>Visit Desk</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
