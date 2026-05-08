"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LibraryResource } from "@/lib/content/resources";
import type { RubricCategory } from "@/lib/ai/anti-patterns";

// Generated podcast view · two phases:
//   1. generating · four-stage progress animation (synthesize voice,
//      extract key insights, build chapter markers, master audio)
//   2. player · mock audio player with chapter list, play/pause/skip
//      controls, "add to playlist" CTA
//
// No real audio behind this · the demo signal is the flow itself. When
// real TTS lands, the `playing` state becomes a connected audio
// element and chapter clicks seek the audio.

type Props = {
  resourceId: string;
  resourceTitle: string;
  resourceSource: string;
  coverEyebrow: string;
  coverTitle: string;
  coverAccent: LibraryResource["coverAccent"];
  blurb: string;
  rubricDims: RubricCategory[];
  autoGenerate: boolean;
};

const GENERATION_STEPS = [
  { label: "Synthesizing Scott narrator voice", durationMs: 900 },
  { label: "Extracting key insights from the source", durationMs: 1100 },
  { label: "Building chapter markers", durationMs: 900 },
  { label: "Mastering audio · ducking · level matching", durationMs: 700 },
];

const ACCENT_GRADIENT: Record<LibraryResource["coverAccent"], string> = {
  gold: "from-[#1a2218] via-[#1c2a1c] to-[#2a3520]",
  green: "from-[#11201a] via-[#143025] to-[#1c4030]",
  sage: "from-[#101a13] via-[#16241a] to-[#202f18]",
};

const ACCENT_TEXT: Record<LibraryResource["coverAccent"], string> = {
  gold: "text-brand-gold",
  green: "text-brand-green",
  sage: "text-sage",
};

type Chapter = { at: string; durSec: number; title: string };

// Build five plausible chapters from the resource metadata. Keeps the
// mock consistent across resources so each one feels distinct without
// pretending to read the underlying PDF.
function buildChapters(blurb: string, coverTitle: string): Chapter[] {
  // Pull the first 1-2 noun-ish phrases from the blurb's first sentence
  // for chapter 2 + 3 titles. Fall back to the cover title.
  const first = blurb.split(/[.·]/)[0].trim().slice(0, 56);
  const second =
    blurb.split(/[.·]/)[1]?.trim().slice(0, 56) ?? "Operator vocabulary";

  return [
    { at: "00:00", durSec: 124, title: `Why ${coverTitle.toLowerCase()} matters at seed` },
    { at: "02:04", durSec: 168, title: first || "The framework Scott applies first" },
    { at: "04:52", durSec: 152, title: second || "Where founders typically break this" },
    {
      at: "07:24",
      durSec: 138,
      title: "Three operator moves to make this week",
    },
    {
      at: "09:42",
      durSec: 96,
      title: "Diligence questions partners will ask about it",
    },
  ];
}

function totalDuration(chapters: Chapter[]): string {
  const sec = chapters.reduce((a, c) => a + c.durSec, 0);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function GeneratedPodcastView({
  resourceId,
  resourceTitle,
  resourceSource,
  coverEyebrow,
  coverTitle,
  coverAccent,
  blurb,
  rubricDims,
  autoGenerate,
}: Props) {
  const [phase, setPhase] = useState<"generating" | "player">(
    autoGenerate ? "generating" : "player"
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const chapters = useMemo(() => buildChapters(blurb, coverTitle), [blurb, coverTitle]);
  const totalLen = useMemo(() => totalDuration(chapters), [chapters]);

  useEffect(() => {
    if (phase !== "generating") return;
    if (stepIdx >= GENERATION_STEPS.length) {
      const t = setTimeout(() => setPhase("player"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setStepIdx((i) => i + 1),
      GENERATION_STEPS[stepIdx].durationMs
    );
    return () => clearTimeout(t);
  }, [phase, stepIdx]);

  if (phase === "generating") {
    return (
      <section className="overflow-hidden rounded-xl border border-brand-gold/30 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-10">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
          ★ generating podcast · {resourceSource} · {resourceTitle}
        </div>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          Building the audio version of {coverTitle.toLowerCase()}…
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          The system reads the source, extracts the operator-relevant
          passages, and synthesizes a Scott-voiced narration with chapter
          markers. About 90 seconds of audio for a single-page resource.
        </p>

        <ol className="mt-7 space-y-3">
          {GENERATION_STEPS.map((step, i) => {
            const isDone = i < stepIdx;
            const isCurrent = i === stepIdx;
            return (
              <li
                key={step.label}
                className={[
                  "flex items-center gap-3 rounded-md border px-4 py-3 transition",
                  isDone
                    ? "border-brand-green/30 bg-brand-green/5"
                    : isCurrent
                    ? "border-brand-gold bg-card"
                    : "border-border/60 bg-card/30",
                ].join(" ")}
              >
                <span
                  className={[
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold",
                    isDone
                      ? "border-brand-green bg-brand-green text-background"
                      : isCurrent
                      ? "border-brand-gold text-brand-gold"
                      : "border-border text-muted-foreground",
                  ].join(" ")}
                >
                  {isDone ? "✓" : isCurrent ? "·" : ""}
                </span>
                <span
                  className={[
                    "text-[14px]",
                    isCurrent ? "text-brand-gold" : "text-foreground/85",
                  ].join(" ")}
                >
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-gold" />
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          mock pipeline · real TTS + retrieval lands when phase 9 ships
        </div>
      </section>
    );
  }

  // === player phase ===
  const active = chapters[activeChapterIdx];

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-border/80 bg-card/40">
        <div
          className={[
            "relative grid grid-cols-[120px_1fr] items-stretch gap-5 p-5 sm:grid-cols-[180px_1fr] sm:p-6",
            `bg-gradient-to-br ${ACCENT_GRADIENT[coverAccent]}`,
          ].join(" ")}
        >
          {/* Cover */}
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,200,66,0.15),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(60,169,74,0.10),transparent_60%)]" />
            <div className="absolute inset-x-3 top-3 font-mono text-[8px] font-bold uppercase tracking-[0.18em] sm:text-[9px]">
              <span className={ACCENT_TEXT[coverAccent]}>{coverEyebrow}</span>
            </div>
            <div className="absolute inset-x-3 bottom-3 font-serif text-base font-semibold leading-[1.05] text-foreground sm:text-xl">
              {coverTitle}
            </div>
            <span className="absolute right-3 top-3 rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-tight text-foreground">
              MP3
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-col justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                ai-generated podcast · scott narrator voice
              </div>
              <h1 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
                {resourceTitle}
              </h1>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                source · {resourceSource} · {totalLen} runtime ·{" "}
                {chapters.length} chapters
              </div>
            </div>

            {/* Mock player controls */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums text-muted-foreground">
                <span className="text-foreground/85">{active.at}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-brand-gold"
                    style={{
                      width: `${((activeChapterIdx + 1) / chapters.length) * 100}%`,
                    }}
                  />
                </div>
                <span>{totalLen}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveChapterIdx(Math.max(0, activeChapterIdx - 1))
                  }
                  className="rounded-full border border-border/80 bg-bg-2/80 p-2 transition hover:border-brand-gold/60 hover:text-brand-gold"
                  aria-label="Previous chapter"
                >
                  <Glyph d="M19 19l-8-7 8-7v14zM10 19V5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPlaying((v) => !v)}
                  className="rounded-full bg-brand-gold p-3 text-[#0a1410] transition hover:bg-brand-gold-2"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <Glyph d="M6 4h4v16H6zM14 4h4v16h-4z" filled />
                  ) : (
                    <Glyph d="M8 5v14l11-7z" filled />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveChapterIdx(
                      Math.min(chapters.length - 1, activeChapterIdx + 1)
                    )
                  }
                  className="rounded-full border border-border/80 bg-bg-2/80 p-2 transition hover:border-brand-gold/60 hover:text-brand-gold"
                  aria-label="Next chapter"
                >
                  <Glyph d="M5 5l8 7-8 7V5zM14 5v14" />
                </button>
                <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  chapter {activeChapterIdx + 1} of {chapters.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter list · click to seek */}
        <ol className="border-t border-border/60">
          {chapters.map((c, i) => {
            const isActive = i === activeChapterIdx;
            return (
              <li key={c.at}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChapterIdx(i);
                    setPlaying(true);
                  }}
                  className={[
                    "grid w-full grid-cols-[60px_1fr_auto] items-center gap-4 border-b border-border/60 px-5 py-3 text-left transition last:border-b-0",
                    isActive
                      ? "bg-brand-gold/10"
                      : "hover:bg-card/50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-mono text-[11px] font-semibold tabular-nums",
                      isActive ? "text-brand-gold" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {c.at}
                  </span>
                  <span
                    className={[
                      "text-[14px] leading-snug",
                      isActive ? "text-foreground" : "text-foreground/85",
                    ].join(" ")}
                  >
                    {c.title}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {Math.floor(c.durSec / 60)}:
                    {String(c.durSec % 60).padStart(2, "0")}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Source + actions */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/30 p-5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            source
          </div>
          <div className="mt-2 font-semibold text-foreground">
            {resourceTitle}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {blurb}
          </p>
          <Link
            href={`/library/resources/${resourceId}`}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-border/80 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/85 transition hover:border-brand-gold/40 hover:text-foreground"
          >
            Open the original →
          </Link>
        </div>
        <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            ★ playlist (mock)
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">
            Stack generated podcasts from any resource into a single
            commute-length queue. Real persistence lands with phase 9.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-brand-gold px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Add to playlist →
          </button>
        </div>
      </section>

      {rubricDims.length > 0 && (
        <section className="mt-4">
          <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            rubric dimensions covered
          </div>
          <div className="flex flex-wrap gap-2">
            {rubricDims.map((d) => (
              <span
                key={d}
                className="rounded-md bg-brand-gold/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold"
              >
                {d}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Glyph({ d, filled }: { d: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}
