import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { deskBySlugQuery, articlesByDeskQuery, memosByDeskQuery, allDesksQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const desk = await client.fetch(deskBySlugQuery, { slug: params.slug });
  if (!desk) return { title: "Desk Not Found" };
  return { title: `${desk.title} Policy Desk` };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
      <div className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> All Desks
          </Link>
          <span className="section-label text-gold-400">Policy Desk</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mt-3">{desk.title}</h1>
          {desk.description && <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-2xl">{desk.description}</p>}
          {desk.location && <p className="mt-3 text-xs text-slate-400">{desk.location}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-serif text-xl text-navy-900">Articles</h2>
                <Link href="/articles" className="text-sm text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                  All articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {articles?.length === 0 ? (
                <p className="text-slate-400 text-sm">No articles from this desk yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {articles?.map((a: any) => (
                    <div key={a._id} className="flex items-start gap-4 py-5">
                      <BookOpen className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {a.topics?.[0] && <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">{a.topics[0].title}</span>}
                          {a.date && <><span className="text-slate-300 text-xs">·</span><span className="text-xs text-slate-400">{formatDate(a.date)}</span></>}
                        </div>
                        <Link href={`/articles/${a.slug.current}`} className="group cursor-pointer">
                          <h3 className="font-serif text-base text-navy-900 group-hover:text-navy-700 transition-colors">{a.title}</h3>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-serif text-xl text-navy-900">Policy Memos</h2>
                <Link href="/policy-memos" className="text-sm text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                  All memos <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {memos?.length === 0 ? (
                <p className="text-slate-400 text-sm">No memos from this desk yet.</p>
              ) : (
                <div className="space-y-3">
                  {memos?.map((m: any) => (
                    <Link key={m._id} href={`/policy-memos/${m.slug.current}`} className="group block cursor-pointer">
                      <div className="border border-slate-200 p-4 hover:border-navy-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-navy-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-serif text-sm font-medium text-navy-900 group-hover:text-navy-700 transition-colors">{m.title}</h3>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                              {m.date && <span className="text-xs text-slate-400">{formatDate(m.date)}</span>}
                              {m.tags?.map((tag: string) => (
                                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            {allDesks?.length > 0 && (
              <div className="border border-slate-200 p-5">
                <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">All Policy Desks</h3>
                <div className="space-y-2">
                  {allDesks.map((d: any) => (
                    <Link key={d._id} href={`/desk/${d.slug.current}`} className={`block text-sm py-1.5 cursor-pointer ${params.slug === d.slug.current ? "text-gold-500 font-medium" : "text-navy-700 hover:text-gold-500 transition-colors"}`}>
                      {d.title} Desk
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
