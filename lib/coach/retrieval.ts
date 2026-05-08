// Lightweight keyword-matched retrieval over the corpus. Stand-in for
// pgvector embeddings (Phase 7) so the live Coach has real corpus
// context to ground answers in today. Same shape as the future
// retriever — both return ranked CoachSource[] from a query.
//
// Algorithm: for each asset, score = sum of token frequency for every
// query token across the asset's searchable text. Tie-break by rubric
// dimension hit and journey-stage hit (small bonuses). Top N returned.

import { SAMPLE_CLIPS, type SampleClip } from "@/lib/content/sample-clips";
import {
  PODCAST_EPISODES,
  type PodcastEpisode,
} from "@/lib/content/podcast-episodes";
import {
  LIBRARY_RESOURCES,
  type LibraryResource,
} from "@/lib/content/resources";
import type { RubricCategory } from "@/lib/ai/anti-patterns";

export type CoachSource =
  | {
      kind: "video";
      id: string;
      title: string;
      show: string;
      summary: string;
      score: number;
      rubricDims: RubricCategory[];
    }
  | {
      kind: "podcast";
      id: string;
      title: string;
      show: string;
      summary: string;
      score: number;
      rubricDims: RubricCategory[];
    }
  | {
      kind: "resource";
      id: string;
      title: string;
      source: string;
      summary: string;
      score: number;
      rubricDims: RubricCategory[];
    };

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "have",
  "i",
  "if",
  "in",
  "into",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
  "do",
  "does",
  "did",
  "how",
  "should",
  "could",
  "me",
  "we",
  "our",
  "they",
  "their",
  "there",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function scoreText(queryTokens: string[], text: string): number {
  if (queryTokens.length === 0) return 0;
  const haystack = text.toLowerCase();
  let score = 0;
  for (const t of queryTokens) {
    // Substring match · cheap and good enough for this corpus size.
    let idx = 0;
    while ((idx = haystack.indexOf(t, idx)) !== -1) {
      score += 1;
      idx += t.length;
    }
  }
  return score;
}

function clipText(c: SampleClip): string {
  return [
    c.title,
    c.aiSummary,
    c.show,
    ...c.rubricDims,
    ...c.keyMoments.map((m) => m.quote),
    ...c.chapters.map((ch) => `${ch.title} ${ch.summary}`),
  ].join(" ");
}

function episodeText(e: PodcastEpisode): string {
  return [e.episodeTitle, e.show, e.host, e.aiSummary, ...e.rubricDims].join(
    " "
  );
}

function resourceText(r: LibraryResource): string {
  return [r.title, r.source, r.blurb, ...r.rubricDims].join(" ");
}

export function retrieveSources(
  query: string,
  opts: { topN?: number; preferDim?: RubricCategory } = {}
): CoachSource[] {
  const topN = opts.topN ?? 5;
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) return [];

  const scored: CoachSource[] = [];

  for (const c of SAMPLE_CLIPS) {
    let score = scoreText(queryTokens, clipText(c));
    if (opts.preferDim && c.rubricDims.includes(opts.preferDim)) score += 2;
    if (score > 0) {
      scored.push({
        kind: "video",
        id: c.id,
        title: c.title,
        show: c.show,
        summary: c.aiSummary,
        score,
        rubricDims: c.rubricDims,
      });
    }
  }

  for (const e of PODCAST_EPISODES) {
    let score = scoreText(queryTokens, episodeText(e));
    if (opts.preferDim && e.rubricDims.includes(opts.preferDim)) score += 2;
    if (score > 0) {
      scored.push({
        kind: "podcast",
        id: e.id,
        title: e.episodeTitle,
        show: e.show,
        summary: e.aiSummary,
        score,
        rubricDims: e.rubricDims,
      });
    }
  }

  for (const r of LIBRARY_RESOURCES) {
    let score = scoreText(queryTokens, resourceText(r));
    if (opts.preferDim && r.rubricDims.includes(opts.preferDim)) score += 2;
    if (score > 0) {
      scored.push({
        kind: "resource",
        id: r.id,
        title: r.title,
        source: r.source,
        summary: r.blurb,
        score,
        rubricDims: r.rubricDims,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}
