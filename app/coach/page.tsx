"use client";

import { useState } from "react";
import Link from "next/link";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";

const MODES = [
  {
    key: "discovery",
    label: "Discovery mode",
    desc: "For stage-1 founders. Asks customer-discovery questions. Pushes you to the clips on problem definition before deck building.",
  },
  {
    key: "structuring",
    label: "Structuring mode",
    desc: "For stage-2 founders. Helps you build the first deck against the rubric. Surfaces frameworks from the corpus per dimension.",
  },
  {
    key: "sharpening",
    label: "Sharpening mode",
    desc: "For stage-3+ founders. Stress-tests your deck or pitch. Plays the role of a skeptical partner. Hands off to PitchOS for the deep grade.",
  },
] as const;

export default function CoachPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const exchange = COACH_EXAMPLES[activeIdx];

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          03 · ai coach · scott-bot · sharpening mode
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">
          Talk to Scott — answers grounded in his actual content.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Every reply cites real clips with timestamp anchors that play
          inline. The Coach refuses to make claims it can&rsquo;t cite to
          the corpus — same discipline as the PitchOS memo regression test.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <div>
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              mode · stage 3 active
            </div>
            <ul className="space-y-2">
              {MODES.map((m, i) => (
                <li
                  key={m.key}
                  className={[
                    "rounded-md border px-3.5 py-2.5 transition",
                    i === 2
                      ? "border-brand-gold/40 bg-brand-gold/5"
                      : "border-border/60 bg-card/30 opacity-60",
                  ].join(" ")}
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold">
                    {m.label}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
                    {m.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              example questions
            </div>
            <ul className="space-y-1.5">
              {COACH_EXAMPLES.map((e, i) => (
                <li
                  key={e.id}
                  onClick={() => setActiveIdx(i)}
                  className={[
                    "cursor-pointer rounded-md border px-3 py-2 text-[12.5px] leading-snug transition",
                    i === activeIdx
                      ? "border-brand-gold/40 bg-brand-gold/5 text-foreground"
                      : "border-border/60 bg-card/20 text-muted-foreground hover:border-brand-gold/30 hover:text-foreground",
                  ].join(" ")}
                >
                  {e.prompt}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <article className="rounded-xl border border-border/60 bg-card/30">
          <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[13px] font-bold text-[#0a1410]">
              S
            </div>
            <div>
              <div className="font-serif text-[15px] font-semibold leading-tight text-foreground">
                Scott · AI Coach
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_6px_var(--color-brand-green)]" />
                ready · sharpening mode
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="ml-auto max-w-lg rounded-xl rounded-tr-sm bg-brand-gold/15 px-4 py-3 text-[14px] leading-snug text-foreground">
              {exchange.prompt}
            </div>

            <div className="max-w-2xl">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                scott · grounded in {exchange.citations.length} clip{exchange.citations.length === 1 ? "" : "s"}
              </div>
              <div className="mt-2 whitespace-pre-line rounded-xl rounded-tl-sm border border-border/60 bg-bg-2/80 px-4 py-3.5 font-serif text-[15px] leading-[1.75] text-foreground/90">
                {exchange.reply.replace(/\[\^\d+\]/g, "")}
              </div>
            </div>

            <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-4">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                cited clips · jump to timestamp
              </div>
              <ul className="mt-3 space-y-2">
                {exchange.citations.map((c, i) => (
                  <li key={i}>
                    <Link
                      href={`/library/${c.clipId}?t=${c.at}`}
                      className="block rounded-md border border-border/60 bg-bg-2/60 px-4 py-3 transition hover:border-brand-gold/40 hover:bg-bg-2"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold">
                        <span>play at {c.at}</span>
                        <span>open clip →</span>
                      </div>
                      <p className="mt-1.5 font-serif text-[13.5px] italic leading-snug text-foreground/90">
                        &ldquo;{c.excerpt}&rdquo;
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                follow-ups Scott would ask
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {exchange.followUps.map((f, i) => (
                  <button
                    key={i}
                    className="rounded-md border border-border/60 bg-card/40 px-3 py-2 text-[12.5px] text-foreground/85 transition hover:border-brand-gold/40 hover:bg-card/70 hover:text-foreground"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="border-t border-border/60 bg-bg-2/60 px-6 py-4"
          >
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 focus-within:border-brand-gold/60">
              <input
                type="text"
                placeholder="Ask Scott — your wedge, your why-now, your team slide…"
                className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-gold px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
              >
                ask →
              </button>
            </div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              prototype · pre-baked exchanges. live RAG ships in platform phase 5.
            </div>
          </form>
        </article>
      </div>
    </main>
  );
}
