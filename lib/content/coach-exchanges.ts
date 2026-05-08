// Pre-baked Coach exchanges · the Scott-bot RAG output the user sees on
// first land. Each exchange shows the citation pattern: every claim
// links to a real internal clip with a timestamp. No external links.
//
// Real Coach (Phase 5 of platform build per 11_content_platform_strategy.md
// §5) replaces these with actual RAG retrieval over the ingested corpus.

export interface CoachCitation {
  clipId: string;
  at: string;
  excerpt: string;
}

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

If your slide reads as a workflow tool today, partners price it as one regardless of how good the founder is[^2].`,
    citations: [
      {
        clipId: "vcfp-2025-05-fmf-decides",
        at: "21:00",
        excerpt: "Wedge → workflow ownership → SoR · the four-stage arc that distinguishes a feature from a company.",
      },
      {
        clipId: "vcfp-2025-05-fmf-decides",
        at: "21:05",
        excerpt:
          "I've never written a check on a wedge that didn't have a system-of-record narrative inside the first eighteen months.",
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

The single most leveraged change you can make to this deck before the round closes is replacing the headline NRR with a five-logo named pipeline.`,
    citations: [
      {
        clipId: "ssg-2025-03-vanity-traction",
        at: "02:18",
        excerpt:
          "Two paying customers is signal. 220% NRR on n=2 is a vanity metric that undermines the rest of the slide.",
      },
      {
        clipId: "ssg-2025-03-vanity-traction",
        at: "07:52",
        excerpt: "Lead with the customer story, not the percent. The math comes when n is at least ten.",
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

If you can't pick one, the right move is to delete "AI-powered" from slide 6 and re-position around the workflow that ships value with or without the model.`,
    citations: [
      {
        clipId: "vcfp-2025-04-ai-wrapper",
        at: "00:00",
        excerpt: "Why won't OpenAI eat this · the question your defensibility slide must answer.",
      },
      {
        clipId: "vcfp-2025-04-ai-wrapper",
        at: "11:20",
        excerpt:
          "I'm not asking you to remove the AI. I'm asking you to lead with the moat instead of the model.",
      },
    ],
    followUps: [
      "Which moat is most credible at seed for a vertical AI play?",
      "How do I show the data flywheel before I have it?",
      "What's the bar for 'integration depth' to count?",
    ],
  },
];
