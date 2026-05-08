"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SAMPLE_CLIPS, SHOW_LABELS, type SampleClip } from "@/lib/content/sample-clips";
import type { RubricCategory } from "@/lib/ai/anti-patterns";
import { WatchedBadge } from "@/components/library/WatchedBadge";

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

const ALL_STAGES: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

// Available rubric dims (sorted by appearance count in the corpus, with
// the partner-rubric weight order as the tiebreaker)
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

function matchesQuery(clip: SampleClip, q: string): boolean {
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

export default function LibraryPage() {
  return (
    <Suspense fallback={null}>
      <LibraryView />
    </Suspense>
  );
}

function LibraryView() {
  // Filter state lives in the URL so deep-linking and back/forward work
  // like an app — the palette can route to /library?dim=wedgeClarity
  // and the chips light up correctly. router.replace + scroll: false
  // keeps the URL synchronized without polluting browser history.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const activeDim = (searchParams.get("dim") as RubricCategory | null) ?? null;
  const activeShow = (searchParams.get("show") as SampleClip["show"] | null) ?? null;
  const stageRaw = searchParams.get("stage");
  const activeStage = stageRaw ? Number(stageRaw) : null;
  const sort = (searchParams.get("sort") as SortKey) ?? "newest";

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

  const setQuery = useCallback(
    (q: string) => setParam({ q: q || null }),
    [setParam]
  );
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

  const filtered = useMemo(() => {
    let list = [...SAMPLE_CLIPS];
    if (activeDim) list = list.filter((c) => c.rubricDims.includes(activeDim));
    if (activeShow) list = list.filter((c) => c.show === activeShow);
    if (activeStage)
      list = list.filter((c) =>
        c.journeyStages.includes(activeStage as 1 | 2 | 3 | 4 | 5)
      );
    if (query.trim()) list = list.filter((c) => matchesQuery(c, query.trim()));

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

  const filterCount =
    (activeDim ? 1 : 0) +
    (activeShow ? 1 : 0) +
    (activeStage ? 1 : 0) +
    (query.trim() ? 1 : 0);

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="mb-6 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          02 · content library · scott&rsquo;s curriculum
        </div>
        <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl leading-[1.05] tracking-tight text-foreground">
          {SAMPLE_CLIPS.length} clips · auto-tagged by rubric dimension
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Every clip is chaptered by an LLM, tagged across the 11-dimension
          partner rubric, and routed to the right journey stage. Filter to
          your weakest dim or your stage; click a card to open the player.
        </p>
      </header>

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
            placeholder="wedge clarity, vanity NRR, why-now…"
            aria-label="Search clips"
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

        {/* Sort dropdown */}
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

      {/* Filter chips · rubric dim */}
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

      {/* Filter chips · show + stage */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          {filtered.length} of {SAMPLE_CLIPS.length} clip
          {filtered.length === 1 ? "" : "s"}
          {filterCount > 0 && (
            <span className="ml-2 text-brand-gold">· {filterCount} filter{filterCount === 1 ? "" : "s"}</span>
          )}
        </span>
        {filterCount > 0 && (
          <button
            onClick={() =>
              setParam({ q: null, dim: null, show: null, stage: null })
            }
            className="text-brand-gold hover:text-brand-gold-2"
          >
            clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-10 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            no matches
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
            Nothing matches that filter set.
          </h3>
          <p className="mt-2 font-serif text-[14px] leading-relaxed text-muted-foreground">
            Try clearing a chip or broadening the query. The corpus has{" "}
            {SAMPLE_CLIPS.length} clips total today; ingestion adds 50+ in
            phase 6.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, idx) => (
            <Link
              key={c.id}
              href={`/library/${c.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40"
            >
              <div className="relative aspect-[16/10] bg-gradient-to-br from-forest to-[#0c1812]">
                <WatchedBadge clipId={c.id} />
                <div
                  className={[
                    "absolute inset-0",
                    idx % 4 === 0
                      ? "bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.14),transparent_60%)]"
                      : idx % 4 === 1
                      ? "bg-[radial-gradient(circle_at_70%_30%,rgba(245,200,66,0.14),transparent_60%)]"
                      : idx % 4 === 2
                      ? "bg-[radial-gradient(circle_at_50%_60%,rgba(187,201,181,0.10),transparent_60%)]"
                      : "bg-[radial-gradient(circle_at_70%_70%,rgba(66,172,64,0.12),transparent_60%)]",
                  ].join(" ")}
                />
                <div className="absolute right-3 top-3 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold tabular-nums text-foreground">
                  {c.durationMin} min
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
                    {SHOW_LABELS[c.show]}
                  </div>
                  <div
                    className={[
                      "grid h-9 w-9 place-items-center rounded-full transition group-hover:scale-110",
                      idx % 2 === 0
                        ? "bg-brand-gold text-[#0a1410]"
                        : "bg-brand-green text-white",
                    ].join(" ")}
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {c.aiSummary.split(". ")[0]}.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
                  {c.rubricDims.slice(0, 2).map((d) => (
                    <span
                      key={d}
                      className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 text-brand-gold"
                    >
                      {RUBRIC_LABELS[d]}
                    </span>
                  ))}
                  {c.rubricDims.length > 2 && (
                    <span className="rounded-sm bg-muted/40 px-1.5 py-0.5 text-muted-foreground">
                      +{c.rubricDims.length - 2}
                    </span>
                  )}
                  <span className="ml-auto text-muted-foreground">
                    stage {c.journeyStages.join("·")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
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
        "rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition",
        active
          ? "border-brand-gold bg-brand-gold/15 text-brand-gold"
          : "border-border/60 bg-card/40 text-muted-foreground hover:border-brand-gold/40 hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
