import { z } from "zod";
import { ANTI_PATTERN_KEYS } from "./anti-patterns";

// === Common building blocks ===

export const SeverityEnum = z.enum([
  "LOW",
  "MEDIUM",
  "MEDIUM_HIGH",
  "HIGH",
  "VERY_HIGH",
]);

export const RubricCategoryEnum = z.enum([
  "founderMarketFit",
  "wedgeClarity",
  "tractionQuality",
  "problemUrgency",
  "gtmRepeatability",
  "marketSizingLogic",
  "whyNow",
  "businessModel",
  "defensibility",
  "deckQuality",
  "riskSurface",
]);

export const PriorityEnum = z.enum(["P0", "P1", "P2", "P3"]);
export const ImpactEnum = z.enum(["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]);
export const EffortEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const MeetingLikelihoodEnum = z.enum([
  "STRONG_YES",
  "YES",
  "MAYBE",
  "NOT_YET",
  "NO",
]);

// CLOSED catalog — Zod refuses any antiPatternKey not in the 16-pattern catalog.
// Note: cast required because z.enum demands a tuple [string, ...string[]].
export const AntiPatternKeyEnum = z.enum(
  ANTI_PATTERN_KEYS as unknown as [string, ...string[]]
);

// === Layer 1 · Extraction (per-slide structured claims with verbatim quotes) ===

export const ExtractedSlideSchema = z.object({
  slideNumber: z.number().int().positive(),
  inferredTitle: z.string(),
  purpose: z.string(),
  rawText: z.string(),
  // Every factual claim on the slide, with the exact text that justifies it.
  // Per `06_prompt_strategy.md` Layer 3: no claim without a quote.
  claims: z.array(
    z.object({
      claim: z.string(),
      sourceQuote: z.string(),
    })
  ),
});

export const ExtractionResultSchema = z.object({
  companyName: z.string(),
  oneLine: z.string(),
  stage: z.string().optional(),
  sector: z.string().optional(),
  slides: z.array(ExtractedSlideSchema),
});

// === Layer 2 · Anti-pattern detections (closed catalog) ===

export const AntiPatternDetectionSchema = z.object({
  key: AntiPatternKeyEnum,
  detected: z.literal(true),
  severity: SeverityEnum,
  evidenceQuote: z.string().min(1, "Verbatim slide quote required"),
  sourceSlide: z.number().int().positive(),
});

export const AntiPatternDetectionsSchema = z.object({
  detections: z.array(AntiPatternDetectionSchema),
  uncatalogedObservations: z.array(z.string()).default([]),
});

// === Layer 1 + 2 · Rubric scoring ===

export const ScoreComponentSchema = z.object({
  name: RubricCategoryEnum,
  score: z.number().int().min(0).max(100),
  evidenceLevel: z.enum(["missing", "weak", "partial", "credible", "strong"]),
  evidenceQuote: z.string(),
  sourceSlide: z.number().int().positive().optional(),
  rationale: z.string(),
});

export const ScoringResultSchema = z.object({
  components: z.array(ScoreComponentSchema),
  fundabilityScore: z.number().int().min(0).max(100),
  meetingLikelihood: MeetingLikelihoodEnum,
  hardFailsTriggered: z.array(z.string()),
});

// === Layer 5 · Synthesized memo (the artifact Scott reads) ===

export const VoiceMarkersSchema = z.object({
  signatureOpenUsed: z.string(),
  decisionClose: z.string(),
  citedSlideClaims: z.number().int().min(0),
  bannedPhraseHits: z.array(z.string()).default([]),
});

export const PartnerVoicedMemoSchema = z.object({
  // The single body of partner-voiced prose. Voice regression test runs over this.
  body: z.string().min(200),
  oneMinutePitch: z.string(),
  whatWouldNeedToBeTrue: z.array(z.string()).min(3),
  bullCase: z.string(),
  bearCase: z.string(),
  decision: z.object({
    verdict: z.string(),
    rationale: z.string(),
  }),
  voiceMarkers: VoiceMarkersSchema,
});

// === Slide-by-slide review ===

export const SlideReviewSchema = z.object({
  slideNumber: z.number().int().positive(),
  inferredTitle: z.string().nullable(),
  slidePurpose: z.string().nullable(),
  clarityScore: z.number().int().min(0).max(100),
  evidenceScore: z.number().int().min(0).max(100),
  investorImpactScore: z.number().int().min(0).max(100),
  whatWorks: z.array(z.string()),
  issues: z.array(z.string()),
  rewriteGuidance: z.string(),
  suggestedTitle: z.string().nullable(),
  evidenceToAdd: z.array(z.string()),
  sourceQuote: z.string().nullable(),
  expectedScoreDelta: z.number().int().default(0),
});

// === Recommendations + objections + diligence ===

export const RecommendationSchema = z.object({
  title: z.string(),
  problem: z.string(),
  recommendation: z.string(),
  investorRationale: z.string(),
  expectedImpact: ImpactEnum,
  effort: EffortEnum,
  priority: PriorityEnum,
  expectedScoreDelta: z.number().int().default(0),
  slideNumber: z.number().int().positive().nullable(),
  exampleCopy: z.string().nullable(),
});

export const InvestorObjectionSchema = z.object({
  // antiPatternKey is required for catalog-anchored detections; null for
  // partner-specific custom-pattern objections.
  antiPatternKey: AntiPatternKeyEnum.nullable(),
  title: z.string(),
  severity: ImpactEnum,
  objection: z.string(), // partner-voice quote
  whyItMatters: z.string(),
  howToAddress: z.string(),
  evidenceRequired: z.array(z.string()),
  relatedSlide: z.number().int().positive().nullable(),
  sourceQuote: z.string().nullable(),
});

export const DiligenceItemSchema = z.object({
  category: z.string(),
  request: z.string(),
  whyItMatters: z.string(),
  suggestedEvidence: z.string(),
  ownerRole: z.string().nullable(),
  priority: PriorityEnum,
});

// === Top-level analysis report (what Phase 4 orchestrator produces) ===

export const FullAnalysisReportSchema = z.object({
  companyName: z.string(),
  fundabilityScore: z.number().int().min(0).max(100),
  meetingLikelihood: MeetingLikelihoodEnum,
  meetingLikelihoodRationale: z.string(),
  executiveSummary: z.string(),
  oneMinutePitch: z.string(),
  whatWouldNeedToBeTrue: z.array(z.string()),
  topStrengths: z.array(z.string()),
  topPassReasons: z.array(z.string()),
  scoring: ScoringResultSchema,
  memo: PartnerVoicedMemoSchema,
  slideReviews: z.array(SlideReviewSchema),
  recommendations: z.array(RecommendationSchema),
  objections: z.array(InvestorObjectionSchema),
  diligence: z.array(DiligenceItemSchema),
  antiPatternDetections: z.array(AntiPatternDetectionSchema),
  rubricVersion: z.string(),
  partnerProfileVersion: z.string(),
  promptVersion: z.string(),
});

// === Inferred TypeScript types ===

export type ExtractedSlide = z.infer<typeof ExtractedSlideSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;
export type AntiPatternDetection = z.infer<typeof AntiPatternDetectionSchema>;
export type AntiPatternDetections = z.infer<typeof AntiPatternDetectionsSchema>;
export type ScoreComponent = z.infer<typeof ScoreComponentSchema>;
export type ScoringResult = z.infer<typeof ScoringResultSchema>;
export type VoiceMarkers = z.infer<typeof VoiceMarkersSchema>;
export type PartnerVoicedMemo = z.infer<typeof PartnerVoicedMemoSchema>;
export type SlideReview = z.infer<typeof SlideReviewSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type InvestorObjection = z.infer<typeof InvestorObjectionSchema>;
export type DiligenceItem = z.infer<typeof DiligenceItemSchema>;
export type FullAnalysisReport = z.infer<typeof FullAnalysisReportSchema>;
