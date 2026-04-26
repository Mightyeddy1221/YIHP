import Link from "next/link";
import { ArrowLeft, Calendar, Users, Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { singleMemoQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const memo = await client.fetch(singleMemoQuery, { slug: params.slug });
  if (!memo) return { title: "Memo Not Found" };
  return { title: memo.title };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function MemoPage({ params }: { params: { slug: string } }) {
  const memo = await client.fetch(singleMemoQuery, { slug: params.slug });
  if (!memo) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        <article>
          <Link href="/policy-memos" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Policy Memos
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-navy-800 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-navy-700 uppercase tracking-wider">Policy Memo</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {memo.topics?.[0] && (
              <Link href={`/topic/${memo.topics[0].slug.current}`} className="text-xs font-semibold text-gold-500 uppercase tracking-wider hover:text-gold-600 cursor-pointer">
                {memo.topics[0].title}
              </Link>
            )}
            {memo.desk && (
              <>
                <span className="text-slate-300">·</span>
                <Link href={`/desk/${memo.desk.slug.current}`} className="text-xs text-slate-500 hover:text-navy-700 cursor-pointer">
                  {memo.desk.title} Desk
                </Link>
              </>
            )}
          </div>

          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 leading-tight text-balance">
            {memo.title}
          </h1>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500 pb-6 border-b border-slate-200">
            {memo.date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(memo.date)}</span>}
            {memo.authors?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {memo.authors.map((a: any) => a.name).join(", ")}
              </span>
            )}
          </div>

          {memo.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {memo.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1">{tag}</span>
              ))}
            </div>
          )}

          {memo.summary && (
            <div className="mt-8">
              <h2 className="font-serif text-xl font-semibold text-navy-900 mb-5">Executive Summary</h2>
              <div className="prose prose-slate max-w-none prose-headings:font-serif">
                <PortableText value={memo.summary} />
              </div>
            </div>
          )}

          {memo.pdfFile?.asset && (
            <div className="mt-10 p-5 bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-navy-900">Full Memo (PDF)</p>
                <p className="text-xs text-slate-500 mt-0.5">Download the complete policy memo with citations and appendices.</p>
              </div>
              <a href={memo.pdfFile.asset.url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-shrink-0 cursor-pointer">
                <Download className="w-4 h-4" /> Download
              </a>
            </div>
          )}
        </article>

        <aside className="mt-12 lg:mt-14 space-y-6">
          {memo.authors?.length > 0 && (
            <div className="border border-slate-200 p-5">
              <h3 className="font-serif text-sm font-semibold text-navy-900 mb-4">Authors</h3>
              <div className="space-y-4">
                {memo.authors.map((author: any) => (
                  <div key={author.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-serif text-navy-800 font-bold text-xs">{author.name?.[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">{author.name}</p>
                      {author.role && <p className="text-xs text-slate-500">{author.role}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-slate-200 p-5">
            <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">Related</h3>
            <div className="space-y-2">
              {memo.topics?.[0] && (
                <Link href={`/topic/${memo.topics[0].slug.current}`} className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                  More on {memo.topics[0].title} →
                </Link>
              )}
              {memo.desk && (
                <Link href={`/desk/${memo.desk.slug.current}`} className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                  {memo.desk.title} Desk →
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
