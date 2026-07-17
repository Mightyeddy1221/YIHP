import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { allTeamQuery } from "@/sanity/lib/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Meet the Team",
  description: "Meet the student researchers, writers, and editors behind YIHP's health policy analysis.",
  alternates: { canonical: `${SITE_URL}/team` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/team`,
    title: "Meet the Team",
    description: "The student researchers, writers, and editors behind YIHP.",
    images: [{ url: ogImageUrl({ title: "Meet the Team", kicker: "Youth Institute for Health Policy" }), width: 1200, height: 630 }],
  },
};
export const revalidate = 60;

export default async function TeamPage() {
  const team: any[] = await client.fetch(allTeamQuery) ?? [];
  const leadership = team.filter((m) => ["Editor-in-Chief", "Managing Editor", "Executive Director", "President", "Director"].some(r => m.role?.includes(r)));
  const rest = team.filter((m) => !leadership.includes(m));

  return (
    <div>
      <div className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="section-label text-gold-400">Our People</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mt-4">Meet the Team</h1>
          <p className="mt-4 text-slate-300 text-sm max-w-xl leading-relaxed">
            YIHP is a team of student researchers, writers, and editors committed to producing rigorous, accessible health policy analysis.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {team.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm">No team members added yet.</p>
            <p className="text-slate-400 text-xs mt-2">Add team members in the <Link href="/studio" className="underline hover:text-navy-700">Sanity Studio</Link>.</p>
          </div>
        ) : (
          <>
            {leadership.length > 0 && (
              <>
                <div className="mb-10">
                  <span className="section-label">Leadership</span>
                  <span className="divider-gold mt-2 mb-6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                  {leadership.map((member) => (
                    <MemberCard key={member._id} member={member} large />
                  ))}
                </div>
              </>
            )}

            {rest.length > 0 && (
              <>
                <div className="mb-10">
                  <span className="section-label">Researchers &amp; Writers</span>
                  <span className="divider-gold mt-2 mb-6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {rest.map((member) => (
                    <MemberCard key={member._id} member={member} large={false} />
                  ))}
                </div>
              </>
            )}

            {leadership.length === 0 && rest.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {team.map((member) => (
                  <MemberCard key={member._id} member={member} large={false} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-14 bg-slate-50 border border-slate-200 p-8 text-center">
          <h2 className="font-serif text-2xl text-navy-900 mb-3">Join YIHP</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            We recruit researchers, writers, and editors on a rolling basis. If you&apos;re a student passionate about health policy, we&apos;d love to hear from you.
          </p>
          <Link href="/about" className="mt-6 btn-primary inline-flex">Learn More</Link>
        </div>
      </div>
    </div>
  );
}

function MemberCard({ member, large }: { member: any; large: boolean }) {
  const dim = large ? "w-32 h-32" : "w-24 h-24";
  const px = large ? 128 : 96;          // rendered display size (matches w-32 / w-24)
  const src = large ? 384 : 288;        // request ~3x from Sanity so retina stays crisp
  return (
    <div className={`border border-slate-200 ${large ? "p-8" : "p-7"}`}>
      <div className="flex items-start gap-6 mb-4">
        {member.photo?.asset ? (
          <div className={`${dim} rounded-full overflow-hidden flex-shrink-0`}>
            <Image
              src={urlFor(member.photo).width(src).height(src).fit("crop").url()}
              alt={member.name}
              width={px}
              height={px}
              quality={90}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className={`${dim} rounded-full ${large ? "bg-navy-800" : "bg-slate-100 border border-slate-200"} flex items-center justify-center flex-shrink-0`}>
            <span className={`font-serif font-bold ${large ? "text-white text-4xl" : "text-navy-700 text-3xl"}`}>
              {member.name?.[0]}
            </span>
          </div>
        )}
        <div className="pt-1">
          <h3 className={`font-serif ${large ? "text-2xl" : "text-xl"} font-semibold text-navy-900`}>{member.name}</h3>
          {member.role && <p className={`mt-1 ${large ? "text-base text-gold-500 font-medium" : "text-sm text-slate-500"}`}>{member.role}</p>}
          {member.desk && (
            <Link href={`/desk/${member.desk.slug.current}`} className="block mt-1 text-sm text-slate-500 hover:text-navy-700 transition-colors cursor-pointer">
              {member.desk.title} Desk
            </Link>
          )}
        </div>
      </div>
      {member.bio && <p className="text-base text-slate-600 leading-relaxed">{member.bio}</p>}
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-navy-700 transition-colors cursor-pointer">
          <ExternalLink className="w-4 h-4" /> LinkedIn
        </a>
      )}
    </div>
  );
}
