import Link from "next/link";
import { ArrowLeft, Calendar, User, Building2, FileText } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { singleArticleQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import AuthorName, { AuthorNames } from "@/components/AuthorName";
import VideoPlayer from "@/components/VideoPlayer";
import SectionNav from "@/components/SectionNav";
import { proseComponents, extractHeadings, type Heading } from "@/components/prose";
import { SITE_URL, SITE_DESCRIPTION, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

function ogImageFor(article: any): string {
  // Priority: editor-set social image → article hero image → generated branded card.
  if (article?.seo?.ogImage?.asset) return urlFor(article.seo.ogImage).width(1200).height(630).fit("crop").url();
  if (article?.heroImage?.asset) return urlFor(article.heroImage).width(1200).height(630).fit("crop").url();
  return ogImageUrl({ title: article.title, kicker: article?.topics?.[0]?.title || "Research" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await client.fetch(singleArticleQuery, { slug: params.slug });
  if (!article) return { title: "Article Not Found" };

  const url = `${SITE_URL}/articles/${params.slug}`;
  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt || SITE_DESCRIPTION;
  const ogImage = ogImageFor(article);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: article.seo?.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: article.date || undefined,
      authors: article.authors?.map((a: any) => a.name).filter(Boolean),
      section: article.topics?.[0]?.title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.fetch(singleArticleQuery, { slug: params.slug });
  if (!article) notFound();

  const url = `${SITE_URL}/articles/${params.slug}`;
  const ogImage = ogImageFor(article);

  // Sections nav: headings pulled straight from the article body.
  const sections: Heading[] = extractHeadings(article.body);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt || undefined,
    image: [ogImage],
    datePublished: article.date || undefined,
    dateModified: article.date || undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: article.authors?.length
      ? article.authors.map((a: any) => ({ "@type": "Person", name: a.name, jobTitle: a.role || undefined }))
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    articleSection: article.topics?.map((t: any) => t.title),
    isAccessibleForFree: true,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <div className="max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={[articleLd, breadcrumbLd]} />

      {/* mobile back link */}
      <Link href="/articles" className="lg:hidden inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-8 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[13rem_minmax(0,44rem)_15rem] lg:justify-between gap-x-10 gap-y-10">
        {/* ===== LEFT RAIL — sticky sections nav ===== */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-28">
            <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-8 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <SectionNav sections={sections} />
          </div>
        </div>

        {/* ===== MIDDLE — article ===== */}
        <article className="min-w-0">
          {article.videoUrl && (
            <div className="mb-8">
              <VideoPlayer url={article.videoUrl} title={article.title} />
            </div>
          )}

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
            {article.authors?.length > 0 && (
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> <AuthorNames authors={article.authors} />
              </span>
            )}
            {article.date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}</span>}
            {article.desk && <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {article.desk.title} Desk</span>}
            {article.transcriptUrl && (
              <a
                href={article.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-navy-700 hover:text-gold-500 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Read the Transcript
              </a>
            )}
          </div>

          {article.body && (
            <div className="mt-8 prose prose-slate max-w-none prose-lg prose-headings:font-serif prose-headings:text-navy-900 prose-a:text-navy-700 [&_*]:break-words [&_*]:overflow-wrap-anywhere">
              <PortableText value={article.body} components={proseComponents} />
            </div>
          )}
        </article>

        {/* ===== RIGHT RAIL — author + related ===== */}
        <aside>
          <div className="lg:sticky lg:top-28 space-y-6">
            {article.authors?.length > 0 && (
              <div className="border border-slate-200 p-5">
                <h3 className="font-serif text-sm font-semibold text-navy-900 mb-4">
                  {article.authors.length > 1 ? "Authors" : "About the Author"}
                </h3>
                <div className="space-y-4">
                  {article.authors.map((author: any) => (
                    <div key={author.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif text-navy-800 font-bold text-xs">{author.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-900"><AuthorName author={author} /></p>
                        {author.role && <p className="text-xs text-slate-500">{author.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
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
          </div>
        </aside>
      </div>
    </div>
  );
}
