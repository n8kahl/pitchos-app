import "server-only";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { MockProvider } from "./mock-provider";
import type { AIProvider, AnalysisInput, StageKey } from "./provider";
import type { FullAnalysisReport } from "./schemas";

const STAGE_TO_PROGRESS: Record<StageKey, number> = {
  VALIDATING_FILE: 5,
  EXTRACTING_FACTS: 18,
  REVIEWING_SLIDES: 32,
  SCORING_FUNDABILITY: 46,
  FINDING_OBJECTIONS: 58,
  BUILDING_DILIGENCE: 70,
  WRITING_MEMO: 82,
  BUILDING_ROADMAP: 92,
  FINALIZING_REPORT: 98,
};

export function getProvider(): AIProvider {
  if (env.AI_PROVIDER === "mock") return new MockProvider();
  throw new Error(
    `AI_PROVIDER=${env.AI_PROVIDER} not implemented in prototype. Use mock.`
  );
}

/**
 * Start an AnalysisRun. Persists the run row immediately, kicks off the
 * provider inline (no queue), and persists the structured output as it
 * completes. Returns the runId synchronously after the row is created;
 * the rest happens in the background via the deliberately-unawaited
 * runAnalysis() call.
 */
export async function startAnalysisRun(deckId: string): Promise<string> {
  const deck = await db.deck.findFirstOrThrow({
    where: { id: deckId, deletedAt: null },
    include: { project: true },
  });

  const [rubric, profile] = await Promise.all([
    db.partnerRubric.findFirstOrThrow({ where: { isDefault: true } }),
    db.partnerProfile.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const run = await db.analysisRun.create({
    data: {
      projectId: deck.projectId,
      deckId: deck.id,
      partnerRubricId: rubric.id,
      partnerProfileId: profile.id,
      rubricVersion: `${rubric.partnerName}/${rubric.version}`,
      partnerProfileVersion: `${profile.partnerName}/${profile.version}`,
      status: "QUEUED",
      stage: "QUEUED",
      progress: 0,
      modelProvider: env.AI_PROVIDER,
      promptVersion: env.PROMPT_VERSION,
    },
  });

  // Fire-and-forget background execution. Errors land in the DB row.
  void runAnalysis(run.id, {
    deckId: deck.id,
    projectId: deck.projectId,
    companyName: deck.project.companyName,
    fileName: deck.fileName,
  }).catch((err) => {
    console.error(`AnalysisRun ${run.id} failed:`, err);
  });

  return run.id;
}

async function runAnalysis(
  runId: string,
  input: AnalysisInput
): Promise<void> {
  await db.analysisRun.update({
    where: { id: runId },
    data: {
      status: "RUNNING",
      stage: "VALIDATING_FILE",
      startedAt: new Date(),
    },
  });

  try {
    const provider = getProvider();
    const report = await provider.analyze(input, async (stage) => {
      await db.analysisRun.update({
        where: { id: runId },
        data: { stage, progress: STAGE_TO_PROGRESS[stage] },
      });
    });

    await persistReport(runId, report);

    await db.analysisRun.update({
      where: { id: runId },
      data: {
        status: "COMPLETED",
        stage: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
        modelName: provider.name,
      },
    });
  } catch (err) {
    await db.analysisRun.update({
      where: { id: runId },
      data: {
        status: "FAILED",
        stage: "FAILED",
        errorMessage: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
      },
    });
    throw err;
  }
}

/**
 * Fan the FullAnalysisReport out into the normalized tables.
 */
async function persistReport(
  runId: string,
  report: FullAnalysisReport
): Promise<void> {
  await db.report.create({
    data: {
      analysisRunId: runId,
      fundabilityScore: report.fundabilityScore,
      meetingLikelihood: report.meetingLikelihood,
      meetingLikelihoodRationale: report.meetingLikelihoodRationale,
      executiveSummary: report.executiveSummary,
      oneMinutePitch: report.oneMinutePitch,
      whatWouldNeedToBeTrue: [...report.whatWouldNeedToBeTrue],
      topStrengths: [...report.topStrengths],
      topPassReasons: [...report.topPassReasons],
      keyMetrics: { scoring: report.scoring.components },
      riskSummary: { hardFails: report.scoring.hardFailsTriggered },
      memoJson: report.memo,
    },
  });

  if (report.slideReviews.length > 0) {
    await db.slideReview.createMany({
      data: report.slideReviews.map((s) => ({
        analysisRunId: runId,
        slideNumber: s.slideNumber,
        inferredTitle: s.inferredTitle,
        slidePurpose: s.slidePurpose,
        clarityScore: s.clarityScore,
        evidenceScore: s.evidenceScore,
        investorImpactScore: s.investorImpactScore,
        whatWorks: [...s.whatWorks],
        issues: [...s.issues],
        rewriteGuidance: s.rewriteGuidance,
        suggestedTitle: s.suggestedTitle,
        evidenceToAdd: [...s.evidenceToAdd],
        sourceQuote: s.sourceQuote,
        expectedScoreDelta: s.expectedScoreDelta,
      })),
    });
  }

  if (report.recommendations.length > 0) {
    await db.recommendation.createMany({
      data: report.recommendations.map((r) => ({
        analysisRunId: runId,
        title: r.title,
        problem: r.problem,
        recommendation: r.recommendation,
        investorRationale: r.investorRationale,
        expectedImpact: r.expectedImpact,
        effort: r.effort,
        priority: r.priority,
        expectedScoreDelta: r.expectedScoreDelta,
        slideNumber: r.slideNumber,
        exampleCopy: r.exampleCopy,
      })),
    });
  }

  if (report.objections.length > 0) {
    await db.investorObjection.createMany({
      data: report.objections.map((o) => ({
        analysisRunId: runId,
        antiPatternKey: o.antiPatternKey,
        title: o.title,
        severity: o.severity,
        objection: o.objection,
        whyItMatters: o.whyItMatters,
        howToAddress: o.howToAddress,
        evidenceRequired: [...o.evidenceRequired],
        relatedSlide: o.relatedSlide,
        sourceQuote: o.sourceQuote,
      })),
    });
  }

  if (report.diligence.length > 0) {
    await db.diligenceItem.createMany({
      data: report.diligence.map((d) => ({
        analysisRunId: runId,
        category: d.category,
        request: d.request,
        whyItMatters: d.whyItMatters,
        suggestedEvidence: d.suggestedEvidence,
        ownerRole: d.ownerRole,
        priority: d.priority,
      })),
    });
  }

  if (report.antiPatternDetections.length > 0) {
    await db.antiPatternDetection.createMany({
      data: report.antiPatternDetections.map((d) => {
        // Map MEDIUM_HIGH catalog severity → HIGH for the Prisma ImpactLevel enum.
        const severity =
          d.severity === "MEDIUM_HIGH" ? "HIGH" : (d.severity as
            | "LOW"
            | "MEDIUM"
            | "HIGH"
            | "VERY_HIGH");
        return {
          analysisRunId: runId,
          antiPatternKey: d.key,
          severity,
          evidence: d.evidenceQuote,
          slideNumber: d.sourceSlide,
        };
      }),
    });
  }
}
