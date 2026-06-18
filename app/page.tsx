import Link from "next/link";
import { ArrowRight, FileText, BookOpen } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { featuredArticlesQuery, recentArticlesQuery, recentMemosQuery, allTopicsQuery, allDesksQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function HomePage() {
  const [featured, allRecent, memos, topics, desks] = await Promise.all([
    client.fetch(featuredArticlesQuery),
    client.fetch(recentArticlesQuery),
    client.fetch(recentMemosQuery),
    client.fetch(allTopicsQuery),
    client.fetch(allDesksQuery),
  ]);

  // If no featured articles, fall back to most recent
  const featuredArticles = featured?.length ? featured : allRecent?.slice(0, 2) ?? [];
  const recentArticles = allRecent?.slice(featuredArticles.length, featuredArticles.length + 4) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="section-label text-gold-400">Youth Institute for Health Policy</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 leading-tight text-balance">
              Policy Research for a Healthier Future
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              YIHP produces rigorous, accessible policy analysis on mental health, substance abuse, housing, and criminal
              justice — advancing health equity across Massachusetts and beyond.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/articles" className="btn-primary">
                Read Our Research <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/policy-memos" className="inline-flex items-center gap-2 border border-white/40 text-white text-sm font-medium px-5 py-2.5 hover:border-white transition-colors duration-150">
                Policy Memos <FileText className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="section-label">Featured Research</span>
            <h2 className="font-serif text-2xl md:text-3xl text-navy-900 mt-2">Latest Articles</h2>
          </div>
          <Link href="/articles" className="text-sm text-navy-800 font-medium hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
            All articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredArticles.length === 0 ? (
          <p className="text-slate-400 text-sm py-8">No articles published yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArticles.map((article: any) => (
                <Link key={article._id} href={`/articles/${article.slug.current}`} className="group cursor-pointer">
                  <article className="border border-slate-200 p-6 hover:border-navy-300 transition-colors duration-200 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      {article.topics?.[0] && (
                        <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">{article.topics[0].title}</span>
                      )}
                      {article.desk && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{article.desk.title} Desk</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-navy-900 leading-snug group-hover:text-navy-700 transition-colors text-balance">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">{article.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{article.date ? formatDate(article.date) : ""}</span>
                      <span className="text-xs font-medium text-navy-700 group-hover:text-gold-500 transition-colors flex items-center gap-1">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {recentArticles.length > 0 && (
              <div className="mt-8 divide-y divide-slate-100">
                {recentArticles.map((article: any) => (
                  <Link key={article._id} href={`/articles/${article.slug.current}`} className="group flex items-start gap-4 py-5 cursor-pointer">
                    <BookOpen className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {article.topics?.[0] && (
                          <span className="text-xs font-semibold text-gold-500 uppercase tracking-wider">{article.topics[0].title}</span>
                        )}
                        {article.date && <span className="text-xs text-slate-400">{formatDate(article.date)}</span>}
                      </div>
                      <h4 className="font-serif text-base text-navy-900 group-hover:text-navy-700 transition-colors leading-snug">{article.title}</h4>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gold-500 transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <div className="border-t border-slate-100" />

      {/* Policy Memos */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="section-label">Policy Memos</span>
              <h2 className="font-serif text-2xl md:text-3xl text-navy-900 mt-2">Recent Memos</h2>
            </div>
            <Link href="/policy-memos" className="text-sm text-navy-800 font-medium hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
              Full archive <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {memos?.length === 0 ? (
            <p className="text-slate-400 text-sm py-8">No memos published yet.</p>
          ) : (
            <div className="space-y-4">
              {memos?.map((memo: any) => (
                <Link key={memo._id} href={`/policy-memos/${memo.slug.current}`} className="group block cursor-pointer">
                  <div className="bg-white border border-slate-200 p-5 hover:border-navy-300 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-navy-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base font-medium text-navy-900 group-hover:text-navy-700 transition-colors leading-snug">
                          {memo.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {memo.date && <span className="text-xs text-slate-400">{formatDate(memo.date)}</span>}
                          {memo.desk && <><span className="text-slate-200">·</span><span className="text-xs text-slate-500">{memo.desk.title} Desk</span></>}
                          {memo.tags?.map((tag: string) => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gold-500 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Topic Areas */}
      {topics?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <span className="section-label">Research Areas</span>
            <h2 className="font-serif text-2xl md:text-3xl text-navy-900 mt-2">Topics We Cover</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic: any) => (
              <Link key={topic._id} href={`/topic/${topic.slug.current}`} className="group block cursor-pointer">
                <div className="border border-slate-200 p-5 hover:border-navy-300 hover:bg-navy-50/30 transition-all duration-200">
                  <span className="divider-gold mb-3" />
                  <h3 className="font-serif text-lg font-semibold text-navy-900 group-hover:text-navy-700 transition-colors mt-3">{topic.title}</h3>
                  {topic.description && <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{topic.description}</p>}
                  <span className="mt-3 text-xs font-medium text-navy-700 group-hover:text-gold-500 transition-colors flex items-center gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Policy Desks */}
      {desks?.length > 0 && (
        <section className="bg-navy-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl">
              <span className="section-label text-gold-400">Policy Desks</span>
              <h2 className="font-serif text-2xl md:text-3xl text-white mt-3">Geographic Research Focus</h2>
              <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                Our policy desks organize research by region, ensuring analysis is grounded in local context, legislation, and community needs.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {desks.map((desk: any) => (
                <Link key={desk._id} href={`/desk/${desk.slug.current}`} className="group block cursor-pointer">
                  <div className="border border-navy-700 p-5 hover:border-gold-500 transition-colors duration-200">
                    <h3 className="font-serif text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">{desk.title}</h3>
                    {desk.description && <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-2">{desk.description}</p>}
                    <span className="mt-3 text-xs text-gold-500 flex items-center gap-1">View desk <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
