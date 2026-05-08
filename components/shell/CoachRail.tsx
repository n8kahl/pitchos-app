"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";
import { useCoach } from "@/lib/state/coach";

const STARTER_PROMPTS = COACH_EXAMPLES.map((e) => e.prompt);

// Match Tailwind's `lg` breakpoint. At lg+ the rail docks alongside main
// content; below lg it stays modal with a backdrop. Uses
// useSyncExternalStore so the lint rule against setState-in-effect
// stays happy in React 19.
const LG_QUERY = "(min-width: 1024px)";

function subscribeMq(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(LG_QUERY);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}

function getMqSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(LG_QUERY).matches;
}

function useIsLg(): boolean {
  return useSyncExternalStore(subscribeMq, getMqSnapshot, () => false);
}

export function CoachRail() {
  const pathname = usePathname();
  const { isOpen, open, close, activeExchangeId, primingPrompt } = useCoach();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isLg = useIsLg();
  const isDocked = isLg && isOpen;

  // Hide the floating CTA on /coach itself — redundant on its own page.
  const hideFloater = pathname === "/coach";

  // Default to first exchange if none selected
  const exchangeIdx = Math.max(
    0,
    COACH_EXAMPLES.findIndex((e) => e.id === activeExchangeId)
  );
  const exchange = COACH_EXAMPLES[exchangeIdx];

  // Esc to close + simple focus management
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the dialog when opened
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {!hideFloater && (
        <button
          onClick={() => open()}
          aria-label="Open Scott AI Coach"
          className={[
            "fixed bottom-20 right-5 z-40 flex items-center gap-2.5 rounded-full bg-brand-gold px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#0a1410] shadow-[0_8px_24px_rgba(245,200,66,0.25)] transition hover:bg-brand-gold-2 sm:bottom-6 md:right-6",
            isOpen ? "pointer-events-none opacity-0" : "",
          ].join(" ")}
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0a1410] text-brand-gold">
            ✸
          </span>
          Ask the Coach
        </button>
      )}

      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal={isDocked ? "false" : "true"}
        aria-label="Scott AI Coach"
        tabIndex={-1}
        className={[
          // Mobile (<sm): bottom sheet (90vh, rounded top), modal
          // sm-md: right rail, modal with backdrop
          // lg+: docked right rail, no backdrop, content shifts left
          "fixed z-50 flex flex-col bg-bg-2 shadow-2xl transition-transform duration-300 focus:outline-none",
          "inset-x-0 bottom-0 h-[90vh] max-h-[760px] rounded-t-2xl border-t border-border/60",
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:h-full sm:max-h-none sm:w-[420px] sm:rounded-none sm:border-l sm:border-t-0",
          // Soften the shadow when docked — the left border carries separation.
          "lg:shadow-xl",
          isOpen ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full",
        ].join(" ")}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[12px] font-bold text-[#0a1410]">
            S
          </div>
          <div className="flex-1">
            <div className="font-serif text-[14px] font-semibold leading-tight text-foreground">
              Scott · AI Coach
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green">
              <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_6px_var(--color-brand-green)]" />
              ready · sharpening mode
            </div>
          </div>
          <button
            onClick={close}
            aria-label="Close Coach"
            className="rounded-md border border-border/60 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
          >
            close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {primingPrompt && (
            <div className="mb-4 rounded-md border border-brand-green/30 bg-brand-green/5 p-3 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-green">
              context · &ldquo;{primingPrompt}&rdquo;
            </div>
          )}

          <div className="rounded-md border border-border/60 bg-card/40 p-4">
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              you asked
            </div>
            <p className="mt-1.5 font-serif text-[14px] leading-snug text-foreground">
              {exchange.prompt}
            </p>
          </div>

          <div className="mt-5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            scott replies · grounded in {exchange.citations.length} clip
            {exchange.citations.length === 1 ? "" : "s"}
          </div>
          <div className="mt-2 max-w-prose whitespace-pre-line font-serif text-[14px] leading-[1.7] text-foreground/90">
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
                    onClick={close}
                    className="block rounded-md border border-brand-gold/20 bg-brand-gold/5 px-3.5 py-3 transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold">
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
              other questions
            </div>
            <ul className="mt-2 space-y-1.5">
              {STARTER_PROMPTS.map((p, i) =>
                i === exchangeIdx ? null : (
                  <li
                    key={i}
                    onClick={() =>
                      open({ exchangeId: COACH_EXAMPLES[i].id })
                    }
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
              defaultValue={primingPrompt ?? ""}
              key={primingPrompt ?? "empty"}
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

      {isOpen && (
        <div
          onClick={close}
          aria-hidden
          className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
        />
      )}
    </>
  );
}
