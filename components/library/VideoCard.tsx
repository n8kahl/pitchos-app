import Link from "next/link";
import { SHOW_LABELS, type SampleClip } from "@/lib/content/sample-clips";
import type { RubricCategory } from "@/lib/ai/anti-patterns";
import { WatchedBadge } from "./WatchedBadge";

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

// Shared video card · used in /library and on Home + Dashboard rails so
// every video preview reads the same. The thumbnail comes from
// i.ytimg.com (YouTube's CDN) at mqdefault size — picks up real video
// art automatically and falls back gracefully when a clip ID has no
// thumbnail set yet.

export function VideoCard({ clip, idx = 0 }: { clip: SampleClip; idx?: number }) {
  return (
    <Link
      href={`/library/${clip.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40"
    >
      <div className="relative aspect-[16/10] bg-gradient-to-br from-forest to-[#0c1812]">
        <WatchedBadge clipId={clip.id} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${clip.youtubeId}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        <div className="absolute right-3 top-3 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold tabular-nums text-foreground">
          {clip.durationMin} min
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
            {SHOW_LABELS[clip.show]}
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
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
          {clip.title}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {clip.aiSummary.split(". ")[0]}.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
          {clip.rubricDims.slice(0, 2).map((d) => (
            <span
              key={d}
              className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 text-brand-gold"
            >
              {RUBRIC_LABELS[d]}
            </span>
          ))}
          {clip.rubricDims.length > 2 && (
            <span className="rounded-sm bg-muted/40 px-1.5 py-0.5 text-muted-foreground">
              +{clip.rubricDims.length - 2}
            </span>
          )}
          <span className="ml-auto text-muted-foreground">
            stage {clip.journeyStages.join("·")}
          </span>
        </div>
      </div>
    </Link>
  );
}
