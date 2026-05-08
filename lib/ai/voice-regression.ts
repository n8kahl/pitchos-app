// Voice regression utility · the discipline that prevents memos from
// drifting back to generic AI tone.
//
// Spec: SDD §28.5 + 06_prompt_strategy.md §5. Runs as both:
//   1. A vitest unit test on every CI build
//   2. A runtime guard in the orchestrator (Phase 4) — if the live LLM
//      output fails, the orchestrator regenerates with the failures
//      injected as additional constraints; rejected after 3 attempts.

import type { VoiceMarkers } from "./schemas";

export interface PartnerVoiceProfile {
  bannedPhrases: readonly string[];
  signatureOpens: readonly string[];
  signatureCloses: readonly string[];
}

export interface VoiceRegressionResult {
  pass: boolean;
  failures: string[];
  voiceMarkers: VoiceMarkers;
}

export function runVoiceRegression(
  memoBody: string,
  profile: PartnerVoiceProfile,
  options: { minCitations?: number } = {}
): VoiceRegressionResult {
  const minCitations = options.minCitations ?? 8;
  const failures: string[] = [];
  const lower = memoBody.toLowerCase();

  // 1. No banned phrases (case-insensitive substring match)
  const bannedHits: string[] = [];
  for (const phrase of profile.bannedPhrases) {
    if (lower.includes(phrase.toLowerCase())) {
      bannedHits.push(phrase);
      failures.push(`banned_phrase: ${phrase}`);
    }
  }

  // 2. Opens with a signature
  const opener = profile.signatureOpens.find((o) => memoBody.startsWith(o));
  if (!opener) {
    failures.push(
      `missing_signature_open · expected one of: ${profile.signatureOpens.join(" | ")}`
    );
  }

  // 3. Closes with a decision verb. Matches `Decision: <verbatim signatureClose>`
  // OR a permissive regex over the canonical decision verbs (pass, defer,
  // partner meeting, deep diligence, lead, 30-min call, 30-minute call).
  const decisionRegex =
    /Decision:\s*(pass|defer|partner meeting|deep diligence|lead|30[- ]min(?:ute)? call|take a 30[- ]min(?:ute)? call)/i;
  const decisionMatch = memoBody.match(decisionRegex);
  if (!decisionMatch) {
    failures.push("missing_decision_close");
  }

  // 4. Citation density
  const citationMatches = memoBody.match(/\[slide \d+\]/g) ?? [];
  if (citationMatches.length < minCitations) {
    failures.push(
      `citation_count_low: ${citationMatches.length} < ${minCitations}`
    );
  }

  // 5. Call made by paragraph 2 — partner doesn't bury the verdict
  const firstTwo = memoBody.split(/\n\s*\n/).slice(0, 2).join(" ").toLowerCase();
  const callMade =
    /\b(yes|no|pass|maybe|defer|partner meeting|30-min|30-minute|take the call|not yet|lead-able|deep diligence)\b/.test(
      firstTwo
    );
  if (!callMade) {
    failures.push("no_call_by_para_2");
  }

  const voiceMarkers: VoiceMarkers = {
    signatureOpenUsed: opener ?? "",
    decisionClose: decisionMatch?.[0] ?? "",
    citedSlideClaims: citationMatches.length,
    bannedPhraseHits: bannedHits,
  };

  return {
    pass: failures.length === 0,
    failures,
    voiceMarkers,
  };
}
