import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About & Mission" };

const values = [
  {
    title: "Rigor",
    description: "We hold our analysis to the highest standards of evidence. Every claim is sourced, every recommendation grounded in data.",
  },
  {
    title: "Accessibility",
    description: "Policy should be understandable to anyone it affects. We write for policymakers, advocates, and community members alike.",
  },
  {
    title: "Equity",
    description: "Health disparities are not inevitable. Our research centers the experiences of communities most burdened by policy failures.",
  },
  {
    title: "Independence",
    description: "We are not affiliated with any political party or advocacy organization. Our conclusions follow the evidence.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-navy-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <span className="section-label text-gold-400">Our Mission</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mt-4 leading-tight max-w-3xl text-balance">
            Policy Research for a Healthier, More Equitable Future
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <span className="divider-gold mb-4" />
              <h2 className="font-serif text-2xl text-navy-900 mt-4 mb-5">Who We Are</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  The Youth Institute for Health Policy (YIHP) is a student-led policy research organization producing rigorous, accessible analysis on health policy issues affecting underserved communities. Founded in Massachusetts, YIHP has grown to include policy desks across multiple states, with researchers drawn from undergraduate and graduate programs across the country.
                </p>
                <p>
                  We believe that young researchers bring both fresh perspective and genuine urgency to policy questions that will define the next generation. Our work is shaped by direct experience with the systems we study — from Medicaid and behavioral health to housing and criminal justice.
                </p>
                <p>
                  YIHP operates independently of any political party, government agency, or advocacy organization. Our funders do not influence our research conclusions. We publish our methodology alongside our findings, and we correct errors when they are identified.
                </p>
              </div>
            </section>

            <section>
              <span className="divider-gold mb-4" />
              <h2 className="font-serif text-2xl text-navy-900 mt-4 mb-5">What We Do</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                <p>
                  YIHP produces two primary types of output: long-form articles that provide deep analysis of health policy issues, and policy memos — shorter, targeted documents intended to inform specific legislative or administrative decisions.
                </p>
                <p>
                  Our research is organized by policy desks, each focused on a specific geographic context. Currently operating in Massachusetts, New York City, and Virginia, each desk maintains its own research agenda while contributing to our cross-cutting theme of health equity.
                </p>
              </div>
            </section>

            {/* Values */}
            <section>
              <span className="divider-gold mb-4" />
              <h2 className="font-serif text-2xl text-navy-900 mt-4 mb-7">Our Values</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {values.map((v) => (
                  <div key={v.title} className="border border-slate-200 p-5">
                    <h3 className="font-serif text-lg font-semibold text-navy-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-navy-800 text-white p-6">
              <h3 className="font-serif text-lg font-semibold mb-3">Join YIHP</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                YIHP recruits researchers, writers, and editors on a rolling basis. We welcome students from all disciplines.
              </p>
              <Link href="/team" className="btn-outline border-white text-white hover:bg-white hover:text-navy-900 inline-flex items-center gap-2">
                Meet the Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="border border-slate-200 p-5">
              <h3 className="font-serif text-sm font-semibold text-navy-900 mb-3">Policy Desks</h3>
              <div className="space-y-2">
                {[
                  { label: "Massachusetts", href: "/desk/massachusetts" },
                  { label: "New York City", href: "/desk/new-york-city" },
                  { label: "Virginia", href: "/desk/virginia" },
                ].map((d) => (
                  <Link key={d.href} href={d.href} className="block text-sm text-navy-700 hover:text-gold-500 transition-colors cursor-pointer">
                    {d.label} →
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
