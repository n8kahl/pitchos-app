import "server-only";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ runId: string }> }
): Promise<Response> {
  const { runId } = await params;
  const run = await db.analysisRun.findUnique({
    where: { id: runId },
    select: {
      id: true,
      status: true,
      stage: true,
      progress: true,
      errorMessage: true,
      startedAt: true,
      completedAt: true,
      modelProvider: true,
      modelName: true,
      rubricVersion: true,
      partnerProfileVersion: true,
    },
  });

  if (!run) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(run);
}
