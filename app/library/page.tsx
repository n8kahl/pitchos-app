"use client";

import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Target,
  Crosshair,
  TrendingUp,
  Flame,
  RefreshCw,
  BarChart3,
  Zap,
  CircleDollarSign,
  Shield,
  Layers,
  AlertTriangle,
  Video,
  Headphones,
  FileText,
} from "lucide-react";
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

// ─── Data maps ───────────────────────────────────────────────────────────────

const RUBRIC_LABELS: Record<RubricCategory, string> = {
  founderMarketFit: "Founder-Market Fit",
  wedgeClarity: "Wedge Clarity",
  tractionQuality: "Traction Quality",
  problemUrgency: "Problem Urgency",
  gtmRepeatability: "GTM Repeatability",
  marketSizingLogic: "Market Sizing",
  whyNow: "Why Now",
  businessModel: "Business Model",
  defensibility: "Defensibility",
  deckQuality: "Deck Quality",
  riskSurface: "Risk Surface",
};

const DIM_TAGLINES: Record<RubricCategory, string> = {
  founderMarketFit: "Do you belong in this problem?",
  wedgeClarity: "Is your entry point specific enough?",
  tractionQuality: "Is growth real or manufactured?",
  problemUrgency: "Would they buy today, or someday?",
  gtmRepeatability: "Can you replicate the first win?",
  marketSizingLogic: "Is the math credible?",
  whyNow: "What changed that makes this the moment?",
  businessModel: "Does the unit economics close?",
  defensibility: "What stops a well-funded copycat?",
  deckQuality: "Does every slide answer a partner question?",
  riskSurface: "What breaks this in 12 months?",
};

const DIM_ICONS: Record<
  RubricCategory,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  founderMarketFit: Target,
  wedgeClarity: Crosshair,
  tractionQuality: TrendingUp,
  problemUrgency: Flame,
  gtmRepeatability: RefreshCw,
  marketSizingLogic: BarChart3,
  whyNow: Zap,
  businessModel: CircleDollarSign,
  defensibility: Shield,
  deckQuality: Layers,
  riskSurface: AlertTriangle,
};

type SortKey = "newest" | "longest" | "shortest" | "by-show";
type MediaKey = "all" | "videos" | "podcasts" | "resources";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  longest: "Longest",
  shortest: "Shortest",
  "by-show": "By show",
};

const ALL_SHOWS: SampleClip["show"][] = [
  "VC Fast Pitch",
  "Emerging Managers Pod",
  "Smart Startup Growth",
  "BDVP Fireside",
];

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

// ─── Match helpers ────────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

// ─── Animation keyframes ─────────────────────────────────────────────────────

const ANIM_STYLES = `
  @keyframes lib-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lib-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes lib-slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lib-scale-in {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  .lib-fade-up   { animation: lib-fade-up   0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .lib-fade-in   { animation: lib-fade-in   0.25s ease both; }
  .lib-slide-down { animation: lib-slide-down 0.28s cubic-bezier(0.16,1,0.3,1) both; }
  .lib-scale-in  { animation: lib-scale-in  0.3s  cubic-bezier(0.16,1,0.3,1) both; }
  .lib-dim-card  { transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease; }
  .lib-dim-card:hover:not(.lib-dim-card--active) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px -4px rgba(0,0,0,0.35);
  }
  .lib-dim-card:active { transform: scale(0.97) translateY(0) !important; }
  .lib-dim-card--active {
    box-shadow: 0 0 0 1px rgba(var(--brand-gold-rgb, 180,140,60), 0.5),
                0 4px 20px -4px rgba(var(--brand-gold-rgb, 180,140,60), 0.15);
  }
  .lib-search-wrap:focus-within {
    box-shadow: 0 0 0 2px rgba(var(--brand-gold-rgb, 180,140,60), 0.18);
  }
  .lib-stage-pill { transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease; }
  .lib-stage-pill:active { transform: scale(0.93); }
`;

export default function LibraryPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_STYLES }} />
      <Suspense fallback={null}>
        <LibraryView />
      </Suspense>
    </>
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

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Changes whenever active filters change — used as key to re-trigger grid entrance
  const filterKey = `${activeDim ?? ""}|${activeStage ?? ""}|${media}|${sort}|${activeShow ?? ""}`;
  const prevFilterKey = useRef(filterKey);
  const filterChanged = filterKey !== prevFilterKey.current;
  if (filterChanged) prevFilterKey.current = filterKey;

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

  const clearAll = useCallback(
    () => setParam({ q: null, dim: null, show: null, stage: null, media: null, sort: null }),
    [setParam]
  );

  // ── Filtered data ────────────────────────────────────────────────────────

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
      case "newest": list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)); break;
      case "longest": list.sort((a, b) => b.durationMin - a.durationMin); break;
      case "shortest": list.sort((a, b) => a.durationMin - b.durationMin); break;
      case "by-show": list.sort((a, b) => a.show.localeCompare(b.show)); break;
    }
    return list;
  }, [query, activeDim, activeShow, activeStage, sort]);

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

  const showVideos = media === "all" || media === "videos";
  const showPodcasts = media === "all" || media === "podcasts";
  const showResources = media === "all" || media === "resources";

  const totalShown =
    (showVideos ? filteredClips.length : 0) +
    (showPodcasts ? filteredEpisodes.length : 0) +
    (showResources ? filteredResources.length : 0);

  const extraFilterCount = (activeShow ? 1 : 0) + (sort !== "newest" ? 1 : 0);
  const hasAnyFilter = !!(
    activeDim || activeShow || activeStage || query.trim() || media !== "all"
  );

  const validStage =
    activeStage && activeStage >= 1 && activeStage <= 5
      ? (activeStage as JourneyStageNumber)
      : null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">

      {/* ── Zone 1: Slim toolbar ─────────────────────────────────────────── */}
      <div className="mb-6 space-y-2.5 lib-fade-up" style={{ animationDelay: "0ms" }}>
        <div className="flex flex-wrap items-center gap-2">

          {/* Stage tabs */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5">
            <StagePill active={activeStage === null} onClick={() => setActiveStage(null)}>
              All
            </StagePill>
            {([1, 2, 3, 4, 5] as const).map((s) => (
              <StagePill
                key={s}
                active={activeStage === s}
                onClick={() => setActiveStage(activeStage === s ? null : s)}
              >
                {s}
              </StagePill>
            ))}
          </div>

          {/* Search */}
          <div
            className={[
              "lib-search-wrap flex flex-1 min-w-[160px] items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2 transition-all duration-200",
              searchFocused ? "border-brand-gold/50 bg-muted/40" : "border-border/60",
            ].join(" ")}
          >
            <Search
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
              strokeWidth={1.5}
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="wedge clarity, term sheet, vanity NRR…"
              aria-label="Search the library"
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="transition-opacity hover:opacity-70 active:scale-90"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Media type icon toggles */}
          <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5">
            {(
              [
                { type: "videos" as MediaKey, Icon: Video, label: "Videos" },
                { type: "podcasts" as MediaKey, Icon: Headphones, label: "Podcasts" },
                { type: "resources" as MediaKey, Icon: FileText, label: "Resources" },
              ] as const
            ).map(({ type, Icon, label }) => {
              const isHighlighted = media === type;
              const isDimmed = media !== "all" && media !== type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMedia(isHighlighted ? "all" : type)}
                  aria-label={label}
                  title={label}
                  className={[
                    "rounded-md p-1.5 transition-all duration-150 active:scale-90",
                    isHighlighted
                      ? "bg-brand-gold/20 text-brand-gold"
                      : isDimmed
                      ? "text-muted-foreground/30 hover:text-muted-foreground"
                      : "text-foreground/60 hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              );
            })}
          </div>

          {/* More filters toggle */}
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={[
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 active:scale-95",
              filtersOpen || extraFilterCount > 0
                ? "border-brand-gold/50 bg-brand-gold/10 text-brand-gold"
                : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-border",
            ].join(" ")}
          >
            <SlidersHorizontal
              className={[
                "h-3.5 w-3.5 transition-transform duration-300",
                filtersOpen ? "rotate-90" : "",
              ].join(" ")}
              strokeWidth={1.5}
            />
            {extraFilterCount > 0 ? `${extraFilterCount} more` : "More"}
          </button>

          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-brand-gold transition hover:opacity-70 active:scale-95 lib-fade-in"
            >
              <X className="h-3 w-3" strokeWidth={2} />
              Clear all
            </button>
          )}
        </div>

        {/* Inline filter panel — animates in */}
        {filtersOpen && (
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-4 lib-slide-down">
            {showVideos && (
              <div>
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Show
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Chip
                    label="All shows"
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
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Sort
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([k, v]) => (
                  <Chip key={k} label={v} active={sort === k} onClick={() => setSort(k)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Stage hero or page header ────────────────────────────────────── */}
      <div className="lib-fade-up" style={{ animationDelay: "60ms" }}>
        {validStage ? (
          <div className="mb-6">
            <StageHero stage={validStage} />
          </div>
        ) : !activeDim ? (
          <header className="mb-6 border-b border-border/40 pb-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              02 · content library · scott&rsquo;s curriculum
            </div>
            <h1 className="mt-2 text-2xl font-semibold sm:text-3xl leading-tight tracking-tight text-foreground">
              {SAMPLE_CLIPS.length + PODCAST_EPISODES.length + LIBRARY_RESOURCES.length} assets · pick a stage or a weakness to focus
            </h1>
          </header>
        ) : null}
      </div>

      {/* ── Zone 3: Dimension browser ────────────────────────────────────── */}
      <div className="mb-6 lib-fade-up" style={{ animationDelay: "110ms" }}>
        <div className="mb-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Browse by what you need to fix
        </div>
        <div
          className="flex gap-2.5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {ALL_DIMS.map((d, i) => {
            const active = activeDim === d;
            const Icon = DIM_ICONS[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDim(active ? null : d)}
                className={[
                  "lib-dim-card flex w-[152px] shrink-0 flex-col gap-2 rounded-xl border px-3.5 py-3 text-left lib-fade-up",
                  active
                    ? "lib-dim-card--active border-brand-gold/60 bg-brand-gold/10"
                    : "border-border/60 bg-card/40 hover:border-brand-gold/30 hover:bg-card/70",
                ].join(" ")}
                style={{ animationDelay: `${110 + i * 28}ms` }}
              >
                <Icon
                  className={[
                    "h-4 w-4 transition-colors duration-150",
                    active ? "text-brand-gold" : "text-muted-foreground",
                  ].join(" ")}
                  strokeWidth={1.5}
                />
                <div>
                  <div
                    className={[
                      "font-mono text-[10.5px] font-bold uppercase leading-tight tracking-[0.09em] transition-colors duration-150",
                      active ? "text-brand-gold" : "text-foreground",
                    ].join(" ")}
                  >
                    {RUBRIC_LABELS[d]}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {DIM_TAGLINES[d]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Focused mode header — slides in when dim is selected ─────────── */}
      {activeDim && (
        <div
          key={activeDim}
          className="mb-6 flex items-start gap-4 rounded-xl border border-brand-gold/30 bg-brand-gold/[0.05] px-5 py-4 lib-slide-down"
        >
          <div className="flex-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              Focused on
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              {RUBRIC_LABELS[activeDim]}
            </h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {DIM_TAGLINES[activeDim]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveDim(null)}
            className="mt-0.5 flex shrink-0 items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-all duration-150 hover:text-foreground hover:border-border active:scale-95"
          >
            <X className="h-3 w-3" strokeWidth={2} />
            Clear
          </button>
        </div>
      )}

      {/* ── Result count ─────────────────────────────────────────────────── */}
      <div
        className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground lib-fade-up"
        style={{ animationDelay: "180ms" }}
      >
        {totalShown} asset{totalShown === 1 ? "" : "s"}
        {hasAnyFilter && (
          <span className="ml-1.5 text-brand-gold lib-fade-in">· filtered</span>
        )}
      </div>

      {/* ── Content — re-animates on filter change ───────────────────────── */}
      {totalShown === 0 ? (
        <div
          key={`empty-${filterKey}`}
          className="rounded-xl border border-dashed border-border/80 bg-card/20 p-10 text-center lib-scale-in"
        >
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            No matches
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
            Nothing matches that combination.
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Try clearing a filter or broadening the search.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-brand-gold/40 bg-brand-gold/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold transition hover:bg-brand-gold/20 active:scale-95"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div key={filterKey} className="space-y-12 lib-fade-up" style={{ animationDelay: "0ms" }}>
          {showVideos && filteredClips.length > 0 && (
            <Section
              eyebrow={`${filteredClips.length} video${filteredClips.length === 1 ? "" : "s"} · embedded youtube`}
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
              eyebrow={`${filteredEpisodes.length} episode${filteredEpisodes.length === 1 ? "" : "s"} · audio`}
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StagePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "lib-stage-pill rounded-md px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em]",
        active
          ? "bg-brand-gold text-[#0a0e0c]"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
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
