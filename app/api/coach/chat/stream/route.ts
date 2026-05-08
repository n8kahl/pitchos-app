import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MockCoachProvider } from "@/lib/coach/mock-provider";
import { AnthropicCoachProvider } from "@/lib/coach/anthropic-provider";
import type { CoachProvider, CoachStreamEvent } from "@/lib/coach/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Streaming Coach chat endpoint. Returns newline-delimited JSON
// events (one CoachStreamEvent per line) so the rail can
// progressively render text as it arrives. Mock provider chunks the
// retrieval-fallback text on small delays; Anthropic provider
// forwards real Sonnet token deltas.

const Body = z.object({
  question: z.string().min(2).max(2000),
  mode: z.enum(["discovery", "structuring", "sharpening"]).optional(),
  stage: z
    .union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ])
    .optional(),
});

function pickProvider(): CoachProvider {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key && key.length > 10) return new AnthropicCoachProvider(key);
  return new MockCoachProvider();
}

function encodeEvent(event: CoachStreamEvent): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(event) + "\n");
}

export async function POST(req: Request): Promise<Response> {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Expected { question: string, mode?, stage? }" },
      { status: 400 }
    );
  }

  const provider = pickProvider();
  if (!provider.stream) {
    return NextResponse.json(
      { error: "Selected provider does not support streaming" },
      { status: 501 }
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of provider.stream!(parsed.data)) {
          controller.enqueue(encodeEvent(event));
        }
      } catch (err) {
        controller.enqueue(
          encodeEvent({
            type: "error",
            message: err instanceof Error ? err.message : "stream failed",
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-content-type-options": "nosniff",
    },
  });
}
