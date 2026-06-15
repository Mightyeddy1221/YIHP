import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/seo";

// Regenerate the sitemap hourly so newly published content appears automatically.
export const revalidate = 3600;

const sitemapQuery = groq`{
  "articles": *[_type == "article" && defined(slug.current)]{ "slug": slug.current, "date": coalesce(_updatedAt, date) },
  "memos": *[_type == "policyMemo" && defined(slug.current)]{ "slug": slug.current, "date": coalesce(_updatedAt, date) },
  "topics": *[_type == "topicArea" && defined(slug.current)]{ "slug": slug.current, "date": _updatedAt },
  "desks": *[_type == "policyDesk" && defined(slug.current)]{ "slug": slug.current, "date": _updatedAt }
}`;

type Row = { slug: string; date?: string };

function toDate(d?: string): Date {
  const parsed = d ? new Date(d) : new Date();
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: { articles: Row[]; memos: Row[]; topics: Row[]; desks: Row[] } | null = null;
  try {
    data = await client.fetch(sitemapQuery);
  } catch {
    data = null;
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/policy-memos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = (data?.articles ?? []).map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: toDate(a.date),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const memoRoutes: MetadataRoute.Sitemap = (data?.memos ?? []).map((m) => ({
    url: `${SITE_URL}/policy-memos/${m.slug}`,
    lastModified: toDate(m.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const topicRoutes: MetadataRoute.Sitemap = (data?.topics ?? []).map((t) => ({
    url: `${SITE_URL}/topic/${t.slug}`,
    lastModified: toDate(t.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const deskRoutes: MetadataRoute.Sitemap = (data?.desks ?? []).map((d) => ({
    url: `${SITE_URL}/desk/${d.slug}`,
    lastModified: toDate(d.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...memoRoutes, ...topicRoutes, ...deskRoutes];
}
