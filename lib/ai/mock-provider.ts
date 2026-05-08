import type {
  AIProvider,
  AnalysisInput,
  ProgressCallback,
  StageKey,
} from "./provider";
import { FullAnalysisReportSchema, type FullAnalysisReport } from "./schemas";
import { MESHOPS_REPORT, MESHOPS_MEMO_BODY } from "./fixtures/meshops";
import { runVoiceRegression } from "./voice-regression";
import { env } from "@/lib/env";

// Scott voice profile — kept in sync with prisma/seed.ts. Used at runtime
// by the regression check and at build time by the unit test. Drift between
// these two surfaces should fail CI.
const SCOTT_PROFILE = {
  bannedPhrases: [
    "exciting",
    "compelling",
    "passionate",
    "world-class",
    "best-in-class",
    "top-tier",
    "leading",
    "industry-leading",
    "huge market",
    "huge opportunity",
    "massive market",
    "massive opportunity",
    "enormous",
    "game-changing",
    "revolutionary",
    "paradigm-shifting",
    "cutting-edge",
    "bleeding-edge",
    "synergy",
    "synergistic",
    "utilize",
    "innovative",
    "I think",
    "I believe",
    "perhaps",
    "might consider",
    "it could be argued",
    "we believe",
    "our company",
    "our team",
  ],
  signatureOpens: [
    "Strongest part of the deck:",
    "What's working here:",
    "The reason this conversation is happening at all:",
    "Strongest single signal in the deck:",
    "What's right:",
  ],
  signatureCloses: [
    "Decision: pass — without follow-up.",
    "Decision: pass with regret — revisit at next round.",
    "Decision: defer — restart in 30 days.",
    "Decision: take a 30-minute call to verify [X].",
    "Decision: partner meeting.",
    "Decision: deep diligence.",
    "Decision: lead — terms attached.",
  ],
} as const;

const STAGE_SEQUENCE: StageKey[] = [
  "VALIDATING_FILE",
  "EXTRACTING_FACTS",
  "REVIEWING_SLIDES",
  "SCORING_FUNDABILITY",
  "FINDING_OBJECTIONS",
  "BUILDING_DILIGENCE",
  "WRITING_MEMO",
  "BUILDING_ROADMAP",
  "FINALIZING_REPORT",
];

export class MockProvider implements AIProvider {
  readonly name = "mock" as const;

  async analyze(
    input: AnalysisInput,
    onProgress?: ProgressCallback
  ): Promise<FullAnalysisReport> {
    // Walk the stages so the orchestrator UI gets a realistic progression.
    // 220ms × 9 stages ≈ 2 seconds of "running" — enough to show the chain
    // visibly without making Scott wait.
    for (let i = 0; i < STAGE_SEQUENCE.length; i++) {
      onProgress?.(STAGE_SEQUENCE[i], Math.round(((i + 1) * 100) / STAGE_SEQUENCE.length));
      await sleep(220);
    }

    // Run the voice regression against the fixture body. The mock is
    // deterministic — if this ever fails, the fixture broke and CI catches it.
    const regression = runVoiceRegression(MESHOPS_MEMO_BODY, SCOTT_PROFILE);
    if (!regression.pass) {
      throw new Error(
        `Mock fixture failed voice regression: ${regression.failures.join(" · ")}`
      );
    }

    // Override the company name with whatever the user uploaded so the demo
    // feels personalized; the analysis content is the canonical MeshOps output.
    const companyOverride =
      input.companyName && input.companyName !== "Untitled deck"
        ? input.companyName
        : MESHOPS_REPORT.companyName;

    const report: FullAnalysisReport = {
      ...MESHOPS_REPORT,
      companyName: companyOverride,
      memo: {
        ...MESHOPS_REPORT.memo,
        voiceMarkers: regression.voiceMarkers,
      },
      rubricVersion: env.DEFAULT_PARTNER_RUBRIC,
      partnerProfileVersion: env.DEFAULT_PARTNER_PROFILE,
      promptVersion: env.PROMPT_VERSION,
    };

    // Schema validation — refuses to emit anything that doesn't match the
    // shape the orchestrator and report UI expect.
    return FullAnalysisReportSchema.parse(report);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { SCOTT_PROFILE };
