// Founder journey · five stages every fundraising founder is on. Single
// source of truth for the journey strip, the stage hero, and any Coach
// prompt routing that depends on stage. Hardcoded today; later derived
// from real run history + assessment results.

export type JourneyStageNumber = 1 | 2 | 3 | 4 | 5;

export interface JourneyStage {
  n: JourneyStageNumber;
  key: "idea" | "validation" | "pitch-ready" | "raising" | "scaling";
  label: string;
  shortHint: string; // single line, used in the persistent journey strip
  blurb: string; // paragraph used in the stage hero
  actions: string[]; // three concrete moves for the founder at this stage
  // Pre-baked Coach exchange id that maps to this stage's primary
  // question. Wired to /coach so the rail opens to the right exchange
  // when the user clicks "Ask Scott" from the hero.
  coachExchangeId: string;
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    n: 1,
    key: "idea",
    label: "Idea",
    shortHint: "Customer interviews · ICP",
    blurb:
      "Before slide one, before pricing, before any deck work. Twenty customer interviews and a buyer specific enough that you could list ten of them by name without checking anything. The ICP test is three lines — title and budget owner, frequency of pain, quantifiable cost in dollars or hours.",
    actions: [
      "Run twenty discovery calls before drafting a deck",
      "Write the ICP in one sentence — title, segment, pain trigger",
      "Quantify the cost in dollars per month or hours per week",
    ],
    coachExchangeId: "do-i-have-an-icp",
  },
  {
    n: 2,
    key: "validation",
    label: "Validation",
    shortHint: "First paying pilot",
    blurb:
      "One paying pilot proves the wedge isn't theoretical. Convert pilot to paid before you raise. Pricing, contract length, and expansion math come from the existing two — not from a spreadsheet model with no real customers behind it.",
    actions: [
      "Convert at least one pilot to a multi-year paid contract",
      "Document expansion within six months of go-live",
      "Build the first version of the deck against the rubric",
    ],
    coachExchangeId: "structuring-deck-from-scratch",
  },
  {
    n: 3,
    key: "pitch-ready",
    label: "Pitch-Ready",
    shortHint: "Score the deck",
    blurb:
      "Twelve slides against the partner rubric. Each slide answers one reflexive partner question. If a slide doesn't answer a question, it doesn't ship. Score the deck on PitchOS before sending anywhere — twice if the score lands below seventy.",
    actions: [
      "Run the deck through PitchOS for the partner-grade memo",
      "Replace any vanity metric with a named-customer story",
      "Tighten the wedge slide to a 24-month system-of-record arc",
    ],
    coachExchangeId: "wedge-narrative",
  },
  {
    n: 4,
    key: "raising",
    label: "Raising",
    shortHint: "Open the round",
    blurb:
      "Open the round, run the IC list, redline term sheets. Liquidation preference and board composition matter more than valuation. The week-one cadence is ten partner meetings, three pass-with-regrets, two leads — anything less and the round doesn't have heat.",
    actions: [
      "Build the partner target list with named introductions",
      "Redline the first term sheet against the canonical guide",
      "Schedule ten first meetings inside two weeks",
    ],
    coachExchangeId: "term-sheet-priorities",
  },
  {
    n: 5,
    key: "scaling",
    label: "Scaling",
    shortHint: "LP cadence · Series A",
    blurb:
      "LP cadence, named-portfolio updates, series A bridge. Ship the next pilot. Hire the GTM advisor. Diligence-ready means three quarters of clean data, not a deck — and the metrics that survive Series A scrutiny are different from the ones that converted at seed.",
    actions: [
      "Send the monthly investor update on the same date each month",
      "Hire the fractional VP Sales advisor on the team slide",
      "Build the diligence room with three quarters of operator data",
    ],
    coachExchangeId: "vanity-traction",
  },
];

export function getStage(n: JourneyStageNumber): JourneyStage {
  // The cast is safe — JOURNEY_STAGES is statically indexed 1-5 in order.
  return JOURNEY_STAGES[n - 1];
}
