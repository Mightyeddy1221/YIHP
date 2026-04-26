import { groq } from "next-sanity";

export const articleFields = groq`
  _id, title, slug, excerpt, date, featured,
  heroImage { asset->, alt },
  author->{ name, role, photo { asset-> } },
  desk->{ title, slug },
  topics[]->{ title, slug }
`;

export const memoFields = groq`
  _id, title, slug, date, tags,
  desk->{ title, slug },
  topics[]->{ title, slug },
  authors[]->{ name, role },
  pdfFile { asset-> }
`;

export const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(date desc)[0...4] {
    ${articleFields}
  }
`;

export const recentArticlesQuery = groq`
  *[_type == "article"] | order(date desc)[0...12] {
    ${articleFields}
  }
`;

export const recentMemosQuery = groq`
  *[_type == "policyMemo"] | order(date desc)[0...6] {
    ${memoFields}
  }
`;

export const allMemosQuery = groq`
  *[_type == "policyMemo"] | order(date desc) {
    ${memoFields}
  }
`;

export const allTopicsQuery = groq`
  *[_type == "topicArea"] | order(title asc) {
    _id, title, slug, description, color
  }
`;

export const allDesksQuery = groq`
  *[_type == "policyDesk"] | order(title asc) {
    _id, title, slug, location, description, color
  }
`;

export const allTeamQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, role, bio, linkedin, order,
    photo { asset-> },
    desk->{ title, slug }
  }
`;

export const missionPageQuery = groq`
  *[_type == "missionPage"][0] {
    headline, subheadline, body, values
  }
`;

export const articlesByDeskQuery = groq`
  *[_type == "article" && desk->slug.current == $slug] | order(date desc) {
    ${articleFields}
  }
`;

export const memosByDeskQuery = groq`
  *[_type == "policyMemo" && desk->slug.current == $slug] | order(date desc) {
    ${memoFields}
  }
`;

export const articlesByTopicQuery = groq`
  *[_type == "article" && $slug in topics[]->slug.current] | order(date desc) {
    ${articleFields}
  }
`;

export const memosByTopicQuery = groq`
  *[_type == "policyMemo" && $slug in topics[]->slug.current] | order(date desc) {
    ${memoFields}
  }
`;

export const singleArticleQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${articleFields},
    body
  }
`;

export const singleMemoQuery = groq`
  *[_type == "policyMemo" && slug.current == $slug][0] {
    ${memoFields},
    summary,
    authors[]->{ name, role, photo { asset-> } }
  }
`;

export const deskBySlugQuery = groq`
  *[_type == "policyDesk" && slug.current == $slug][0] {
    _id, title, slug, location, description, color
  }
`;

export const topicBySlugQuery = groq`
  *[_type == "topicArea" && slug.current == $slug][0] {
    _id, title, slug, description, color
  }
`;
