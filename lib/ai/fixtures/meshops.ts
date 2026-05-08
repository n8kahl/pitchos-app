// MeshOps fixture · the canonical demo deck.
//
// What this is: deterministic Scott-voiced output the mock provider
// returns regardless of the actual uploaded PDF. For the demo flow with
// Scott, this is what plays — drag a deck, see this memo render. The
// fixture mirrors the structure of `03_sample_memo.html` (the voice
// quality bar) but is consolidated into the FullAnalysisReport shape.
//
// The memo body below is the artifact the voice regression test runs
// against. Edits to this body must keep:
//   · Opens with one of the signatureOpens
//   · Ends with a `Decision: ...` line matching the close regex
//   · Has ≥8 [slide N] citations
//   · Zero banned phrases
//   · Call made by paragraph 2

import type {
  FullAnalysisReport,
  ExtractionResult,
  AntiPatternDetection,
  SlideReview,
  Recommendation,
  InvestorObjection,
  DiligenceItem,
} from "../schemas";

const MESHOPS_MEMO_BODY = `Strongest part of the deck: founder-market fit. The CEO ran logistics ops at C.H. Robinson for ten years [slide 13]; the CTO completed an ML PhD at CMU on temporal sequence models — directly applicable to shipment-event reasoning. That credential alone is the reason this conversation is happening at all.

Decision before scrolling further: take the 30-minute call. Defer IC two weeks. Three deficits stop this from being lead-able as written, and all three are correctable inside the round-close window: the wedge slide [slide 4] reads as a workflow tool rather than a system of record; the why-now [slide 5] leans on an FMCSA deadline that has slipped twice; the headline traction is 220% NRR on n=2 [slide 7] — a vanity metric that undermines the rest of the slide.

Where it stops being a yes is the wedge. The product as demoed [slide 6] routes exceptions, tags non-compliant shipments, and writes audit-ready summaries. That is a workflow tool, and a workflow tool is something a 3PL adopts; a system of record is what a 3PL builds its operating model around. Investors price the company differently depending on which it becomes — and the deck currently markets the lower-multiple version. The right anchor is Toast (POS → restaurant SoR → fintech) or ServiceTitan (dispatch → SoR → vertical financial services). Both started as ostensible feature companies and absorbed the operating layer beneath them within five years.

Two paying customers is signal. 220% NRR on n=2 is a vanity metric I would remove before sending this to anyone [slide 7]. The right framing is the customer story: two paying customers, both expanded contracts within six months, both converted to multi-year, both of whom will take a reference call. The math comes when n is at least 10. The single most important data point this company can add to the deck before the round closes is a 5-logo pipeline with named stages.

The why-now slide [slide 5] is the second-weakest argument. The defensible why-now is structural, not regulatory: 3PL consolidation has reached an inflection that forces internal compliance integration; per-shipment ML reasoning crossed a cost threshold in 2024; the dominant TMS vendors have not shipped a meaningful AI-native capability in 36 months. Lead with those. Move the regulatory tailwind to a sub-bullet, not a headline.

The team is engineering-heavy without enterprise GTM [slide 13]. For seed milestones I can survive that; for Series A you cannot. The most leveraged hire MeshOps can make pre-A is a fractional VP Sales with logistics experience. Even one named advisor on the team slide today would move the deck materially.

What would need to be true to convert this to a yes: three or more paying customers by round close with no single customer above 30% of ARR; average sales cycle under 60 days on the next two pilots; one Tier-1 3PL signed as design partner [slide 9]; the wedge slide rewritten around the system-of-record narrative; one named GTM advisor on the team slide; the why-now restructured around 3PL consolidation and inference-cost economics, not the regulatory deadline.

Decision: take a 30-minute call to verify the wedge framing and the GTM hire plan. If the founder applies the wedge rewrite, lands one additional paying customer, and adds a named GTM advisor before the next call, this graduates to lead-able. If she does not, decline politely and revisit at Series A — the company itself is real.`;

export const MESHOPS_EXTRACTION: ExtractionResult = {
  companyName: "MeshOps",
  oneLine:
    "Vertical AI for shipper-broker compliance · mid-market 3PL wedge with system-of-record ambition.",
  stage: "SEED",
  sector: "Vertical AI · Logistics",
  slides: [
    {
      slideNumber: 1,
      inferredTitle: "Cover · MeshOps",
      purpose: "title",
      rawText:
        "MeshOps · Building the operating record for shipper-broker compliance · Seed round · 2026",
      claims: [
        {
          claim: "Company is at seed stage and raising in 2026.",
          sourceQuote: "Seed round · 2026",
        },
      ],
    },
    {
      slideNumber: 2,
      inferredTitle: "Problem",
      purpose: "problem",
      rawText:
        "Shipper-broker compliance failures cost mid-market 3PLs $1.2M–$3.2M per year in audit-flagged write-offs they only catch after the fact.",
      claims: [
        {
          claim: "Annual loss range is $1.2M–$3.2M for mid-market 3PLs.",
          sourceQuote:
            "$1.2M–$3.2M per year in audit-flagged write-offs they only catch after the fact",
        },
      ],
    },
    {
      slideNumber: 3,
      inferredTitle: "Market",
      purpose: "market",
      rawText:
        "$12B logistics-software TAM. Mid-market 3PL beachhead = ~12,000 brokers in the US, average ACV $24–60K.",
      claims: [
        {
          claim: "TAM is $12B; SAM is mid-market 3PL with ~12,000 brokers.",
          sourceQuote:
            "$12B logistics-software TAM. Mid-market 3PL beachhead = ~12,000 brokers in the US, average ACV $24–60K.",
        },
      ],
    },
    {
      slideNumber: 4,
      inferredTitle: "Wedge",
      purpose: "wedge",
      rawText:
        "Mid-market 3PLs (50–500 employees) where compliance pain is acute and operating budgets are below enterprise thresholds. Workflow integration in 24 hours without TMS rip-and-replace.",
      claims: [
        {
          claim:
            "Wedge is mid-market 3PLs with deployment in 24 hours alongside existing TMS.",
          sourceQuote:
            "Workflow integration in 24 hours without TMS rip-and-replace",
        },
      ],
    },
    {
      slideNumber: 5,
      inferredTitle: "Why now",
      purpose: "why_now",
      rawText:
        "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice). Brokers will need automated compliance attestation.",
      claims: [
        {
          claim:
            "Why-now rests on FMCSA enforcement of revised broker-of-record rules.",
          sourceQuote:
            "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice)",
        },
      ],
    },
    {
      slideNumber: 6,
      inferredTitle: "Solution",
      purpose: "solution",
      rawText:
        "AI-powered exception routing, non-compliance flagging, audit-ready summaries. Integrates with existing TMS to add compliance intelligence.",
      claims: [
        {
          claim:
            "Product is AI-powered routing/flagging/summarizing layered on top of the existing TMS.",
          sourceQuote:
            "AI-powered exception routing, non-compliance flagging, audit-ready summaries. Integrates with existing TMS",
        },
      ],
    },
    {
      slideNumber: 7,
      inferredTitle: "Traction",
      purpose: "traction",
      rawText:
        "$340K ARR · 220% net revenue retention · 2 paying customers (Goldline Freight, Crossway Logistics). Both converted from pilot to paid within 90 days.",
      claims: [
        {
          claim: "$340K ARR with 220% NRR on 2 customers.",
          sourceQuote:
            "$340K ARR · 220% net revenue retention · 2 paying customers",
        },
      ],
    },
    {
      slideNumber: 8,
      inferredTitle: "Business model",
      purpose: "business_model",
      rawText:
        "SaaS subscription · $24K–$60K ACV · 3-year contracts standard.",
      claims: [
        {
          claim: "ACV ranges $24K–$60K, contracts 3 years.",
          sourceQuote: "$24K–$60K ACV · 3-year contracts standard",
        },
      ],
    },
    {
      slideNumber: 9,
      inferredTitle: "GTM",
      purpose: "gtm",
      rawText:
        "Founder-led sales through CEO's network at C.H. Robinson. 5 named pipeline logos in conversation.",
      claims: [
        {
          claim:
            "Sales motion is founder-led through CEO network; pipeline of 5 named logos.",
          sourceQuote:
            "Founder-led sales through CEO's network at C.H. Robinson. 5 named pipeline logos in conversation.",
        },
      ],
    },
    {
      slideNumber: 10,
      inferredTitle: "Competition",
      purpose: "competition",
      rawText:
        "Competitive matrix vs. Vector, ShipChain, generic compliance SaaS. MeshOps wins on integration depth and AI-native architecture.",
      claims: [
        {
          claim: "Competition is positioned vs. niche compliance vendors.",
          sourceQuote:
            "Competitive matrix vs. Vector, ShipChain, generic compliance SaaS",
        },
      ],
    },
    {
      slideNumber: 11,
      inferredTitle: "Defensibility",
      purpose: "defensibility",
      rawText:
        "Two TMS partnerships in flight (verbal). Proprietary exception data. Workflow lock-in via audit cycle integration.",
      claims: [
        {
          claim:
            "Three claimed moats: TMS partnerships, exception data, workflow lock-in.",
          sourceQuote:
            "Two TMS partnerships in flight (verbal). Proprietary exception data. Workflow lock-in via audit cycle integration.",
        },
      ],
    },
    {
      slideNumber: 12,
      inferredTitle: "Use of funds",
      purpose: "use_of_funds",
      rawText:
        "$3.5M raise on $15M post · 60% engineering · 30% go-to-market · 10% ops · 18-month runway.",
      claims: [
        {
          claim:
            "Round size is $3.5M at $15M post; allocation 60/30/10 across eng/GTM/ops; 18-month runway.",
          sourceQuote:
            "$3.5M raise on $15M post · 60% engineering · 30% go-to-market · 10% ops · 18-month runway",
        },
      ],
    },
    {
      slideNumber: 13,
      inferredTitle: "Team",
      purpose: "team",
      rawText:
        "CEO: 10 years at C.H. Robinson, ending as Director of Operations. CTO: ML PhD, CMU, temporal sequence models. 4 engineers, 0 GTM.",
      claims: [
        {
          claim:
            "CEO has 10 years operations experience at C.H. Robinson; CTO has ML PhD; team is 4 engineers + no GTM.",
          sourceQuote:
            "CEO: 10 years at C.H. Robinson, ending as Director of Operations. CTO: ML PhD, CMU, temporal sequence models. 4 engineers, 0 GTM.",
        },
      ],
    },
    {
      slideNumber: 14,
      inferredTitle: "Ask",
      purpose: "ask",
      rawText:
        "Closing $3.5M seed by June 2026. Lead investor sought. Use of funds tied to 10-customer · $1.5M ARR · Series A-ready milestone.",
      claims: [
        {
          claim:
            "Round closes June 2026; milestone is 10 customers / $1.5M ARR for Series A readiness.",
          sourceQuote:
            "Closing $3.5M seed by June 2026 ... 10-customer · $1.5M ARR · Series A-ready milestone",
        },
      ],
    },
  ],
};

export const MESHOPS_DETECTIONS: AntiPatternDetection[] = [
  {
    key: "feature_not_company",
    detected: true,
    severity: "HIGH",
    evidenceQuote:
      "AI-powered exception routing, non-compliance flagging, audit-ready summaries. Integrates with existing TMS",
    sourceSlide: 6,
  },
  {
    key: "vanity_traction",
    detected: true,
    severity: "MEDIUM_HIGH",
    evidenceQuote:
      "$340K ARR · 220% net revenue retention · 2 paying customers",
    sourceSlide: 7,
  },
  {
    key: "regulatory_dependent_why_now",
    detected: true,
    severity: "HIGH",
    evidenceQuote:
      "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice)",
    sourceSlide: 5,
  },
  {
    key: "team_no_gtm",
    detected: true,
    severity: "MEDIUM",
    evidenceQuote: "4 engineers, 0 GTM",
    sourceSlide: 13,
  },
  {
    key: "single_customer_concentration",
    detected: true,
    severity: "MEDIUM_HIGH",
    evidenceQuote: "2 paying customers (Goldline Freight, Crossway Logistics)",
    sourceSlide: 7,
  },
];

export const MESHOPS_OBJECTIONS: InvestorObjection[] = [
  {
    antiPatternKey: "feature_not_company",
    title: "Wedge reads as a feature, not a company",
    severity: "HIGH",
    objection: "This looks like a feature, not a company.",
    whyItMatters:
      "The reflexive partner question is 'why doesn't the TMS incumbent ship this in 18 months?' — and the deck does not currently contain the wedge → workflow ownership → system-of-record narrative that answers it.",
    howToAddress:
      "Add a slide showing wedge → workflow ownership → system of record → adjacent monetization. Anchor on Toast or ServiceTitan.",
    evidenceRequired: [
      "Slide showing the 24-month roadmap from workflow tool to system of record",
      "Statement of which adjacent revenue streams open at SoR status (audit-as-a-service, dispute resolution fees)",
    ],
    relatedSlide: 4,
    sourceQuote: "Workflow integration in 24 hours without TMS rip-and-replace",
  },
  {
    antiPatternKey: "vanity_traction",
    title: "220% NRR on n=2 undermines the rest of the slide",
    severity: "MEDIUM",
    objection: "Loud number, thin substance.",
    whyItMatters:
      "Net retention computed on two customers reads as inflated. The headline number is technically accurate but actively undermines every other metric on the slide because it signals the founder thinks the partner won't notice.",
    howToAddress:
      "Lead with the customer story, not the percent. Show absolute revenue, named logos, contract length, pilot-to-paid conversion. Save NRR for n ≥ 10.",
    evidenceRequired: [
      "Pilot-to-paid conversion rate across the existing two and the next three pipeline logos",
      "ACV and contract length per customer in absolute dollars",
    ],
    relatedSlide: 7,
    sourceQuote:
      "$340K ARR · 220% net revenue retention · 2 paying customers",
  },
  {
    antiPatternKey: "regulatory_dependent_why_now",
    title: "Why-now leans on a deadline that has slipped twice",
    severity: "HIGH",
    objection: "Why-now leans on a deadline that has slipped before.",
    whyItMatters:
      "Experienced partners discount slipped regulatory deadlines reflexively. Even one slip is enough; two is fatal. The structural argument should be load-bearing, not the regulatory tailwind.",
    howToAddress:
      "Restructure the why-now around 3PL consolidation reaching an inflection, sub-cent inference economics, and the TMS incumbent inaction window. Move the FMCSA tailwind to a sub-bullet.",
    evidenceRequired: [
      "Three structural why-now arguments rank-ordered by load-bearingness",
      "Citation for 3PL consolidation rate that supports the inflection claim",
    ],
    relatedSlide: 5,
    sourceQuote:
      "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice)",
  },
  {
    antiPatternKey: "team_no_gtm",
    title: "Team is engineering-heavy with no enterprise GTM",
    severity: "MEDIUM",
    objection: "Team is engineering-heavy without enterprise GTM.",
    whyItMatters:
      "For seed milestones (~10 paying customers in 18 months) this is survivable. For the seed-to-Series-A transition it is not. Partners discount the GTM motion in their model of the company.",
    howToAddress:
      "Add a named GTM advisor with sector-specific enterprise sales scars. List a fractional VP Sales hire plan in use of funds.",
    evidenceRequired: [
      "Named GTM advisor on the team slide",
      "Hire plan for VP Sales with target start date in use-of-funds breakdown",
    ],
    relatedSlide: 13,
    sourceQuote: "4 engineers, 0 GTM",
  },
  {
    antiPatternKey: "single_customer_concentration",
    title: "Two customers · concentration risk on the round",
    severity: "HIGH",
    objection: "Customer concentration risk.",
    whyItMatters:
      "Two customers means a single churn or contract dispute drops ARR by 50%+. Concentration the founder doesn't pre-empt becomes a diligence-stage blocker.",
    howToAddress:
      "Show ACV per customer transparently, a 5+ logo named pipeline with stage, contract length per customer.",
    evidenceRequired: [
      "Named pipeline of at least 5 logos with sales stage labeled",
      "ACV breakdown per existing customer",
    ],
    relatedSlide: 7,
    sourceQuote: "2 paying customers (Goldline Freight, Crossway Logistics)",
  },
];

export const MESHOPS_RECOMMENDATIONS: Recommendation[] = [
  {
    title: "Rewrite slide 4 around the wedge → SoR narrative",
    problem:
      "Current slide markets MeshOps as a workflow tool, which is the lower-multiple framing.",
    recommendation:
      "Replace slide 4 with the four-stage arc: workflow ownership → audit/document layer → system of record → adjacent monetization. Anchor visually on Toast or ServiceTitan.",
    investorRationale:
      "Investors price companies differently depending on whether they will become a SoR. Without the explicit arc, partners default to the lower multiple.",
    expectedImpact: "VERY_HIGH",
    effort: "MEDIUM",
    priority: "P0",
    expectedScoreDelta: 8,
    slideNumber: 4,
    exampleCopy:
      "MeshOps is the system of record for shipper-broker compliance. We start as the workflow layer — exception routing, audit prep, dispute resolution — that brokers can deploy in 24 hours without ripping out their TMS.",
  },
  {
    title: "Restructure why-now around structural inflections",
    problem:
      "The current why-now leans on FMCSA enforcement that has slipped twice; partners reflexively discount.",
    recommendation:
      "Lead with three structural arguments: 3PL consolidation forcing internal compliance integration; sub-cent inference cost making per-event AI viable for mid-market budgets; TMS incumbent inaction window. Move the regulatory tailwind to a sub-bullet.",
    investorRationale:
      "A regulatory why-now that has slipped twice is fatal at any partner who reads logistics. A structural why-now is durable.",
    expectedImpact: "HIGH",
    effort: "LOW",
    priority: "P0",
    expectedScoreDelta: 6,
    slideNumber: 5,
    exampleCopy:
      "Mid-market 3PL consolidation has reached an inflection · per-shipment ML reasoning crossed sub-cent inference in 2024 · the dominant TMS vendors have not shipped a meaningful AI-native capability in 36 months.",
  },
  {
    title: "Replace 220% NRR headline with the customer story",
    problem:
      "Net retention math on n=2 reads as a vanity metric and undermines other numbers on the slide.",
    recommendation:
      "Lead with named logos, expansion shape, contract length, pilot-to-paid conversion. Move NRR off the headline; surface it only after n ≥ 10.",
    investorRationale:
      "The customer story is more credible than headline math at small n. Partners read inflated metrics as a discount on everything around them.",
    expectedImpact: "HIGH",
    effort: "LOW",
    priority: "P0",
    expectedScoreDelta: 5,
    slideNumber: 7,
    exampleCopy:
      "Two paying customers · both expanded contracts within six months · both converted to multi-year · both will take a reference call. Pipeline: 5 named logos, 3 in pilot conversation.",
  },
  {
    title: "Add a named GTM advisor to the team slide",
    problem:
      "Team is engineering-heavy with no named enterprise-logistics GTM presence.",
    recommendation:
      "Recruit and name an advisor with enterprise logistics sales scars (3PL or large-broker background). Include a fractional VP Sales hire timeline in use-of-funds.",
    investorRationale:
      "Even one named advisor changes how a partner reads the seed-to-A motion. The cost is low and the credibility lift is material.",
    expectedImpact: "MEDIUM",
    effort: "MEDIUM",
    priority: "P1",
    expectedScoreDelta: 3,
    slideNumber: 13,
    exampleCopy: null,
  },
];

export const MESHOPS_DILIGENCE: DiligenceItem[] = [
  {
    category: "Traction · cohort revenue",
    request:
      "Monthly ARR by customer for the last 12 months, including pilot-period revenue.",
    whyItMatters:
      "Need to see expansion shape, not just headline NRR. A vanity NRR on small n is useless; a customer-by-customer expansion curve is decisive.",
    suggestedEvidence:
      "Stripe / billing-system export by customer, monthly granularity.",
    ownerRole: "CEO",
    priority: "P0",
  },
  {
    category: "Pipeline by stage",
    request:
      "Top-of-funnel logos, stage of each, conversion rate from first call to pilot, pilot-to-paid conversion rate.",
    whyItMatters:
      "Without a stage-labeled named pipeline, partners cannot model whether customer #3 lands in 3 months or 13 months.",
    suggestedEvidence: "CRM export or curated pipeline sheet.",
    ownerRole: "CEO",
    priority: "P0",
  },
  {
    category: "Sales cycle distribution",
    request:
      "Time-from-first-conversation-to-contract for each existing customer + each pipeline logo.",
    whyItMatters:
      "Necessary for credible bookings forecast. CAC is unmodelable without it.",
    suggestedEvidence: "CRM activity log or hand-curated timeline.",
    ownerRole: "CEO",
    priority: "P0",
  },
  {
    category: "Technical · model accuracy",
    request:
      "False-negative rate on compliance-flagging model. Human-review fallback path when the model is wrong.",
    whyItMatters:
      "If the model misses high-impact violations, customers churn. The fallback path is what separates a real product from a demo.",
    suggestedEvidence:
      "Internal accuracy benchmark · process diagram for human review path.",
    ownerRole: "CTO",
    priority: "P1",
  },
  {
    category: "TMS partnership status",
    request:
      "Contractual or verbal? Per-partner revenue split? Exclusivity terms?",
    whyItMatters:
      "Verbal-only partnerships are zero defensibility. Need to verify what is contractual before treating as a moat.",
    suggestedEvidence: "Partnership agreement or term sheet drafts.",
    ownerRole: "CEO",
    priority: "P1",
  },
  {
    category: "GTM hire plan",
    request:
      "Named role, target hire date, target compensation band, candidate pipeline if any.",
    whyItMatters:
      "Use-of-funds allocates 30% to GTM but does not name a role. Partners want a specific commitment, not a department line item.",
    suggestedEvidence:
      "Hire plan document with target start dates, JD for VP Sales role.",
    ownerRole: "CEO",
    priority: "P1",
  },
];

export const MESHOPS_SLIDE_REVIEWS: SlideReview[] = [
  {
    slideNumber: 4,
    inferredTitle: "Wedge",
    slidePurpose: "wedge",
    clarityScore: 64,
    evidenceScore: 72,
    investorImpactScore: 56,
    whatWorks: [
      "Mid-market 3PL ICP is named with employee-count band (50-500)",
      "24-hour deployment claim is concrete and falsifiable",
    ],
    issues: [
      "Frames as workflow tool, not system of record",
      "No expansion narrative beyond compliance routing",
    ],
    rewriteGuidance:
      "Rewrite around a four-stage arc: workflow ownership in months 1–6 → audit/document layer in months 6–12 → system of record by month 18 → adjacent monetization (audit-as-a-service, dispute fees) by month 24. Anchor visually on Toast or ServiceTitan.",
    suggestedTitle: "From workflow layer to system of record",
    evidenceToAdd: [
      "Visual timeline showing the four-stage arc",
      "Toast / ServiceTitan side-bar callout with $-multiple gap explained",
    ],
    sourceQuote: "Workflow integration in 24 hours without TMS rip-and-replace",
    expectedScoreDelta: 8,
  },
  {
    slideNumber: 5,
    inferredTitle: "Why now",
    slidePurpose: "why_now",
    clarityScore: 58,
    evidenceScore: 50,
    investorImpactScore: 42,
    whatWorks: ["A specific year is named, which forces specificity"],
    issues: [
      "Regulatory deadline has slipped twice already",
      "No structural macro argument is on the slide",
      "Single-anchor argument is fragile",
    ],
    rewriteGuidance:
      "Lead with three structural arguments — 3PL consolidation, sub-cent inference economics, TMS incumbent inaction. Move the FMCSA tailwind to a sub-bullet, not the headline.",
    suggestedTitle: "Why now · structural inflection, not regulatory deadline",
    evidenceToAdd: [
      "Citation for 3PL consolidation rate (Tier-1 acquisitions per year)",
      "Inference-cost-per-shipment chart 2022 vs. 2024",
    ],
    sourceQuote:
      "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice)",
    expectedScoreDelta: 6,
  },
  {
    slideNumber: 7,
    inferredTitle: "Traction",
    slidePurpose: "traction",
    clarityScore: 70,
    evidenceScore: 60,
    investorImpactScore: 48,
    whatWorks: [
      "Both paying customers are named",
      "Pilot-to-paid conversion within 90 days is real signal",
    ],
    issues: [
      "220% NRR on n=2 reads as vanity metric",
      "No pipeline disclosed",
      "No ACV per customer or contract length on the slide",
    ],
    rewriteGuidance:
      "Replace the NRR headline with the customer story. Show expansion absolute-dollar shape, named pipeline with stages, ACV per customer.",
    suggestedTitle:
      "Traction · two paid pilots, both expanded, multi-year contracts",
    evidenceToAdd: [
      "5-logo named pipeline with stage labels",
      "Per-customer expansion curve in absolute dollars",
    ],
    sourceQuote:
      "$340K ARR · 220% net revenue retention · 2 paying customers",
    expectedScoreDelta: 5,
  },
  {
    slideNumber: 13,
    inferredTitle: "Team",
    slidePurpose: "team",
    clarityScore: 78,
    evidenceScore: 80,
    investorImpactScore: 60,
    whatWorks: [
      "CEO has 10 years operations experience at C.H. Robinson — strongest single signal in the deck",
      "CTO has directly applicable ML credentials",
    ],
    issues: [
      "No named GTM advisor",
      "No enterprise sales presence on the team",
    ],
    rewriteGuidance:
      "Add a named GTM advisor with sector-specific enterprise sales scars. List the fractional VP Sales hire timeline next to the team slide.",
    suggestedTitle: null,
    evidenceToAdd: [
      "Named GTM advisor with logistics or enterprise SaaS background",
      "VP Sales hire plan with target start date",
    ],
    sourceQuote:
      "CEO: 10 years at C.H. Robinson, ending as Director of Operations. CTO: ML PhD, CMU, temporal sequence models. 4 engineers, 0 GTM.",
    expectedScoreDelta: 3,
  },
];

export const MESHOPS_REPORT: Omit<
  FullAnalysisReport,
  "rubricVersion" | "partnerProfileVersion" | "promptVersion"
> = {
  companyName: "MeshOps",
  fundabilityScore: 62,
  meetingLikelihood: "MAYBE",
  meetingLikelihoodRationale:
    "Founder-market fit and customer pain are real; wedge framing, why-now load-bearingness, and traction-presentation deficits are correctable inside the round-close window. Take the call, defer IC pending diligence.",
  executiveSummary:
    "Strong founder-market fit and a real wedge in mid-market 3PL compliance — undermined by a feature-shaped solution slide, a regulatory-dependent why-now, and a vanity-NRR headline.",
  oneMinutePitch:
    "MeshOps is the system of record for shipper-broker compliance. The CEO ran logistics ops at C.H. Robinson for ten years; the CTO is an ML PhD. Two paying pilots have already converted, both expanded, both multi-year. The wedge is mid-market 3PLs where compliance pain is acute and budgets are below enterprise thresholds. Three deficits stop this from being lead-able as written — wedge framing, regulatory why-now, and headline traction — all correctable inside the round-close window.",
  whatWouldNeedToBeTrue: [
    "Three or more paying customers by round close, with no single customer above 30% of ARR",
    "Average sales cycle under 60 days on the next two pilots",
    "One Tier-1 3PL signed as design partner, even at zero revenue",
    "Wedge slide rewritten around the system-of-record narrative with Toast or ServiceTitan as visual anchor",
    "One named GTM advisor on the team slide with enterprise logistics scars",
    "Why-now restructured around 3PL consolidation and inference economics, not the FMCSA deadline",
  ],
  topStrengths: [
    "CEO has 10 years operations experience at the largest US 3PL",
    "Two paying pilots, both expanded, both converted to multi-year contracts",
    "Real customer pain quantified at $1.2M–$3.2M annual write-offs per broker",
    "Honest round size tied to a specific 18-month milestone",
  ],
  topPassReasons: [
    "Solution slide reads as a feature inside the existing TMS, not a company",
    "Why-now rests on an FMCSA deadline that has slipped twice",
    "220% NRR on n=2 is a vanity metric that undermines the rest of the traction slide",
    "No named GTM presence on the team slide for the seed-to-A transition",
  ],
  scoring: {
    components: [
      {
        name: "founderMarketFit",
        score: 84,
        evidenceLevel: "strong",
        evidenceQuote:
          "CEO: 10 years at C.H. Robinson, ending as Director of Operations.",
        sourceSlide: 13,
        rationale:
          "10 years of direct operations experience at the largest US 3PL is the single strongest signal in this deck.",
      },
      {
        name: "wedgeClarity",
        score: 56,
        evidenceLevel: "partial",
        evidenceQuote:
          "Workflow integration in 24 hours without TMS rip-and-replace",
        sourceSlide: 4,
        rationale:
          "Wedge is named but framed as a workflow tool. The system-of-record arc is missing — and that arc is the entire valuation question.",
      },
      {
        name: "tractionQuality",
        score: 58,
        evidenceLevel: "weak",
        evidenceQuote:
          "$340K ARR · 220% net revenue retention · 2 paying customers",
        sourceSlide: 7,
        rationale:
          "Two paying customers is signal. NRR on n=2 actively undermines that signal. Real metric is customer-by-customer expansion shape.",
      },
      {
        name: "problemUrgency",
        score: 74,
        evidenceLevel: "credible",
        evidenceQuote:
          "$1.2M–$3.2M per year in audit-flagged write-offs they only catch after the fact",
        sourceSlide: 2,
        rationale:
          "Pain is quantified in real dollars per broker. That converts narrative pain to operational pain that buyers will pay to remove.",
      },
      {
        name: "gtmRepeatability",
        score: 62,
        evidenceLevel: "partial",
        evidenceQuote:
          "Founder-led sales through CEO's network at C.H. Robinson. 5 named pipeline logos in conversation.",
        sourceSlide: 9,
        rationale:
          "Founder-led closing is fine at seed. Repeatability cannot be assessed without sales-cycle distribution and a named advisor.",
      },
      {
        name: "marketSizingLogic",
        score: 68,
        evidenceLevel: "credible",
        evidenceQuote:
          "$12B logistics-software TAM. Mid-market 3PL beachhead = ~12,000 brokers in the US, average ACV $24–60K.",
        sourceSlide: 3,
        rationale:
          "Bottom-up is present (broker count × ACV). The TAM-first ordering is a stylistic miss but the numbers underneath are credible.",
      },
      {
        name: "whyNow",
        score: 42,
        evidenceLevel: "weak",
        evidenceQuote:
          "FMCSA broker-of-record rule enforcement expected 2026 (originally 2024, deferred twice)",
        sourceSlide: 5,
        rationale:
          "Single-anchor regulatory why-now with two prior slips. The structural why-now (consolidation + inference economics) is absent from the slide.",
      },
      {
        name: "businessModel",
        score: 76,
        evidenceLevel: "credible",
        evidenceQuote:
          "SaaS subscription · $24K–$60K ACV · 3-year contracts standard.",
        sourceSlide: 8,
        rationale:
          "Recurring contracts at credible ACV bands. Pricing logic is sound for the mid-market broker buyer.",
      },
      {
        name: "defensibility",
        score: 60,
        evidenceLevel: "partial",
        evidenceQuote:
          "Two TMS partnerships in flight (verbal). Proprietary exception data. Workflow lock-in via audit cycle integration.",
        sourceSlide: 11,
        rationale:
          "Three claimed moats. Verbal partnerships are not yet defensible; proprietary exception data needs 12 months to accrue. Workflow lock-in is real once cycle is live.",
      },
      {
        name: "deckQuality",
        score: 78,
        evidenceLevel: "strong",
        evidenceQuote: "",
        rationale:
          "Visual quality is investor-grade. Citation density per slide is adequate. No design penalties applied.",
      },
      {
        name: "riskSurface",
        score: 54,
        evidenceLevel: "partial",
        evidenceQuote: "2 paying customers (Goldline Freight, Crossway Logistics)",
        sourceSlide: 7,
        rationale:
          "Customer concentration is the load-bearing risk. Verbal-only TMS partnerships are the second risk. Both are addressable before round close.",
      },
    ],
    fundabilityScore: 62,
    meetingLikelihood: "MAYBE",
    hardFailsTriggered: [],
  },
  memo: {
    body: MESHOPS_MEMO_BODY,
    oneMinutePitch:
      "MeshOps is building the operating record for shipper-broker compliance, starting in mid-market 3PLs. The CEO ran logistics ops at C.H. Robinson for ten years; two paying pilots have converted within 90 days, both multi-year, both reference-able. Three corrections — wedge framing, why-now structure, and headline traction — turn this from maybe to lead-able inside the round-close window.",
    whatWouldNeedToBeTrue: [
      "Three or more paying customers by round close, with no single customer above 30% of ARR",
      "Average sales cycle under 60 days on the next two pilots",
      "One Tier-1 3PL signed as design partner, even at zero revenue",
      "Wedge slide rewritten around the system-of-record narrative",
      "One named GTM advisor on the team slide",
      "Why-now restructured around 3PL consolidation and inference economics",
    ],
    bullCase:
      "Founder-market fit is rare; the customer pain is real, regulatorily-adjacent, and operationally measurable. With the wedge → SoR rewrite, three more named pilots, and a fractional GTM advisor, this is a $300–500M outcome on a 6–8 year horizon.",
    bearCase:
      "Mid-market 3PL is a graveyard for vertical SaaS. Sales cycles run 90–120 days, ACVs trend down in macro contractions, and churn correlates with broker bankruptcy. Layered AI risk on top of an already-difficult sales motion produces a $5–8M ARR services-flavored business that does not return capital.",
    decision: {
      verdict:
        "Take a 30-minute call to verify the wedge framing and the GTM hire plan.",
      rationale:
        "The deficits are story problems, not company problems. If addressed before next call, this graduates to lead-able. If not, decline politely and revisit at Series A.",
    },
    voiceMarkers: {
      // populated by the mock provider after running the regression test
      signatureOpenUsed: "",
      decisionClose: "",
      citedSlideClaims: 0,
      bannedPhraseHits: [],
    },
  },
  slideReviews: MESHOPS_SLIDE_REVIEWS,
  recommendations: MESHOPS_RECOMMENDATIONS,
  objections: MESHOPS_OBJECTIONS,
  diligence: MESHOPS_DILIGENCE,
  antiPatternDetections: MESHOPS_DETECTIONS,
};

export { MESHOPS_MEMO_BODY };
