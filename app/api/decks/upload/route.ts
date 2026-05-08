import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { startAnalysisRun } from "@/lib/ai/orchestrator";
import { deckStorageKey, getStorage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = env.AI_MAX_FILE_MB * 1024 * 1024;

function deriveCompanyName(fileName: string): string {
  const stem = fileName.replace(/\.[^.]+$/, "").trim();
  return stem || "Untitled deck";
}

export async function POST(request: NextRequest): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing `file` field" },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: `Only PDF accepted (got ${file.type || "unknown"})` },
      { status: 415 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)} MB · max ${env.AI_MAX_FILE_MB} MB`,
      },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const checksum = createHash("sha256").update(buffer).digest("hex");

  // Dedup: if a deck with the same checksum exists (and isn't deleted),
  // reuse it. This supports re-uploads without re-running extraction.
  const existing = await db.deck.findFirst({
    where: { checksum, deletedAt: null },
    include: { project: true },
  });

  if (existing) {
    const runId = await startAnalysisRun(existing.id);
    return NextResponse.json({
      deckId: existing.id,
      projectId: existing.projectId,
      runId,
      checksum,
      bytes: existing.fileSizeBytes,
      reused: true,
    });
  }

  const project = await db.project.create({
    data: {
      companyName: deriveCompanyName(file.name),
    },
  });

  const deck = await db.deck.create({
    data: {
      projectId: project.id,
      fileName: file.name,
      fileType: file.type,
      fileSizeBytes: file.size,
      checksum,
      storageKey: "", // filled in after upload succeeds
    },
  });

  const storageKey = deckStorageKey(project.id, deck.id);

  try {
    await getStorage().put(storageKey, buffer, "application/pdf");
  } catch (err) {
    // Roll back DB rows so the dedup index doesn't trap a missing-blob deck
    await db.deck.delete({ where: { id: deck.id } }).catch(() => {});
    await db.project.delete({ where: { id: project.id } }).catch(() => {});
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to persist deck blob",
      },
      { status: 500 }
    );
  }

  await db.deck.update({
    where: { id: deck.id },
    data: { storageKey },
  });

  const runId = await startAnalysisRun(deck.id);

  return NextResponse.json({
    deckId: deck.id,
    projectId: project.id,
    runId,
    checksum,
    bytes: file.size,
    reused: false,
  });
}
