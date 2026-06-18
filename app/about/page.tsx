import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, ogImageUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About & Mission",
  description: "The Youth Institute for Health Policy (YIHP) is a student-led, nonpartisan research organization producing rigorous, accessible health policy analysis advancing health equity.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/about`,
    title: "About & Mission",
    description: "A student-led, nonpartisan health policy research organization advancing health equity.",
    images: [{ url: ogImageUrl({ title: "About & Mission", kicker: "Youth Institute for Health Policy" }), width: 1200, height: 630 }],
  },
};

const values = [
  { term: "Rigor", def: "Every claim is sourced; every recommendation grounded in evidence. We publish our methods alongside our findings." },
  { term: "Accessibility", def: "Policy should be legible to the people it affects. We write for legislators, advocates, and neighbors alike." },
  { term: "Equity", def: "Health disparities are not inevitable. Our work centers the communities most burdened by policy failure." },
  { term: "Independence", def: "Unaffiliated with any party or advocacy group. Our funders do not shape our conclusions; the evidence does." },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      {/* editorial title page */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <div className="kicker mb-4">Our Mission</div>
          <h1 className="serif-display text-[2.8rem] sm:text-[3.8rem] text-balance">
            Policy research for a healthier, more equitable future.
          </h1>
        </div>
        <div className="lg:col-span-4 lg:pb-2">
          <p className="dek text-[1.15rem]">
            A student-led, nonpartisan research institute writing for the people that
            health policy actually reaches.
          </p>
        </div>
      </header>

      <div className="rule-double mt-10 mb-12" />

      {/* body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <section className="dropcap runin measure-wide">
            <p>
              The Youth Institute for Health Policy is a student-led research organization
              producing rigorous, accessible analysis on the health policy questions facing
              underserved communities. Founded in Massachusetts, YIHP now spans policy desks
              across several states, with researchers drawn from undergraduate and graduate
              programs nationwide.
            </p>
            <p>
              We believe young researchers bring both fresh perspective and genuine urgency to
              questions that will define the next generation — from Medicaid and behavioral
              health to housing and the criminal-legal system. Our work is shaped by direct
              experience with the systems we study.
            </p>
          </section>

          {/* pull quote */}
          <blockquote className="my-12 py-2" style={{ borderTop: "2px solid var(--ink)", borderBottom: "1px solid var(--rule)" }}>
            <p className="serif-display text-[1.7rem] sm:text-[2.1rem] leading-[1.18] py-6 text-balance">
              &ldquo;We publish our methodology alongside our findings, and we correct errors
              when they are found.&rdquo;
            </p>
          </blockquote>

          <section className="runin measure-wide">
            <div className="kicker mb-3">What We Do</div>
            <p>
              YIHP produces two kinds of work: long-form articles offering deep analysis of a
              policy landscape, and policy memos — shorter, targeted briefs written to inform a
              specific legislative or administrative decision.
            </p>
            <p>
              Research is organized by desk, each rooted in a geographic context. Massachusetts,
              New York City, and Virginia each keep their own agenda while contributing to our
              shared throughline of health equity.
            </p>
          </section>

          {/* values as a ruled definition list */}
          <section className="mt-14">
            <div className="rule-thick mb-1" />
            <h2 className="serif-display text-[1.6rem] py-3">Our Standards</h2>
            <dl>
              {values.map((v, i) => (
                <div
                  key={v.term}
                  className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-8 gap-y-1 py-6"
                  style={{ borderTop: "1px solid var(--rule)" }}
                >
                  <dt className="serif-display text-[1.3rem] text-[color:var(--ink)]">
                    <span className="text-[color:var(--brass)] tnums mr-2 text-[0.95rem] align-top">{String(i + 1).padStart(2, "0")}</span>
                    {v.term}
                  </dt>
                  <dd className="text-[1rem] leading-relaxed" style={{ color: "var(--ink-2)", fontFamily: "var(--font-fraunces), serif" }}>{v.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* aside */}
        <aside className="lg:col-span-4 space-y-10">
          <div>
            <div className="rule-thick mb-1" />
            <div className="kicker py-3">Join the Institute</div>
            <p className="text-[0.98rem] leading-relaxed" style={{ color: "var(--ink-2)", fontFamily: "var(--font-fraunces), serif" }}>
              We recruit researchers, writers, and editors on a rolling basis, and welcome
              students from every discipline.
            </p>
            <Link href="/team" className="link-rule mt-5 inline-block">Meet the Masthead</Link>
          </div>

          <div>
            <div className="rule-hair mb-4" />
            <div className="kicker mb-3 kicker-ink">Policy Desks</div>
            <ul className="space-y-3">
              {[
                { label: "Massachusetts", href: "/desk/massachusetts" },
                { label: "New York City", href: "/desk/new-york-city" },
                { label: "Virginia", href: "/desk/virginia" },
              ].map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="link-ink serif-display text-[1.15rem] flex items-baseline justify-between group">
                    <span>{d.label}</span>
                    <span className="text-[color:var(--brass)] group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "var(--paper-2)" }} className="p-6">
            <div className="kicker mb-2">By the Numbers</div>
            <p className="serif-display text-[1.05rem] leading-snug text-[color:var(--ink-2)]">
              Three desks &middot; five research domains &middot; one standard of evidence.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
