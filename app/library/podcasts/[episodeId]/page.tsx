import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpisodeById, PODCAST_EPISODES } from "@/lib/content/podcast-episodes";
import { PodcastEmbed } from "@/components/library/PodcastEmbed";

type PageProps = {
  params: Promise<{ episodeId: string }>;
  searchParams: Promise<{ t?: string }>;
};

export function generateStaticParams() {
  return PODCAST_EPISODES.map((e) => ({ episodeId: e.id }));
}

export default async function PodcastEpisodePage({
  params,
  searchParams,
}: PageProps) {
  const { episodeId } = await params;
  const { t } = await searchParams;
  const episode = getEpisodeById(episodeId);
  if (!episode) notFound();

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Breadcrumb */}
      <div className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <Link href="/library" className="text-brand-gold hover:text-brand-gold-2">
          ← library
        </Link>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span>podcasts</span>
        <span className="mx-2 text-muted-foreground/60">/</span>
        <span className="text-foreground">{episode.show}</span>
      </div>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border/40 pb-6">
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            podcast · {episode.show}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
            {episode.episodeTitle}
          </h1>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            host · {episode.host} · {episode.durationMin} min · {episode.publishedAt}
          </div>
        </div>
      </header>

      <PodcastEmbed episode={episode} initialT={t} />

      {/* AI summary */}
      <div className="mt-6 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          ★ AI summary · auto-extracted
        </div>
        <p className="mt-2 font-serif text-[15px] leading-[1.7] text-foreground/90">
          {episode.aiSummary}
        </p>
      </div>

      {/* Tags */}
      <section className="mt-8">
        <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          rubric dimensions covered
        </div>
        <div className="flex flex-wrap gap-2">
          {episode.rubricDims.map((d) => (
            <span
              key={d}
              className="rounded-md bg-brand-gold/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-gold"
            >
              {d}
            </span>
          ))}
        </div>
      </section>

      {/* Listen on external */}
      <section className="mt-8 rounded-xl border border-border/60 bg-card/40 p-5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          original source
        </div>
        <a
          href={episode.externalUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 inline-flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gold hover:text-brand-gold-2"
        >
          Open on {episode.provider === "apple" ? "Apple Podcasts" : "Spotify"} →
        </a>
      </section>
    </main>
  );
}
