"use client";

import { useEffect, useState } from "react";

export const REPORT_SECTIONS = [
  { id: "verdict", label: "★ Verdict" },
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

  // On mount: hide every panel except the first
  useEffect(() => {
    showPanel("verdict");
  }, []);

  function showPanel(id: string) {
    for (const s of REPORT_SECTIONS) {
      const el = document.getElementById(`panel-${s.id}`);
      if (!el) continue;
      el.style.display = s.id === id ? "" : "none";
    }
    setActive(id);
    // Scroll to top of report area so the panel starts visible
    document.getElementById("report-panels")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <nav
      aria-label="Report sections"
      className="sticky top-0 z-20 -mx-6 overflow-x-auto border-b border-border/60 bg-background/95 backdrop-blur-md sm:-mx-8"
    >
      <ul className="flex min-w-max items-center gap-0.5 px-4 py-1.5 sm:px-6">
        {REPORT_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => showPanel(s.id)}
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
