import Link from "next/link";
import { Suspense } from "react";
import { SAMPLE_CLIPS } from "@/lib/content/sample-clips";
import { PODCAST_EPISODES } from "@/lib/content/podcast-episodes";
import { LIBRARY_RESOURCES } from "@/lib/content/resources";
import { AskedRecently } from "@/components/home/AskedRecently";
import { ContinueWatching } from "@/components/home/ContinueWatching";
import { LatestRun, LatestRunSkeleton } from "@/components/home/LatestRun";
import { PodcastCard } from "@/components/library/PodcastCard";
import { ResourceCard } from "@/components/library/ResourceCard";
import { VideoCard } from "@/components/library/VideoCard";

export default function HomePage() {
  // Static rails render immediately; the DB-backed "Latest run" card
  // streams in inside Suspense so first paint is never blocked on
  // analysisRun.findFirst().
  const featured = SAMPLE_CLIPS.find((c) => c.id === "vcfp-2025-05-fmf-decides")!;
  const lessonRail = SAMPLE_CLIPS.slice(1, 4);
  const featuredPodcasts = PODCAST_EPISODES.slice(0, 2);
  const featuredResources = LIBRARY_RESOURCES.slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {/* Welcome / intent strip + Coach prompts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
            stage 3 of 5 · pitch-ready · sharpening mode
          </div>
          <h1 className="font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Tighten the wedge. Ship the next pilot. Sharpen for IC.
          </h1>
          <p className="mt-3 max-w-xl font-serif text-base leading-relaxed text-muted-foreground sm:text-lg">
            Three moves move your fundability score the most this week. The
            Coach runs in <em className="font-medium text-foreground">sharpening mode</em> at
            stage 3; the clips below are routed to your weakest rubric
            dimension.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/pitchos"
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              Score a deck →
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-md border border-border/80 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
            >
              Open library
            </Link>
          </div>
        </section>

        <AskedRecently />
      </div>

      {/* Continue watching · only renders if localStorage has entries */}
      <ContinueWatching />

      {/* Today's read · featured clip · real YouTube thumbnail backs the hero */}
      <section className="mt-10 sm:mt-12">
        <SectionRow
          eyebrow="01 · today's read · stage-routed"
          title="Why founder-market fit "
          titleEm="decides every memo"
          right={`${featured.show} · ${featured.durationMin} min`}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Link
            href={`/library/${featured.id}`}
            className="group block overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:border-brand-gold/40"
          >
            <div className="relative aspect-[16/9] bg-gradient-to-br from-forest to-[#0c1812]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${featured.youtubeId}/hqdefault.jpg`}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
              <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between sm:inset-x-6 sm:bottom-6">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                    {featured.show}
                  </div>
                  <div className="mt-2 max-w-md font-serif text-2xl font-semibold leading-[1.05] text-foreground sm:text-3xl">
                    {featured.title}
                  </div>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition group-hover:scale-105 sm:h-14 sm:w-14">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute right-4 top-4 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold tracking-tight text-foreground sm:right-5 sm:top-5">
                {featured.durationMin} min
              </div>
            </div>
            <div className="border-t border-border/60 px-5 py-4 sm:px-6 sm:py-5">
              <p className="max-w-prose font-serif text-[15px] leading-[1.7] text-foreground/90">
                {featured.aiSummary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
                <span className="text-muted-foreground">tagged ·</span>
                {featured.rubricDims.map((d) => (
                  <span
                    key={d}
                    className="rounded-sm bg-brand-gold/10 px-2 py-0.5 text-brand-gold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          <aside className="rounded-xl border border-border/80 bg-card/40 p-5 sm:p-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              ai chapters · auto-extracted
            </div>
            <ol className="mt-4 space-y-3.5">
              {featured.chapters.map((c, i) => (
                <li key={c.at} className="grid grid-cols-[44px_1fr] gap-2.5">
                  <Link
                    href={`/library/${featured.id}?t=${c.at}`}
                    className="font-mono text-[11px] font-bold tabular-nums text-brand-gold hover:text-brand-gold-2"
                  >
                    {c.at}
                  </Link>
                  <div>
                    <div className="font-serif text-sm font-semibold leading-snug text-foreground">
                      {String(i + 1).padStart(2, "0")} · {c.title}
                    </div>
                    <div className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">
                      {c.summary}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              click any timestamp · player seeks on land
            </div>
          </aside>
        </div>
      </section>

      {/* Recommended next · uses the shared VideoCard so thumbnails come
          straight from YouTube · same chrome as the library grid */}
      <section className="mt-10 sm:mt-14">
        <SectionRow
          eyebrow="02 · what scott would have you watch next"
          title="Stage-3 routing · "
          titleEm="weakest-dim first"
          right="re-ranks weekly · live in phase 6"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lessonRail.map((c, idx) => (
            <VideoCard key={c.id} clip={c} idx={idx} />
          ))}
        </div>
      </section>

      {/* Long-form · real podcast appearances */}
      <section className="mt-10 sm:mt-14">
        <SectionRow
          eyebrow="03 · long-form · scott on the road"
          title="Listen on the commute · "
          titleEm="real interviews"
          right={`${PODCAST_EPISODES.length} episode${PODCAST_EPISODES.length === 1 ? "" : "s"} · audio`}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {featuredPodcasts.map((ep) => (
            <PodcastCard key={ep.id} episode={ep} />
          ))}
        </div>
      </section>

      {/* Reference · real PDFs and infographics */}
      <section className="mt-10 sm:mt-14">
        <SectionRow
          eyebrow="04 · reference · pull as you go"
          title="Templates, term sheets, "
          titleEm="and the canonical decks"
          right={`${LIBRARY_RESOURCES.length} resource${LIBRARY_RESOURCES.length === 1 ? "" : "s"}`}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      </section>

      {/* Your raise · last analysis · streams in via Suspense */}
      <section className="mt-10 sm:mt-14">
        <SectionRow eyebrow="05 · your raise" title="Latest " titleEm="PitchOS run" />
        <Suspense fallback={<LatestRunSkeleton />}>
          <LatestRun />
        </Suspense>
      </section>
    </main>
  );
}

function SectionRow({
  eyebrow,
  title,
  titleEm,
  right,
}: {
  eyebrow: string;
  title: string;
  titleEm: string;
  right?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-3">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          {eyebrow}
        </div>
        <h2 className="mt-2 font-serif text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
          {title}
          <em className="font-medium not-italic text-brand-green">{titleEm}</em>
        </h2>
      </div>
      {right && (
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {right}
        </div>
      )}
    </div>
  );
}
