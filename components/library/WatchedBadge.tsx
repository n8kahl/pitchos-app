"use client";

import { useWatchEntry } from "@/lib/state/watch-history";

export function WatchedBadge({ clipId }: { clipId: string }) {
  const entry = useWatchEntry(clipId);
  if (!entry) return null;

  const isComplete = entry.progressPct >= 90;

  return (
    <div
      className={[
        "absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em]",
        isComplete
          ? "bg-brand-green/20 text-brand-green"
          : "bg-brand-gold/20 text-brand-gold",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isComplete ? "bg-brand-green" : "bg-brand-gold",
        ].join(" ")}
      />
      {isComplete ? "watched" : `${entry.progressPct}% in`}
    </div>
  );
}
