import "server-only";
import {
  COACH_EXAMPLES,
  type CoachExchange,
} from "@/lib/content/coach-exchanges";
import { retrieveSources, type CoachSource } from "./retrieval";
import type { CoachInput, CoachProvider, CoachReply } from "./provider";

// Default Coach provider · always available, no API key required.
//
// Strategy: keyword-match the user's question against the existing
// prebaked exchanges. Return the best match's reply and citations
// when the score is high enough to feel like a real answer; otherwise
// return a retrieval-only reply that lists relevant sources without
// pretending to have an answer.

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by",
  "for", "from", "have", "i", "if", "in", "into", "is", "it",
  "my", "of", "on", "or", "that", "the", "this", "to", "was",
  "what", "when", "where", "which", "who", "why", "will", "with",
  "would", "you", "your", "do", "does", "did", "how", "should",
  "could", "me", "we", "our",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function scoreExchange(queryToks: string[], exchange: CoachExchange): number {
  if (queryToks.length === 0) return 0;
  const haystack = `${exchange.prompt} ${exchange.followUps.join(" ")}`.toLowerCase();
  let score = 0;
  for (const t of queryToks) {
    let i = 0;
    while ((i = haystack.indexOf(t, i)) !== -1) {
      score += 1;
      i += t.length;
    }
  }
  return score;
}

function exchangeAsSources(exchange: CoachExchange): CoachSource[] {
  // Map the prebaked citations onto the CoachSource shape used by the
  // live provider. Retrieval lookups return the same shape so the rail
  // can render either provider's output identically.
  const out: CoachSource[] = [];
  for (const c of exchange.citations) {
    if (c.kind === "video") {
      out.push({
        kind: "video",
        id: c.clipId,
        title: c.excerpt.slice(0, 60),
        show: "",
        summary: c.excerpt,
        score: 1,
        rubricDims: [],
      });
    } else if (c.kind === "podcast") {
      out.push({
        kind: "podcast",
        id: c.episodeId,
        title: c.excerpt.slice(0, 60),
        show: "",
        summary: c.excerpt,
        score: 1,
        rubricDims: [],
      });
    } else {
      out.push({
        kind: "resource",
        id: c.resourceId,
        title: c.excerpt.slice(0, 60),
        source: "",
        summary: c.excerpt,
        score: 1,
        rubricDims: [],
      });
    }
  }
  return out;
}

const MIN_MATCH_SCORE = 2;

export class MockCoachProvider implements CoachProvider {
  async ask(input: CoachInput): Promise<CoachReply> {
    const queryToks = tokens(input.question);
    let bestExchange: CoachExchange | null = null;
    let bestScore = 0;

    for (const e of COACH_EXAMPLES) {
      // Mode preference · if the user is in a specific mode, match
      // exchanges in that mode first by giving them a score lift.
      const modeBonus = input.mode && e.mode === input.mode ? 1 : 0;
      const score = scoreExchange(queryToks, e) + modeBonus;
      if (score > bestScore) {
        bestScore = score;
        bestExchange = e;
      }
    }

    // Strong match — return the prebaked answer + its citations.
    if (bestExchange && bestScore >= MIN_MATCH_SCORE) {
      return {
        text: bestExchange.reply,
        sources: exchangeAsSources(bestExchange),
        matchedExchangeId: bestExchange.id,
        provider: "mock",
      };
    }

    // Weak match · still return useful retrieval over the corpus so
    // the user gets pointers rather than nothing.
    const retrieved = retrieveSources(input.question, { topN: 5 });
    return {
      text: retrieved.length
        ? "No prebaked exchange covers that exactly — here are the closest assets in the corpus. Live AI lands when ANTHROPIC_API_KEY is set; until then, the Coach answers from the curated exchange set."
        : "No prebaked exchange covers that. Try a question about ICP, wedge, traction, AI defensibility, or term sheets — or wait for live AI in the next deploy.",
      sources: retrieved,
      matchedExchangeId: null,
      provider: "mock",
    };
  }
}
