"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { COACH_EXAMPLES, type CoachExchange } from "@/lib/content/coach-exchanges";

type ModeKey = "discovery" | "structuring" | "sharpening";

const MODES: Array<{
  key: ModeKey;
  label: string;
  stage: string;
  desc: string;
}> = [
  {
    key: "discovery",
    label: "Discovery",
    stage: "stage 1 · idea",
    desc: "Customer-discovery first. The Coach pushes you to interviews before deck building. Surfaces the clips on problem definition and ICP work.",
  },
  {
    key: "structuring",
    label: "Structuring",
    stage: "stage 2 · validation",
    desc: "Build the first deck against the rubric. Frameworks per dimension. Scott's twelve-slide order with question-per-slide discipline.",
  },
  {
    key: "sharpening",
    label: "Sharpening",
    stage: "stage 3+ · pitch-ready",
    desc: "Stress-test the deck or pitch. Plays a skeptical partner. Hands off to PitchOS for the deep grade.",
  },
];

export default function CoachPage() {
  const [mode, setModeState] = useState<ModeKey>("sharpening");
  const [activeId, setActiveIdState] = useState<string | null>(
    () => COACH_EXAMPLES.find((e) => e.mode === "sharpening")?.id ?? null
  );
  const [thinking, setThinking] = useState(false);
  const thinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inMode = useMemo(
    () => COACH_EXAMPLES.filter((e) => e.mode === mode),
    [mode]
  );

  function triggerThinking() {
    setThinking(true);
    if (thinkTimer.current) clearTimeout(thinkTimer.current);
    thinkTimer.current = setTimeout(() => setThinking(false), 700);
  }

  function selectMode(next: ModeKey) {
    setModeState(next);
    const first = COACH_EXAMPLES.find((e) => e.mode === next);
    setActiveIdState(first?.id ?? null);
    if (first) triggerThinking();
  }

  function selectExchange(id: string) {
    if (id === activeId) return;
    setActiveIdState(id);
    triggerThinking();
  }

  const exchange: CoachExchange | null = activeId
    ? COACH_EXAMPLES.find((e) => e.id === activeId) ?? null
    : null;

  const activeMode = MODES.find((m) => m.key === mode)!;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          03 · ai coach · scott-bot · {activeMode.label.toLowerCase()} mode
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
          Talk to Scott — answers grounded in his actual content.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Every reply cites real clips with timestamp anchors that play
          inline. The Coach refuses to claim what it can&rsquo;t cite —
          same discipline as the PitchOS memo regression test.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-5">
          <div>
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              mode · click to switch
            </div>
            <ul className="space-y-2">
              {MODES.map((m) => {
                const active = m.key === mode;
                return (
                  <li key={m.key}>
                    <button
                      type="button"
                      onClick={() => selectMode(m.key)}
                      className={[
                        "w-full rounded-md border px-3.5 py-2.5 text-left transition",
                        active
                          ? "border-brand-gold/50 bg-brand-gold/10 shadow-[inset_2px_0_0_var(--color-brand-gold)]"
                          : "border-border/60 bg-card/30 hover:border-brand-gold/30 hover:bg-card/50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold">
                        <span>{m.label}</span>
                        {active && (
                          <span className="rounded-sm bg-brand-gold/20 px-1.5 py-0.5 text-[8px] tracking-[0.14em]">
                            active
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                        {m.stage}
                      </div>
                      <p className="mt-1.5 text-[12px] leading-snug text-foreground/85">
                        {m.desc}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {inMode.length} questions · {activeMode.label.toLowerCase()} mode
            </div>
            {inMode.length === 0 ? (
              <div className="rounded-md border border-dashed border-border/60 bg-card/20 px-3 py-4 text-[12px] leading-snug text-muted-foreground">
                No prebaked exchanges in this mode yet. Live RAG ships in
                phase 5.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {inMode.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => selectExchange(e.id)}
                      className={[
                        "w-full rounded-md border px-3 py-2 text-left text-[12.5px] leading-snug transition",
                        activeId === e.id
                          ? "border-brand-gold/40 bg-brand-gold/5 text-foreground"
                          : "border-border/60 bg-card/20 text-muted-foreground hover:border-brand-gold/30 hover:text-foreground",
                      ].join(" ")}
                    >
                      {e.prompt}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <article className="rounded-xl border border-border/60 bg-card/30">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[13px] font-bold text-[#0a1410]">
              S
            </div>
            <div className="flex-1">
              <div className="font-serif text-[15px] font-semibold leading-tight text-foreground">
                Scott · AI Coach
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green">
                <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_6px_var(--color-brand-green)]" />
                {thinking ? "thinking…" : `ready · ${activeMode.label.toLowerCase()} mode`}
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-6">
            {exchange ? (
              <>
                <div className="ml-auto max-w-lg rounded-xl rounded-tr-sm bg-brand-gold/15 px-4 py-3 text-[14px] leading-snug text-foreground">
                  {exchange.prompt}
                </div>

                {thinking ? (
                  <ScottThinking />
                ) : (
                  <>
                    <div className="max-w-2xl">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                        scott · grounded in {exchange.citations.length} clip
                        {exchange.citations.length === 1 ? "" : "s"}
                      </div>
                      <div className="mt-2 max-w-prose whitespace-pre-line rounded-xl rounded-tl-sm border border-border/60 bg-bg-2/80 px-4 py-3.5 font-serif text-[15px] leading-[1.75] text-foreground/90">
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
                            type="button"
                            onClick={() => {
                              // Find an exchange whose prompt matches the follow-up
                              const next = COACH_EXAMPLES.find(
                                (e) =>
                                  e.id !== exchange.id &&
                                  (e.prompt === f ||
                                    e.followUps.includes(f) ||
                                    f
                                      .toLowerCase()
                                      .includes(e.id.split("-")[0]))
                              );
                              if (next) {
                                setModeState(next.mode);
                                setActiveIdState(next.id);
                                triggerThinking();
                              }
                            }}
                            className="rounded-md border border-border/60 bg-card/40 px-3 py-2 text-[12.5px] text-foreground/85 transition hover:border-brand-gold/40 hover:bg-card/70 hover:text-foreground"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <EmptyMode mode={activeMode.label} />
            )}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="border-t border-border/60 bg-bg-2/60 px-5 py-4 sm:px-6"
          >
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-card px-3 py-2 focus-within:border-brand-gold/60">
              <input
                type="text"
                placeholder={
                  mode === "discovery"
                    ? "Ask Scott about your problem, your customer, your insight…"
                    : mode === "structuring"
                      ? "Ask Scott about deck structure, slide order, frameworks…"
                      : "Ask Scott about your wedge, your why-now, your team slide…"
                }
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-gold px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
              >
                ask →
              </button>
            </div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              prototype · prebaked exchanges. live RAG ships in platform phase 5.
            </div>
          </form>
        </article>
      </div>
    </main>
  );
}

function ScottThinking() {
  return (
    <div className="max-w-2xl">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
        scott · retrieving grounding clips
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-xl rounded-tl-sm border border-border/60 bg-bg-2/80 px-5 py-5">
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-gold/80" />
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-gold/80" />
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-gold/80" />
      </div>
    </div>
  );
}

function EmptyMode({ mode }: { mode: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/20 px-5 py-12 text-center">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {mode} mode
      </div>
      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
        No prebaked exchanges in this mode yet.
      </h3>
      <p className="mt-2 font-serif text-[14px] leading-relaxed text-muted-foreground">
        Live RAG ships in platform phase 5. The mode rail and routing
        already work; the model just needs to be wired.
      </p>
    </div>
  );
}
