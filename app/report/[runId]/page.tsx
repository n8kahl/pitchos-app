// Phase 5 lands here. For now, a minimal report stub renders the persisted
// memo body + score so the demo flow runs end-to-end. Full polished report
// (Source Serif memo as document, score breakdown, objection cards,
// "what would need to be true" checklist) lands in Phase 5.

import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type PageProps = {
  params: Promise<{ runId: string }>;
};

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
    voiceMarkers: {
      signatureOpenUsed: string;
      decisionClose: string;
      citedSlideClaims: number;
      bannedPhraseHits: string[];
    };
  };
  const voicePass =
    memo.voiceMarkers.bannedPhraseHits.length === 0 &&
    memo.voiceMarkers.citedSlideClaims >= 8;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-widest text-signal-cyan hover:text-signal-cyan/80"
      >
        ← upload another deck
      </Link>

      <header className="mt-6 border-b border-border/50 pb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal-cyan">
          partner memo · scott · black dog vp
        </div>
        <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground">
          {run.deck.project.companyName}
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {run.rubricVersion} · {run.partnerProfileVersion} · run {run.id.slice(-8)}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-md border border-border bg-card/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              fundability
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold tabular-nums text-foreground">
              {run.report.fundabilityScore}
              <span className="ml-1 text-sm text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="rounded-md border border-border bg-card/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              meeting likelihood
            </div>
            <div className="mt-2 font-sans text-lg font-semibold text-foreground">
              {run.report.meetingLikelihood.replace(/_/g, " ")}
            </div>
          </div>
          <div className="rounded-md border border-border bg-card/40 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              voice integrity
            </div>
            <div
              className={[
                "mt-2 font-sans text-lg font-semibold",
                voicePass ? "text-signal-cyan" : "text-signal-red",
              ].join(" ")}
            >
              {voicePass ? "✓ pass" : "× fail"}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {memo.voiceMarkers.citedSlideClaims} citations · 0 banned
            </div>
          </div>
        </div>
      </header>

      <article className="prose prose-invert mt-12 max-w-none font-serif text-base leading-relaxed text-foreground">
        {memo.body.split(/\n\s*\n/).map((para, i) => (
          <p key={i} className="mb-5 whitespace-pre-line">
            {para}
          </p>
        ))}
      </article>

      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-cyan">
          what would need to be true
        </div>
        <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-foreground">
          The &ldquo;convert this to a yes&rdquo; checklist
        </h2>
        <ul className="mt-6 space-y-3">
          {run.report.whatWouldNeedToBeTrue.map((item, i) => (
            <li
              key={i}
              className="grid grid-cols-[40px_1fr] gap-3 border-b border-border/50 pb-3 text-foreground"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-cyan">
          named objections · catalog-anchored
        </div>
        <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-foreground">
          {run.objections.length} anti-patterns detected
        </h2>
        <div className="mt-6 space-y-4">
          {run.objections.map((o) => (
            <article
              key={o.id}
              className="rounded-md border border-border bg-card/40 p-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {o.antiPatternKey ?? "custom"} · slide {o.relatedSlide ?? "—"} · {o.severity.toLowerCase().replace("_", " ")}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-signal-cyan">
                  Δ {-(o.severity === "VERY_HIGH" ? 16 : o.severity === "HIGH" ? 12 : o.severity === "MEDIUM" ? 7 : 4)} pts
                </div>
              </div>
              <h3 className="mt-2 font-sans text-base font-semibold text-foreground">
                {o.title}
              </h3>
              <blockquote className="mt-3 border-l-2 border-signal-cyan/60 pl-4 font-serif italic text-foreground/90">
                &ldquo;{o.objection}&rdquo;
              </blockquote>
              {o.sourceQuote && (
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  evidence · &ldquo;{o.sourceQuote}&rdquo;
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {o.howToAddress}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-20 border-t border-border/50 pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>{run.modelProvider} provider · prompt v0.2</span>
          <span>{run.objections.length} objections · {run.recommendations.length} recommendations · {run.diligence.length} diligence items · {run.slideReviews.length} slide reviews</span>
        </div>
      </footer>
    </main>
  );
}
