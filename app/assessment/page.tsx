"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ASSESSMENT_QUESTIONS,
  READINESS_DIMS,
  scoreAssessment,
  type AnswerMap,
  type ReadinessDim,
} from "@/lib/content/assessment";
import { getClipById, SHOW_LABELS } from "@/lib/content/sample-clips";
import { saveJourney, clearJourney } from "@/lib/state/journey";

type Mode = "intro" | "quiz" | "result";

export default function AssessmentPage() {
  const [mode, setMode] = useState<Mode>("intro");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [stepIdx, setStepIdx] = useState(0);

  const total = ASSESSMENT_QUESTIONS.length;
  const current = ASSESSMENT_QUESTIONS[stepIdx];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;

  function pickOption(score: number) {
    const next = { ...answers, [current.id]: score };
    setAnswers(next);
    if (stepIdx < total - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      // last question → show result
      setMode("result");
    }
  }

  function reset() {
    setAnswers({});
    setStepIdx(0);
    setMode("intro");
  }

  if (mode === "intro") return <Intro onStart={() => setMode("quiz")} />;
  if (mode === "result")
    return <Result answers={answers} onRetake={reset} />;

  return (
    <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-6 border-b border-border/40 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-brand-gold">04 · founder readiness</span>
          <span>
            question {stepIdx + 1} of {total}
          </span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-brand-gold transition-[width] duration-300"
            style={{ width: `${((stepIdx + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <article>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green">
          {READINESS_DIMS[current.dim].label}
        </div>
        <h1 className="mt-3 font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
          {current.prompt}
        </h1>
        <p className="mt-3 max-w-prose font-serif text-[14px] italic leading-relaxed text-muted-foreground">
          {current.rationale}
        </p>

        <ul className="mt-6 space-y-2">
          {current.options.map((opt, i) => {
            const selected = answers[current.id] === opt.score;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pickOption(opt.score)}
                  className={[
                    "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition",
                    selected
                      ? "border-brand-gold bg-brand-gold/10"
                      : "border-border/60 bg-card/30 hover:border-brand-gold/40 hover:bg-card/60",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold",
                      selected
                        ? "border-brand-gold bg-brand-gold text-[#0a1410]"
                        : "border-border text-muted-foreground",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 text-[14px] leading-snug text-foreground/90">
                    {opt.label}
                  </span>
                  <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    {opt.score}/10
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
            className="rounded-md border border-border/60 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition hover:bg-muted/40 hover:text-foreground disabled:opacity-40"
          >
            ← back
          </button>
          {stepIdx === total - 1 && allAnswered ? (
            <button
              type="button"
              onClick={() => setMode("result")}
              className="rounded-md bg-brand-gold px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              See results →
            </button>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              tap an option to advance
            </span>
          )}
        </div>
      </article>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          04 · founder readiness · journey rubric v1.0
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Where are you on the path to fundable?
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
          8 questions across four dimensions —{" "}
          <em className="font-medium text-foreground">insight depth</em>,{" "}
          <em className="font-medium text-foreground">traction signal</em>,{" "}
          <em className="font-medium text-foreground">narrative coherence</em>,{" "}
          <em className="font-medium text-foreground">investor readiness</em>.
          Routes you to the right journey stage and the right Coach mode.
          Re-take monthly. Takes about three minutes.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(Object.keys(READINESS_DIMS) as ReadinessDim[]).map((d) => (
          <div
            key={d}
            className="rounded-md border border-border/60 bg-card/30 p-4"
          >
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
              {READINESS_DIMS[d].label}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              maps to · {READINESS_DIMS[d].rubricMap.slice(0, 3).join(" · ")}
              {READINESS_DIMS[d].rubricMap.length > 3 ? " ·…" : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-3 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
        >
          Start the assessment →
        </button>
      </div>
    </main>
  );
}

function Result({
  answers,
  onRetake,
}: {
  answers: AnswerMap;
  onRetake: () => void;
}) {
  const result = useMemo(() => scoreAssessment(answers), [answers]);
  // Persist the stage so the FounderJourneyStrip and any other surface
  // can derive the user's place on the journey from one source of truth.
  useEffect(() => {
    saveJourney(result);
  }, [result]);

  function handleRetake() {
    clearJourney();
    onRetake();
  }

  const weakestLabel = READINESS_DIMS[result.weakestDim].label;
  const weakClipIds = ASSESSMENT_QUESTIONS.filter(
    (q) => q.dim === result.weakestDim
  )
    .flatMap((q) => q.weakDimClips)
    .filter((id, i, arr) => arr.indexOf(id) === i)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          04 · result · journey rubric v1.0
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Stage {result.stage} of 5 · {result.stageName}
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
          Overall readiness · {result.overall.toFixed(1)} / 10. Weakest
          dimension · <span className="font-bold text-foreground">{weakestLabel}</span>.
          The Coach is in{" "}
          <em className="font-medium text-foreground">
            {result.stage <= 1
              ? "discovery"
              : result.stage <= 2
                ? "structuring"
                : "sharpening"}{" "}
            mode
          </em>
          .
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight text-foreground">
          Your readiness scores
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {(Object.keys(READINESS_DIMS) as ReadinessDim[]).map((d) => {
            const score = result.scores[d];
            const isWeakest = d === result.weakestDim;
            return (
              <div
                key={d}
                className={[
                  "rounded-xl border p-5 transition",
                  isWeakest
                    ? "border-signal-red/40 bg-signal-red/5"
                    : "border-border/60 bg-card/30",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {READINESS_DIMS[d].label}
                    {isWeakest && (
                      <span className="ml-2 text-signal-red">· weakest</span>
                    )}
                  </div>
                  <div
                    className={[
                      "font-mono text-2xl font-bold tabular-nums",
                      score >= 7
                        ? "text-brand-green"
                        : score >= 5
                          ? "text-brand-gold"
                          : "text-signal-red",
                    ].join(" ")}
                  >
                    {score.toFixed(1)}
                    <span className="ml-0.5 text-xs text-muted-foreground">
                      /10
                    </span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={[
                      "h-full rounded-full transition-[width] duration-500",
                      score >= 7
                        ? "bg-brand-green"
                        : score >= 5
                          ? "bg-brand-gold"
                          : "bg-signal-red",
                    ].join(" ")}
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  maps to · {READINESS_DIMS[d].rubricMap.slice(0, 2).join(" · ")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          ★ recommended next move
        </div>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {weakestLabel} is your weakest dimension.
        </h3>
        <p className="mt-2 max-w-prose font-serif text-[15px] leading-relaxed text-foreground/85">
          {result.stage <= 2
            ? "Spend the next two weeks on customer interviews and structuring drafts before scoring a deck. The Coach will route you to discovery and structuring content."
            : "The Coach in sharpening mode + a PitchOS run on your current deck will move this score the most before your next IC. Estimated lift "}
          {result.stage > 2 && (
            <>
              <span className="font-bold text-brand-gold">
                +1.4 to +2.1 points
              </span>{" "}
              per full cycle.
            </>
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Open the Coach →
          </Link>
          <Link
            href="/pitchos"
            className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
          >
            Run PitchOS
          </Link>
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 rounded-md border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-muted-foreground hover:text-foreground"
          >
            Re-take
          </button>
        </div>
      </section>

      {weakClipIds.length > 0 && (
        <section>
          <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight text-foreground">
            Watch these on {weakestLabel.toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {weakClipIds.map((id) => {
              const clip = getClipById(id);
              if (!clip) return null;
              return (
                <Link
                  key={id}
                  href={`/library/${id}`}
                  className="flex flex-col rounded-xl border border-border/80 bg-card/40 p-5 transition hover:border-brand-gold/40 hover:bg-card/60"
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {SHOW_LABELS[clip.show]} · {clip.durationMin} min
                  </div>
                  <div className="mt-3 font-serif text-[15px] font-semibold leading-tight tracking-tight text-foreground">
                    {clip.title}
                  </div>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {clip.aiSummary.split(". ")[0]}.
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
