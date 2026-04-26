import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { recentArticlesQuery, allTopicsQuery, allDesksQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Articles" };
export const revalidate = 60;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlesPage() {
  const [articles, topics, desks] = await Promise.all([
    client.fetch(recentArticlesQuery),
    client.fetch(allTopicsQuery),
    client.fetch(allDesksQuery),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-slate-200 pb-8 mb-10">
        <span className="section-label">YIHP Publication</span>
        <h1 className="font-serif text-3xl md:text-4xl text-navy-900 mt-3">Articles</h1>
        <p className="mt-3 text-slate-500 text-sm max-w-2xl leading-relaxed">
          Policy analysis and original research from YIHP researchers across our policy desks.
        </p>
      </div>

      {/* Filters */}
      {(topics?.length > 0 || desks?.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 self-center">Topics:</span>
          {topics?.map((t: any) => (
            <Link key={t._id} href={`/topic/${t.slug.current}`} className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-800 transition-colors cursor-pointer">
              {t.title}
            </Link>
          ))}
        </div>
      )}

      {articles?.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">No articles published yet.</p>
          <p className="text-slate-400 text-xs mt-2">Add your first article in the <Link href="/studio" className="underline hover:text-navy-700">Sanity Studio</Link>.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {articles?.map((article: any) => (
            <div key={article._id} className="flex gap-5 py-7">
              <div className="hidden sm:flex w-10 h-10 bg-navy-50 border border-navy-100 items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-4 h-4 text-navy-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {article.topics?.[0] && (
                    <Link href={`/topic/${article.topics[0].slug.current}`} className="text-xs font-semibold text-gold-500 uppercase tracking-wider hover:text-gold-600 cursor-pointer">
                      {article.topics[0].title}
                    </Link>
                  )}
                  {article.desk && (
                    <>
                      <span className="text-slate-300 text-xs">·</span>
                      <Link href={`/desk/${article.desk.slug.current}`} className="text-xs text-slate-500 hover:text-navy-700 cursor-pointer">
                        {article.desk.title} Desk
                      </Link>
                    </>
                  )}
                  {article.date && (
                    <>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="text-xs text-slate-400">{formatDate(article.date)}</span>
                    </>
                  )}
                </div>
                <Link href={`/articles/${article.slug.current}`} className="group cursor-pointer">
                  <h2 className="font-serif text-xl text-navy-900 group-hover:text-navy-700 transition-colors leading-snug font-semibold">
                    {article.title}
                  </h2>
                </Link>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">{article.excerpt}</p>
                )}
                <div className="mt-3 flex items-center gap-4">
                  {article.author && <span className="text-xs text-slate-500">By {article.author.name}</span>}
                  <Link href={`/articles/${article.slug.current}`} className="text-xs font-medium text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                    Read article <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
