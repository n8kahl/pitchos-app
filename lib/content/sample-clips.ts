// Sample content corpus · stand-in until 16_content_engine_plan.md ships.
// Hand-crafted to feel like Scott's real teaching — every clip is keyed
// to a rubric dimension and has AI-extracted chapter summaries.
//
// Not external links. The platform ABSORBS the content — these become
// embedded players + inline transcripts in the clip-detail view.

import type { RubricCategory } from "@/lib/ai/anti-patterns";

export interface SampleClip {
  id: string;
  show: "VC Fast Pitch" | "Emerging Managers Pod" | "Smart Startup Growth" | "BDVP Fireside";
  title: string;
  durationMin: number;
  publishedAt: string; // YYYY-MM
  rubricDims: RubricCategory[];
  journeyStages: Array<1 | 2 | 3 | 4 | 5>;
  aiSummary: string;
  keyMoments: Array<{ at: string; quote: string }>;
  chapters: Array<{ at: string; title: string; summary: string }>;
  // Placeholder for embedded player. Real ingestion (Phase 6) replaces
  // this with R2-hosted MP4 + WebVTT subtitle track.
  videoSrc: string | null;
}

export const SAMPLE_CLIPS: SampleClip[] = [
  {
    id: "vcfp-2025-05-fmf-decides",
    show: "VC Fast Pitch",
    title: "Why founder-market fit decides every memo",
    durationMin: 47,
    publishedAt: "2025-05",
    rubricDims: ["founderMarketFit", "wedgeClarity"],
    journeyStages: [2, 3, 4],
    aiSummary:
      "Scott breaks down three decks where the team won the deal before slide one — and three where it lost the deal at slide thirteen. The pattern: 'why this team specifically' is either answered in the first credentials line or it isn't, and the rest of the deck cannot recover from a missing answer.",
    keyMoments: [
      {
        at: "08:42",
        quote:
          "If you're going to a logistics partner with no logistics experience, the rest of the deck is fighting from underneath.",
      },
      {
        at: "21:05",
        quote:
          "I've never written a check on a wedge that didn't have a system-of-record narrative inside the first eighteen months.",
      },
      {
        at: "33:19",
        quote:
          "Pass with regret. Revisit at Series A. The ingredients are real, but the deck has not yet earned a partner meeting.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Why team is the bet at seed", summary: "Founder-market fit is the highest-weighted dimension — and the one most decks underweight." },
      { at: "08:30", title: "The C.H. Robinson archetype", summary: "Ten years operating in the target sector beats five years selling to it. Scott's pattern for credibility from prior employer." },
      { at: "21:00", title: "Wedge → workflow ownership → SoR", summary: "The four-stage arc that distinguishes a feature from a company. Anchored on Toast and ServiceTitan." },
      { at: "33:00", title: "What separates 'pass' from 'pass with regret'", summary: "The verdict structure when the founder is real but the deck isn't ready." },
    ],
    videoSrc: null,
  },
  {
    id: "emp-2025-04-emerging-fund-thesis",
    show: "Emerging Managers Pod",
    title: "How $20M funds beat tier-1 returns",
    durationMin: 52,
    publishedAt: "2025-04",
    rubricDims: ["whyNow", "businessModel"],
    journeyStages: [4, 5],
    aiSummary:
      "Why deploying a small fund with discipline outperforms a large fund with momentum capital. Scott walks through the structural reasons emerging managers are well-positioned for the 2025–2027 vintage.",
    keyMoments: [
      {
        at: "15:30",
        quote:
          "Tier-one funds have to deploy at scale. Emerging managers can take a position no tier-one would be allowed to write.",
      },
      {
        at: "37:48",
        quote:
          "An LP base of fifteen committed believers is more durable than fifty institutional check-the-box LPs.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Why fund I is the best vintage", summary: "First-fund returns are statistically the strongest in the dataset." },
      { at: "15:15", title: "Position size advantage", summary: "Why a $20M fund can take meaningful positions in deals that don't move the needle for a $200M fund." },
      { at: "37:30", title: "Building the right LP base", summary: "Concentrate on conviction LPs over checkbox institutional LPs." },
    ],
    videoSrc: null,
  },
  {
    id: "ssg-2025-03-vanity-traction",
    show: "Smart Startup Growth",
    title: "Anti-vanity metrics for seed decks",
    durationMin: 12,
    publishedAt: "2025-03",
    rubricDims: ["tractionQuality"],
    journeyStages: [3, 4],
    aiSummary:
      "Five metrics partners reflexively discount on first read, and what to put in the deck instead. NRR on n=2, 'percent growth' without an absolute base, and the small-sample retention math that signals the founder thinks the partner won't notice.",
    keyMoments: [
      {
        at: "02:18",
        quote:
          "Two paying customers is signal. 220% NRR on n=2 is a vanity metric that undermines the rest of the slide.",
      },
      {
        at: "07:52",
        quote:
          "Lead with the customer story, not the percent. The math comes when n is at least ten.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Why partners discount headline NRR at small n", summary: "The single most common own-goal in seed decks." },
      { at: "07:40", title: "What to lead with instead", summary: "Named logos, expansion-in-dollars, contract length, pilot-to-paid conversion." },
    ],
    videoSrc: null,
  },
  {
    id: "vcfp-2025-04-ai-wrapper",
    show: "VC Fast Pitch",
    title: "The AI wrapper test — five questions",
    durationMin: 38,
    publishedAt: "2025-04",
    rubricDims: ["defensibility", "wedgeClarity"],
    journeyStages: [3, 4],
    aiSummary:
      "Scott's five-question test for whether 'AI' on the solution slide is a moat or a marketing word. If the deck cannot answer 'why won't OpenAI ship this in twelve months', the AI is a feature — not the company.",
    keyMoments: [
      {
        at: "11:20",
        quote:
          "I'm not asking you to remove the AI. I'm asking you to lead with the moat instead of the model. The model is a means; the moat is the company.",
      },
      {
        at: "24:55",
        quote:
          "Proprietary data, integration depth, switching cost, fine-tuning. Pick one and prove it. 'AI' on its own is not a moat.",
      },
    ],
    chapters: [
      { at: "00:00", title: "The reflexive partner question", summary: "'Why won't OpenAI eat this' is the question your defensibility slide must answer." },
      { at: "11:00", title: "Lead with the moat, not the model", summary: "Re-positioning AI as a means rather than the end." },
      { at: "24:30", title: "Four real moats", summary: "Proprietary data, integration depth, switching cost, fine-tuning — what each looks like in a deck." },
    ],
    videoSrc: null,
  },
  {
    id: "bdvp-2025-02-why-now-structural",
    show: "BDVP Fireside",
    title: "Structural why-now beats regulatory why-now",
    durationMin: 24,
    publishedAt: "2025-02",
    rubricDims: ["whyNow"],
    journeyStages: [2, 3, 4],
    aiSummary:
      "Scott on the most common preventable own-goal: hanging the why-now on a regulatory deadline. Slipped deadlines are reflexive partner discounts. Structural inflections beat regulatory tailwinds for memo durability.",
    keyMoments: [
      {
        at: "06:14",
        quote:
          "If your why-now has slipped twice already, it's not a tailwind — it's a liability the partner is going to ask about for thirty seconds before passing.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Three structural why-nows", summary: "Sector consolidation, cost-curve crossover, incumbent inaction window." },
      { at: "06:00", title: "Why regulatory why-nows fail", summary: "The pattern across logistics, healthcare, and crypto-adjacent decks." },
    ],
    videoSrc: null,
  },
  {
    id: "vcfp-2025-06-team-no-gtm",
    show: "VC Fast Pitch",
    title: "The fractional VP Sales — Scott's most leveraged hire",
    durationMin: 31,
    publishedAt: "2025-06",
    rubricDims: ["gtmRepeatability"],
    journeyStages: [3, 4],
    aiSummary:
      "Why one named GTM advisor on the team slide moves the deck materially. Scott's argument for the fractional VP Sales as the single most leveraged pre-Series-A hire — and how to find one who actually moves the needle.",
    keyMoments: [
      {
        at: "13:42",
        quote:
          "For seed milestones I can survive an engineering-heavy team. For Series A you cannot. Even one named advisor on the team slide changes how I read this.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Why team-no-GTM kills the seed-to-A motion", summary: "The discount that compounds at Series A diligence." },
      { at: "13:30", title: "Where to find a real GTM advisor", summary: "Operator network signals vs. LinkedIn-title signals." },
    ],
    videoSrc: null,
  },
  {
    id: "ssg-2025-01-bottom-up-tam",
    show: "Smart Startup Growth",
    title: "Bottom-up SAM beats top-down TAM",
    durationMin: 16,
    publishedAt: "2025-01",
    rubricDims: ["marketSizingLogic"],
    journeyStages: [2, 3],
    aiSummary:
      "Why $12B TAM with no segmentation gets discounted on first read. Scott on bottom-up sizing: name the wedge segment, name the buyer, math out the ACV. The wedge market is more believable than the total market — always.",
    keyMoments: [
      {
        at: "04:02",
        quote:
          "I've never seen a top-down TAM number convince a partner of anything. Bottom-up SAM math has converted IC meetings I would have otherwise passed on.",
      },
    ],
    chapters: [
      { at: "00:00", title: "Why TAM-only sizing fails", summary: "The reflexive discount partners apply to top-down market slides." },
      { at: "04:00", title: "The bottom-up worksheet", summary: "ICP × buyer count × ACV. Three lines that beat any TAM headline." },
    ],
    videoSrc: null,
  },
  {
    id: "emp-2025-06-lp-cadence",
    show: "Emerging Managers Pod",
    title: "LP cadence for first-fund GPs",
    durationMin: 41,
    publishedAt: "2025-06",
    rubricDims: ["gtmRepeatability"],
    journeyStages: [5],
    aiSummary:
      "Scott on the LP communication cadence that builds conviction across vintages. Quarterly letters, named-portfolio updates, and the difference between transparency and performance theater.",
    keyMoments: [
      {
        at: "18:30",
        quote:
          "If you don't have something specific to say to your LPs every quarter, you are not running the firm. You are running a fund.",
      },
    ],
    chapters: [
      { at: "00:00", title: "The annual letter is the LP relationship", summary: "Structure, length, and what to say when nothing's happened." },
      { at: "18:15", title: "Performance theater vs. transparency", summary: "When portfolio honesty earns more capital than portfolio polish." },
    ],
    videoSrc: null,
  },
];

export function getClipById(id: string): SampleClip | undefined {
  return SAMPLE_CLIPS.find((c) => c.id === id);
}

export function getClipsByDimension(dim: RubricCategory): SampleClip[] {
  return SAMPLE_CLIPS.filter((c) => c.rubricDims.includes(dim));
}

export function getClipsByStage(stage: 1 | 2 | 3 | 4 | 5): SampleClip[] {
  return SAMPLE_CLIPS.filter((c) => c.journeyStages.includes(stage));
}

export const SHOW_LABELS: Record<SampleClip["show"], string> = {
  "VC Fast Pitch": "VC Fast Pitch",
  "Emerging Managers Pod": "Emerging Managers Podcast",
  "Smart Startup Growth": "Smart Startup Growth",
  "BDVP Fireside": "BDVP Fireside",
};
