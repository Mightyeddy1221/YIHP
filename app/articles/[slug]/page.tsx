import Link from "next/link";
import { ArrowLeft, Calendar, User, Building2 } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { singleArticleQuery, allDesksQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await client.fetch(singleArticleQuery, { slug: params.slug });
  if (!article) return { title: "Article Not Found" };
  return { title: article.title, description: article.excerpt };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.fetch(singleArticleQuery, { slug: params.slug });
  if (!article) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
        <article>
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.topics?.[0] && (
              <Link href={`/topic/${article.topics[0].slug.current}`} className="text-xs font-semibold text-gold-500 uppercase tracking-wider hover:text-gold-600 cursor-pointer">
                {article.topics[0].title}
              </Link>
            )}
            {article.desk && (
              <>
                <span className="text-slate-300">·</span>
                <Link href={`/desk/${article.desk.slug.current}`} className="text-xs text-slate-500 hover:text-navy-700 cursor-pointer">
                  {article.desk.title} Desk
                </Link>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 leading-tight text-balance">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-4 text-lg text-slate-600 leading-relaxed border-l-4 border-gold-500 pl-4">
              {article.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500 pb-6 border-b border-slate-200">
            {article.author && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author.name}</span>}
            {article.date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}</span>}
            {article.desk && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {article.desk.title} Desk</span>}
          </div>

          {article.body && (
            <div className="mt-8 prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-navy-900 prose-a:text-navy-700 [&_*]:break-words [&_*]:overflow-wrap-anywhere">
              <PortableText value={article.body} />
            </div>
          )}
        </article>

        <aside className="mt-12 lg:mt-0 space-y-6">
          {article.author && (
            <div className="border border-slate-200 p-5">
              <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">About the Author</h3>
              <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center mb-3">
                <span className="font-serif text-navy-800 font-bold text-sm">{article.author.name?.[0]}</span>
              </div>
              <p className="font-medium text-sm text-navy-900">{article.author.name}</p>
              {article.author.role && <p className="text-xs text-slate-500 mt-0.5">{article.author.role}</p>}
            </div>
          )}

          <div className="border border-slate-200 p-5">
            <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">Related</h3>
            <div className="space-y-3">
              {article.topics?.[0] && (
                <Link href={`/topic/${article.topics[0].slug.current}`} className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                  More on {article.topics[0].title} →
                </Link>
              )}
              {article.desk && (
                <Link href={`/desk/${article.desk.slug.current}`} className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                  {article.desk.title} Desk →
                </Link>
              )}
              <Link href="/policy-memos" className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                Policy Memos →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
