"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STAGE_LABELS: Array<{ key: string; label: string; mono: string }> = [
  { key: "VALIDATING_FILE", label: "Validating PDF", mono: "01 · validate" },
  { key: "EXTRACTING_FACTS", label: "Extracting structured claims · per-slide quote anchoring", mono: "02 · extract" },
  { key: "REVIEWING_SLIDES", label: "Slide-by-slide review", mono: "03 · slides" },
  { key: "SCORING_FUNDABILITY", label: "Scoring against Black Dog VP rubric v1.3", mono: "04 · score" },
  { key: "FINDING_OBJECTIONS", label: "Detecting closed-catalog anti-patterns", mono: "05 · objections" },
  { key: "BUILDING_DILIGENCE", label: "Building diligence checklist", mono: "06 · diligence" },
  { key: "WRITING_MEMO", label: "Synthesizing partner-voiced memo", mono: "07 · memo" },
  { key: "BUILDING_ROADMAP", label: "Counterfactual rewrites + score deltas", mono: "08 · roadmap" },
  { key: "FINALIZING_REPORT", label: "Finalizing report · voice regression check", mono: "09 · finalize" },
];

const TERMINAL_STAGES = new Set(["COMPLETED", "FAILED"]);

type Props = {
  runId: string;
  initialStage: string;
  initialStatus: string;
  initialProgress: number;
};

type RunStatus = {
  status: string;
  stage: string;
  progress: number;
  errorMessage: string | null;
};

export function ProgressView({
  runId,
  initialStage,
  initialStatus,
  initialProgress,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<RunStatus>({
    status: initialStatus,
    stage: initialStage,
    progress: initialProgress,
    errorMessage: null,
  });

  useEffect(() => {
    if (TERMINAL_STAGES.has(state.status)) return;

    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/analysis-runs/${runId}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const next = (await res.json()) as RunStatus;
        if (cancelled) return;
        setState(next);
        if (next.status === "COMPLETED") {
          router.replace(`/report/${runId}`);
        }
      } catch {
        // network blip; next tick will retry
      }
    };

    const id = setInterval(tick, 500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [runId, state.status, router]);

  const currentIdx = STAGE_LABELS.findIndex((s) => s.key === state.stage);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-card/40 p-6">
        <div className="flex items-end justify-between">
          <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            progress
          </div>
          <div className="font-mono text-2xl font-semibold tabular-nums text-brand-gold">
            {state.progress}
            <span className="ml-1 text-sm text-muted-foreground">%</span>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-brand-gold transition-[width] duration-500 ease-out"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      </div>

      <ol className="space-y-3">
        {STAGE_LABELS.map((s, i) => {
          const isDone = currentIdx > i || state.status === "COMPLETED";
          const isCurrent =
            currentIdx === i && !TERMINAL_STAGES.has(state.status);
          return (
            <li
              key={s.key}
              className={[
                "flex items-start gap-4 rounded-md border px-5 py-4 transition",
                isDone
                  ? "border-brand-green/30 bg-brand-green/5"
                  : isCurrent
                  ? "border-brand-gold bg-card"
                  : "border-border bg-card/30",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  isDone
                    ? "border-brand-green bg-brand-green text-background"
                    : isCurrent
                    ? "border-brand-gold text-brand-gold"
                    : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {isDone ? "✓" : isCurrent ? "·" : ""}
              </div>
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.mono}
                </div>
                <div
                  className={[
                    "mt-1 text-sm",
                    isCurrent ? "text-brand-gold" : "text-foreground",
                  ].join(" ")}
                >
                  {s.label}
                  {isCurrent && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {state.status === "FAILED" && (
        <div className="rounded-md border border-signal-red/40 bg-signal-red/5 p-4 text-sm text-signal-red">
          <div className="font-mono text-[11px] uppercase tracking-widest">
            run failed
          </div>
          <div className="mt-2 text-foreground">
            {state.errorMessage ?? "Unknown error"}
          </div>
        </div>
      )}
    </div>
  );
}
