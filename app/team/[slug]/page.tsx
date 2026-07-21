import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { teamMemberBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const revalidate = 60;

function bioText(member: any): string {
  const source = member?.fullBio || member?.bio || "";
  return source.trim();
}

function memberPhoto(member: any): string | null {
  return member?.photo?.asset ? urlFor(member.photo).width(1200).height(1200).fit("crop").url() : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const member = await client.fetch(teamMemberBySlugQuery, { slug: params.slug });
  if (!member) return { title: "Team Member Not Found" };

  const url = `${SITE_URL}/team/${params.slug}`;
  const bio = bioText(member);
  const description = bio ? bio.slice(0, 160) : `${member.name}${member.role ? `, ${member.role}` : ""} at the Youth Institute for Health Policy.`;
  const ogImage = ogImageUrl({ title: member.name, kicker: member.role || "YIHP" });

  return {
    title: member.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: member.name,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: member.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: member.name,
      description,
      images: [ogImage],
    },
  };
}

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await client.fetch(teamMemberBySlugQuery, { slug: params.slug });
  if (!member) notFound();

  const url = `${SITE_URL}/team/${params.slug}`;
  const photo = memberPhoto(member);
  const bio = bioText(member);
  const paragraphs = bio ? bio.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [];

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: member.name,
    jobTitle: member.role || undefined,
    description: bio || undefined,
    image: photo || undefined,
    url,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    sameAs: member.linkedin ? [member.linkedin] : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Team", item: `${SITE_URL}/team` },
      { "@type": "ListItem", position: 3, name: member.name, item: url },
    ],
  };

  return (
    <div className="max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <JsonLd data={[personLd, breadcrumbLd]} />

      <Link href="/team" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-800 transition-colors mb-10 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Team
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-slate-200">
          {photo ? (
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={photo}
                alt={member.name}
                width={128}
                height={128}
                quality={90}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-navy-800 flex items-center justify-center flex-shrink-0">
              <span className="font-serif font-bold text-white text-4xl">{member.name?.[0]}</span>
            </div>
          )}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 leading-tight">{member.name}</h1>
            {member.role && <p className="mt-1.5 text-base text-gold-500 font-medium">{member.role}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {member.desk && (
                <Link href={`/desk/${member.desk.slug.current}`} className="text-slate-500 hover:text-navy-700 transition-colors cursor-pointer">
                  {member.desk.title} Desk
                </Link>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-navy-700 transition-colors cursor-pointer">
                  <ExternalLink className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {paragraphs.length > 0 ? (
          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-slate-700 leading-relaxed">{p}</p>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-400 italic">Bio coming soon.</p>
        )}
      </div>
    </div>
  );
}
