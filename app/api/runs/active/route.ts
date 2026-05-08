import "server-only";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Active-run lookup powering the TopBar status pill. Returns the most
// recent run regardless of status — the client decides how to render
// each state. The pill polls this every few seconds while a run is in
// flight, less often when idle.

const STAGE_ORDER = [
  "QUEUED",
  "VALIDATING_FILE",
  "EXTRACTING_FACTS",
  "REVIEWING_SLIDES",
  "SCORING_FUNDABILITY",
  "FINDING_OBJECTIONS",
  "BUILDING_DILIGENCE",
  "WRITING_MEMO",
  "BUILDING_ROADMAP",
  "FINALIZING_REPORT",
  "COMPLETED",
  "FAILED",
] as const;

const STAGE_LABEL: Record<string, string> = {
  QUEUED: "queued",
  VALIDATING_FILE: "validating",
  EXTRACTING_FACTS: "extracting facts",
  REVIEWING_SLIDES: "reviewing slides",
  SCORING_FUNDABILITY: "scoring",
  FINDING_OBJECTIONS: "finding objections",
  BUILDING_DILIGENCE: "building diligence",
  WRITING_MEMO: "writing memo",
  BUILDING_ROADMAP: "building roadmap",
  FINALIZING_REPORT: "finalizing",
  COMPLETED: "complete",
  FAILED: "failed",
};

// Working stages exclude QUEUED (waiting) and the two terminal states.
// Pill shows "scoring · 4 of 9" so the founder reads a real chain
// rather than a single opaque LLM call.
const WORKING_STAGES = STAGE_ORDER.slice(1, -2);
const WORKING_TOTAL = WORKING_STAGES.length;

export type ActiveRunPayload = {
  run: {
    id: string;
    status: string;
    stage: string;
    stageLabel: string;
    stageIndex: number;
    stageTotal: number;
    progress: number;
    companyName: string;
    fundabilityScore: number | null;
    isInFlight: boolean;
    completedAt: string | null;
  } | null;
};

export async function GET(): Promise<Response> {
  const run = await db.analysisRun.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      stage: true,
      progress: true,
      completedAt: true,
      deck: { select: { project: { select: { companyName: true } } } },
      report: { select: { fundabilityScore: true } },
    },
  });

  if (!run) {
    return NextResponse.json<ActiveRunPayload>({ run: null });
  }

  const stageIndex = WORKING_STAGES.indexOf(run.stage);
  const isInFlight = run.status === "QUEUED" || run.status === "RUNNING";

  return NextResponse.json<ActiveRunPayload>({
    run: {
      id: run.id,
      status: run.status,
      stage: run.stage,
      stageLabel: STAGE_LABEL[run.stage] ?? run.stage.toLowerCase(),
      stageIndex: stageIndex >= 0 ? stageIndex + 1 : 0,
      stageTotal: WORKING_TOTAL,
      progress: run.progress,
      companyName: run.deck?.project?.companyName ?? "untitled",
      fundabilityScore: run.report?.fundabilityScore ?? null,
      isInFlight,
      completedAt: run.completedAt?.toISOString() ?? null,
    },
  });
}
