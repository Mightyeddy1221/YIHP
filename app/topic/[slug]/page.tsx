import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { topicBySlugQuery, articlesByTopicQuery, memosByTopicQuery, allTopicsQuery } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topic = await client.fetch(topicBySlugQuery, { slug: params.slug });
  if (!topic) return { title: "Topic Not Found" };
  return { title: topic.title };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
    <div>
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> All Topics
          </Link>
          <div className="mt-6">
            <span className="section-label">Research Area</span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mt-3">{topic.title}</h1>
            {topic.description && <p className="mt-3 text-slate-500 text-sm max-w-2xl leading-relaxed">{topic.description}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-serif text-xl text-navy-900">Articles</h2>
                <Link href="/articles" className="text-sm text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                  All articles <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {articles?.length === 0 ? (
                <p className="text-slate-400 text-sm">No articles on this topic yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {articles?.map((a: any) => (
                    <div key={a._id} className="flex items-start gap-4 py-5">
                      <BookOpen className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {a.desk && <Link href={`/desk/${a.desk.slug.current}`} className="text-xs text-slate-500 hover:text-navy-700 cursor-pointer">{a.desk.title} Desk</Link>}
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

            {memos?.length > 0 && (
              <section>
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-serif text-xl text-navy-900">Policy Memos</h2>
                  <Link href="/policy-memos" className="text-sm text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                    All memos <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {memos.map((m: any) => (
                    <Link key={m._id} href={`/policy-memos/${m.slug.current}`} className="group block cursor-pointer">
                      <div className="border border-slate-200 p-4 hover:border-navy-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-navy-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-serif text-sm font-medium text-navy-900 group-hover:text-navy-700 transition-colors">{m.title}</h3>
                            {m.date && <span className="text-xs text-slate-400 mt-1 block">{formatDate(m.date)}</span>}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {allTopics?.length > 0 && (
              <div className="border border-slate-200 p-5">
                <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">All Topics</h3>
                <div className="space-y-2">
                  {allTopics.map((t: any) => (
                    <Link key={t._id} href={`/topic/${t.slug.current}`} className={`block text-sm py-1 cursor-pointer ${params.slug === t.slug.current ? "text-gold-500 font-medium" : "text-navy-700 hover:text-gold-500 transition-colors"}`}>
                      {t.title}
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
