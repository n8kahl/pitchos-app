"use client";

import { useEffect, useRef, useState } from "react";
import { recordVisit } from "@/lib/state/watch-history";

type Props = {
  clipId: string;
  durationMin: number;
  initialT?: string;
  // 11-character YouTube video ID. When set, the frame renders a
  // privacy-enhanced YouTube embed; without it, the legacy stub.
  youtubeId?: string | null;
  title?: string;
};

// Parse "MM:SS" or "HH:MM:SS" into seconds. Used for ?start= on the
// YouTube embed so chapter-link clicks (?t=08:42) seek the player.
function parseTimecode(t: string): number {
  const parts = t.split(":").map((n) => parseInt(n, 10));
  if (parts.some((p) => Number.isNaN(p))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

/**
 * Embedded video player for a clip.
 *
 * - When youtubeId is provided, renders a privacy-enhanced YouTube
 *   iframe. Chapter clicks (?t=08:42) reload the iframe at the new
 *   start time and pulse the frame gold for confirmation.
 * - The visit is recorded on mount and whenever ?t= changes — feeds
 *   the "Continue watching" rail on Home.
 * - Without youtubeId, falls back to the original placeholder.
 */
export function PlayerFrame({
  clipId,
  durationMin,
  initialT,
  youtubeId,
  title,
}: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [seekToast, setSeekToast] = useState<string | null>(null);
  const [t, setT] = useState<string | undefined>(initialT);

  // Record visit on mount + whenever ?t= changes.
  useEffect(() => {
    recordVisit(clipId, durationMin, t);
  }, [clipId, durationMin, t]);

  // Listen to URL param changes via History API.
  useEffect(() => {
    const sync = () => {
      const url = new URL(window.location.href);
      const next = url.searchParams.get("t") ?? undefined;
      if (next !== t) setT(next);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [t]);

  // When t changes, pulse the frame and show toast.
  useEffect(() => {
    if (!t) return;
    const el = frameRef.current;
    if (!el) return;
    el.classList.add("memo-cite-pulse");
    setSeekToast(`Seeking to ${t}`);
    const t1 = setTimeout(() => el.classList.remove("memo-cite-pulse"), 1400);
    const t2 = setTimeout(() => setSeekToast(null), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [t]);

  if (youtubeId) {
    const startSec = t ? parseTimecode(t) : 0;
    const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startSec}&rel=0&modestbranding=1&playsinline=1`;
    return (
      <div
        ref={frameRef}
        className="relative aspect-video overflow-hidden rounded-xl border border-border/80 bg-black transition"
      >
        <iframe
          // Re-mount on t change so the new ?start= takes effect.
          key={`${youtubeId}-${startSec}`}
          src={src}
          title={title ?? "Clip player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
        {seekToast && (
          <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-md border border-brand-gold/40 bg-bg-2/90 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-lg backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            {seekToast}
          </div>
        )}
      </div>
    );
  }

  // Legacy stub · used when a clip lacks a youtubeId (e.g. private mp4).
  return (
    <div
      ref={frameRef}
      className="relative aspect-video overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest to-[#0c1812] transition"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.14),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(245,200,66,0.10),transparent_60%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <button
          aria-label="Play clip"
          className="grid h-20 w-20 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition hover:scale-105"
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {t ? `cued at ${t}` : "embedded player · phase 6 wires R2 + WebVTT"}
        </div>
      </div>

      {seekToast && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-md border border-brand-gold/40 bg-bg-2/90 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {seekToast}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-5 py-3">
        <span className="font-mono text-[11px] tabular-nums text-foreground/85">
          {t ?? "00:00"}
        </span>
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[18%] rounded-full bg-brand-gold" />
          </div>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {String(durationMin).padStart(2, "0")}:00
        </span>
      </div>
    </div>
  );
}
