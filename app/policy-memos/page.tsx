import Link from "next/link";
import { FileText, ArrowRight, Download } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allMemosQuery, allTopicsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = { title: "Policy Memos" };
export const revalidate = 60;

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PolicyMemosPage() {
  const [memos, topics] = await Promise.all([
    client.fetch(allMemosQuery),
    client.fetch(allTopicsQuery),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-slate-200 pb-8 mb-10">
        <span className="section-label">YIHP Archive</span>
        <h1 className="font-serif text-3xl md:text-4xl text-navy-900 mt-3">Policy Memos</h1>
        <p className="mt-3 text-slate-500 text-sm max-w-2xl leading-relaxed">
          Focused policy briefs and recommendations from YIHP researchers, intended for policymakers, advocates, and the public.
        </p>
      </div>

      {topics?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 self-center">Topics:</span>
          {topics.map((t: any) => (
            <Link key={t._id} href={`/topic/${t.slug.current}`} className="text-xs px-3 py-1.5 border border-slate-200 text-slate-600 hover:border-navy-300 hover:text-navy-800 transition-colors cursor-pointer">
              {t.title}
            </Link>
          ))}
        </div>
      )}

      {memos?.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-slate-400 text-sm">No memos published yet.</p>
          <p className="text-slate-400 text-xs mt-2">Add your first memo in the <Link href="/studio" className="underline hover:text-navy-700">Sanity Studio</Link>.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {memos?.map((memo: any) => (
            <div key={memo._id} className="bg-white border border-slate-200 hover:border-navy-300 transition-colors duration-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {memo.topics?.[0] && (
                      <Link href={`/topic/${memo.topics[0].slug.current}`} className="text-xs font-semibold text-gold-500 uppercase tracking-wider hover:text-gold-600 cursor-pointer">
                        {memo.topics[0].title}
                      </Link>
                    )}
                    {memo.desk && (
                      <>
                        <span className="text-slate-300 text-xs">·</span>
                        <Link href={`/desk/${memo.desk.slug.current}`} className="text-xs text-slate-500 hover:text-navy-700 cursor-pointer">
                          {memo.desk.title} Desk
                        </Link>
                      </>
                    )}
                    {memo.date && (
                      <>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-xs text-slate-400">{formatDate(memo.date)}</span>
                      </>
                    )}
                  </div>
                  <Link href={`/policy-memos/${memo.slug.current}`} className="group cursor-pointer">
                    <h2 className="font-serif text-lg font-semibold text-navy-900 group-hover:text-navy-700 transition-colors leading-snug">
                      {memo.title}
                    </h2>
                  </Link>
                  {memo.authors?.length > 0 && (
                    <p className="text-xs text-slate-500 mt-2">By {memo.authors.map((a: any) => a.name).join(", ")}</p>
                  )}
                  {memo.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {memo.tags.map((tag: string) => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pl-14 flex items-center gap-4">
                <Link href={`/policy-memos/${memo.slug.current}`} className="text-sm font-medium text-navy-700 hover:text-gold-500 transition-colors flex items-center gap-1 cursor-pointer">
                  Read summary <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {memo.pdfFile?.asset && (
                  <a href={memo.pdfFile.asset.url} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-navy-700 transition-colors flex items-center gap-1 cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
