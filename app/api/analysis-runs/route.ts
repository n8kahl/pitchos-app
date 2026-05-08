import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { startAnalysisRun } from "@/lib/ai/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const StartRunBody = z.object({ deckId: z.string().min(1) });

export async function POST(request: NextRequest): Promise<Response> {
  const json = await request.json().catch(() => null);
  const parsed = StartRunBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Expected { deckId: string }" },
      { status: 400 }
    );
  }
  try {
    const runId = await startAnalysisRun(parsed.data.deckId);
    return NextResponse.json({ runId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to start run" },
      { status: 500 }
    );
  }
}
