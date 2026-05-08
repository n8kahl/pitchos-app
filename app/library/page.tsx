import Link from "next/link";
import { SAMPLE_CLIPS, SHOW_LABELS } from "@/lib/content/sample-clips";

const RUBRIC_LABELS: Record<string, string> = {
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

export default function LibraryPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          02 · content library · scott&rsquo;s curriculum
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground">
          {SAMPLE_CLIPS.length} clips · auto-tagged by rubric dimension
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Every clip is chaptered by an LLM, tagged across the 11-dimension
          partner rubric, and routed to the right journey stage. Click a
          card to open the embedded player with the full transcript and AI
          summary.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_CLIPS.map((c, idx) => (
          <Link
            key={c.id}
            href={`/library/${c.id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40"
          >
            <div className="relative aspect-[16/10] bg-gradient-to-br from-forest to-[#0c1812]">
              <div
                className={[
                  "absolute inset-0",
                  idx % 3 === 0
                    ? "bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.14),transparent_60%)]"
                    : idx % 3 === 1
                    ? "bg-[radial-gradient(circle_at_70%_30%,rgba(245,200,66,0.14),transparent_60%)]"
                    : "bg-[radial-gradient(circle_at_50%_60%,rgba(187,201,181,0.10),transparent_60%)]",
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
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
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
              <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3 font-mono text-[10px] uppercase tracking-[0.1em]">
                {c.rubricDims.map((d) => (
                  <span
                    key={d}
                    className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 font-semibold text-brand-gold"
                  >
                    {RUBRIC_LABELS[d]}
                  </span>
                ))}
                <span className="ml-auto text-muted-foreground">
                  stage {c.journeyStages.join("·")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
