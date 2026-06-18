import Link from "next/link";

export default function Colophon() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24">
      <div className="band-navy">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* nameplate / mission */}
            <div className="md:col-span-6">
              <div className="nameplate text-[1.9rem] leading-[0.95] text-[color:var(--paper)]">
                Youth Institute<span className="block">for Health Policy</span>
              </div>
              <p className="mt-5 measure text-[1.0625rem] leading-relaxed text-[color:rgba(246,241,231,0.78)]"
                 style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                Rigorous, accessible policy analysis on mental health, substance use,
                housing, and criminal justice — advancing health equity across the
                Commonwealth and beyond.
              </p>
            </div>

            {/* index */}
            <div className="md:col-span-3">
              <div className="kicker mb-4">The Publication</div>
              <ul className="space-y-2.5 sans text-[0.82rem] text-[color:rgba(246,241,231,0.82)]">
                <li><Link className="hover:text-white transition-colors" href="/articles">Articles</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/policy-memos">Policy Memos</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/desk/massachusetts">Policy Desks</Link></li>
              </ul>
            </div>

            {/* org */}
            <div className="md:col-span-3">
              <div className="kicker mb-4">The Institute</div>
              <ul className="space-y-2.5 sans text-[0.82rem] text-[color:rgba(246,241,231,0.82)]">
                <li><Link className="hover:text-white transition-colors" href="/about">About &amp; Mission</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/team">Masthead &amp; Team</Link></li>
              </ul>
            </div>
          </div>

          {/* colophon line — the human signature */}
          <div className="mt-14 pt-6 flex flex-col sm:flex-row justify-between gap-3"
               style={{ borderTop: "1px solid rgba(246,241,231,0.18)" }}>
            <p className="sans text-[0.66rem] uppercase tracking-[0.14em] text-[color:rgba(246,241,231,0.55)]">
              &copy; {year} Youth Institute for Health Policy. Published in Massachusetts.
            </p>
            <p className="sans text-[0.66rem] uppercase tracking-[0.14em] text-[color:rgba(246,241,231,0.55)]">
              Set in Fraunces &amp; Archivo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
