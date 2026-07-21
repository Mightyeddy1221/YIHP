import Link from "next/link";

/**
 * Renders an author's name, linking to their team page when a slug exists,
 * otherwise plain text. Keeps the slug-guard consistent everywhere authors
 * are shown (bylines, author sidebars, list cards).
 */
export default function AuthorName({ author, className = "" }: { author: any; className?: string }) {
  if (author?.slug?.current) {
    return (
      <Link
        href={`/team/${author.slug.current}`}
        className={`hover:text-gold-500 transition-colors cursor-pointer ${className}`}
      >
        {author.name}
      </Link>
    );
  }
  return <span className={className}>{author?.name}</span>;
}

/** Comma-separated list of author names, each linked when possible. */
export function AuthorNames({ authors, className = "" }: { authors: any[]; className?: string }) {
  if (!authors?.length) return null;
  return (
    <>
      {authors.map((a: any, i: number) => (
        <span key={a.slug?.current || a.name || i}>
          <AuthorName author={a} className={className} />
          {i < authors.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}
