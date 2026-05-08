-- CreateEnum
CREATE TYPE "FundingStage" AS ENUM ('IDEA', 'PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'GROWTH', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BusinessModel" AS ENUM ('SAAS', 'MARKETPLACE', 'CONSUMER', 'ENTERPRISE', 'FINTECH', 'HEALTHCARE', 'DEEP_TECH', 'AI_INFRA', 'SERVICES_ENABLED_SOFTWARE', 'OTHER');

-- CreateEnum
CREATE TYPE "InvestorArchetype" AS ENUM ('GENERALIST_SEED', 'AI_NATIVE_FUND', 'VERTICAL_THESIS', 'STRATEGIC_INVESTOR', 'ANGEL', 'ACCELERATOR');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AnalysisStage" AS ENUM ('QUEUED', 'VALIDATING_FILE', 'EXTRACTING_FACTS', 'REVIEWING_SLIDES', 'SCORING_FUNDABILITY', 'FINDING_OBJECTIONS', 'BUILDING_DILIGENCE', 'WRITING_MEMO', 'BUILDING_ROADMAP', 'FINALIZING_REPORT', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MeetingLikelihood" AS ENUM ('STRONG_YES', 'YES', 'MAYBE', 'NOT_YET', 'NO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('P0', 'P1', 'P2', 'P3');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "EffortLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "PartnerRubric" (
    "id" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "weights" JSONB NOT NULL,
    "stageOverrides" JSONB NOT NULL,
    "hardFailCriteria" JSONB NOT NULL,
    "antiPatternsEmphasized" JSONB NOT NULL,
    "antiPatternsDeEmphasized" JSONB NOT NULL,
    "customAntiPatterns" JSONB NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerRubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerProfile" (
    "id" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "voiceSamples" TEXT[],
    "tonalMarkers" TEXT[],
    "bannedPhrases" TEXT[],
    "signatureOpens" TEXT[],
    "signatureCloses" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "oneLine" TEXT,
    "stage" "FundingStage" NOT NULL DEFAULT 'UNKNOWN',
    "sector" TEXT,
    "businessModel" "BusinessModel" NOT NULL DEFAULT 'OTHER',
    "targetRound" TEXT,
    "targetArchetype" "InvestorArchetype" NOT NULL DEFAULT 'GENERALIST_SEED',
    "reviewerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "pageCount" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "partnerRubricId" TEXT NOT NULL,
    "partnerProfileId" TEXT NOT NULL,
    "rubricVersion" TEXT NOT NULL,
    "partnerProfileVersion" TEXT NOT NULL,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'QUEUED',
    "stage" "AnalysisStage" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "modelProvider" TEXT,
    "modelName" TEXT,
    "promptVersion" TEXT NOT NULL DEFAULT 'v0.2',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extractionJson" JSONB,
    "resultJson" JSONB,
    "providerMetaJson" JSONB,

    CONSTRAINT "AnalysisRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "fundabilityScore" INTEGER NOT NULL,
    "meetingLikelihood" "MeetingLikelihood" NOT NULL,
    "meetingLikelihoodRationale" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "oneMinutePitch" TEXT NOT NULL,
    "whatWouldNeedToBeTrue" TEXT[],
    "topStrengths" JSONB NOT NULL,
    "topPassReasons" JSONB NOT NULL,
    "keyMetrics" JSONB NOT NULL,
    "riskSummary" JSONB NOT NULL,
    "memoJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideReview" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "slideNumber" INTEGER NOT NULL,
    "inferredTitle" TEXT,
    "slidePurpose" TEXT,
    "clarityScore" INTEGER NOT NULL,
    "evidenceScore" INTEGER NOT NULL,
    "investorImpactScore" INTEGER NOT NULL,
    "whatWorks" TEXT[],
    "issues" TEXT[],
    "rewriteGuidance" TEXT NOT NULL,
    "suggestedTitle" TEXT,
    "evidenceToAdd" TEXT[],
    "sourceQuote" TEXT,
    "expectedScoreDelta" INTEGER NOT NULL DEFAULT 0,
    "rawJson" JSONB,

    CONSTRAINT "SlideReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "investorRationale" TEXT NOT NULL,
    "expectedImpact" "ImpactLevel" NOT NULL,
    "effort" "EffortLevel" NOT NULL,
    "priority" "Priority" NOT NULL,
    "expectedScoreDelta" INTEGER NOT NULL DEFAULT 0,
    "slideNumber" INTEGER,
    "exampleCopy" TEXT,
    "rawJson" JSONB,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorObjection" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "antiPatternKey" TEXT,
    "title" TEXT NOT NULL,
    "severity" "ImpactLevel" NOT NULL,
    "objection" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "howToAddress" TEXT NOT NULL,
    "evidenceRequired" TEXT[],
    "relatedSlide" INTEGER,
    "sourceQuote" TEXT,
    "rawJson" JSONB,

    CONSTRAINT "InvestorObjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiligenceItem" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "suggestedEvidence" TEXT NOT NULL,
    "ownerRole" TEXT,
    "priority" "Priority" NOT NULL,
    "rawJson" JSONB,

    CONSTRAINT "DiligenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AntiPatternDetection" (
    "id" TEXT NOT NULL,
    "analysisRunId" TEXT NOT NULL,
    "antiPatternKey" TEXT NOT NULL,
    "severity" "ImpactLevel" NOT NULL,
    "evidence" TEXT NOT NULL,
    "slideNumber" INTEGER,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AntiPatternDetection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerRubric_partnerName_version_key" ON "PartnerRubric"("partnerName", "version");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerProfile_partnerName_version_key" ON "PartnerProfile"("partnerName", "version");

-- CreateIndex
CREATE INDEX "Deck_projectId_idx" ON "Deck"("projectId");

-- CreateIndex
CREATE INDEX "Deck_checksum_idx" ON "Deck"("checksum");

-- CreateIndex
CREATE INDEX "AnalysisRun_projectId_idx" ON "AnalysisRun"("projectId");

-- CreateIndex
CREATE INDEX "AnalysisRun_deckId_idx" ON "AnalysisRun"("deckId");

-- CreateIndex
CREATE INDEX "AnalysisRun_status_idx" ON "AnalysisRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Report_analysisRunId_key" ON "Report"("analysisRunId");

-- CreateIndex
CREATE INDEX "SlideReview_analysisRunId_idx" ON "SlideReview"("analysisRunId");

-- CreateIndex
CREATE UNIQUE INDEX "SlideReview_analysisRunId_slideNumber_key" ON "SlideReview"("analysisRunId", "slideNumber");

-- CreateIndex
CREATE INDEX "Recommendation_analysisRunId_idx" ON "Recommendation"("analysisRunId");

-- CreateIndex
CREATE INDEX "Recommendation_priority_idx" ON "Recommendation"("priority");

-- CreateIndex
CREATE INDEX "InvestorObjection_analysisRunId_idx" ON "InvestorObjection"("analysisRunId");

-- CreateIndex
CREATE INDEX "InvestorObjection_antiPatternKey_idx" ON "InvestorObjection"("antiPatternKey");

-- CreateIndex
CREATE INDEX "DiligenceItem_analysisRunId_idx" ON "DiligenceItem"("analysisRunId");

-- CreateIndex
CREATE INDEX "AntiPatternDetection_analysisRunId_idx" ON "AntiPatternDetection"("analysisRunId");

-- CreateIndex
CREATE INDEX "AntiPatternDetection_antiPatternKey_idx" ON "AntiPatternDetection"("antiPatternKey");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_partnerRubricId_fkey" FOREIGN KEY ("partnerRubricId") REFERENCES "PartnerRubric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisRun" ADD CONSTRAINT "AnalysisRun_partnerProfileId_fkey" FOREIGN KEY ("partnerProfileId") REFERENCES "PartnerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideReview" ADD CONSTRAINT "SlideReview_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorObjection" ADD CONSTRAINT "InvestorObjection_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiligenceItem" ADD CONSTRAINT "DiligenceItem_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntiPatternDetection" ADD CONSTRAINT "AntiPatternDetection_analysisRunId_fkey" FOREIGN KEY ("analysisRunId") REFERENCES "AnalysisRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
