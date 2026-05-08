"use client";

import { useEffect, useMemo, useState } from "react";
import type { SlideReview as DbSlideReview } from "@/lib/prisma/generated/client";

type ExtractedSlide = {
  slideNumber: number;
  inferredTitle: string;
  purpose: string;
  rawText: string;
};

type Severity = "red" | "amber" | "green";

type Props = {
  slides: ExtractedSlide[];
  reviews: DbSlideReview[];
  companyName: string;
};

function severityFor(review: DbSlideReview | undefined): Severity {
  if (!review) return "green";
  const min = Math.min(
    review.clarityScore,
    review.evidenceScore,
    review.investorImpactScore
  );
  if (min < 50) return "red";
  if (min < 65) return "amber";
  return "green";
}

function scoreColor(score: number): string {
  if (score >= 75) return "text-brand-green";
  if (score >= 60) return "text-brand-gold";
  return "text-signal-red";
}

const PURPOSE_LABEL: Record<string, string> = {
  title: "Cover",
  problem: "Problem",
  market: "Market",
  wedge: "Wedge",
  why_now: "Why now",
  solution: "Solution",
  traction: "Traction",
  business_model: "Business model",
  gtm: "GTM",
  competition: "Competition",
  defensibility: "Defensibility",
  use_of_funds: "Use of funds",
  team: "Team",
  ask: "Ask",
};

export function SlideTeardown({ slides, reviews, companyName }: Props) {
  const reviewsBySlide = useMemo(() => {
    const m = new Map<number, DbSlideReview>();
    for (const r of reviews) m.set(r.slideNumber, r);
    return m;
  }, [reviews]);

  const sorted = useMemo(
    () => [...slides].sort((a, b) => a.slideNumber - b.slideNumber),
    [slides]
  );
  const [activeSlide, setActiveSlide] = useState<number>(
    sorted[0]?.slideNumber ?? 1
  );

  useEffect(() => {
    function onCite(e: Event) {
      const detail = (e as CustomEvent<{ slideNumber: number }>).detail;
      if (detail?.slideNumber) setActiveSlide(detail.slideNumber);
    }
    window.addEventListener("pitchos:slide-cite", onCite);
    return () => window.removeEventListener("pitchos:slide-cite", onCite);
  }, []);

  const activeExtract = sorted.find((s) => s.slideNumber === activeSlide);
  const activeReview = reviewsBySlide.get(activeSlide);
  const totalIssues = sorted.filter(
    (s) => severityFor(reviewsBySlide.get(s.slideNumber)) === "red"
  ).length;

  return (
    <div>
      <p className="mt-2 max-w-2xl font-prose text-[15px] leading-[1.7] text-muted-foreground">
        {sorted.length} slides analyzed ·{" "}
        <span className="text-signal-red">
          {totalIssues} with material issues
        </span>{" "}
        · click any slide to see the teardown
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Thumb rail */}
        <div className="rounded-md border border-border bg-card/40 p-2 lg:max-h-[640px] lg:overflow-y-auto">
          <ul className="space-y-1">
            {sorted.map((s) => {
              const review = reviewsBySlide.get(s.slideNumber);
              const sev = severityFor(review);
              const isActive = s.slideNumber === activeSlide;
              return (
                <li key={s.slideNumber}>
                  <button
                    id={`slide-${s.slideNumber}`}
                    onClick={() => setActiveSlide(s.slideNumber)}
                    className={[
                      "scroll-mt-24 flex w-full cursor-pointer items-center gap-3 rounded-sm border px-2.5 py-2 text-left transition",
                      isActive
                        ? "border-brand-gold/50 bg-brand-gold/5"
                        : "border-transparent hover:border-border hover:bg-card/70",
                    ].join(" ")}
                  >
                    <ThumbCanvas
                      slide={s}
                      companyName={companyName}
                      compact
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {String(s.slideNumber).padStart(2, "0")}
                      </div>
                      <div className="truncate font-sans text-[13px] font-medium text-foreground">
                        {s.inferredTitle}
                      </div>
                    </div>
                    <span
                      aria-hidden
                      className={[
                        "h-2.5 w-2.5 flex-shrink-0 rounded-full",
                        sev === "red"
                          ? "bg-signal-red"
                          : sev === "amber"
                          ? "bg-brand-gold"
                          : "bg-brand-green",
                      ].join(" ")}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Detail pane */}
        <div className="rounded-md border border-border bg-card/40 p-5 sm:p-6">
          {activeExtract ? (
            <>
              <SlidePreview slide={activeExtract} companyName={companyName} />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                    slide {String(activeExtract.slideNumber).padStart(2, "0")} ·{" "}
                    {PURPOSE_LABEL[activeExtract.purpose] ??
                      activeExtract.purpose.replace(/_/g, " ")}
                  </div>
                  <h3 className="mt-1 font-prose text-xl font-semibold text-foreground">
                    {activeReview?.suggestedTitle ??
                      activeReview?.inferredTitle ??
                      activeExtract.inferredTitle}
                  </h3>
                </div>
                {activeReview && (
                  <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums">
                    <span className="text-muted-foreground">clarity</span>
                    <span className={scoreColor(activeReview.clarityScore)}>
                      {activeReview.clarityScore}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">evidence</span>
                    <span className={scoreColor(activeReview.evidenceScore)}>
                      {activeReview.evidenceScore}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">impact</span>
                    <span
                      className={scoreColor(activeReview.investorImpactScore)}
                    >
                      {activeReview.investorImpactScore}
                    </span>
                  </div>
                )}
              </div>

              {!activeReview && (
                <div className="mt-4 rounded-md border border-brand-green/30 bg-brand-green/5 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-brand-green">
                  ✓ Slide cleared the rubric · no material issues flagged
                </div>
              )}

              {activeReview?.sourceQuote && (
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  evidence · &ldquo;{activeReview.sourceQuote}&rdquo;
                </p>
              )}

              {activeReview && activeReview.whatWorks.length > 0 && (
                <div className="mt-4">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">
                    works
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[14px] leading-snug text-foreground/85">
                    {activeReview.whatWorks.map((w, i) => (
                      <li key={i} className="pl-4 -indent-4">
                        · {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeReview && activeReview.issues.length > 0 && (
                <div className="mt-3">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-signal-red">
                    issues
                  </div>
                  <ul className="mt-1.5 space-y-1 text-[14px] leading-snug text-foreground/85">
                    {activeReview.issues.map((iss, i) => (
                      <li key={i} className="pl-4 -indent-4">
                        · {iss}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeReview?.rewriteGuidance && (
                <div className="mt-4 max-w-2xl font-prose text-[14px] italic leading-[1.7] text-foreground/85">
                  {activeReview.rewriteGuidance}
                </div>
              )}

              {activeReview && activeReview.expectedScoreDelta > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-brand-gold/30 bg-brand-gold/5 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                  if rewritten · +{activeReview.expectedScoreDelta} pts projected
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// === CSS-rendered slide mocks · keyed by purpose ===

function SlidePreview({
  slide,
  companyName,
}: {
  slide: ExtractedSlide;
  companyName: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border/60 bg-gradient-to-br from-[#0e1c18] via-[#0a1612] to-[#08120f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <SlideContent slide={slide} companyName={companyName} />
      <div className="absolute bottom-3 right-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/30">
        {String(slide.slideNumber).padStart(2, "0")}
      </div>
    </div>
  );
}

function SlideContent({
  slide,
  companyName,
}: {
  slide: ExtractedSlide;
  companyName: string;
}) {
  const stat = extractStat(slide.rawText);

  switch (slide.purpose) {
    case "title":
      return (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="font-prose text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {companyName}
          </div>
          <div className="mt-3 max-w-md font-prose text-[14px] text-foreground/70">
            {firstSentence(slide.rawText)}
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-brand-gold">
            Seed deck · {new Date().getFullYear()}
          </div>
        </div>
      );
    case "market":
    case "traction":
      return (
        <div className="flex h-full flex-col items-start justify-center px-8">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            {PURPOSE_LABEL[slide.purpose]}
          </div>
          <div className="mt-3 font-prose text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {stat ?? (slide.purpose === "market" ? "$12B" : "$340K")}
          </div>
          <div className="mt-2 font-prose text-[14px] text-foreground/70">
            {firstSentence(slide.rawText)}
          </div>
        </div>
      );
    case "team": {
      const people = extractTeam(slide.rawText);
      return (
        <div className="flex h-full flex-col px-8 py-7">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            Team
          </div>
          <div className="mt-1 font-prose text-2xl font-semibold text-foreground">
            Founders & advisors
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {people.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 font-mono text-[11px] font-bold text-brand-gold">
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-sans text-[13px] font-semibold text-foreground">
                    {p.name}
                  </div>
                  <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {p.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "ask":
      return (
        <div className="flex h-full flex-col items-start justify-center px-8">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            The ask
          </div>
          <div className="mt-3 font-prose text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {extractDollar(slide.rawText) ?? "$3.5M"}
          </div>
          <div className="mt-2 font-prose text-[14px] text-foreground/70">
            {firstSentence(slide.rawText)}
          </div>
        </div>
      );
    case "wedge":
    case "why_now":
    case "solution":
    case "problem":
    case "competition":
    case "defensibility":
    case "gtm":
    case "business_model":
    case "use_of_funds":
    default:
      return (
        <div className="flex h-full flex-col px-8 py-7">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            {PURPOSE_LABEL[slide.purpose] ??
              slide.purpose.replace(/_/g, " ")}
          </div>
          <div className="mt-2 font-prose text-2xl font-semibold leading-tight text-foreground">
            {slide.inferredTitle}
          </div>
          <div className="mt-3 max-w-xl font-prose text-[14px] leading-[1.55] text-foreground/75">
            {truncate(slide.rawText, 240)}
          </div>
        </div>
      );
  }
}

function ThumbCanvas({
  slide,
  companyName,
  compact,
}: {
  slide: ExtractedSlide;
  companyName: string;
  compact?: boolean;
}) {
  const size = compact ? "h-9 w-12" : "h-12 w-16";
  return (
    <div
      className={[
        size,
        "flex flex-shrink-0 items-center justify-center rounded-sm border border-border/40 bg-gradient-to-br from-[#0e1c18] to-[#08120f] font-mono text-[8px] font-bold uppercase tracking-wider text-foreground/40",
      ].join(" ")}
      aria-hidden
    >
      {slide.purpose === "title" ? companyName.slice(0, 3) : slide.purpose.slice(0, 3)}
    </div>
  );
}

// === Tiny extractors over rawText · best-effort, deterministic ===

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/);
  return m ? m[0].trim() : truncate(text, 120);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "…";
}

function extractStat(text: string): string | null {
  const m =
    text.match(/\$[\d.]+[BMK]\s*[A-Za-z]*/) ??
    text.match(/\d+%/) ??
    text.match(/\$[\d,]+/);
  return m ? m[0] : null;
}

function extractDollar(text: string): string | null {
  const m = text.match(/\$[\d.]+[BMK]/);
  return m ? m[0] : null;
}

function extractTeam(
  text: string
): Array<{ initials: string; name: string; title: string }> {
  // Looks for "ROLE: <description>" patterns in the rawText. Falls back to
  // generic founder placeholders if the parse comes up empty so the demo
  // never renders a hollow team slide.
  const roles = [...text.matchAll(/\b(CEO|CTO|COO|CFO|VP[^:]*)\s*:\s*([^.]+)/g)];
  if (roles.length === 0) {
    return [
      { initials: "JD", name: "Jane Doe", title: "Co-founder · CEO" },
      { initials: "SR", name: "Sam Reyes", title: "Co-founder · CTO" },
    ];
  }
  return roles.slice(0, 4).map(([, role, desc]) => {
    const trimmed = desc.trim().replace(/\s+/g, " ");
    const initials = role.length === 3 ? role : role.slice(0, 2).toUpperCase();
    return {
      initials,
      name: roleToName(role),
      title: `${role} · ${truncate(trimmed, 36)}`,
    };
  });
}

function roleToName(role: string): string {
  const map: Record<string, string> = {
    CEO: "Founder",
    CTO: "Co-founder",
    COO: "Operator",
    CFO: "Finance lead",
  };
  return map[role.toUpperCase()] ?? role;
}
