"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const desks = [
  { label: "Massachusetts", href: "/desk/massachusetts" },
  { label: "New York City", href: "/desk/new-york-city" },
  { label: "Virginia", href: "/desk/virginia" },
];

const topics = [
  { label: "Mental Health", href: "/topic/mental-health" },
  { label: "Substance Abuse", href: "/topic/substance-abuse" },
  { label: "Housing & Homelessness", href: "/topic/housing-homelessness" },
  { label: "Criminal Justice", href: "/topic/criminal-justice" },
  { label: "Education", href: "/topic/education" },
];

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="nav-link flex items-center gap-1 cursor-pointer"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-200 shadow-lg z-50 py-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-navy-800 transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Top bar */}
      <div className="bg-navy-800 text-white text-xs font-sans py-1.5 text-center tracking-wide">
        Youth Institute for Health Policy
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-navy-800 flex items-center justify-center">
              <span className="text-gold-500 font-serif font-bold text-sm">Y</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-navy-900 text-lg tracking-tight">YIHP</div>
              <div className="text-xs text-slate-500 font-sans hidden sm:block" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                YOUTH INSTITUTE FOR HEALTH POLICY
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            <Link href="/articles" className="nav-link">Articles</Link>
            <Link href="/policy-memos" className="nav-link">Policy Memos</Link>
            <Dropdown label="Policy Desks" items={desks} />
            <Dropdown label="Topics" items={topics} />
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/team" className="nav-link">Team</Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-600 hover:text-navy-800 cursor-pointer"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-1">
            {[
              { label: "Articles", href: "/articles" },
              { label: "Policy Memos", href: "/policy-memos" },
              { label: "About", href: "/about" },
              { label: "Team", href: "/team" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-2 text-sm text-slate-700 hover:text-navy-800 cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Policy Desks</p>
              {desks.map((d) => (
                <Link key={d.href} href={d.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:text-navy-800 cursor-pointer">{d.label}</Link>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100">
              <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Topics</p>
              {topics.map((t) => (
                <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-sm text-slate-600 hover:text-navy-800 cursor-pointer">{t.label}</Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
