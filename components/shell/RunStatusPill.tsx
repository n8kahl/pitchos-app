"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ActiveRunPayload } from "@/app/api/runs/active/route";

// TopBar pill that derives its label from the latest analysis run.
// Three visual states — in-flight, complete, idle. While a run is in
// flight the pill polls every 3s; when idle it polls every 30s. Tab
// visibility pauses polling so it doesn't burn cycles in background.

type Run = NonNullable<ActiveRunPayload["run"]>;

const POLL_RUNNING_MS = 3_000;
const POLL_IDLE_MS = 30_000;

export function RunStatusPill() {
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState(false);
  const aborted = useRef(false);

  useEffect(() => {
    aborted.current = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      if (aborted.current) return;
      try {
        const res = await fetch("/api/runs/active", { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data: ActiveRunPayload = await res.json();
        if (aborted.current) return;
        setRun(data.run);
        setError(false);
      } catch {
        if (aborted.current) return;
        setError(true);
      }
      if (aborted.current) return;
      const wait = run?.isInFlight ? POLL_RUNNING_MS : POLL_IDLE_MS;
      timer = setTimeout(tick, wait);
    }

    function onVisibility() {
      if (document.hidden) {
        if (timer) clearTimeout(timer);
        timer = null;
      } else if (!timer) {
        tick();
      }
    }

    tick();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      aborted.current = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [run?.isInFlight]);

  // Idle / first paint / fetch error → fall back to the founder stage.
  // This preserves the current UX so the pill never disappears.
  if (!run || error) return <FounderStagePill />;

  if (run.isInFlight) return <InFlightPill run={run} />;
  if (run.status === "FAILED") return <FailedPill run={run} />;
  if (run.status === "COMPLETED" && run.fundabilityScore !== null) {
    return <CompletePill run={run} score={run.fundabilityScore} />;
  }
  return <FounderStagePill />;
}

function InFlightPill({ run }: { run: Run }) {
  const stage = run.stageIndex > 0 ? `${run.stageIndex} of ${run.stageTotal}` : "queued";
  return (
    <>
      <Link
        href={`/runs/${run.id}`}
        className="hidden items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 transition hover:border-brand-gold/70 hover:bg-brand-gold/15 sm:flex"
      >
        <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold">
          analyzing · {stage}
        </span>
      </Link>
      <Link
        href={`/runs/${run.id}`}
        aria-label={`Run in progress · ${run.stageLabel} · ${stage}`}
        title={`analyzing · ${run.stageLabel} · ${stage}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-brand-gold/40 bg-brand-gold/10 sm:hidden"
      >
        <span className="stage-dot-pulse h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_8px_var(--color-brand-gold)]" />
      </Link>
    </>
  );
}

function CompletePill({ run, score }: { run: Run; score: number }) {
  return (
    <>
      <Link
        href={`/report/${run.id}`}
        className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/5 px-3 py-1 transition hover:border-brand-green/60 hover:bg-brand-green/10 sm:flex"
      >
        <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green">
          fundability · <span className="tabular-nums text-foreground">{score}</span>
        </span>
      </Link>
      <Link
        href={`/report/${run.id}`}
        aria-label={`Latest fundability score · ${score}`}
        title={`fundability · ${score}`}
        className="grid h-9 w-9 place-items-center rounded-full border border-brand-green/30 bg-brand-green/5 font-mono text-[10px] font-bold tabular-nums text-brand-green sm:hidden"
      >
        {score}
      </Link>
    </>
  );
}

function FailedPill({ run }: { run: Run }) {
  return (
    <>
      <Link
        href={`/runs/${run.id}`}
        className="hidden items-center gap-2 rounded-full border border-destructive/40 bg-destructive/5 px-3 py-1 transition hover:border-destructive/70 sm:flex"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-destructive">
          run failed · review
        </span>
      </Link>
      <Link
        href={`/runs/${run.id}`}
        aria-label="Run failed · review"
        title="run failed · review"
        className="grid h-9 w-9 place-items-center rounded-full border border-destructive/40 bg-destructive/5 sm:hidden"
      >
        <span className="h-2 w-2 rounded-full bg-destructive" />
      </Link>
    </>
  );
}

function FounderStagePill() {
  return (
    <>
      <div className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/5 px-3 py-1 sm:flex">
        <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green">
          Stage 3 · Pitch-Ready
        </span>
      </div>
      <div
        aria-label="Stage 3 · Pitch-Ready"
        title="Stage 3 · Pitch-Ready"
        className="grid h-9 w-9 place-items-center rounded-full border border-brand-green/30 bg-brand-green/5 sm:hidden"
      >
        <span className="stage-dot-pulse h-2 w-2 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
      </div>
    </>
  );
}
