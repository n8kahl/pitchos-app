// Closed 16-pattern anti-pattern catalog · v1.0
//
// Source of truth: 09_anti_patterns_explained.md §3. The catalog is
// deliberately CLOSED — the LLM (real or mock) may only emit detections
// keyed to one of the 16 entries below. Adding a new pattern requires:
//   1. Detection criteria (heuristic + LLM prompt)
//   2. Severity / category mapping
//   3. Penalty calibration
//   4. Fix template
//   5. Test fixtures (decks where present + absent)
//
// Per-partner emphasis multipliers live on the PartnerRubric row
// (antiPatternsEmphasized / antiPatternsDeEmphasized JSON fields). Custom
// partner-specific patterns (e.g. Scott's two) live on
// PartnerRubric.customAntiPatterns and are not part of this shared catalog.

export type AntiPatternKey =
  | "feature_not_company"
  | "tam_no_beachhead"
  | "vanity_traction"
  | "ai_wrapper_no_moat"
  | "regulatory_dependent_why_now"
  | "team_no_gtm"
  | "single_customer_concentration"
  | "services_masquerading_as_saas"
  | "five_products_no_pmf"
  | "founder_market_misfit"
  | "regulatory_timebomb"
  | "no_problem_urgency"
  | "unsubstantiated_claim"
  | "missing_use_of_funds"
  | "premature_growth_metrics"
  | "wrong_round_size";

export type Severity = "LOW" | "MEDIUM" | "MEDIUM_HIGH" | "HIGH" | "VERY_HIGH";

export type RubricCategory =
  | "founderMarketFit"
  | "wedgeClarity"
  | "tractionQuality"
  | "problemUrgency"
  | "gtmRepeatability"
  | "marketSizingLogic"
  | "whyNow"
  | "businessModel"
  | "defensibility"
  | "deckQuality"
  | "riskSurface";

export interface AntiPattern {
  key: AntiPatternKey;
  name: string;
  severity: Severity;
  category: RubricCategory;
  penalty: number;
  partnerObjection: string;
  body: string;
  fix: string;
}

export const ANTI_PATTERN_CATALOG: AntiPattern[] = [
  {
    key: "feature_not_company",
    name: "Feature, not a company",
    severity: "HIGH",
    category: "wedgeClarity",
    penalty: 14,
    partnerObjection: "This looks like a feature, not a company.",
    body:
      "The solution slide describes a workflow that lives inside an existing tool. " +
      "The reflexive partner question is 'why doesn't [incumbent] ship this in 18 months?' — " +
      "and the deck does not currently contain the wedge → workflow ownership → " +
      "system-of-record narrative that answers it.",
    fix:
      "Add a slide showing wedge → workflow ownership → system of record → adjacent " +
      "monetization. Anchor on Toast (POS → restaurant SoR → fintech) or ServiceTitan " +
      "(dispatch → SoR → vertical financial services).",
  },
  {
    key: "tam_no_beachhead",
    name: "TAM with no beachhead",
    severity: "HIGH",
    category: "marketSizingLogic",
    penalty: 12,
    partnerObjection: "$XB TAM doesn't have a beachhead.",
    body:
      "The market slide cites a top-down TAM with no segmentation, no buyer persona, " +
      "and no ACV math. Every founder claims a huge market; the deck that also shows " +
      "the bottom-up SAM is an order of magnitude more credible. Without it, the " +
      "partner discounts the entire market thesis.",
    fix:
      "Lead with a bottom-up SAM: named ICP segment, buyer count, ACV assumption. " +
      "Then expand the lens. The wedge market is more believable than the total market.",
  },
  {
    key: "vanity_traction",
    name: "Vanity traction",
    severity: "MEDIUM_HIGH",
    category: "tractionQuality",
    penalty: 10,
    partnerObjection: "Loud number, thin substance.",
    body:
      "Retention/expansion math (NRR, churn, expansion) is shown on a small customer base " +
      "(n<5), or percent growth is shown without an absolute base. The headline number is " +
      "technically accurate but reads as inflated and undermines every other metric on the slide.",
    fix:
      "Lead with the customer story, not the percent. Show absolute revenue, named logos, " +
      "contract length, pilot-to-paid conversion rate. Save NRR for n ≥ 10.",
  },
  {
    key: "ai_wrapper_no_moat",
    name: "AI wrapper with no moat",
    severity: "HIGH",
    category: "defensibility",
    penalty: 11,
    partnerObjection: "Why won't OpenAI eat this?",
    body:
      "The deck centers on an AI capability without articulating proprietary data, " +
      "integration depth, switching cost, or fine-tuned model. 'Why doesn't OpenAI ship " +
      "this in 12 months' is the reflexive partner question — and as written the deck has " +
      "no answer.",
    fix:
      "Lead with the moat, not the model. Specify either: proprietary data flywheel, " +
      "contractual integration depth, or workflow lock-in via switching cost. The model is " +
      "a means; do not lead with it.",
  },
  {
    key: "regulatory_dependent_why_now",
    name: "Regulatory-dependent why-now",
    severity: "MEDIUM_HIGH",
    category: "whyNow",
    penalty: 8,
    partnerObjection: "Why-now leans on a deadline that has slipped before.",
    body:
      "The why-now slide rests on a regulatory event — typically a deadline that has " +
      "slipped before. Experienced partners discount slipped deadlines reflexively. Even " +
      "one slip is enough; two is fatal. The structural argument should be load-bearing, " +
      "not the regulatory tailwind.",
    fix:
      "Restructure the why-now around three structural arguments: (a) sector consolidation " +
      "reaching an inflection, (b) cost-curve crossover (e.g. inference cost), (c) incumbent " +
      "inaction window. Move the regulatory tailwind to a sub-bullet.",
  },
  {
    key: "team_no_gtm",
    name: "Engineering-heavy team, no GTM",
    severity: "MEDIUM",
    category: "gtmRepeatability",
    penalty: 6,
    partnerObjection: "Team is engineering-heavy without enterprise GTM.",
    body:
      "Team slide shows >50% engineers with no named GTM advisor and no enterprise sales " +
      "experience in the target sector. For seed milestones (~10 paying customers) it's " +
      "survivable; for Series A it is not. Partners discount the seed-to-A motion.",
    fix:
      "Add a named GTM advisor with sector-specific enterprise sales scars. Even one named " +
      "advisor moves this materially. List a fractional VP Sales hire plan in use of funds.",
  },
  {
    key: "single_customer_concentration",
    name: "Single-customer concentration",
    severity: "MEDIUM_HIGH",
    category: "riskSurface",
    penalty: 6,
    partnerObjection: "Customer concentration risk.",
    body:
      "One customer represents >50% of ARR (or any concentration left as a question rather " +
      "than transparently shown). Concentration the founder doesn't pre-empt becomes a " +
      "diligence-stage blocker. Concentration shown transparently is half as penalized.",
    fix:
      "Show ACV per customer, named pipeline (5+ logos with stage), contract length. " +
      "Concentration broken down transparently is far less penalized than concentration " +
      "left as a question.",
  },
  {
    key: "services_masquerading_as_saas",
    name: "Services masquerading as SaaS",
    severity: "HIGH",
    category: "businessModel",
    penalty: 10,
    partnerObjection: "This is services revenue dressed up as SaaS.",
    body:
      "The deck pitches SaaS-style multiples and growth, but the actual delivery model " +
      "has a high services component (revenue per FTE < $200K, custom integrations per " +
      "customer, services hours embedded in pricing). Services businesses don't get SaaS " +
      "multiples; pretending they do triggers diligence rejection.",
    fix:
      "Be honest about the mix. Pitch as services-enabled software with a clear glide " +
      "path to product-led revenue. Or accept lower multiples and pitch like a services " +
      "business. Pretending kills the deal.",
  },
  {
    key: "five_products_no_pmf",
    name: "Five products, no PMF",
    severity: "HIGH",
    category: "wedgeClarity",
    penalty: 10,
    partnerObjection: "Five products, no PMF.",
    body:
      "The deck describes three or more products / use cases with no claim of " +
      "product-market fit on any single one. 'This team can't focus' is the partner read.",
    fix:
      "Pick the one with the strongest signal. Lead with it. Mention the others only in " +
      "roadmap. PMF on one product is the only way to get to Series A.",
  },
  {
    key: "founder_market_misfit",
    name: "Founder–market misfit",
    severity: "VERY_HIGH",
    category: "founderMarketFit",
    penalty: 16,
    partnerObjection: "I don't see why this team specifically wins this market.",
    body:
      "The founder bio shows no domain experience in the stated sector and no compensating " +
      "advantage (technical, distribution, capital). Founder-market fit is the highest-" +
      "weighted dimension in most seed rubrics. Without it, the rest of the deck is " +
      "fighting from underneath.",
    fix:
      "If the founder has hidden domain experience, surface it explicitly. If they don't, " +
      "lead with the compensating advantage and explain why it's enough. Do not paper over.",
  },
  {
    key: "regulatory_timebomb",
    name: "Regulatory timebomb",
    severity: "HIGH",
    category: "riskSurface",
    penalty: 10,
    partnerObjection: "What happens to this business when the regulatory shoe drops?",
    body:
      "The product depends on a currently-allowed activity facing meaningful regulatory " +
      "pressure (scraping, off-label medical, crypto-adjacent, certain biometric / " +
      "data-collection patterns). Even if 'tomorrow's problem,' it shows up in diligence " +
      "as a dealbreaker.",
    fix:
      "Acknowledge the risk explicitly. Show the alternative path / pivot / compliance " +
      "posture. Investors penalize ignored risks far more than acknowledged ones.",
  },
  {
    key: "no_problem_urgency",
    name: "No problem urgency",
    severity: "MEDIUM",
    category: "problemUrgency",
    penalty: 7,
    partnerObjection: "The pain is described, not quantified.",
    body:
      "The problem is described abstractly — no dollars lost, no hours wasted, no " +
      "frequency, no named buyer. Without numbers, the partner cannot calibrate severity. " +
      "The problem might be real, but it's not specifically real.",
    fix:
      "Replace narrative with numbers. Hours wasted per buyer per week. Dollars lost per " +
      "year. Deals broken per quarter. Numbers force the partner to engage.",
  },
  {
    key: "unsubstantiated_claim",
    name: "Unsubstantiated claim",
    severity: "MEDIUM",
    category: "deckQuality",
    penalty: 7,
    partnerObjection: "Where does this number come from?",
    body:
      "A specific, prominent claim (revenue, customer count, partnership, market share) " +
      "appears with no supporting evidence. In diligence, every unsubstantiated claim " +
      "becomes a question. Many questions = many opportunities to lose the deal.",
    fix:
      "Add the supporting evidence: source, date, methodology. Or remove the claim. " +
      "Unsupported claims do more damage than supportive silence.",
  },
  {
    key: "missing_use_of_funds",
    name: "Missing or generic use of funds",
    severity: "LOW",
    category: "businessModel",
    penalty: 4,
    partnerObjection: "What does the round actually buy?",
    body:
      "No use-of-funds slide, or one that's generic ('hiring, marketing, product') with " +
      "no milestone tie-in. The partner cannot evaluate whether the round size matches " +
      "the milestone.",
    fix:
      "Allocate the round to specific milestones, not departments. Tie spending to " +
      "concrete outcomes: '60% engineering: integration depth + ML team-of-3. " +
      "30% GTM: VP Sales + 2 AEs. 18 months to $1.5M ARR / 10 customers / Series A ready.'",
  },
  {
    key: "premature_growth_metrics",
    name: "Premature growth metrics",
    severity: "LOW",
    category: "tractionQuality",
    penalty: 3,
    partnerObjection: "These metrics are overfitted to this stage.",
    body:
      "The deck shows Series A-style metrics (CAC, LTV, payback, magic number, gross " +
      "retention) at pre-seed. At pre-seed those metrics are statistically meaningless " +
      "and signal over-fitting to a Series A pitch template.",
    fix:
      "Strip Series A metrics from a pre-seed deck. Lead with what is meaningful at " +
      "pre-seed: customer pain evidence, founder-market fit, clear wedge, design-partner " +
      "momentum.",
  },
  {
    key: "wrong_round_size",
    name: "Wrong-sized round",
    severity: "MEDIUM",
    category: "businessModel",
    penalty: 5,
    partnerObjection: "This is the wrong-sized round for what you're trying to do.",
    body:
      "The requested round implies less than 12 months or more than 24 months of runway " +
      "given the stated burn rate. <12 months means refundraising before any milestone; " +
      ">24 months reads as a vanity round.",
    fix:
      "Re-size the round to a 18-month runway tied to specific milestones. If the " +
      "milestones require more, justify the larger size with a milestone the smaller " +
      "round cannot reach.",
  },
];

export const ANTI_PATTERN_KEYS: readonly AntiPatternKey[] = ANTI_PATTERN_CATALOG.map(
  (p) => p.key
);

export const ANTI_PATTERN_INDEX: Record<AntiPatternKey, AntiPattern> =
  Object.fromEntries(
    ANTI_PATTERN_CATALOG.map((p) => [p.key, p])
  ) as Record<AntiPatternKey, AntiPattern>;

export function getAntiPattern(key: AntiPatternKey): AntiPattern {
  const found = ANTI_PATTERN_INDEX[key];
  if (!found) throw new Error(`Unknown anti-pattern key: ${key}`);
  return found;
}
