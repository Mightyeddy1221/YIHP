"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./prose";

export default function SectionNav({ sections }: { sections: Heading[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      setActive(id);
    }
  };

  if (!sections.length) return null;

  return (
    <nav aria-label="Sections">
      <div className="text-[11px] font-sans font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Sections
      </div>
      <ul>
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => go(e, s.id)}
                className="block py-1.5 leading-snug border-l-2 transition-colors font-sans"
                style={{
                  paddingLeft: s.level === 3 ? "1.5rem" : "0.75rem",
                  marginLeft: "-2px",
                  borderColor: on ? "#C8952A" : "transparent",
                  color: on ? "#112440" : "#64748b",
                  fontSize: s.level === 3 ? "0.8rem" : "0.875rem",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {s.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
