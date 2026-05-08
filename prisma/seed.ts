import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/prisma/generated/client";

// === Black Dog VP Fundability Rubric · v1.3 ===
//
// Source of truth: 17_unified_rubric.md (synthesis across 10_sample_rubric.md
// v1.2 + 11_content_platform_strategy.md §3 + 09_anti_patterns_explained.md
// §3,§5). Zero structural change vs. v1.2 — same 11 dimensions, same weights,
// same hard-fails. v1.3 adds custom anti-patterns to the data model and
// citations in the description field.

const BLACK_DOG_VP_RUBRIC = {
  partnerName: "Scott · Black Dog VP",
  version: "v1.3",
  description:
    "Generalist seed rubric — anti-AI-wrapper, anti-vanity-metrics, founder-market-fit weighted. " +
    "Per 17_unified_rubric.md §0: structurally correct across all six strategy docs reviewed; " +
    "9 of 11 dimensions have direct content backing in Scott's existing corpus per " +
    "11_content_platform_strategy.md §3.",
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
  // Catalog patterns Scott specifically over-/under-weights.
  // The 16-pattern shared catalog itself lives in lib/ai/anti-patterns.ts (Phase 3).
  antiPatternsEmphasized: {
    feature_not_company: 1.5,
    vanity_traction: 1.4,
    regulatory_dependent_why_now: 1.5,
    ai_wrapper_no_moat: 1.3,
    five_products_no_pmf: 1.3,
  },
  antiPatternsDeEmphasized: {
    premature_growth_metrics: 0.8,
    deck_quality: 0.7,
  },
  // Promoted into the canonical model in v1.3 per 17_unified_rubric.md §7.
  customAntiPatterns: [
    {
      key: "scott_specific_001",
      name: "services_company_in_software_clothing",
      severity: "HIGH",
      detection:
        "Revenue per FTE under $200K AND pitch deck uses 'platform' or 'SaaS' language.",
      objection: "This is services revenue dressed up as SaaS.",
      fix: "Be honest about the mix. Services-enabled software with a glide path to product-led revenue is fundable. Pretending to be SaaS is not.",
      penalty: 12,
      category: "businessModel",
    },
    {
      key: "scott_specific_002",
      name: "founder_distance_from_pain",
      severity: "VERY_HIGH",
      detection:
        "Founder bio shows no exposure to the customer's daily workflow AND the deck describes 'talking to' or 'interviewing' customers rather than living the problem.",
      objection: "The founder has heard about the problem; they haven't lived it.",
      fix: "If the founder has lived the problem and didn't put it on the slide, surface it. If they haven't, recruit a co-founder who has.",
      penalty: 16,
      category: "founderMarketFit",
    },
  ],
} as const;

// === Scott's PartnerProfile v1.0 — voice transfer layer ===
// Unchanged from 10_sample_rubric.md §2. Bumps to v1.1 only when Scott
// supplies actual recent memo prose to replace the drafted samples.

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

  await db.partnerRubric.upsert({
    where: {
      partnerName_version: {
        partnerName: BLACK_DOG_VP_RUBRIC.partnerName,
        version: BLACK_DOG_VP_RUBRIC.version,
      },
    },
    create: {
      partnerName: BLACK_DOG_VP_RUBRIC.partnerName,
      version: BLACK_DOG_VP_RUBRIC.version,
      description: BLACK_DOG_VP_RUBRIC.description,
      weights: BLACK_DOG_VP_RUBRIC.weights,
      stageOverrides: BLACK_DOG_VP_RUBRIC.stageOverrides,
      hardFailCriteria: BLACK_DOG_VP_RUBRIC.hardFailCriteria,
      antiPatternsEmphasized: BLACK_DOG_VP_RUBRIC.antiPatternsEmphasized,
      antiPatternsDeEmphasized: BLACK_DOG_VP_RUBRIC.antiPatternsDeEmphasized,
      customAntiPatterns: [...BLACK_DOG_VP_RUBRIC.customAntiPatterns],
      isDefault: true,
    },
    update: {
      description: BLACK_DOG_VP_RUBRIC.description,
      weights: BLACK_DOG_VP_RUBRIC.weights,
      stageOverrides: BLACK_DOG_VP_RUBRIC.stageOverrides,
      hardFailCriteria: BLACK_DOG_VP_RUBRIC.hardFailCriteria,
      antiPatternsEmphasized: BLACK_DOG_VP_RUBRIC.antiPatternsEmphasized,
      antiPatternsDeEmphasized: BLACK_DOG_VP_RUBRIC.antiPatternsDeEmphasized,
      customAntiPatterns: [...BLACK_DOG_VP_RUBRIC.customAntiPatterns],
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
    `Seeded: rubric=${BLACK_DOG_VP_RUBRIC.partnerName}/${BLACK_DOG_VP_RUBRIC.version} · profile=${SCOTT_PARTNER_PROFILE.partnerName}/${SCOTT_PARTNER_PROFILE.version}`
  );

  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
