"use client";

import Link from "next/link";
import { AskedRecently } from "./AskedRecently";
import { useWatchHistory } from "@/lib/state/watch-history";
import { useJourney, useHasAssessment } from "@/lib/state/journey";
import { getStage } from "@/lib/content/journey-stages";
import type { JourneyStageNumber } from "@/lib/content/journey-stages";

type Props = {
  hasAnyRun: boolean;
};

export function HomeIntro({ hasAnyRun }: Props) {
  const watch = useWatchHistory();
  const isEmpty = !hasAnyRun && watch.length === 0;

  if (isEmpty) return <EmptyStartHere />;
  return <WelcomeStrip />;
}

// ─── Empty state (no runs, no watch history) ────────────────────────────────

function EmptyStartHere() {
  return (
    <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-10">
      <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
        <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
        welcome · black dog venture platform
      </div>
      <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        The private platform Scott built to coach founders on the path to fundable.
      </h1>
      <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
        Score your deck against the partner rubric, work through the content
        his portfolio companies get in IC prep, and use the Coach to
        pressure-test your narrative. The three-minute readiness assessment
        routes everything — content, Coach mode, and scoring — to where you
        actually are.
      </p>

      {/* Mobile: assessment dominant, two secondary actions below */}
      <div className="mt-7 sm:hidden">
        <Link
          href="/assessment"
          className="flex w-full items-center justify-between rounded-xl bg-brand-gold px-5 py-4 transition hover:bg-brand-gold-2 active:scale-[0.98]"
        >
          <div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#0a1410]/60">
              start here · 3 min
            </div>
            <div className="mt-1 font-serif text-lg font-semibold text-[#0a1410]">
              Take the readiness assessment
            </div>
          </div>
          <span className="ml-4 text-xl font-bold text-[#0a1410]">→</span>
        </Link>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/pitchos"
            className="flex flex-col rounded-xl border border-border/80 bg-card/40 p-4 transition hover:border-brand-gold/40"
          >
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              2 sec
            </div>
            <div className="mt-1.5 font-serif text-sm font-semibold leading-tight text-foreground">
              Score a pitch deck
            </div>
          </Link>
          <Link
            href="/library"
            className="flex flex-col rounded-xl border border-border/80 bg-card/40 p-4 transition hover:border-brand-gold/40"
          >
            <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              browse
            </div>
            <div className="mt-1.5 font-serif text-sm font-semibold leading-tight text-foreground">
              Open the library
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop: 3-column grid, assessment primary */}
      <div className="mt-7 hidden grid-cols-3 gap-4 sm:grid">
        <PathCard
          eyebrow="01 · start here · 3 min"
          title="Take the readiness assessment"
          blurb="Eight questions across four dimensions — routes content, Coach mode, and scoring to the stage you're actually at."
          href="/assessment"
          accent="green"
          primary
        />
        <PathCard
          eyebrow="02 · two seconds"
          title="Score a pitch deck"
          blurb="Drop a PDF; PitchOS returns a partner-grade memo in Scott's voice with five anti-pattern callouts."
          href="/pitchos"
          accent="gold"
        />
        <PathCard
          eyebrow="03 · browse"
          title="Open the library"
          blurb="Real Scott assets — videos, podcast episodes, term sheets, and decks — auto-tagged by rubric dimension."
          href="/library"
          accent="sage"
        />
      </div>
    </section>
  );
}

type PathCardProps = {
  eyebrow: string;
  title: string;
  blurb: string;
  href: string;
  accent: "gold" | "green" | "sage";
  primary?: boolean;
};

function PathCard({ eyebrow, title, blurb, href, accent, primary }: PathCardProps) {
  const accentText =
    accent === "gold"
      ? "text-brand-gold"
      : accent === "green"
        ? "text-brand-green"
        : "text-muted-foreground";
  const border = primary
    ? "border-brand-green/40 hover:border-brand-green/70 shadow-[0_8px_24px_rgba(16,185,129,0.10)]"
    : "border-border/80 hover:border-brand-gold/40";
  const cta = primary
    ? "bg-brand-gold text-[#0a1410] hover:bg-brand-gold-2"
    : "border border-border/80 text-foreground hover:border-brand-gold/40";

  return (
    <Link
      href={href}
      className={[
        "group flex flex-col rounded-xl border bg-card/40 p-5 transition hover:-translate-y-0.5",
        border,
      ].join(" ")}
    >
      <div className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${accentText}`}>
        {eyebrow}
      </div>
      <h3 className="mt-2 font-serif text-xl font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
        {blurb}
      </p>
      <span
        className={[
          "mt-4 inline-flex items-center gap-2 self-start rounded-md px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition",
          cta,
        ].join(" ")}
      >
        Start →
      </span>
    </Link>
  );
}

// ─── Returning-user welcome strip ───────────────────────────────────────────

// Per-stage hero headlines — punchy, action-oriented.
const STAGE_HEADLINES: Record<JourneyStageNumber, string> = {
  1: "Twenty conversations before a single slide.",
  2: "One paying pilot changes everything.",
  3: "Tighten the deck. Score it before the room.",
  4: "Open the round. Run the list. Close the heat.",
  5: "Quarterly cadence, Series A bridge, clean data.",
};

function WelcomeStrip() {
  const journey = useJourney();
  const hasAssessment = useHasAssessment();

  // Has activity but no assessment — prompt without faking a stage
  if (!hasAssessment) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
            stage not set · take the assessment
          </div>
          <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Personalize your dashboard. Three minutes.
          </h1>
          <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
            Content recommendations, Coach routing, and scoring all weight to
            the stage you&apos;re actually at. Right now everything defaults to
            generic — the assessment fixes that.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              Take the assessment →
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
            >
              Open library
            </Link>
          </div>
        </section>
        <AskedRecently />
      </div>
    );
  }

  // Has assessment — show their actual stage data
  const stageData = getStage(journey!.stage);
  const coachMode =
    journey!.stage <= 1
      ? "discovery"
      : journey!.stage <= 2
        ? "structuring"
        : "sharpening";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
          <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
          stage {journey!.stage} of 5 · {journey!.stageName} · {coachMode} mode
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {STAGE_HEADLINES[journey!.stage]}
        </h1>
        <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
          {stageData.blurb}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/pitchos"
            className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Score a deck →
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
          >
            Open library
          </Link>
        </div>
      </section>
      <AskedRecently />
    </div>
  );
}
