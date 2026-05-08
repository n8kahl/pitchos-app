"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "verdict", label: "Verdict" },
  { id: "s01", label: "01 Memo" },
  { id: "s02", label: "02 Bull/Bear" },
  { id: "s03", label: "03 Scores" },
  { id: "s04", label: "04 Objections" },
  { id: "s05", label: "05 Slides" },
  { id: "s06", label: "06 Gates" },
  { id: "s07", label: "07 Diligence" },
  { id: "s08", label: "08 Lens" },
  { id: "s09", label: "09 Q&A" },
];

export function ReportNav() {
  const [active, setActive] = useState("verdict");
  const pillRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { threshold: 0.15, rootMargin: "-72px 0px -55% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Report sections"
      className="sticky top-0 z-20 -mx-6 overflow-x-auto border-b border-border/60 bg-background/95 backdrop-blur-md sm:-mx-8"
    >
      <ul className="flex min-w-max items-center gap-0.5 px-4 py-1.5 sm:px-6">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                ref={isActive ? pillRef : null}
                onClick={() => scrollTo(s.id)}
                className={[
                  "whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] transition",
                  isActive
                    ? "bg-brand-gold/15 text-brand-gold"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
