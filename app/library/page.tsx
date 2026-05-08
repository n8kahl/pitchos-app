"use client";

import { Suspense, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SAMPLE_CLIPS, SHOW_LABELS, type SampleClip } from "@/lib/content/sample-clips";
import { PODCAST_EPISODES, type PodcastEpisode } from "@/lib/content/podcast-episodes";
import { LIBRARY_RESOURCES, type LibraryResource } from "@/lib/content/resources";
import type { RubricCategory } from "@/lib/ai/anti-patterns";
import { VideoCard } from "@/components/library/VideoCard";
import { PodcastCard } from "@/components/library/PodcastCard";
import { ResourceCard } from "@/components/library/ResourceCard";
import { HorizontalRail } from "@/components/library/HorizontalRail";
import { StageHero } from "@/components/library/StageHero";
import type { JourneyStageNumber } from "@/lib/content/journey-stages";

const RUBRIC_LABELS: Record<RubricCategory, string> = {
  founderMarketFit: "founder-market fit",
  wedgeClarity: "wedge clarity",
  tractionQuality: "traction quality",
  problemUrgency: "problem urgency",
  gtmRepeatability: "GTM repeatability",
  marketSizingLogic: "market sizing",
  whyNow: "why now",
  businessModel: "business model",
  defensibility: "defensibility",
  deckQuality: "deck quality",
  riskSurface: "risk surface",
};

type SortKey = "newest" | "longest" | "shortest" | "by-show";
type MediaKey = "all" | "videos" | "podcasts" | "resources";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  longest: "Longest",
  shortest: "Shortest",
  "by-show": "By show",
};

const MEDIA_LABELS: Record<MediaKey, string> = {
  all: "All",
  videos: "Videos",
  podcasts: "Podcasts",
  resources: "Resources",
};

const ALL_SHOWS: SampleClip["show"][] = [
  "VC Fast Pitch",
  "Emerging Managers Pod",
  "Smart Startup Growth",
  "BDVP Fireside",
];

const ALL_STAGES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

const ALL_DIMS: RubricCategory[] = [
  "founderMarketFit",
  "wedgeClarity",
  "tractionQuality",
  "problemUrgency",
  "gtmRepeatability",
  "marketSizingLogic",
  "whyNow",
  "businessModel",
  "defensibility",
  "deckQuality",
  "riskSurface",
];

function matchesQueryClip(clip: SampleClip, q: string): boolean {
  const target = [
    clip.title,
    clip.aiSummary,
    ...clip.keyMoments.map((m) => m.quote),
    ...clip.chapters.map((c) => `${c.title} ${c.summary}`),
    ...clip.rubricDims,
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => target.includes(token));
}

function matchesQueryEpisode(ep: PodcastEpisode, q: string): boolean {
  const target = [ep.episodeTitle, ep.show, ep.host, ep.aiSummary, ...ep.rubricDims]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => target.includes(token));
}

function matchesQueryResource(r: LibraryResource, q: string): boolean {
  const target = [r.title, r.source, r.blurb, ...r.rubricDims].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => target.includes(token));
}

export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <LibraryView />
    </Suspense>
  );
}

function LibraryView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const activeDim = (searchParams.get("dim") as RubricCategory | null) ?? null;
  const activeShow = (searchParams.get("show") as SampleClip["show"] | null) ?? null;
  const stageRaw = searchParams.get("stage");
  const activeStage = stageRaw ? Number(stageRaw) : null;
  const sort = (searchParams.get("sort") as SortKey) ?? "newest";
  const media = (searchParams.get("media") as MediaKey | null) ?? "all";

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setQuery = useCallback((q: string) => setParam({ q: q || null }), [setParam]);
  const setActiveDim = useCallback(
    (d: RubricCategory | null) => setParam({ dim: d }),
    [setParam]
  );
  const setActiveShow = useCallback(
    (s: SampleClip["show"] | null) => setParam({ show: s }),
    [setParam]
  );
  const setActiveStage = useCallback(
    (s: number | null) => setParam({ stage: s ? String(s) : null }),
    [setParam]
  );
  const setSort = useCallback(
    (s: SortKey) => setParam({ sort: s === "newest" ? null : s }),
    [setParam]
  );
  const setMedia = useCallback(
    (m: MediaKey) => setParam({ media: m === "all" ? null : m }),
    [setParam]
  );

  // Videos
  const filteredClips = useMemo(() => {
    let list = [...SAMPLE_CLIPS];
    if (activeDim) list = list.filter((c) => c.rubricDims.includes(activeDim));
    if (activeShow) list = list.filter((c) => c.show === activeShow);
    if (activeStage)
      list = list.filter((c) =>
        c.journeyStages.includes(activeStage as 1 | 2 | 3 | 4 | 5)
      );
    if (query.trim()) list = list.filter((c) => matchesQueryClip(c, query.trim()));

    switch (sort) {
      case "newest":
        list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        break;
      case "longest":
        list.sort((a, b) => b.durationMin - a.durationMin);
        break;
      case "shortest":
        list.sort((a, b) => a.durationMin - b.durationMin);
        break;
      case "by-show":
        list.sort((a, b) => a.show.localeCompare(b.show));
        break;
    }
    return list;
  }, [query, activeDim, activeShow, activeStage, sort]);

  // Podcasts (show filter does not apply — podcasts have hosts, not shows
  // from the rubric's enum)
  const filteredEpisodes = useMemo(() => {
    let list = [...PODCAST_EPISODES];
    if (activeDim) list = list.filter((e) => e.rubricDims.includes(activeDim));
    if (activeStage)
      list = list.filter((e) =>
        e.journeyStages.includes(activeStage as 1 | 2 | 3 | 4 | 5)
      );
    if (query.trim()) list = list.filter((e) => matchesQueryEpisode(e, query.trim()));
    list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return list;
  }, [query, activeDim, activeStage]);

  // Resources (no published date — sort alphabetically)
  const filteredResources = useMemo(() => {
    let list = [...LIBRARY_RESOURCES];
    if (activeDim) list = list.filter((r) => r.rubricDims.includes(activeDim));
    if (activeStage)
      list = list.filter((r) =>
        r.journeyStages.includes(activeStage as 1 | 2 | 3 | 4 | 5)
      );
    if (query.trim()) list = list.filter((r) => matchesQueryResource(r, query.trim()));
    list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, activeDim, activeStage]);

  const totalShown =
    (media === "videos" || media === "all" ? filteredClips.length : 0) +
    (media === "podcasts" || media === "all" ? filteredEpisodes.length : 0) +
    (media === "resources" || media === "all" ? filteredResources.length : 0);

  const filterCount =
    (activeDim ? 1 : 0) +
    (activeShow ? 1 : 0) +
    (activeStage ? 1 : 0) +
    (query.trim() ? 1 : 0) +
    (media !== "all" ? 1 : 0);

  const showVideos = media === "all" || media === "videos";
  const showPodcasts = media === "all" || media === "podcasts";
  const showResources = media === "all" || media === "resources";

  // When ?stage=N is in the URL the user wants stage context, not the
  // generic library header. The StageHero replaces it and tells them
  // what to do at this phase before they scroll into the filtered grid.
  const validStage =
    activeStage && activeStage >= 1 && activeStage <= 5
      ? (activeStage as JourneyStageNumber)
      : null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      {validStage ? (
        <StageHero stage={validStage} />
      ) : (
        <header className="mb-6 border-b border-border/40 pb-6">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            02 · content library · scott&rsquo;s curriculum
          </div>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
            {SAMPLE_CLIPS.length + PODCAST_EPISODES.length + LIBRARY_RESOURCES.length}{" "}
            assets · auto-tagged by rubric dimension
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Every video, podcast, and PDF is chaptered or summarized by the
            system, tagged across the 11-dimension partner rubric, and routed to
            the right journey stage. Filter to your weakest dim or your stage;
            click a card to open the player or viewer.
          </p>
        </header>
      )}

      {/* Search row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 py-2 focus-within:border-brand-gold/60 focus-within:bg-muted/50 sm:min-w-[320px]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 stroke-muted-foreground"
            fill="none"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="wedge clarity, term sheet, vanity NRR…"
            aria-label="Search the library"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
            >
              clear
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-3 py-2 text-[12.5px]">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            sort
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-transparent font-mono text-[11px] uppercase tracking-[0.12em] text-foreground focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([k, v]) => (
              <option key={k} value={k} className="bg-bg-2 text-foreground">
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Media-type chips · the most-used cut */}
      <div className="mb-3">
        <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          media type
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(MEDIA_LABELS) as MediaKey[]).map((m) => (
            <Chip
              key={m}
              label={MEDIA_LABELS[m]}
              active={media === m}
              onClick={() => setMedia(m)}
            />
          ))}
        </div>
      </div>

      {/* Rubric dim */}
      <div className="mb-3">
        <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          rubric dimension
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label="all"
            active={activeDim === null}
            onClick={() => setActiveDim(null)}
          />
          {ALL_DIMS.map((d) => (
            <Chip
              key={d}
              label={RUBRIC_LABELS[d]}
              active={activeDim === d}
              onClick={() => setActiveDim(activeDim === d ? null : d)}
            />
          ))}
        </div>
      </div>

      {/* Show + stage */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {showVideos && (
          <div>
            <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              show
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Chip
                label="all"
                active={activeShow === null}
                onClick={() => setActiveShow(null)}
              />
              {ALL_SHOWS.map((s) => (
                <Chip
                  key={s}
                  label={SHOW_LABELS[s]}
                  active={activeShow === s}
                  onClick={() => setActiveShow(activeShow === s ? null : s)}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            journey stage
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip
              label="all"
              active={activeStage === null}
              onClick={() => setActiveStage(null)}
            />
            {ALL_STAGES.map((s) => (
              <Chip
                key={s}
                label={`stage ${s}`}
                active={activeStage === s}
                onClick={() => setActiveStage(activeStage === s ? null : s)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Result row */}
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        <span>
          {totalShown} asset{totalShown === 1 ? "" : "s"}
          {filterCount > 0 && (
            <span className="ml-2 text-brand-gold">
              · {filterCount} filter{filterCount === 1 ? "" : "s"}
            </span>
          )}
        </span>
        {filterCount > 0 && (
          <button
            onClick={() =>
              setParam({
                q: null,
                dim: null,
                show: null,
                stage: null,
                media: null,
              })
            }
            className="text-brand-gold hover:text-brand-gold-2"
          >
            clear all
          </button>
        )}
      </div>

      {totalShown === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-10 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            no matches
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
            Nothing matches that filter set.
          </h3>
          <p className="mt-2 font-serif text-[14px] leading-relaxed text-muted-foreground">
            Try clearing a chip or broadening the query.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {showVideos && filteredClips.length > 0 && (
            <Section
              eyebrow={`${filteredClips.length} video${filteredClips.length === 1 ? "" : "s"} · embedded YouTube`}
              title="Talks, fireside cuts, and panel pulls"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredClips.map((c, idx) => (
                  <VideoCard key={c.id} clip={c} idx={idx} />
                ))}
              </div>
            </Section>
          )}

          {showPodcasts && filteredEpisodes.length > 0 && (
            <Section
              eyebrow={`${filteredEpisodes.length} podcast episode${filteredEpisodes.length === 1 ? "" : "s"} · audio`}
              title="Long-form interviews"
            >
              <HorizontalRail ariaLabel="Podcast episodes">
                {filteredEpisodes.map((e) => (
                  <PodcastCard key={e.id} episode={e} />
                ))}
              </HorizontalRail>
            </Section>
          )}

          {showResources && filteredResources.length > 0 && (
            <Section
              eyebrow={`${filteredResources.length} resource${filteredResources.length === 1 ? "" : "s"} · pdfs and infographics`}
              title="Reference material"
            >
              <HorizontalRail ariaLabel="Resources">
                {filteredResources.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </HorizontalRail>
            </Section>
          )}
        </div>
      )}
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 border-b border-border/40 pb-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          {eyebrow}
        </div>
        <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-md border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition",
        active
          ? "border-brand-gold/60 bg-brand-gold/15 text-brand-gold"
          : "border-border/80 bg-muted/30 text-muted-foreground hover:border-brand-gold/30 hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
