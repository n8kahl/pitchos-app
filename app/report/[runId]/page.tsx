// PitchOS · partner memo · the document Scott reads.
//
// Layout per SDD §21.3 + UX audit findings:
//   1. Verdict at top — partner reads top-down, decision can't be buried
//   2. Memo body with [slide N] citations that jump-and-pulse the matching
//      slide review further down
//   3. Slide reviews rendered with stable id="slide-N" anchors so citations
//      land on the right element
//
// Source Serif typography for the prose. JetBrains Mono for citations and
// data accents. Inter for UI chrome.

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { ScoreComponent } from "@/lib/ai/schemas";
import { MemoBody } from "@/components/report/MemoBody";
import { SlideTeardown } from "@/components/report/SlideTeardown";
import { InvestorLens } from "@/components/report/InvestorLens";
import { QARehearsal } from "@/components/report/QARehearsal";
import { ReportNav } from "@/components/report/ReportNav";
import { AskCoachButton } from "@/components/library/AskCoachButton";

type PageProps = {
  params: Promise<{ runId: string }>;
};

const RUBRIC_LABELS: Record<string, string> = {
  founderMarketFit: "Founder–market fit",
  wedgeClarity: "Wedge clarity",
  tractionQuality: "Traction quality",
  problemUrgency: "Problem urgency",
  gtmRepeatability: "GTM repeatability",
  marketSizingLogic: "Market sizing",
  whyNow: "Why now",
  businessModel: "Business model",
  defensibility: "Defensibility",
  deckQuality: "Deck quality",
  riskSurface: "Risk surface",
};

function scoreColor(score: number): string {
  if (score >= 75) return "text-brand-green";
  if (score >= 60) return "text-brand-gold";
  return "text-signal-red";
}

function scoreBar(score: number): string {
  if (score >= 75) return "bg-brand-green";
  if (score >= 60) return "bg-brand-gold";
  return "bg-signal-red";
}

function meetingLikelihoodColor(likelihood: string): string {
  if (likelihood === "STRONG_YES" || likelihood === "YES")
    return "text-brand-green";
  if (likelihood === "MAYBE") return "text-brand-gold";
  return "text-signal-red";
}

export default async function ReportPage({ params }: PageProps) {
  const { runId } = await params;

  const run = await db.analysisRun.findUnique({
    where: { id: runId },
    include: {
      deck: { include: { project: true } },
      report: true,
      objections: { orderBy: { severity: "desc" } },
      antiPatternDetections: true,
      slideReviews: { orderBy: { slideNumber: "asc" } },
      recommendations: { orderBy: { priority: "asc" } },
      diligence: { orderBy: { priority: "asc" } },
    },
  });

  if (!run || !run.report) notFound();

  const memo = run.report.memoJson as {
    body: string;
    bullCase: string;
    bearCase: string;
    decision: { verdict: string; rationale: string };
    voiceMarkers: {
      signatureOpenUsed: string;
      decisionClose: string;
      citedSlideClaims: number;
      bannedPhraseHits: string[];
    };
  };

  // persistReport in lib/ai/orchestrator.ts writes
  //   keyMetrics: { scoring: report.scoring.components }
  // so keyMetrics.scoring IS the array. Earlier code expected one
  // more level of wrapping and crashed on undefined.map.
  const scoring =
    (run.report.keyMetrics as { scoring?: ScoreComponent[] } | null)
      ?.scoring ?? [];

  const extractedSlides: Array<{
    slideNumber: number;
    inferredTitle: string;
    purpose: string;
    rawText: string;
  }> =
    (run.extractionJson as {
      slides?: Array<{
        slideNumber: number;
        inferredTitle: string;
        purpose: string;
        rawText: string;
      }>;
    } | null)?.slides ??
    run.slideReviews.map((r) => ({
      slideNumber: r.slideNumber,
      inferredTitle: r.suggestedTitle ?? r.inferredTitle,
      purpose: inferPurposeFromTitle(
        r.suggestedTitle ?? r.inferredTitle,
        r.slideNumber,
        run.slideReviews.length
      ),
      rawText: [r.sourceQuote, r.rewriteGuidance].filter(Boolean).join(". "),
    }));

  const voicePass =
    memo.voiceMarkers.bannedPhraseHits.length === 0 &&
    memo.voiceMarkers.citedSlideClaims >= 8;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-8 sm:px-8 sm:pt-10">
      {/* Top bar · back to dashboard + voice integrity */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <Link
          href="/dashboard"
          className="text-brand-gold transition hover:text-brand-gold-2"
        >
          ← back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span>run {run.id.slice(-10)}</span>
          <span
            className={[
              "rounded-sm border px-2 py-1",
              voicePass
                ? "border-brand-green/40 bg-brand-green/5 text-brand-green"
                : "border-signal-red/40 bg-signal-red/5 text-signal-red",
            ].join(" ")}
          >
            {voicePass ? "✓ voice integrity" : "× voice fail"}
          </span>
        </div>
      </div>

      {/* Header · company + executive summary + 4-stat strip */}
      <header className="mt-8 border-b border-border/50 pb-8">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
          partner memo · scott · black dog vp
        </div>
        <h1 className="mt-3 font-prose text-3xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl">
          {run.deck.project.companyName}
        </h1>
        <p className="mt-3 max-w-2xl font-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
          {run.report.executiveSummary}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          <Stat
            label="Fundability"
            value={`${run.report.fundabilityScore}`}
            sub="/ 100"
            valueClass={scoreColor(run.report.fundabilityScore)}
          />
          <Stat
            label="Meeting"
            value={run.report.meetingLikelihood.replace(/_/g, " ")}
            sub={
              run.report.meetingLikelihood === "MAYBE" ? "with diligence" : ""
            }
            valueClass={meetingLikelihoodColor(run.report.meetingLikelihood)}
          />
          <Stat
            label="Citations"
            value={`${memo.voiceMarkers.citedSlideClaims}`}
            sub="slide-quote anchored"
          />
          <Stat
            label="Anti-patterns"
            value={`${run.antiPatternDetections.length}`}
            sub="of 16 in catalog"
          />
        </div>
      </header>

      <ReportNav />

      {/* === VERDICT · the TL;DR · most prominent thing on the page === */}
      <section id="verdict" className="mt-10 scroll-mt-16">
        <div className="relative overflow-hidden rounded-xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 via-card to-card p-7 sm:p-9">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-gold via-brand-green to-brand-gold" />
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            ★ partner verdict
          </div>
          <h2 className="mt-3 max-w-3xl font-prose text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
            {memo.decision.verdict}
          </h2>
          <p className="mt-4 max-w-3xl font-prose text-[15px] leading-[1.7] text-foreground/85 sm:text-base">
            {memo.decision.rationale}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-brand-gold/20 pt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
            <span className="text-muted-foreground">if you do nothing else ·</span>
            {run.report.whatWouldNeedToBeTrue.slice(0, 2).map((item, i) => (
              <span
                key={i}
                className="rounded-sm border border-brand-gold/30 bg-brand-gold/5 px-2 py-1 text-brand-gold"
              >
                {item.split(",")[0].slice(0, 60)}
                {item.length > 60 ? "…" : ""}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* === 01 · Memo body · with interactive [slide N] citations === */}
      <section id="s01" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow num="01" label="partner memo · sharpening voice" />
        <h2 className="sr-only">Memo body</h2>
        <div className="mt-5">
          <MemoBody body={memo.body} />
        </div>
      </section>

      {/* === 02 · Bull / bear === */}
      <section id="s02" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow num="02" label="bull / bear · agent disagreement" />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          The two cases
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-md border border-brand-green/30 bg-brand-green/5 p-5 sm:p-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">
              bull case
            </div>
            <p className="mt-3 font-prose text-[15px] leading-[1.7] text-foreground/90">
              {memo.bullCase}
            </p>
          </article>
          <article className="rounded-md border border-signal-red/30 bg-signal-red/5 p-5 sm:p-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-signal-red">
              bear case
            </div>
            <p className="mt-3 font-prose text-[15px] leading-[1.7] text-foreground/90">
              {memo.bearCase}
            </p>
          </article>
        </div>
      </section>

      {/* === 03 · Scorecard === */}
      <section id="s03" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow num="03" label={`scorecard · ${run.rubricVersion}`} />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          Sub-scores · 11 dimensions
        </h2>
        <div className="mt-5 overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[1.4fr_70px_2fr] items-center gap-5 border-b border-border bg-muted/30 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <div>Dimension</div>
            <div className="text-right">Score</div>
            <div>Read</div>
          </div>
          {scoring.map((c) => (
            <div
              key={c.name}
              className="grid grid-cols-[1.4fr_70px_2fr] items-center gap-5 border-b border-border px-5 py-3 last:border-b-0"
            >
              <div className="font-sans text-sm text-foreground">
                {RUBRIC_LABELS[c.name] ?? c.name}
              </div>
              <div
                className={[
                  "text-right font-mono text-sm font-bold tabular-nums",
                  scoreColor(c.score),
                ].join(" ")}
              >
                {c.score}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={["h-full rounded-full", scoreBar(c.score)].join(
                    " "
                  )}
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === 04 · Anti-pattern objections === */}
      <section id="s04" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow
          num="04"
          label="named objections · catalog-anchored"
        />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          {run.objections.length} anti-patterns Scott would flag
        </h2>
        <div className="mt-5 space-y-4">
          {run.objections.map((o) => (
            <article
              key={o.id}
              className="rounded-md border border-border bg-card/40 p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {o.antiPatternKey ?? "custom"}
                  {o.relatedSlide ? ` · slide ${o.relatedSlide}` : ""}
                </div>
                <SeverityBadge severity={o.severity} />
              </div>
              <h3 className="mt-2 font-prose text-lg font-semibold text-foreground">
                {o.title}
              </h3>
              <blockquote className="mt-3 border-l-2 border-brand-gold/60 pl-4 font-prose italic leading-snug text-foreground/90">
                &ldquo;{o.objection}&rdquo;
              </blockquote>
              {o.sourceQuote && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  evidence · &ldquo;{o.sourceQuote}&rdquo;
                </p>
              )}
              <p className="mt-4 max-w-2xl font-prose text-[15px] leading-[1.7] text-foreground/85">
                {o.howToAddress}
              </p>
              <div className="mt-4">
                <AskCoachButton
                  primingPrompt={`How do I address the ${o.antiPatternKey ?? "custom"} objection — "${o.title}"?`}
                >
                  ✸ ask coach how to address →
                </AskCoachButton>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* === 05 · Slide-by-slide teardown · rail + detail · citation jump targets === */}
      <section id="s05" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow
          num="05"
          label="slide-by-slide teardown · click [slide N] in the memo or any thumb"
        />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          The deck, slide by slide
        </h2>
        <SlideTeardown
          slides={extractedSlides}
          reviews={run.slideReviews}
          companyName={run.deck.project.companyName}
        />
      </section>

      {/* === 06 · What would need to be true === */}
      <section id="s06" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow num="06" label="what would need to be true" />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          What turns this into a yes
        </h2>
        <p className="mt-2 max-w-2xl font-prose text-[15px] leading-[1.7] text-muted-foreground">
          Each item is achievable inside the round-close window. Land
          these, the deck graduates from{" "}
          {run.report.meetingLikelihood.toLowerCase().replace(/_/g, " ")} to
          lead-able.
        </p>
        <ol className="mt-5 overflow-hidden rounded-md border border-border">
          {run.report.whatWouldNeedToBeTrue.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[42px_1fr] items-start gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              <span className="font-mono text-[11px] font-bold tabular-nums text-brand-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-prose text-[15px] leading-[1.65] text-foreground/90">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* === 07 · Diligence === */}
      <section id="s07" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow num="07" label="diligence · before IC" />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          What we&rsquo;d want before IC
        </h2>
        <div className="mt-5 space-y-3">
          {run.diligence.map((d, i) => (
            <article
              key={d.id}
              className="grid grid-cols-[42px_1fr] gap-4 border-b border-border pb-4 last:border-b-0"
            >
              <span className="font-mono text-[11px] font-bold tabular-nums text-brand-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-sans text-sm font-semibold text-foreground">
                  {d.request}
                </div>
                <div className="mt-1.5 max-w-2xl font-prose text-[14px] leading-[1.7] text-foreground/80">
                  {d.whyItMatters}
                </div>
                <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {d.category} · {d.priority} · owner {d.ownerRole ?? "—"}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* === 08 · Investor lens · same deck through different archetypes === */}
      <section id="s08" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow
          num="08"
          label="investor lens simulator · same deck, different archetype"
        />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          Pick the right partner before sending
        </h2>
        <InvestorLens
          baseScore={run.report.fundabilityScore}
          detectedAntiPatternKeys={run.antiPatternDetections.map(
            (d) => d.antiPatternKey
          )}
          fullText={extractedSlides.map((s) => s.rawText).join(" ")}
        />
      </section>

      {/* === 09 · Q&A rehearsal · partner-voiced questions, click to expand === */}
      <section id="s09" className="mt-12 scroll-mt-14 sm:mt-16">
        <SectionEyebrow
          num="09"
          label="q&a rehearsal · the questions a partner will ask in the room"
        />
        <h2 className="mt-3 font-prose text-2xl font-semibold tracking-tight text-foreground">
          Walk in ready for these
        </h2>
        <QARehearsal
          objections={run.objections.map((o) => ({
            antiPatternKey: o.antiPatternKey,
            title: o.title,
            objection: o.objection,
            whyItMatters: o.whyItMatters,
            howToAddress: o.howToAddress,
            evidenceRequired: o.evidenceRequired,
          }))}
        />
      </section>

      {/* Footer meta */}
      <footer className="mt-20 border-t border-border/50 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>
            {run.modelProvider} provider · prompt v0.2 ·{" "}
            {memo.voiceMarkers.signatureOpenUsed
              .replace(":", "")
              .toLowerCase()}{" "}
            open
          </span>
          <span>
            {run.objections.length} obj · {run.recommendations.length} recs ·{" "}
            {run.diligence.length} dilig · {run.slideReviews.length} slides
          </span>
        </div>
      </footer>
    </main>
  );
}

function inferPurposeFromTitle(
  title: string,
  slideNum: number,
  total: number
): string {
  const t = title.toLowerCase();
  if (slideNum === 1) return "title";
  if (t.includes("team") || t.includes("founder")) return "team";
  if (t.includes("market") || t.includes("tam") || t.includes("size")) return "market";
  if (t.includes("traction") || t.includes("growth") || t.includes("revenue") || t.includes("arr")) return "traction";
  if (t.includes("ask") || t.includes("raise") || t.includes("round")) return "ask";
  if (t.includes("problem") || t.includes("pain") || t.includes("challenge")) return "problem";
  if (t.includes("solution") || t.includes("product") || t.includes("platform")) return "solution";
  if (t.includes("business model") || t.includes("monetiz") || t.includes("pricing")) return "business_model";
  if (t.includes("why now") || t.includes("timing") || t.includes("tailwind")) return "why_now";
  if (t.includes("competition") || t.includes("competitive") || t.includes("landscape")) return "competition";
  if (t.includes("defensib") || t.includes("moat")) return "defensibility";
  if (t.includes("gtm") || t.includes("go-to-market") || t.includes("sales")) return "gtm";
  if (t.includes("use of fund") || t.includes("allocation")) return "use_of_funds";
  if (t.includes("wedge") || t.includes("beachhead")) return "wedge";
  if (slideNum >= total - 1) return "ask";
  return "problem";
}

function SectionEyebrow({ num, label }: { num: string; label: string }) {
  return (
    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
      <span className="text-brand-gold">{num}</span>
      <span className="mx-2 text-border">·</span>
      <span>{label}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-card/60 px-5 py-4">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className={[
          "mt-2 font-mono text-2xl font-bold tabular-nums",
          valueClass ?? "text-foreground",
        ].join(" ")}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {sub}
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const palette =
    severity === "VERY_HIGH" || severity === "HIGH"
      ? "border-signal-red/40 bg-signal-red/10 text-signal-red"
      : severity === "MEDIUM"
      ? "border-brand-gold/40 bg-brand-gold/10 text-brand-gold"
      : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={[
        "rounded-sm border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]",
        palette,
      ].join(" ")}
    >
      {severity.toLowerCase().replace("_", " ")}
    </span>
  );
}
