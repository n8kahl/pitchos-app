"use client";

import { useEffect, useRef, useState } from "react";
import type { PodcastEpisode } from "@/lib/content/podcast-episodes";
import { recordVisit } from "@/lib/state/watch-history";

type Props = {
  episode: PodcastEpisode;
  initialT?: string;
};

// Apple Podcasts iframe embed pattern. Apple's player respects
// /us/podcast/<anything>/id<collectionId>?i=<episodeId> and renders the
// episode-specific player.
function appleEmbedUrl(collectionId: string, episodeId: string): string {
  return `https://embed.podcasts.apple.com/us/podcast/scott-kelly/id${collectionId}?i=${episodeId}`;
}

// Spotify iframe pattern. The episode ID alone gets a clean embed.
function spotifyEmbedUrl(episodeId: string): string {
  return `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`;
}

export function PodcastEmbed({ episode, initialT }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [seekToast, setSeekToast] = useState<string | null>(null);
  const [t] = useState<string | undefined>(initialT);

  // Track listens the same way clips track views.
  useEffect(() => {
    recordVisit(episode.id, episode.durationMin, t);
  }, [episode.id, episode.durationMin, t]);

  // Pulse + toast on cued seek (timestamp linking is best-effort —
  // not every podcast player honors `?t=`, but the chrome confirms
  // the user's intent regardless).
  useEffect(() => {
    if (!t) return;
    const el = frameRef.current;
    if (!el) return;
    el.classList.add("memo-cite-pulse");
    setSeekToast(`Cued at ${t}`);
    const t1 = setTimeout(() => el.classList.remove("memo-cite-pulse"), 1400);
    const t2 = setTimeout(() => setSeekToast(null), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [t]);

  const hasApple =
    episode.provider === "apple" &&
    episode.appleCollectionId &&
    episode.appleEpisodeId &&
    episode.appleCollectionId !== "0";
  const hasSpotify =
    episode.provider === "spotify" && episode.spotifyEpisodeId;

  const embedUrl = hasApple
    ? appleEmbedUrl(episode.appleCollectionId!, episode.appleEpisodeId!)
    : hasSpotify
    ? spotifyEmbedUrl(episode.spotifyEpisodeId!)
    : null;

  return (
    <div
      ref={frameRef}
      className="relative overflow-hidden rounded-xl border border-border/80 bg-bg-2 transition"
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={`${episode.show} · ${episode.episodeTitle}`}
          allow="autoplay *; encrypted-media *; clipboard-write"
          loading="lazy"
          className="block h-[180px] w-full border-0 sm:h-[232px]"
        />
      ) : (
        <ListenOnCard episode={episode} />
      )}
      {seekToast && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-md border border-brand-gold/40 bg-bg-2/90 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {seekToast}
        </div>
      )}
    </div>
  );
}

// Fallback for episodes that don't have a working embed pair (e.g.
// Substack-hosted shows). Visually consistent with the embed block —
// the "Listen on" CTA opens the external player in a new tab.
function ListenOnCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <div className="flex items-center gap-5 px-6 py-7">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-forest to-[#0c1812] shadow-inner">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 stroke-brand-gold"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v6a4.5 4.5 0 0 0 9 0V6A4.5 4.5 0 0 0 12 1.5z" />
          <path d="M3.75 11.25v.75a8.25 8.25 0 0 0 16.5 0v-.75" />
          <path d="M12 20.25V22.5" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          podcast · {episode.show}
        </div>
        <div className="mt-1 font-serif text-base font-semibold leading-tight text-foreground">
          {episode.episodeTitle}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          host · {episode.host} · {episode.durationMin} min
        </div>
      </div>
      <a
        href={episode.externalUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="shrink-0 rounded-md bg-brand-gold px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
      >
        Listen →
      </a>
    </div>
  );
}
