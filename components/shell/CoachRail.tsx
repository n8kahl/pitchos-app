"use client";

import { useState } from "react";
import Link from "next/link";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";

const STARTER_PROMPTS = COACH_EXAMPLES.map((e) => e.prompt);

export function CoachRail() {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const exchange = COACH_EXAMPLES[activeIdx];

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-brand-gold px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a1410] shadow-[0_8px_24px_rgba(245,200,66,0.25)] transition hover:bg-brand-gold-2",
          open ? "opacity-0 pointer-events-none" : "",
        ].join(" ")}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a1410] text-brand-gold">
          ✸
        </span>
        Ask the Coach
      </button>

      <aside
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/60 bg-bg-2 shadow-2xl transition-transform duration-300 sm:w-[420px]",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[12px] font-bold text-[#0a1410]">
            S
          </div>
          <div className="flex-1">
            <div className="font-serif text-[14px] font-semibold leading-tight text-foreground">
              Scott · AI Coach
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-green">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_6px_var(--color-brand-green)]" />
              ready · sharpening mode
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
          >
            close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-md border border-border/60 bg-card/40 p-4">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              you asked
            </div>
            <p className="mt-1.5 font-serif text-[14px] leading-snug text-foreground">
              {exchange.prompt}
            </p>
          </div>

          <div className="mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            scott replies · grounded in {exchange.citations.length} clip{exchange.citations.length === 1 ? "" : "s"}
          </div>
          <div className="mt-2 whitespace-pre-line font-serif text-[14px] leading-[1.7] text-foreground/90">
            {exchange.reply.replace(/\[\^\d+\]/g, "")}
          </div>

          <div className="mt-6">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              cited clips · in this platform
            </div>
            <ul className="mt-2 space-y-2">
              {exchange.citations.map((c, i) => (
                <li key={i}>
                  <Link
                    href={`/library/${c.clipId}?t=${c.at}`}
                    className="block rounded-md border border-brand-gold/20 bg-brand-gold/5 px-3.5 py-3 transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-gold">
                      <span>play at {c.at}</span>
                      <span>→</span>
                    </div>
                    <p className="mt-1 font-serif text-[13px] italic leading-snug text-foreground/85">
                      &ldquo;{c.excerpt}&rdquo;
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              follow-up
            </div>
            <ul className="mt-2 space-y-1.5">
              {exchange.followUps.map((f, i) => (
                <li
                  key={i}
                  className="cursor-pointer rounded-md border border-border/60 bg-card/40 px-3 py-2 text-[12.5px] text-foreground/85 transition hover:border-brand-gold/40 hover:bg-card/70 hover:text-foreground"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              other example questions
            </div>
            <ul className="mt-2 space-y-1.5">
              {STARTER_PROMPTS.map((p, i) =>
                i === activeIdx ? null : (
                  <li
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className="cursor-pointer rounded-md border border-dashed border-border px-3 py-2 text-[12.5px] text-muted-foreground transition hover:border-brand-gold/40 hover:text-foreground"
                  >
                    {p}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <form
          className="border-t border-border/60 bg-bg-3 px-4 py-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 focus-within:border-brand-gold/60">
            <input
              type="text"
              placeholder="Ask Scott about your deck, your wedge, your why-now…"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-brand-gold px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              ask →
            </button>
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            prototype · pre-baked exchanges. real RAG ships in platform phase 5.
          </div>
        </form>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
        />
      )}
    </>
  );
}
