import "server-only";
import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { startAnalysisRun } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Demo · skips the file picker entirely. Creates (or reuses) the
// MeshOps fixture deck and kicks off an AnalysisRun. The mock
// provider returns deterministic Scott-voiced output so the demo
// always produces the same partner memo, and the 9-stage progress
// chain ticks through normally on the way there.
//
// Wired from the "Try with the MeshOps sample deck" CTA on /pitchos.

const DEMO_FILE_NAME = "MeshOps_Series_A_Deck_v8.pdf";
const DEMO_COMPANY = "MeshOps";
// Deterministic checksum so repeated demo runs hit the dedup branch
// in the upload contract — one Deck row in the DB, fresh AnalysisRun
// every click.
const DEMO_CHECKSUM = createHash("sha256")
  .update("pitchos-demo-meshops-fixture-v1")
  .digest("hex");
const DEMO_FILE_BYTES = 2_148_932;

export async function POST(): Promise<Response> {
  // Reuse if a prior demo created the deck row.
  const existing = await db.deck.findFirst({
    where: { checksum: DEMO_CHECKSUM, deletedAt: null },
  });

  if (existing) {
    const runId = await startAnalysisRun(existing.id);
    return NextResponse.json({
      runId,
      reused: true,
      companyName: DEMO_COMPANY,
      fileName: DEMO_FILE_NAME,
    });
  }

  const project = await db.project.create({
    data: { companyName: DEMO_COMPANY },
  });

  const deck = await db.deck.create({
    data: {
      projectId: project.id,
      fileName: DEMO_FILE_NAME,
      fileType: "application/pdf",
      fileSizeBytes: DEMO_FILE_BYTES,
      checksum: DEMO_CHECKSUM,
      // Storage key intentionally empty · the mock provider returns the
      // MeshOps fixture without reading any blob. When live AI lands,
      // this row gets a real key pointing at a hosted sample PDF.
      storageKey: "",
    },
  });

  const runId = await startAnalysisRun(deck.id);
  return NextResponse.json({
    runId,
    reused: false,
    companyName: DEMO_COMPANY,
    fileName: DEMO_FILE_NAME,
  });
}
