import type { FullAnalysisReport } from "./schemas";

// AIProvider is the seam between the orchestrator and the actual model.
// Mock ships first; AnthropicProvider lands in Phase 7. Both must produce
// FullAnalysisReport-shaped output that passes the voice regression test.

export interface AnalysisInput {
  deckId: string;
  projectId: string;
  companyName: string;
  // PDF bytes — the mock ignores these, the live provider sends them.
  deckBytes?: Buffer;
  fileName: string;
  // Stage / sector / archetype hints from the Project record.
  stage?: string;
  sector?: string;
}

export type StageKey =
  | "VALIDATING_FILE"
  | "EXTRACTING_FACTS"
  | "REVIEWING_SLIDES"
  | "SCORING_FUNDABILITY"
  | "FINDING_OBJECTIONS"
  | "BUILDING_DILIGENCE"
  | "WRITING_MEMO"
  | "BUILDING_ROADMAP"
  | "FINALIZING_REPORT";

export type ProgressCallback = (stage: StageKey, percent: number) => void;

export interface AIProvider {
  readonly name: "mock" | "anthropic" | "openai";
  /**
   * Produce a complete analysis report. Implementations are responsible for
   * running the voice regression test and re-generating on failure (mock
   * always passes by construction; live providers retry up to 3x).
   */
  analyze(
    input: AnalysisInput,
    onProgress?: ProgressCallback
  ): Promise<FullAnalysisReport>;
}
