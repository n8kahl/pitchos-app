// Pre-baked Coach exchanges · the Scott-bot RAG output the user sees on
// first land. Each exchange shows the citation pattern: every claim
// links to a real internal clip, podcast episode, or PDF resource — no
// external links, no claims without a source.
//
// Real Coach (Phase 5 of platform build per 11_content_platform_strategy.md
// §5) replaces these with actual RAG retrieval over the ingested corpus.

export type CoachCitation =
  | {
      kind: "video";
      clipId: string;
      at: string; // "MM:SS" — chapter timestamp
      excerpt: string;
    }
  | {
      kind: "podcast";
      episodeId: string;
      at: string; // "MM:SS" — episode timestamp
      excerpt: string;
    }
  | {
      kind: "resource";
      resourceId: string;
      pageRef?: string; // "p. 4" or "slide 12"
      excerpt: string;
    };

export interface CoachExchange {
  id: string;
  prompt: string;
  // Mode the prompt routes to (per 11_content_platform_strategy.md §5.1)
  mode: "discovery" | "structuring" | "sharpening";
  reply: string; // Markdown-flavored, with [^N] inline citations
  citations: CoachCitation[];
  followUps: string[];
}

export const COACH_EXAMPLES: CoachExchange[] = [
  // === DISCOVERY MODE · stage 1 founders ===
  {
    id: "do-i-have-an-icp",
    prompt: "I think I have a problem worth solving — how do I know I have an ICP?",
    mode: "discovery",
    reply: `If the question feels like a guess, **you don't have one yet**. An ICP is not "small businesses in the US" — it's a buyer specific enough that you could list ten of them by name without checking anything[^1].

Three tests Scott applies:

1. **Title and budget owner.** "VP of Operations at a 3PL with 50–500 employees." Specific enough that the buyer self-identifies in the first sentence.
2. **Frequency of pain.** Does the buyer hit this problem weekly, monthly, or quarterly? Anything quarterly or less is a hard sell at seed.
3. **Quantifiable cost.** $1.2M–$3.2M in audit write-offs. 18 hours per week. 12% of revenue. Numbers force the buyer to engage[^2].

If you can't answer all three, the right next move is **20 customer interviews** before you write another slide. The bottom-up sizing worksheet on the TAM/SAM/SOM card is the structure to fill in once you have answers[^3].`,
    citations: [
      {
        kind: "video",
        clipId: "ssg-2025-01-bottom-up-tam",
        at: "00:00",
        excerpt: "ICP × buyer count × ACV. Three lines that beat any TAM headline.",
      },
      {
        kind: "video",
        clipId: "vcfp-2025-05-fmf-decides",
        at: "00:00",
        excerpt: "Founder-market fit is the highest-weighted dimension — and the one most decks underweight.",
      },
      {
        kind: "resource",
        resourceId: "tam-sam-som-table",
        excerpt: "The bottom-up sizing worksheet · ICP × buyer count × ACV.",
      },
    ],
    followUps: [
      "What does a good customer-interview script look like?",
      "How many interviews before I'm ready to draft a deck?",
      "What's the difference between an ICP and a beachhead?",
    ],
  },
  {
    id: "structuring-deck-from-scratch",
    prompt: "I have one paying pilot. How do I structure my first real deck?",
    mode: "structuring",
    reply: `**Twelve slides, in this order**, and not one more:

1. Cover · company name + 1-line + ask
2. Problem · quantified · who · how often · what it costs them
3. Market · bottom-up · ICP × buyer count × ACV[^1]
4. Wedge · the 24-month arc to system-of-record[^2]
5. Why now · structural · not regulatory
6. Solution · what you do · screenshot · not feature list
7. Traction · named customer · expansion · multi-year
8. Business model · ACV · contract length · gross margin
9. GTM · founder-led now · what the next two hires unlock
10. Defensibility · proprietary data + integration depth + workflow lock
11. Team · founder-market fit story · GTM advisor named
12. Use of funds · tied to a specific milestone · 18-month runway · ask

Scott's pattern: every slide answers the partner's reflexive question for that section. **If a slide doesn't answer a question, it doesn't ship.**

The Sequoia template is the canonical reference for the slide-order discipline[^3]. After you have v1, get a PitchOS run on it before you send it anywhere.`,
    citations: [
      {
        kind: "video",
        clipId: "ssg-2025-01-bottom-up-tam",
        at: "04:00",
        excerpt: "ICP × buyer count × ACV. Three lines that beat any TAM headline.",
      },
      {
        kind: "video",
        clipId: "vcfp-2025-05-fmf-decides",
        at: "21:00",
        excerpt: "Wedge → workflow ownership → SoR · the four-stage arc.",
      },
      {
        kind: "resource",
        resourceId: "sequoia-pitch-deck-template",
        pageRef: "12 slides",
        excerpt: "The canonical seed-stage outline · 12 slides, one question each.",
      },
      {
        kind: "resource",
        resourceId: "12-slides-killer-pitch-deck",
        excerpt: "Scott's slide-by-slide infographic · question per slide.",
      },
    ],
    followUps: [
      "What goes in the appendix vs. the main deck?",
      "How long should each section be in the partner-meeting reading?",
      "When does the financial model become required?",
    ],
  },
  {
    id: "wedge-narrative",
    prompt: "How do I tell my wedge story without sounding generic?",
    mode: "structuring",
    reply: `Strongest part of your wedge story is the **path you intend to walk**, not the wedge itself. Every founder claims a wedge. The deck that converts shows the four-stage arc beneath it.

Anchor on Toast or ServiceTitan: workflow ownership → audit / document layer → system of record → adjacent monetization. Scott walks through this directly[^1].

Three concrete moves to put on slide four:

1. **Name the operating layer you absorb**, not just the workflow you start with. "We start as exception routing; we become the audit-trail layer the TMS was never designed to own."
2. **Show the timeline.** 18 months to SoR, 24 months to adjacent monetization. Specific.
3. **Anchor the comparison visually.** A small Toast / ServiceTitan side-bar callout removes the partner's "I've heard this before" reflex.

If your slide reads as a workflow tool today, partners price it as one regardless of how good the founder is[^2]. Scott unpacks the same arc on The San Francisco Experience podcast — useful for hearing the rhythm of the pitch, not just the structure[^3].`,
    citations: [
      {
        kind: "video",
        clipId: "vcfp-2025-05-fmf-decides",
        at: "21:00",
        excerpt: "Wedge → workflow ownership → SoR · the four-stage arc that distinguishes a feature from a company.",
      },
      {
        kind: "video",
        clipId: "vcfp-2025-05-fmf-decides",
        at: "21:05",
        excerpt:
          "I've never written a check on a wedge that didn't have a system-of-record narrative inside the first eighteen months.",
      },
      {
        kind: "podcast",
        episodeId: "sfx-find-pitch-investors",
        at: "12:00",
        excerpt:
          "The do's and don'ts of approaching investors · same wedge framework, audio-length unpacking.",
      },
    ],
    followUps: [
      "What does the visual anchor look like on the slide?",
      "How do I show the timeline without overpromising?",
      "What's the right ACV story for an SoR pitch?",
    ],
  },
  {
    id: "vanity-traction",
    prompt: "Should I lead with my 220% NRR on the traction slide?",
    mode: "sharpening",
    reply: `**No.** That's a vanity metric on a small customer base, and partners reflexively discount the rest of the slide once they see it[^1].

The math you want on the slide instead:

- Two paying customers · both expanded contracts within six months · both multi-year · both reference-able
- Pilot-to-paid conversion rate (you converted 100% of your pilots — say it that way)
- Named pipeline, 5+ logos, with stage labels
- ACV per customer in absolute dollars
- Sales cycle distribution from the existing two

The customer story converts. The percent does not[^2]. Save NRR for n ≥ 10.

The single most leveraged change you can make to this deck before the round closes is replacing the headline NRR with a five-logo named pipeline. Scott goes deeper on the same pattern in the BCFS interview[^3].`,
    citations: [
      {
        kind: "video",
        clipId: "ssg-2025-03-vanity-traction",
        at: "02:18",
        excerpt:
          "Two paying customers is signal. 220% NRR on n=2 is a vanity metric that undermines the rest of the slide.",
      },
      {
        kind: "video",
        clipId: "ssg-2025-03-vanity-traction",
        at: "07:52",
        excerpt: "Lead with the customer story, not the percent. The math comes when n is at least ten.",
      },
      {
        kind: "podcast",
        episodeId: "bcfs-2025-10-find-pitch-investors",
        at: "14:30",
        excerpt:
          "Investors discount the metrics that look engineered for the slide. Lead with the customer.",
      },
    ],
    followUps: [
      "How do I handle the pipeline disclosure if I'm worried about competitors seeing it?",
      "What's the format for a pilot-to-paid conversion line?",
      "When does NRR start being credible?",
    ],
  },
  {
    id: "ai-defensibility",
    prompt: "My deck has 'AI-powered' on slide 6 — is that a problem?",
    mode: "sharpening",
    reply: `Depends on what's beneath it. The reflexive partner question is "why won't OpenAI ship this in twelve months"[^1] — and right now your slide doesn't answer it.

Four moats that count:

- **Proprietary data flywheel** — every shipment / patient / transaction generates a structured record only you have access to
- **Integration depth** — contractual partnerships that competitors would have to rebuild to replicate
- **Switching cost** — workflow lock-in once the customer's audit cycle / billing / dispatch runs through you
- **Fine-tuning on a private corpus** — your model is qualitatively different on the buyer's data

Pick one. Prove it on the slide. Lead with it instead of the model[^2]. "AI" by itself is not a moat — it's a marketing word that triggers a partner discount.

If you can't pick one, the right move is to delete "AI-powered" from slide 6 and re-position around the workflow that ships value with or without the model. Scott walks the same framework on BAM BizTalk in the context of 2026 fundraising[^3].`,
    citations: [
      {
        kind: "video",
        clipId: "vcfp-2025-04-ai-wrapper",
        at: "00:00",
        excerpt: "Why won't OpenAI eat this · the question your defensibility slide must answer.",
      },
      {
        kind: "video",
        clipId: "vcfp-2025-04-ai-wrapper",
        at: "11:20",
        excerpt:
          "I'm not asking you to remove the AI. I'm asking you to lead with the moat instead of the model.",
      },
      {
        kind: "podcast",
        episodeId: "bam-biztalk-80-funding-future",
        at: "22:00",
        excerpt:
          "Funding the future · resilience, AI, and the discipline that separates a wrapper from a company.",
      },
    ],
    followUps: [
      "Which moat is most credible at seed for a vertical AI play?",
      "How do I show the data flywheel before I have it?",
      "What's the bar for 'integration depth' to count?",
    ],
  },
  // New entry · leads with PDF citations to demonstrate cross-media
  // grounding. Founders working through term-sheet diligence end here.
  {
    id: "term-sheet-priorities",
    prompt: "I have a term sheet. What clauses should I push back on first?",
    mode: "sharpening",
    reply: `Three pieces of paper, in this order, before anything else:

1. **Liquidation preference** · 1× non-participating is the seed standard. Anything multiplier, participating, or stacked is a partner-side ask the founder almost always pushes back on[^1].
2. **Board composition** · two-and-one (two founders + one investor) at seed; three-and-two at A. Anything more investor-leaning is a structural hand-off you don't need to make at seed.
3. **Protective provisions list** · the longer the list, the more friction at every future round. Trim aggressively.

Read the founder-side guide cover-to-cover before the negotiation call — the term-by-term explanations are the same vocabulary the partner will use, and you don't want them defining the language[^2]. Use the Tech Coast Angels glossary for any term that comes up that wasn't in the main guide[^3].

Scott's read on this in the BAM BizTalk interview is also worth thirty minutes — the rhythm of how a founder pushes back without breaking the relationship is the part the docs don't teach[^4].`,
    citations: [
      {
        kind: "resource",
        resourceId: "ultimate-guide-vc-term-sheets",
        pageRef: "p. 12",
        excerpt:
          "Liquidation preference is the highest-leverage line item · 1× non-participating is the seed standard.",
      },
      {
        kind: "resource",
        resourceId: "ultimate-guide-vc-term-sheets",
        pageRef: "p. 24",
        excerpt:
          "Board composition · the structural hand-off founders most often regret making early.",
      },
      {
        kind: "resource",
        resourceId: "tca-term-sheet-definitions",
        excerpt:
          "Plain-language glossary · for any term that surfaces mid-redline.",
      },
      {
        kind: "podcast",
        episodeId: "bam-biztalk-80-funding-future",
        at: "32:00",
        excerpt:
          "How a founder pushes back without breaking the partner relationship.",
      },
    ],
    followUps: [
      "What does a 'fair' option pool look like at seed?",
      "When is participating preferred actually OK?",
      "How do I run a clean redline call with the partner?",
    ],
  },
];
