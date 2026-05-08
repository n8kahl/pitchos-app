import Link from "next/link";
import type { PodcastEpisode } from "@/lib/content/podcast-episodes";

// Podcast episode card · routes to /library/podcasts/[id] for the
// embed + show notes view. Uses a brand-true gradient cover with the
// show name and host so it visually distinguishes from video cards
// without needing per-show artwork.

export function PodcastCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <Link
      href={`/library/podcasts/${episode.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#11201a] via-[#16241a] to-forest">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,200,66,0.10),transparent_60%),radial-gradient(circle_at_30%_75%,rgba(60,169,74,0.08),transparent_60%)]" />
        <div className="absolute inset-x-5 top-5 flex items-center justify-between">
          <span className="rounded-sm bg-brand-gold/15 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            podcast · audio
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-tight text-foreground/85">
            {episode.durationMin} min
          </span>
        </div>
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {episode.show}
            </div>
            <div className="mt-1 font-serif text-xl font-semibold leading-[1.1] tracking-tight text-foreground">
              {episode.episodeTitle}
            </div>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition group-hover:scale-105">
            {/* mic glyph · matches the embed page */}
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v6a4.5 4.5 0 0 0 9 0V6A4.5 4.5 0 0 0 12 1.5z" />
              <path d="M3.75 11.25v.75a8.25 8.25 0 0 0 16.5 0v-.75" />
              <path d="M12 20.25V22.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-5 py-4 sm:px-6 sm:py-5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          host · {episode.host}
        </div>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {episode.aiSummary.split(". ")[0]}.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
          {episode.rubricDims.slice(0, 2).map((d) => (
            <span
              key={d}
              className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 text-brand-gold"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
