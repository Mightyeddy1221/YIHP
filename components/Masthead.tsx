import Link from "next/link";

const sections = [
  { label: "Articles", href: "/articles" },
  { label: "Policy Memos", href: "/policy-memos" },
  { label: "Massachusetts", href: "/desk/massachusetts" },
  { label: "New York City", href: "/desk/new-york-city" },
  { label: "Virginia", href: "/desk/virginia" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
];

function todayLine() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Masthead() {
  return (
    <header className="edition-bg">
      {/* dateline strip */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="rule-hair" />
        <div className="flex items-center justify-between py-2 sans text-[0.62rem] tracking-[0.16em] uppercase text-[color:var(--ink-3)]">
          <span>Nonpartisan Health Policy Research</span>
          <span className="nums hidden sm:inline">{todayLine()}</span>
          <span className="hidden md:inline">Massachusetts &middot; New York &middot; Virginia</span>
        </div>
      </div>

      {/* nameplate */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="rule-thick" />
        <div className="text-center py-7 sm:py-9">
          <Link href="/" className="inline-block link-ink">
            <div className="nameplate text-[2.45rem] sm:text-[3.6rem] md:text-[4.4rem] text-[color:var(--ink)]">
              Youth Institute
              <span className="block">for Health Policy</span>
            </div>
          </Link>
          <div className="mt-3 sans uppercase tracking-[0.42em] text-[0.6rem] sm:text-[0.66rem] text-[color:var(--ink-2)] pl-[0.42em]">
            A Student Policy Review
          </div>
        </div>
        <div className="rule-double" />
      </div>

      {/* section bar */}
      <nav className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="section-bar flex flex-wrap items-center justify-center gap-y-1 py-3">
          {sections.map((s, i) => (
            <span key={s.label} className="flex items-center">
              {i > 0 && <span className="mx-3 sm:mx-4 text-[color:var(--rule-2)]">/</span>}
              <Link href={s.href}>{s.label}</Link>
            </span>
          ))}
        </div>
        <div className="rule-hair" />
      </nav>
    </header>
  );
}
