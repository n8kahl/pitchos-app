import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/prisma/generated/client";

// === Scott's PartnerRubric v1.2 — from 10_sample_rubric.md §1 ===
//
// Default seed weights for the Black Dog VP rubric, generalist seed lens.
// Per Scott (10_sample_rubric.md §1.2): "The number isn't sacred. The
// relative ranking is. If founderMarketFit and wedgeClarity are anywhere
// outside the top three, the rubric is wrong."

const BLACK_DOG_VP_RUBRIC = {
  partnerName: "Scott · Black Dog VP",
  version: "v1.2",
  description:
    "Generalist seed rubric — anti-AI-wrapper, anti-vanity-metrics, founder-market-fit weighted. Source of truth: PitchOS spec doc 10_sample_rubric.md §1.",
  weights: {
    founderMarketFit: 0.16,
    wedgeClarity: 0.13,
    tractionQuality: 0.13,
    problemUrgency: 0.11,
    gtmRepeatability: 0.1,
    marketSizingLogic: 0.09,
    whyNow: 0.07,
    businessModel: 0.07,
    defensibility: 0.06,
    deckQuality: 0.04,
    riskSurface: 0.04,
  },
  stageOverrides: {
    PRE_SEED: {
      founderMarketFit: 0.22,
      tractionQuality: 0.04,
      problemUrgency: 0.14,
      wedgeClarity: 0.13,
      deckQuality: 0.02,
    },
    SERIES_A: {
      founderMarketFit: 0.1,
      tractionQuality: 0.22,
      gtmRepeatability: 0.16,
      riskSurface: 0.06,
    },
  },
  hardFailCriteria: [
    "no_named_icp",
    "tam_no_beachhead",
    "ai_wrapper_no_proprietary_data",
    "single_customer_concentration_above_50pct_at_seed",
    "regulatory_why_now_with_slipped_deadline_twice",
    "founder_market_misfit_with_no_compensating_advantage",
    "services_revenue_above_50pct_pitched_as_saas",
  ],
  // Catalog patterns Scott specifically over-weights. The full 16-pattern
  // catalog lives in lib/ai/anti-patterns.ts (lands in Phase 3).
  antiPatterns: [
    "feature_not_company",
    "vanity_traction",
    "regulatory_dependent_why_now",
    "ai_wrapper_no_moat",
    "five_products_no_pmf",
  ],
} as const;

// === Scott's PartnerProfile v1.0 — from 10_sample_rubric.md §2 ===

const SCOTT_PARTNER_PROFILE = {
  partnerName: "Scott · Black Dog VP",
  version: "v1.0",
  voiceSamples: [
    "Strongest part of the deck is the founder-market fit. The CEO ran logistics ops at C.H. Robinson for ten years. That credential alone is the reason this conversation is happening at all.",
    "Where it stops being a yes: the wedge slide [slide 4] reads as a workflow tool, not a system of record. I would not write a check at this valuation for a workflow tool, regardless of how good the founder is.",
    "Take the call. Defer IC two weeks. If the founder can articulate the wedge-to-platform story credibly and lands one more named customer in that window, this graduates to lead-able.",
    "The market slide [slide 6] is doing too much. $12B TAM with no segmentation, no buyer persona, and no ACV math will get discounted on first read by any partner who has reviewed more than fifty decks. The right framing here is bottom-up: name the wedge segment, name the buyer, math out the ACV. The wedge market is more believable than the total market — always.",
    "Two paying customers is signal. 220% NRR on n=2 is a vanity metric that undermines the rest of the slide. Lead with the customer story. The math comes when n is at least 10.",
    "The team is engineering-heavy without enterprise GTM. For seed milestones I can survive that; for Series A you cannot. The most leveraged hire you can make pre-A is a fractional VP Sales with sector scars. Even one named advisor on the team slide changes how I read this.",
    "Pass with regret. Revisit at Series A. The ingredients are real, but the deck has not yet earned a partner meeting.",
    "I'm not asking you to remove the AI. I'm asking you to lead with the moat instead of the model. The model is a means; the moat is the company.",
  ],
  tonalMarkers: [
    "evidence-first",
    "directive",
    "anti-hype",
    "specific-not-general",
    "charitable-but-honest",
    "decision-committed",
    "operationally-aware",
  ],
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

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const db = new PrismaClient({ adapter });

  // === Org + dev user ===
  const orgName = process.env.DEV_ORG_NAME ?? "Black Dog VP (Demo)";
  const orgKind =
    (process.env.DEV_ORG_KIND as "FOUNDER" | "FUND" | "ACCELERATOR" | undefined) ?? "FUND";
  const userEmail = process.env.DEV_USER_EMAIL ?? "nate@example.com";
  const userName = process.env.DEV_USER_NAME ?? "Nate (Demo)";

  let org = await db.organization.findFirst({ where: { name: orgName } });
  if (!org) {
    org = await db.organization.create({ data: { name: orgName, kind: orgKind } });
  }

  await db.user.upsert({
    where: { email: userEmail },
    create: {
      email: userEmail,
      name: userName,
      organizationId: org.id,
      role: "owner",
    },
    update: { name: userName, organizationId: org.id },
  });

  // === System-shipped Black Dog VP rubric (organizationId = null) ===
  await db.partnerRubric.upsert({
    where: {
      partnerName_version: {
        partnerName: BLACK_DOG_VP_RUBRIC.partnerName,
        version: BLACK_DOG_VP_RUBRIC.version,
      },
    },
    create: {
      organizationId: null,
      partnerName: BLACK_DOG_VP_RUBRIC.partnerName,
      version: BLACK_DOG_VP_RUBRIC.version,
      description: BLACK_DOG_VP_RUBRIC.description,
      weights: BLACK_DOG_VP_RUBRIC.weights,
      stageOverrides: BLACK_DOG_VP_RUBRIC.stageOverrides,
      hardFailCriteria: BLACK_DOG_VP_RUBRIC.hardFailCriteria,
      antiPatterns: [...BLACK_DOG_VP_RUBRIC.antiPatterns],
      isDefault: true,
    },
    update: {
      description: BLACK_DOG_VP_RUBRIC.description,
      weights: BLACK_DOG_VP_RUBRIC.weights,
      stageOverrides: BLACK_DOG_VP_RUBRIC.stageOverrides,
      hardFailCriteria: BLACK_DOG_VP_RUBRIC.hardFailCriteria,
      antiPatterns: [...BLACK_DOG_VP_RUBRIC.antiPatterns],
      isDefault: true,
    },
  });

  await db.partnerProfile.upsert({
    where: {
      partnerName_version: {
        partnerName: SCOTT_PARTNER_PROFILE.partnerName,
        version: SCOTT_PARTNER_PROFILE.version,
      },
    },
    create: {
      organizationId: null,
      partnerName: SCOTT_PARTNER_PROFILE.partnerName,
      version: SCOTT_PARTNER_PROFILE.version,
      voiceSamples: [...SCOTT_PARTNER_PROFILE.voiceSamples],
      tonalMarkers: [...SCOTT_PARTNER_PROFILE.tonalMarkers],
      bannedPhrases: [...SCOTT_PARTNER_PROFILE.bannedPhrases],
      signatureOpens: [...SCOTT_PARTNER_PROFILE.signatureOpens],
      signatureCloses: [...SCOTT_PARTNER_PROFILE.signatureCloses],
    },
    update: {
      voiceSamples: [...SCOTT_PARTNER_PROFILE.voiceSamples],
      tonalMarkers: [...SCOTT_PARTNER_PROFILE.tonalMarkers],
      bannedPhrases: [...SCOTT_PARTNER_PROFILE.bannedPhrases],
      signatureOpens: [...SCOTT_PARTNER_PROFILE.signatureOpens],
      signatureCloses: [...SCOTT_PARTNER_PROFILE.signatureCloses],
    },
  });

  console.log(
    `Seeded: org=${org.name} (${org.id}) · user=${userEmail} · rubric=${BLACK_DOG_VP_RUBRIC.partnerName}/${BLACK_DOG_VP_RUBRIC.version} · profile=${SCOTT_PARTNER_PROFILE.partnerName}/${SCOTT_PARTNER_PROFILE.version}`
  );

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
