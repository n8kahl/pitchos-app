import { describe, expect, it } from "vitest";
import {
  MESHOPS_MEMO_BODY,
  MESHOPS_REPORT,
} from "@/lib/ai/fixtures/meshops";
import { runVoiceRegression } from "@/lib/ai/voice-regression";
import { SCOTT_PROFILE } from "@/lib/ai/mock-provider";
import { FullAnalysisReportSchema } from "@/lib/ai/schemas";

// Per SDD §28.5: a unit test must run on every CI build that fails any
// memo regressing toward generic AI tone.
describe("voice regression · MeshOps mock fixture", () => {
  it("memo body opens with one of Scott's signature openers", () => {
    const result = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    expect(result.voiceMarkers.signatureOpenUsed).not.toBe("");
    expect(SCOTT_PROFILE.signatureOpens).toContain(
      result.voiceMarkers.signatureOpenUsed
    );
  });

  it("memo body closes with a `Decision: ...` verb", () => {
    const result = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    expect(result.voiceMarkers.decisionClose).toMatch(/^Decision:/i);
  });

  it("memo cites at least 8 slides", () => {
    const result = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    expect(result.voiceMarkers.citedSlideClaims).toBeGreaterThanOrEqual(8);
  });

  it("memo body contains zero banned phrases", () => {
    const result = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    expect(result.voiceMarkers.bannedPhraseHits).toEqual([]);
  });

  it("makes the call by paragraph 2", () => {
    const firstTwo = MESHOPS_MEMO_BODY.split(/\n\s*\n/)
      .slice(0, 2)
      .join(" ")
      .toLowerCase();
    expect(firstTwo).toMatch(/30-min|30-minute|defer|partner meeting|pass/);
  });

  it("voice regression utility reports overall pass=true", () => {
    const result = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    expect(result.failures).toEqual([]);
    expect(result.pass).toBe(true);
  });

  it("anti-pattern detections all anchor to the closed catalog", () => {
    const knownKeys = new Set([
      "feature_not_company",
      "tam_no_beachhead",
      "vanity_traction",
      "ai_wrapper_no_moat",
      "regulatory_dependent_why_now",
      "team_no_gtm",
      "single_customer_concentration",
      "services_masquerading_as_saas",
      "five_products_no_pmf",
      "founder_market_misfit",
      "regulatory_timebomb",
      "no_problem_urgency",
      "unsubstantiated_claim",
      "missing_use_of_funds",
      "premature_growth_metrics",
      "wrong_round_size",
    ]);
    for (const det of MESHOPS_REPORT.antiPatternDetections) {
      expect(knownKeys.has(det.key as string)).toBe(true);
    }
    for (const obj of MESHOPS_REPORT.objections) {
      if (obj.antiPatternKey !== null) {
        expect(knownKeys.has(obj.antiPatternKey as string)).toBe(true);
      }
    }
  });

  it("every anti-pattern detection has a verbatim slide quote", () => {
    for (const det of MESHOPS_REPORT.antiPatternDetections) {
      expect(det.evidenceQuote).toBeTruthy();
      expect(det.sourceSlide).toBeGreaterThan(0);
    }
  });

  it("full report parses against the production schema", () => {
    const parsed = FullAnalysisReportSchema.safeParse({
      ...MESHOPS_REPORT,
      rubricVersion: "black-dog-vp/v1.3",
      partnerProfileVersion: "scott/v1.0",
      promptVersion: "v0.2",
    });
    if (!parsed.success) {
      console.error(parsed.error.issues);
    }
    expect(parsed.success).toBe(true);
  });
});
