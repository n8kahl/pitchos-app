"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Skip-the-file-picker path · clicks POST /api/decks/demo-run, which
// creates (or reuses) the MeshOps fixture deck and starts a fresh
// AnalysisRun. Lands on /runs/<id> where the existing 9-stage progress
// chain takes over.

type State = "idle" | "starting" | "error";

export function SampleDeckCTA() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function start() {
    setState("starting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/decks/demo-run", { method: "POST" });
      const json = (await res.json()) as
        | { runId: string; reused: boolean; companyName: string; fileName: string }
        | { error: string };
      if (!res.ok || "error" in json) {
        throw new Error("error" in json ? json.error : "Demo run failed to start");
      }
      router.push(`/runs/${json.runId}?demo=1`);
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Demo run failed");
    }
  }

  const isStarting = state === "starting";

  return (
    <div className="w-full max-w-xl">
      <button
        type="button"
        onClick={start}
        disabled={isStarting}
        className={[
          "group flex w-full items-center justify-between gap-4 rounded-lg border border-brand-gold/40 bg-brand-gold/5 px-5 py-4 text-left transition",
          isStarting
            ? "pointer-events-none opacity-70"
            : "hover:border-brand-gold/70 hover:bg-brand-gold/10",
        ].join(" ")}
      >
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            ★ no PDF? · try the sample deck
          </div>
          <div className="mt-1 text-[14px] font-semibold leading-tight text-foreground">
            Score the MeshOps fixture · 12 slides · seed-stage SaaS
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            walks the same 9-stage chain · ~2 second mock analysis
          </div>
        </div>
        <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold transition group-hover:translate-x-0.5">
          {isStarting ? "starting…" : "Run →"}
        </span>
      </button>
      {state === "error" && errorMsg && (
        <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
