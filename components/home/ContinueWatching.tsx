"use client";

import Link from "next/link";
import { useWatchHistory } from "@/lib/state/watch-history";
import { getClipById, SHOW_LABELS } from "@/lib/content/sample-clips";

export function ContinueWatching() {
  const history = useWatchHistory();
  if (history.length === 0) return null;

  const recent = history.slice(0, 3);

  return (
    <section className="mt-10 sm:mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            00 · pick up where you left off
          </div>
          <h2 className="mt-2 font-serif text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
            Continue watching ·{" "}
            <em className="font-medium not-italic text-brand-green">
              local resume state
            </em>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {recent.map((entry) => {
          const clip = getClipById(entry.clipId);
          if (!clip) return null;
          return (
            <Link
              key={entry.clipId}
              href={`/library/${clip.id}?t=${entry.position}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-forest to-[#0c1812]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,200,66,0.12),transparent_60%)]" />
                <div className="absolute right-3 top-3 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold tabular-nums text-foreground">
                  {entry.position} · {entry.progressPct}%
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                  <div
                    className="h-full bg-brand-gold"
                    style={{ width: `${entry.progressPct}%` }}
                  />
                </div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {SHOW_LABELS[clip.show]} · {clip.durationMin} min
                </div>
                <div className="mt-2 font-serif text-base font-semibold leading-snug text-foreground">
                  {clip.title}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-gold">
                  resume at {entry.position} →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
