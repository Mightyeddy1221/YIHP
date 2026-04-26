import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gold-500 flex items-center justify-center">
                <span className="text-navy-900 font-serif font-bold text-sm">Y</span>
              </div>
              <span className="font-serif font-bold text-xl text-white">YIHP</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              The Youth Institute for Health Policy produces rigorous, accessible policy analysis to advance health equity across Massachusetts and beyond.
            </p>
          </div>

          {/* Publication */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-4">Publication</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Articles", href: "/articles" },
                { label: "Policy Memos", href: "/policy-memos" },
                { label: "Policy Desks", href: "/desk/massachusetts" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-500 mb-4">Organization</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About & Mission", href: "/about" },
                { label: "Meet the Team", href: "/team" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-navy-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Youth Institute for Health Policy. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Policy research for a healthier future.
          </p>
        </div>
      </div>
    </footer>
  );
}
