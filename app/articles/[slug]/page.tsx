import Link from "next/link";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { singleArticleQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import SectionNav from "@/components/SectionNav";
import { proseComponents, extractHeadings, type Heading } from "@/components/prose";
import { SITE_URL, SITE_DESCRIPTION, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

function ogImageFor(article: any): string {
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
      authors: article.author?.name ? [article.author.name] : undefined,
      section: article.topics?.[0]?.title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
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
    author: article.author?.name
      ? { "@type": "Person", name: article.author.name, jobTitle: article.author.role || undefined }
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
    <div className="max-w-[84rem] mx-auto px-5 sm:px-8 pt-10">
      <JsonLd data={[articleLd, breadcrumbLd]} />

      {/* mobile back link */}
      <Link href="/articles" className="link-rule lg:hidden inline-block mb-8" style={{ borderColor: "var(--rule-2)" }}>
        &larr; All Articles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[13rem_minmax(0,44rem)_15rem] lg:justify-between gap-x-10 gap-y-10">
        {/* ===== LEFT RAIL ===== */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-10">
            <Link href="/articles" className="link-rule inline-block mb-8" style={{ borderColor: "var(--rule-2)" }}>
              &larr; All Articles
            </Link>
            <SectionNav sections={sections} />
          </div>
        </div>

        {/* ===== MIDDLE — article ===== */}
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-baseline gap-x-3 mb-4">
              {article.topics?.[0] && (
                <Link href={`/topic/${article.topics[0].slug.current}`} className="kicker hover:text-[color:var(--ink)]">{article.topics[0].title}</Link>
              )}
              {article.desk && (
                <Link href={`/desk/${article.desk.slug.current}`} className="kicker kicker-ink hover:text-[color:var(--ink)]">{article.desk.title} Desk</Link>
              )}
            </div>

            <h1 className="serif-display text-[2.5rem] sm:text-[3.4rem] leading-[1.02] text-balance">{article.title}</h1>

            {article.excerpt && (
              <p className="dek mt-6 text-[1.3rem] leading-[1.4]">{article.excerpt}</p>
            )}

            <div className="mt-7 rule-thick" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3 sans text-[0.7rem] uppercase tracking-[0.13em] text-[color:var(--ink-2)]">
              {article.author?.name && <span>By {article.author.name}{article.author.role ? `, ${article.author.role}` : ""}</span>}
              {article.date && <span className="nums">{formatDate(article.date)}</span>}
              {article.desk && <span>{article.desk.title} Desk</span>}
            </div>
            <div className="rule-hair" />
          </header>

          <article className="mt-10">
            {article.body ? (
              <div className="edition-prose">
                <PortableText value={article.body} components={proseComponents} />
              </div>
            ) : (
              <p className="dek">The full text of this article is being prepared.</p>
            )}
          </article>
        </div>

        {/* ===== RIGHT RAIL ===== */}
        <aside className="lg:pt-1">
          <div className="lg:sticky lg:top-10 space-y-10">
            {article.author?.name && (
              <div>
                <div className="rule-thick mb-1" />
                <div className="kicker py-3">About the Author</div>
                <p className="serif-display text-[1.2rem] leading-snug">{article.author.name}</p>
                {article.author.role && <p className="mt-1 sans text-[0.72rem] uppercase tracking-[0.1em] text-[color:var(--ink-3)]">{article.author.role}</p>}
              </div>
            )}

            <div>
              <div className="rule-hair mb-4" />
              <div className="kicker mb-3 kicker-ink">Continue Reading</div>
              <ul className="space-y-2.5">
                {article.topics?.[0] && (
                  <li><Link href={`/topic/${article.topics[0].slug.current}`} className="link-ink serif-display text-[1.05rem]">More on {article.topics[0].title} &rarr;</Link></li>
                )}
                {article.desk && (
                  <li><Link href={`/desk/${article.desk.slug.current}`} className="link-ink serif-display text-[1.05rem]">{article.desk.title} Desk &rarr;</Link></li>
                )}
                <li><Link href="/policy-memos" className="link-ink serif-display text-[1.05rem]">Policy Memos &rarr;</Link></li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
