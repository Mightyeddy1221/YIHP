import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { singleMemoQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import SectionNav from "@/components/SectionNav";
import { proseComponents, extractHeadings, type Heading } from "@/components/prose";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL, SITE_DESCRIPTION, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

function memoDescription(memo: any): string {
  if (memo?.seo?.metaDescription) return memo.seo.metaDescription;
  const firstBlock = Array.isArray(memo?.summary) ? memo.summary.find((b: any) => b._type === "block") : null;
  const text = firstBlock?.children?.map((c: any) => c.text).join("") || "";
  return text.trim() ? text.trim().slice(0, 200) : SITE_DESCRIPTION;
}

function memoOgImage(memo: any): string {
  if (memo?.seo?.ogImage?.asset) return urlFor(memo.seo.ogImage).width(1200).height(630).fit("crop").url();
  return ogImageUrl({ title: memo.title, kicker: "Policy Memo" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const memo = await client.fetch(singleMemoQuery, { slug: params.slug });
  if (!memo) return { title: "Memo Not Found" };

  const url = `${SITE_URL}/policy-memos/${params.slug}`;
  const title = memo.seo?.metaTitle || memo.title;
  const description = memoDescription(memo);
  const ogImage = memoOgImage(memo);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: memo.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: memo.date || undefined,
      authors: memo.authors?.map((a: any) => a.name).filter(Boolean),
      section: memo.topics?.[0]?.title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function MemoPage({ params }: { params: { slug: string } }) {
  const memo = await client.fetch(singleMemoQuery, { slug: params.slug });
  if (!memo) notFound();

  const url = `${SITE_URL}/policy-memos/${params.slug}`;
  const ogImage = memoOgImage(memo);

  // Build the section nav: Summary (if present) + headings pulled from the body.
  const sections: Heading[] = [
    ...(memo.summary ? [{ id: "summary", text: "Summary", level: 2 }] : []),
    ...extractHeadings(memo.body),
  ];

  const memoLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#memo`,
    headline: memo.title,
    description: memoDescription(memo),
    image: [ogImage],
    datePublished: memo.date || undefined,
    dateModified: memo.date || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: memo.authors?.length
      ? memo.authors.map((a: any) => ({ "@type": "Person", name: a.name, jobTitle: a.role || undefined }))
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    articleSection: memo.topics?.map((t: any) => t.title),
    keywords: memo.tags?.join(", ") || undefined,
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Policy Memos", item: `${SITE_URL}/policy-memos` },
      { "@type": "ListItem", position: 3, name: memo.title, item: url },
    ],
  };

  return (
    <div className="max-w-[84rem] mx-auto px-5 sm:px-8 pt-10">
      <JsonLd data={[memoLd, breadcrumbLd]} />

      {/* mobile back link */}
      <Link href="/policy-memos" className="link-rule lg:hidden inline-block mb-8" style={{ borderColor: "var(--rule-2)" }}>
        &larr; All Policy Memos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[13rem_minmax(0,44rem)_15rem] lg:justify-between gap-x-10 gap-y-10">
        {/* ===== LEFT RAIL — sticky sections nav ===== */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-10">
            <Link href="/policy-memos" className="link-rule inline-block mb-8" style={{ borderColor: "var(--rule-2)" }}>
              &larr; All Memos
            </Link>
            <SectionNav sections={sections} />
          </div>
        </div>

        {/* ===== MIDDLE — article ===== */}
        <div className="min-w-0">
          <header>
            <div className="kicker mb-4" style={{ color: "var(--brass)" }}>Policy Memo</div>
            <div className="flex flex-wrap items-baseline gap-x-3 mb-4">
              {memo.topics?.[0] && (
                <Link href={`/topic/${memo.topics[0].slug.current}`} className="kicker kicker-ink hover:text-[color:var(--ink)]">{memo.topics[0].title}</Link>
              )}
              {memo.desk && (
                <Link href={`/desk/${memo.desk.slug.current}`} className="kicker kicker-ink hover:text-[color:var(--ink)]">{memo.desk.title} Desk</Link>
              )}
            </div>

            <h1 className="serif-display text-[2.4rem] sm:text-[3.2rem] leading-[1.04] text-balance">{memo.title}</h1>

            <div className="mt-7 rule-thick" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3 sans text-[0.7rem] uppercase tracking-[0.13em] text-[color:var(--ink-2)]">
              {memo.date && <span className="nums">{formatDate(memo.date)}</span>}
              {memo.authors?.length > 0 && <span>By {memo.authors.map((a: any) => a.name).join(", ")}</span>}
            </div>
            <div className="rule-hair" />

            {memo.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {memo.tags.map((tag: string) => (
                  <span key={tag} className="sans text-[0.64rem] uppercase tracking-[0.1em] text-[color:var(--ink-2)] px-2.5 py-1" style={{ border: "1px solid var(--rule-2)" }}>{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="mt-10">
            {memo.summary && (
              <section id="summary" className="scroll-mt-24">
                <div className="kicker mb-4">Executive Summary</div>
                <div className="edition-prose edition-prose--plain">
                  <PortableText value={memo.summary} components={proseComponents} />
                </div>
              </section>
            )}

            {memo.body && memo.body.length > 0 && (
              <section className="mt-12">
                <div className="rule-hair mb-8" />
                <div className="edition-prose">
                  <PortableText value={memo.body} components={proseComponents} />
                </div>
              </section>
            )}

            {memo.pdfFile?.asset && (
              <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6" style={{ background: "var(--paper-2)" }}>
                <div>
                  <p className="serif-display text-[1.2rem]">The Complete Memo</p>
                  <p className="mt-1 sans text-[0.72rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)]">PDF with full citations &amp; appendices</p>
                </div>
                <a href={memo.pdfFile.asset.url} target="_blank" rel="noopener noreferrer" className="link-rule flex-shrink-0">Download PDF &darr;</a>
              </div>
            )}
          </div>
        </div>

        {/* ===== RIGHT RAIL — author + related ===== */}
        <aside className="lg:pt-1">
          <div className="lg:sticky lg:top-10 space-y-10">
            {memo.authors?.length > 0 && (
              <div>
                <div className="rule-thick mb-1" />
                <div className="kicker py-3">{memo.authors.length > 1 ? "Authors" : "Author"}</div>
                <ul className="space-y-4">
                  {memo.authors.map((author: any) => (
                    <li key={author.name}>
                      <p className="serif-display text-[1.1rem] leading-snug">{author.name}</p>
                      {author.role && <p className="mt-0.5 sans text-[0.68rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)]">{author.role}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="rule-hair mb-4" />
              <div className="kicker mb-3 kicker-ink">Related</div>
              <ul className="space-y-2.5">
                {memo.topics?.[0] && (
                  <li><Link href={`/topic/${memo.topics[0].slug.current}`} className="link-ink serif-display text-[1.05rem]">More on {memo.topics[0].title} &rarr;</Link></li>
                )}
                {memo.desk && (
                  <li><Link href={`/desk/${memo.desk.slug.current}`} className="link-ink serif-display text-[1.05rem]">{memo.desk.title} Desk &rarr;</Link></li>
                )}
                <li><Link href="/articles" className="link-ink serif-display text-[1.05rem]">All Articles &rarr;</Link></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
