// Founder Journey Rubric · 8-question self-assessment
// Source: 11_content_platform_strategy.md §2.3
//
// 4 dimensions × 2 questions each. Score per question 0-10. Dim score
// is the sum of its two questions ÷ 2. Overall is the avg of 4 dims.
//
// Stage routing thresholds chosen so the prototype lands a real founder
// at stage 3 with a mix of solid and weak answers (the "sharpening"
// scenario the rest of the platform demos).

import type { RubricCategory } from "@/lib/ai/anti-patterns";

export type ReadinessDim = "insight" | "traction" | "narrative" | "investor";

export interface Question {
  id: string;
  dim: ReadinessDim;
  prompt: string;
  // Operator-direct subhead — the "why this question matters" line
  rationale: string;
  options: Array<{ label: string; score: number }>;
  // Clips in the corpus most relevant to founders weak on this question
  weakDimClips: string[];
}

export const READINESS_DIMS: Record<ReadinessDim, { label: string; rubricMap: RubricCategory[] }> = {
  insight: {
    label: "Insight depth",
    rubricMap: ["problemUrgency", "founderMarketFit"],
  },
  traction: {
    label: "Traction signal",
    rubricMap: ["tractionQuality", "gtmRepeatability"],
  },
  narrative: {
    label: "Narrative coherence",
    rubricMap: ["wedgeClarity", "marketSizingLogic", "whyNow"],
  },
  investor: {
    label: "Investor readiness",
    rubricMap: ["defensibility", "deckQuality", "riskSurface", "businessModel"],
  },
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "q1",
    dim: "insight",
    prompt: "Can you describe your ICP in one sentence — with title + budget owner?",
    rationale:
      "If the buyer can't self-identify in the first sentence, you don't have an ICP yet.",
    options: [
      { label: "Yes — title and dollar budget named", score: 10 },
      { label: "Yes — but vague on title or budget", score: 6 },
      { label: "Sort of — directional but not specific", score: 3 },
      { label: "Not yet", score: 0 },
    ],
    weakDimClips: ["ssg-2025-01-bottom-up-tam", "vcfp-2025-05-fmf-decides"],
  },
  {
    id: "q2",
    dim: "insight",
    prompt: "How often does your buyer hit the problem you solve?",
    rationale:
      "Quarterly or rarer is a hard sell at seed. Weekly+ is fundable pain.",
    options: [
      { label: "Daily", score: 10 },
      { label: "Weekly", score: 8 },
      { label: "Monthly", score: 5 },
      { label: "Quarterly or rarer", score: 1 },
    ],
    weakDimClips: ["bdvp-2025-02-why-now-structural"],
  },
  {
    id: "q3",
    dim: "traction",
    prompt: "How many paying customers do you have today?",
    rationale:
      "Two paying is signal. NRR math gets credible at ten. Pilots only is stage-2 territory.",
    options: [
      { label: "10 or more · paying", score: 10 },
      { label: "3 to 9 paying", score: 7 },
      { label: "1 or 2 paying", score: 4 },
      { label: "Pilots / LOIs only", score: 2 },
      { label: "None yet", score: 0 },
    ],
    weakDimClips: ["ssg-2025-03-vanity-traction"],
  },
  {
    id: "q4",
    dim: "traction",
    prompt: "What's your pilot-to-paid conversion rate across the last 5+ pilots?",
    rationale:
      "Below 50% is a sales-cycle red flag. Above 75% earns the next conversation.",
    options: [
      { label: "75% or higher", score: 10 },
      { label: "50 to 75%", score: 7 },
      { label: "25 to 50%", score: 4 },
      { label: "Under 25% or not measured", score: 1 },
    ],
    weakDimClips: ["ssg-2025-03-vanity-traction", "vcfp-2025-06-team-no-gtm"],
  },
  {
    id: "q5",
    dim: "narrative",
    prompt: "Can you articulate the company in 60 seconds — wedge, traction, ask?",
    rationale:
      "If you can't pitch it in the elevator, you can't pitch it in the partner room.",
    options: [
      { label: "Yes — clean delivery in under 60s", score: 10 },
      { label: "Mostly — usually 75-90s", score: 6 },
      { label: "Sometimes · depends on the audience", score: 3 },
      { label: "Working on it", score: 0 },
    ],
    weakDimClips: ["vcfp-2025-05-fmf-decides"],
  },
  {
    id: "q6",
    dim: "narrative",
    prompt:
      "Does your wedge slide show the path to system-of-record over 24 months?",
    rationale:
      "Workflow tools price differently from systems of record. The deck has to show which one you become.",
    options: [
      { label: "Yes — explicit 4-stage arc on the slide", score: 10 },
      { label: "Implicit · partner has to read between lines", score: 6 },
      { label: "Just the wedge — no expansion narrative", score: 3 },
      { label: "Not yet", score: 0 },
    ],
    weakDimClips: ["vcfp-2025-05-fmf-decides", "vcfp-2025-04-ai-wrapper"],
  },
  {
    id: "q7",
    dim: "investor",
    prompt: "Could you handle a partner meeting tomorrow with no prep call?",
    rationale:
      "If no, the Coach in sharpening mode is the most leveraged hour you spend this week.",
    options: [
      { label: "Yes · ready", score: 10 },
      { label: "With one prep call", score: 7 },
      { label: "Not yet · need to tighten the wedge first", score: 3 },
      { label: "Definitely not", score: 0 },
    ],
    weakDimClips: ["vcfp-2025-04-ai-wrapper", "ssg-2025-03-vanity-traction"],
  },
  {
    id: "q8",
    dim: "investor",
    prompt:
      "Do you have a named GTM advisor (or hire plan) in your team slide?",
    rationale:
      "Engineering-heavy team without enterprise GTM is survivable at seed, fatal at Series A.",
    options: [
      { label: "Named advisor + named hire plan", score: 10 },
      { label: "Hire plan only — no advisor yet", score: 6 },
      { label: "Vague intent, no name", score: 3 },
      { label: "Neither yet", score: 0 },
    ],
    weakDimClips: ["vcfp-2025-06-team-no-gtm"],
  },
];

export type AnswerMap = Record<string, number>;

export interface AssessmentResult {
  scores: Record<ReadinessDim, number>;
  overall: number;
  weakestDim: ReadinessDim;
  stage: 1 | 2 | 3 | 4 | 5;
  stageName: string;
}

export function scoreAssessment(answers: AnswerMap): AssessmentResult {
  const byDim: Record<ReadinessDim, number[]> = {
    insight: [],
    traction: [],
    narrative: [],
    investor: [],
  };
  for (const q of ASSESSMENT_QUESTIONS) {
    if (q.id in answers) byDim[q.dim].push(answers[q.id]);
  }
  const scores: Record<ReadinessDim, number> = {
    insight: avg(byDim.insight),
    traction: avg(byDim.traction),
    narrative: avg(byDim.narrative),
    investor: avg(byDim.investor),
  };
  const overall = avg(Object.values(scores));
  const weakestDim = (Object.keys(scores) as ReadinessDim[]).reduce(
    (acc, k) => (scores[k] < scores[acc] ? k : acc),
    "insight" as ReadinessDim
  );

  let stage: 1 | 2 | 3 | 4 | 5 = 1;
  let stageName = "Idea";
  if (overall >= 9.0) {
    stage = 5;
    stageName = "Post-Funding";
  } else if (overall >= 7.5) {
    stage = 4;
    stageName = "Active Fundraise";
  } else if (overall >= 5.5) {
    stage = 3;
    stageName = "Pitch-Ready";
  } else if (overall >= 3.0) {
    stage = 2;
    stageName = "Validation";
  }

  return { scores, overall, weakestDim, stage, stageName };
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, n) => s + n, 0) / arr.length;
}
