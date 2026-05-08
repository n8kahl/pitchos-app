import Link from "next/link";
import { db } from "@/lib/db";
import { SAMPLE_CLIPS } from "@/lib/content/sample-clips";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";

export default async function HomePage() {
  // Most recent analysis run, if any — surfaced on the home dashboard so
  // users land in their workflow, not on a marketing page.
  const lastRun = await db.analysisRun.findFirst({
    orderBy: { createdAt: "desc" },
    include: { deck: { include: { project: true } }, report: true },
  });

  const featured = SAMPLE_CLIPS.find((c) => c.id === "vcfp-2025-05-fmf-decides")!;
  const lessonRail = SAMPLE_CLIPS.slice(1, 4);

  return (
    <main className="mx-auto max-w-6xl px-8 py-10">
      {/* Welcome row — journey + Coach quick prompt */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-forest via-bg-2 to-bg-2 p-8">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_6px_var(--color-brand-gold)]" />
            stage 3 of 5 · pitch-ready
          </div>
          <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Welcome back, Nate.
          </h1>
          <p className="mt-3 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
            You&rsquo;re in the pitch-ready stage — Scott&rsquo;s curriculum
            shifts to wedge sharpening, traction-presentation, and pre-IC
            diligence prep. The Coach is in <em className="font-medium text-foreground">sharpening mode</em>.
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

        <section className="rounded-xl border border-border/80 bg-card/40 p-6">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
            asked recently · scott replied
          </div>
          <ul className="mt-4 space-y-2">
            {COACH_EXAMPLES.slice(0, 3).map((q) => (
              <li
                key={q.id}
                className="rounded-md border border-border/60 bg-bg-2/60 px-3.5 py-2.5 text-[13px] leading-snug text-foreground/85 transition hover:border-brand-gold/40 hover:bg-bg-2"
              >
                {q.prompt}
              </li>
            ))}
          </ul>
          <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            tap the Coach button to open any →
          </div>
        </section>
      </div>

      {/* Today's lesson — embedded "video" with AI chapters + key moments */}
      <section className="mt-10">
        <SectionRow
          eyebrow="01 · today's lesson · ai-curated"
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(60,169,74,0.15),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(245,200,66,0.10),transparent_60%)]" />
              <div className="absolute inset-x-6 bottom-6 z-10 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                    {featured.show}
                  </div>
                  <div className="mt-2 font-serif text-3xl font-semibold leading-[1.05] text-foreground">
                    {featured.title}
                  </div>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-gold text-[#0a1410] transition group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute right-5 top-5 rounded-sm bg-black/50 px-2 py-1 font-mono text-[10px] font-semibold tracking-tight text-foreground">
                {featured.durationMin} min
              </div>
            </div>
            <div className="border-t border-border/60 px-6 py-5">
              <p className="font-serif text-[15px] leading-[1.7] text-foreground/90">
                {featured.aiSummary}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                <span className="text-muted-foreground">tagged ·</span>
                {featured.rubricDims.map((d) => (
                  <span
                    key={d}
                    className="rounded-sm bg-brand-gold/10 px-2 py-0.5 font-bold text-brand-gold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          <aside className="rounded-xl border border-border/80 bg-card/40 p-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              ai chapters · auto-extracted
            </div>
            <ol className="mt-4 space-y-3.5">
              {featured.chapters.map((c, i) => (
                <li key={c.at} className="grid grid-cols-[44px_1fr] gap-2.5">
                  <Link
                    href={`/library/${featured.id}?t=${c.at}`}
                    className="font-mono text-[11px] font-semibold tabular-nums text-brand-gold hover:text-brand-gold-2"
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
              timestamps jump into the embedded player →
            </div>
          </aside>
        </div>
      </section>

      {/* Recommended next · journey-stage-routed clips */}
      <section className="mt-12">
        <SectionRow
          eyebrow="02 · recommended next · stage-routed"
          title="What Scott would have you "
          titleEm="watch this week"
          right="based on stage 3 + your weakest rubric dim"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {lessonRail.map((c) => (
            <Link
              key={c.id}
              href={`/library/${c.id}`}
              className="flex flex-col rounded-xl border border-border/80 bg-card/40 p-5 transition hover:border-brand-gold/40 hover:bg-card/60"
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {c.show} · {c.durationMin} min
              </div>
              <div className="mt-3 font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
                {c.title}
              </div>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                {c.aiSummary.split(". ")[0]}.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
                {c.rubricDims.slice(0, 2).map((d) => (
                  <span
                    key={d}
                    className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 font-semibold text-brand-gold"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Your fundraise — last analysis run */}
      <section className="mt-12">
        <SectionRow
          eyebrow="03 · your fundraise"
          title="Your latest "
          titleEm="PitchOS analysis"
        />
        {lastRun ? (
          <Link
            href={lastRun.report ? `/report/${lastRun.id}` : `/runs/${lastRun.id}`}
            className="flex items-center justify-between rounded-xl border border-border/80 bg-card/40 px-7 py-6 transition hover:border-brand-gold/40"
          >
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {new Date(lastRun.createdAt).toLocaleDateString()} · run {lastRun.id.slice(-10)}
              </div>
              <div className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
                {lastRun.deck.project.companyName}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {lastRun.rubricVersion} · {lastRun.status.toLowerCase()}
              </div>
            </div>
            <div className="flex items-center gap-6">
              {lastRun.report && (
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    fundability
                  </div>
                  <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-brand-gold">
                    {lastRun.report.fundabilityScore}
                    <span className="ml-0.5 text-sm text-muted-foreground">/100</span>
                  </div>
                </div>
              )}
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-brand-gold">
                open →
              </span>
            </div>
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-10 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              no analyses yet
            </div>
            <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground">
              Drop a deck and the Coach will memo it.
            </h3>
            <Link
              href="/pitchos"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
            >
              Open PitchOS →
            </Link>
          </div>
        )}
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
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border/40 pb-3">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          {eyebrow}
        </div>
        <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {title}
          <em className="font-medium not-italic text-brand-green">{titleEm}</em>
        </h2>
      </div>
      {right && (
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {right}
        </div>
      )}
    </div>
  );
}
