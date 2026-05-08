"use client";

import Link from "next/link";
import {
  getStage,
  type JourneyStageNumber,
} from "@/lib/content/journey-stages";
import { useCoach } from "@/lib/state/coach";

// Stage hero · renders above library results when /library?stage=N is
// set. Tells the user what the phase is, what to do at it, and gives
// them a one-click path to the matching Coach exchange. The library
// grid below shows the filtered content tagged for the same stage.
//
// Note: this hero deliberately does NOT render the five-stage pager.
// The persistent FounderJourneyStrip at the top of every page already
// shows the journey map · repeating it inside the hero is double
// navigation that confuses what each surface is for.

type Props = {
  stage: JourneyStageNumber;
};

export function StageHero({ stage }: Props) {
  const data = getStage(stage);
  const { open: openCoach } = useCoach();

  return (
    <section className="mb-8 overflow-hidden rounded-xl border border-brand-gold/30 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            stage {stage} of 5 · {data.label.toLowerCase()}
          </div>
          <h1 className="mt-2 text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl">
            {data.label}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {data.blurb}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openCoach({ exchangeId: data.coachExchangeId })}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              Ask the Coach about {data.label.toLowerCase()} →
            </button>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
            >
              Show all stages
            </Link>
          </div>
        </div>

        <aside className="rounded-xl border border-border/80 bg-card/40 p-5 sm:p-6">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            three moves · this stage
          </div>
          <ol className="mt-4 space-y-3.5">
            {data.actions.map((action, i) => (
              <li
                key={action}
                className="grid grid-cols-[28px_1fr] items-start gap-2.5"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gold/15 font-mono text-[10px] font-bold tabular-nums text-brand-gold">
                  {i + 1}
                </span>
                <span className="text-[14px] leading-snug text-foreground/90">
                  {action}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-5 border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            content below filtered to stage {stage}
          </div>
        </aside>
      </div>
    </section>
  );
}
