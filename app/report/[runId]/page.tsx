// PitchOS · partner memo · the document Scott reads.
//
// Layout per SDD §21.3: memo is rendered as a *document*, not a card grid.
// Source Serif typography for the prose. Dark `#070a13` substrate. Score
// data and citations in JetBrains Mono. UI chrome in Inter.

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import type { ScoreComponent } from "@/lib/ai/schemas";

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
  if (score >= 75) return "text-signal-cyan";
  if (score >= 60) return "text-signal-amber";
  return "text-signal-red";
}

function scoreBar(score: number): string {
  if (score >= 75) return "bg-signal-cyan";
  if (score >= 60) return "bg-signal-amber";
  return "bg-signal-red";
}

function meetingLikelihoodColor(likelihood: string): string {
  if (likelihood === "STRONG_YES" || likelihood === "YES") return "text-signal-cyan";
  if (likelihood === "MAYBE") return "text-signal-amber";
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

  const scoring = (run.report.keyMetrics as { scoring: { components: ScoreComponent[] } })
    .scoring.components;

  const voicePass =
    memo.voiceMarkers.bannedPhraseHits.length === 0 &&
    memo.voiceMarkers.citedSlideClaims >= 8;

  const memoParas = memo.body.split(/\n\s*\n/);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-10 sm:px-8 sm:pt-14">
      {/* Top nav */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <Link
          href="/"
          className="text-signal-cyan transition hover:text-signal-cyan/80"
        >
          ← upload another deck
        </Link>
        <div className="flex items-center gap-3">
          <span>run {run.id.slice(-10)}</span>
          <span
            className={[
              "rounded-sm border px-2 py-1",
              voicePass
                ? "border-signal-cyan/40 text-signal-cyan"
                : "border-signal-red/40 text-signal-red",
            ].join(" ")}
          >
            {voicePass ? "✓ voice integrity" : "× voice fail"}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="mt-10 border-b border-border/50 pb-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-signal-cyan">
          partner memo · scott · black dog vp
        </div>
        <h1 className="mt-4 font-sans text-5xl font-semibold leading-[1.04] tracking-tight text-foreground">
          {run.deck.project.companyName}
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground">
          {run.report.executiveSummary}
        </p>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          <Stat label="Fundability" value={`${run.report.fundabilityScore}`} sub="/ 100" />
          <Stat
            label="Meeting"
            value={run.report.meetingLikelihood.replace(/_/g, " ")}
            sub={run.report.meetingLikelihood === "MAYBE" ? "with diligence" : ""}
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
            sub={`of 16 in catalog`}
          />
        </div>
      </header>

      {/* Memo body — the document */}
      <section className="mt-14">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          01 · partner memo
        </div>
        <article className="mt-6 font-serif text-[17px] leading-[1.75] text-foreground/95">
          {memoParas.map((para, i) => (
            <p key={i} className="mb-6">
              {renderCitations(para)}
            </p>
          ))}
        </article>
      </section>

      {/* Bull / bear */}
      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          02 · bull / bear
        </div>
        <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
          Investment cases
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-md border border-signal-cyan/30 bg-signal-cyan/5 p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-signal-cyan">
              bull case
            </div>
            <p className="mt-3 font-serif text-[15px] leading-relaxed text-foreground/90">
              {memo.bullCase}
            </p>
          </article>
          <article className="rounded-md border border-signal-red/30 bg-signal-red/5 p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-signal-red">
              bear case
            </div>
            <p className="mt-3 font-serif text-[15px] leading-relaxed text-foreground/90">
              {memo.bearCase}
            </p>
          </article>
        </div>
      </section>

      {/* Score breakdown */}
      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          03 · scorecard · {run.rubricVersion}
        </div>
        <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
          Sub-score breakdown
        </h2>
        <div className="mt-6 overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[1.4fr_70px_2fr] items-center gap-5 border-b border-border bg-muted/30 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
                  "text-right font-mono text-sm font-semibold tabular-nums",
                  scoreColor(c.score),
                ].join(" ")}
              >
                {c.score}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={["h-full rounded-full", scoreBar(c.score)].join(" ")}
                  style={{ width: `${c.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-pattern objections */}
      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          04 · named objections · catalog-anchored
        </div>
        <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
          {run.objections.length} anti-patterns detected
        </h2>
        <p className="mt-2 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Each detection is keyed to one of the 16 patterns in the closed
          catalog. Every detection includes the verbatim slide quote that
          triggered it — no detection without a quote.
        </p>
        <div className="mt-6 space-y-4">
          {run.objections.map((o) => (
            <article
              key={o.id}
              className="rounded-md border border-border bg-card/40 p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {o.antiPatternKey ?? "custom"}
                  {o.relatedSlide ? ` · slide ${o.relatedSlide}` : ""} · {o.severity.toLowerCase().replace("_", " ")}
                </div>
                <SeverityBadge severity={o.severity} />
              </div>
              <h3 className="mt-3 font-sans text-lg font-semibold text-foreground">
                {o.title}
              </h3>
              <blockquote className="mt-4 border-l-2 border-signal-cyan/60 pl-4 font-serif italic text-foreground/90">
                &ldquo;{o.objection}&rdquo;
              </blockquote>
              {o.sourceQuote && (
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  evidence · &ldquo;{o.sourceQuote}&rdquo;
                </p>
              )}
              <p className="mt-4 font-serif text-[15px] leading-relaxed text-foreground/85">
                {o.howToAddress}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* What would need to be true */}
      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          05 · what would need to be true
        </div>
        <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
          The &ldquo;convert this to a yes&rdquo; checklist
        </h2>
        <p className="mt-2 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Each item is achievable inside the round-close window. If the
          founder lands these, the deck graduates from {run.report.meetingLikelihood.toLowerCase().replace(/_/g, " ")} to lead-able.
        </p>
        <ol className="mt-6 space-y-0 overflow-hidden rounded-md border border-border">
          {run.report.whatWouldNeedToBeTrue.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[42px_1fr] items-start gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-serif text-[15px] leading-relaxed text-foreground/90">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Diligence */}
      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          06 · diligence
        </div>
        <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground">
          What we&rsquo;d want before IC
        </h2>
        <div className="mt-6 space-y-3">
          {run.diligence.map((d, i) => (
            <article
              key={d.id}
              className="grid grid-cols-[42px_1fr] gap-4 border-b border-border pb-4 last:border-b-0"
            >
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-sans text-sm font-semibold text-foreground">
                  {d.request}
                </div>
                <div className="mt-2 font-serif text-[14px] leading-relaxed text-foreground/80">
                  {d.whyItMatters}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {d.category} · {d.priority} · owner {d.ownerRole ?? "—"}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Decision callout */}
      <section className="mt-16">
        <div className="rounded-lg border border-signal-cyan/30 bg-gradient-to-br from-signal-cyan/10 via-card to-card p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal-cyan">
            final partner recommendation
          </div>
          <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-foreground">
            {memo.decision.verdict}
          </h2>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-foreground/85">
            {memo.decision.rationale}
          </p>
        </div>
      </section>

      {/* Footer meta */}
      <footer className="mt-20 border-t border-border/50 pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>
            {run.modelProvider} provider · prompt v0.2 ·{" "}
            {memo.voiceMarkers.signatureOpenUsed.replace(":", "").toLowerCase()}
            {" "}open
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
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={[
          "mt-2 font-mono text-2xl font-semibold tabular-nums",
          valueClass ?? "text-foreground",
        ].join(" ")}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
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
      ? "border-signal-amber/40 bg-signal-amber/10 text-signal-amber"
      : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={[
        "rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
        palette,
      ].join(" ")}
    >
      {severity.toLowerCase().replace("_", " ")}
    </span>
  );
}

// Render `[slide N]` citations as monospaced superscripts. Matches the
// citation treatment in 03_sample_memo.html.
function renderCitations(text: string): React.ReactNode {
  const parts = text.split(/(\[slide \d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[slide (\d+)\]$/);
    if (m) {
      return (
        <span
          key={i}
          className="ml-0.5 inline-block translate-y-[-1px] rounded-sm border border-border bg-muted/60 px-1 py-px align-baseline font-mono text-[10px] tabular-nums tracking-tight text-signal-cyan"
        >
          {m[1]}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
