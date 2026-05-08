"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  JOURNEY_STAGES,
  getStage,
  type JourneyStageNumber,
} from "@/lib/content/journey-stages";

// Persistent founder-journey strip · sits below the TopBar and shows
// the five-stage map every founder is on, with the current stage
// highlighted. Click a stage to filter the library to clips routed
// for that stage. The "next move" hint at the right tells the user
// what to do at the current stage so the platform stops feeling
// open-ended.
//
// Stage state is hardcoded to 3 for now — same as the existing chrome
// pill — pending real derivation from the user's run history. Surfaces
// where the strip would compete with vertical chrome (clip / podcast /
// resource detail pages) opt out via the HIDDEN_PREFIXES list.

// Hide on clip / podcast / resource detail pages — they have their own
// breadcrumb and the strip would compete for the same vertical space.
const HIDDEN_PREFIXES = ["/library/", "/runs/", "/report/"];

export function FounderJourneyStrip() {
  const pathname = usePathname();
  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));
  if (hidden) return null;

  // TODO: derive from real run history once stage detection lands.
  const currentStage: JourneyStageNumber = 3;
  const next = getStage(currentStage);

  return (
    <div
      className="border-b border-border/60 bg-bg-2/60 backdrop-blur"
      style={{ viewTransitionName: "founder-journey-strip" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-2 sm:px-8">
        <span className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground md:inline">
          founder journey
        </span>

        <ol className="flex flex-1 items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {JOURNEY_STAGES.map((s, i) => {
            const isCurrent = s.n === currentStage;
            const isPast = s.n < currentStage;
            return (
              <li key={s.key} className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/library?stage=${s.n}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={[
                    "group flex items-center gap-1.5 rounded-full px-2.5 py-1 transition",
                    isCurrent
                      ? "bg-brand-gold/15 ring-1 ring-brand-gold/40"
                      : isPast
                      ? "hover:bg-muted/30"
                      : "hover:bg-muted/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-4 w-4 shrink-0 place-items-center rounded-full font-mono text-[9px] font-bold tabular-nums",
                      isCurrent
                        ? "bg-brand-gold text-[#0a1410]"
                        : isPast
                        ? "bg-brand-green/20 text-brand-green"
                        : "border border-border bg-transparent text-muted-foreground",
                    ].join(" ")}
                  >
                    {isPast ? "✓" : s.n}
                  </span>
                  <span
                    className={[
                      "font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition",
                      isCurrent
                        ? "text-brand-gold"
                        : isPast
                        ? "text-foreground/70 group-hover:text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    ].join(" ")}
                  >
                    {s.label}
                  </span>
                </Link>
                {i < JOURNEY_STAGES.length - 1 && (
                  <span
                    aria-hidden
                    className={[
                      "h-px w-3 shrink-0 sm:w-5",
                      s.n < currentStage ? "bg-brand-green/40" : "bg-border/60",
                    ].join(" ")}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Next move · the actionable hint */}
        <div className="hidden shrink-0 items-center gap-2 border-l border-border/60 pl-3 lg:flex">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            next ·
          </span>
          <span className="text-[12px] text-foreground/85">{next.shortHint}</span>
        </div>
      </div>
    </div>
  );
}
