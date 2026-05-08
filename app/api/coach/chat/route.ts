import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MockCoachProvider } from "@/lib/coach/mock-provider";
import { AnthropicCoachProvider } from "@/lib/coach/anthropic-provider";
import type { CoachProvider } from "@/lib/coach/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Single-turn Coach chat endpoint. Picks the provider per env so the
// rail can call a stable URL whether or not the live key is set —
// MockCoachProvider routes to the closest prebaked exchange when no
// key, AnthropicCoachProvider streams Sonnet 4.6 when ANTHROPIC_API_KEY
// is present.

const Body = z.object({
  question: z.string().min(2).max(2000),
  mode: z.enum(["discovery", "structuring", "sharpening"]).optional(),
  stage: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
});

function pickProvider(): CoachProvider {
  const key = process.env.ANTHROPIC_API_KEY;
  if (key && key.length > 10) {
    return new AnthropicCoachProvider(key);
  }
  return new MockCoachProvider();
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

  try {
    const provider = pickProvider();
    const reply = await provider.ask(parsed.data);
    return NextResponse.json(reply);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Coach call failed" },
      { status: 500 }
    );
  }
}
