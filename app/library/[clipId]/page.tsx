import Link from "next/link";
import { notFound } from "next/navigation";
import { getClipById, SAMPLE_CLIPS, SHOW_LABELS } from "@/lib/content/sample-clips";

type PageProps = {
  params: Promise<{ clipId: string }>;
  searchParams: Promise<{ t?: string }>;
};

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

export default async function ClipDetailPage({ params, searchParams }: PageProps) {
  const { clipId } = await params;
  const { t } = await searchParams;
  const clip = getClipById(clipId);
  if (!clip) notFound();

  const related = SAMPLE_CLIPS.filter(
    (c) =>
      c.id !== clip.id &&
      c.rubricDims.some((d) => clip.rubricDims.includes(d))
  ).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      <Link
        href="/library"
        className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold transition hover:text-brand-gold-2"
      >
        ← library
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Player + transcript */}
        <article>
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                {SHOW_LABELS[clip.show]} · {clip.publishedAt}
              </div>
              <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">
                {clip.title}
              </h1>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {clip.durationMin} min
            </div>
          </div>

          {/* Embedded player placeholder · Phase 6 swaps for R2-hosted MP4 */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest to-[#0c1812]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.14),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(245,200,66,0.10),transparent_60%)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button className="grid h-20 w-20 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-9 w-9" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t ? `seek to ${t} on play` : "embedded player · phase 6 wires R2 + WebVTT"}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-5 py-3">
              <span className="font-mono text-[10px] tabular-nums text-foreground/85">
                {t ?? "00:00"}
              </span>
              <div className="flex-1">
                <div className="h-1 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[18%] rounded-full bg-brand-gold" />
                </div>
              </div>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                {String(clip.durationMin).padStart(2, "0")}:00
              </span>
            </div>
          </div>

          {/* AI summary */}
          <div className="mt-6 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
              ★ AI summary · auto-extracted
            </div>
            <p className="mt-2 font-serif text-[15px] leading-[1.7] text-foreground/90">
              {clip.aiSummary}
            </p>
          </div>

          {/* Chapters */}
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-semibold tracking-tight text-foreground">
              Chapters
            </h2>
            <ol className="overflow-hidden rounded-xl border border-border/60">
              {clip.chapters.map((c, i) => (
                <li
                  key={c.at}
                  className="grid grid-cols-[64px_1fr] gap-4 border-b border-border/60 px-5 py-4 transition last:border-b-0 hover:bg-card/40"
                >
                  <Link
                    href={`?t=${c.at}`}
                    className="font-mono text-[12px] font-semibold tabular-nums text-brand-gold hover:text-brand-gold-2"
                  >
                    {c.at}
                  </Link>
                  <div>
                    <div className="font-serif text-[15px] font-semibold leading-snug text-foreground">
                      {String(i + 1).padStart(2, "0")} · {c.title}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {c.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Key moments */}
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-semibold tracking-tight text-foreground">
              Key moments · pull quotes
            </h2>
            <div className="space-y-3">
              {clip.keyMoments.map((m, i) => (
                <Link
                  key={i}
                  href={`?t=${m.at}`}
                  className="flex gap-5 rounded-xl border border-border/60 bg-card/30 p-5 transition hover:border-brand-gold/40 hover:bg-card/60"
                >
                  <div className="font-mono text-[11px] font-semibold tabular-nums text-brand-gold">
                    {m.at}
                  </div>
                  <blockquote className="border-l-2 border-brand-green/60 pl-4 font-serif text-[15px] italic leading-snug text-foreground/90">
                    &ldquo;{m.quote}&rdquo;
                  </blockquote>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Right rail · meta + tags + related */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card/30 p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              rubric dimensions covered
            </div>
            <ul className="mt-3 space-y-2">
              {clip.rubricDims.map((d) => (
                <li
                  key={d}
                  className="flex items-center justify-between rounded-md bg-brand-gold/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]"
                >
                  <span className="font-bold text-brand-gold">{RUBRIC_LABELS[d]}</span>
                  <span className="text-muted-foreground">primary</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              journey stage routing
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]">
              {[1, 2, 3, 4, 5].map((s) => {
                const active = clip.journeyStages.includes(s as 1 | 2 | 3 | 4 | 5);
                return (
                  <span
                    key={s}
                    className={[
                      "rounded-sm px-2 py-1",
                      active
                        ? "bg-brand-green/15 text-brand-green"
                        : "border border-dashed border-border text-muted-foreground/60",
                    ].join(" ")}
                  >
                    stage {s}
                  </span>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] leading-snug text-muted-foreground">
              Surfaced to founders in stage{" "}
              {clip.journeyStages.join(" / ")} on the workspace home.
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              ask the coach about this clip
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">
              The Scott-bot can answer follow-ups grounded in this clip plus
              everything else in the corpus tagged{" "}
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-brand-gold">
                {clip.rubricDims[0]}
              </span>
              .
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md border border-brand-gold/40 bg-brand-gold/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold transition hover:bg-brand-gold/10">
              ✸ open coach →
            </button>
          </div>

          {related.length > 0 && (
            <div className="rounded-xl border border-border/60 bg-card/30 p-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                related clips · same rubric dim
              </div>
              <ul className="mt-3 space-y-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/library/${r.id}`}
                      className="block text-foreground/90 transition hover:text-foreground"
                    >
                      <div className="font-serif text-[14px] font-semibold leading-tight">
                        {r.title}
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {r.show} · {r.durationMin} min
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
