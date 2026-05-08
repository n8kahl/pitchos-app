"use client";

import Link from "next/link";
import { AskedRecently } from "./AskedRecently";
import { useWatchHistory } from "@/lib/state/watch-history";

// Renders one of two intro blocks based on whether the user has any
// signal yet:
//
// - Empty (no analysis runs from server, no watch history in
//   localStorage) → a "Pick where to start" hero with three path
//   cards. The user lands knowing exactly what to do next.
// - Has signal → the existing welcome strip + AskedRecently row.
//
// hasAnyRun is server-derived (from a count query in app/page.tsx) so
// the empty branch can SSR correctly even before the client knows
// about localStorage.

type Props = {
  hasAnyRun: boolean;
};

export function HomeIntro({ hasAnyRun }: Props) {
  const watch = useWatchHistory();
  const isEmpty = !hasAnyRun && watch.length === 0;

  if (isEmpty) return <EmptyStartHere />;
  return <WelcomeStrip />;
}

function EmptyStartHere() {
  return (
    <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-10">
      <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
        <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
        welcome to black dog · pick where to start
      </div>
      <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        Three ways in. Take whichever matches your week.
      </h1>
      <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
        Black Dog is the platform Scott runs his founder coaching from.
        Score a deck against the partner rubric, learn from the corpus,
        or take the readiness assessment to see which stage to focus on
        first.
      </p>
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        <PathCard
          eyebrow="01 · five minutes"
          title="Take the readiness assessment"
          blurb="Eight questions tells you the stage you're at and the rubric dimensions to sharpen first."
          href="/assessment"
          accent="green"
        />
        <PathCard
          eyebrow="02 · two seconds"
          title="Score a pitch deck"
          blurb="Drop a PDF; PitchOS returns a partner-grade memo in Scott's voice with five anti-pattern callouts."
          href="/pitchos"
          accent="gold"
          primary
        />
        <PathCard
          eyebrow="03 · browse · no commitment"
          title="Open the library"
          blurb="Twenty-three real Scott assets — videos, podcast episodes, term sheets, and decks — auto-tagged by rubric dimension."
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
      : "text-sage";
  const border = primary
    ? "border-brand-gold/50 hover:border-brand-gold/80 shadow-[0_8px_24px_rgba(245,200,66,0.12)]"
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

function WelcomeStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
          <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
          stage 3 of 5 · pitch-ready · sharpening mode
        </div>
        <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Tighten the wedge. Ship the next pilot. Sharpen for IC.
        </h1>
        <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
          Three moves move your fundability score the most this week. The
          Coach runs in <em className="font-medium text-foreground">sharpening mode</em> at
          stage 3; the clips below are routed to your weakest rubric
          dimension.
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
