import Link from "next/link";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const runs = await db.analysisRun.findMany({
    orderBy: { createdAt: "desc" },
    include: { deck: { include: { project: true } }, report: true },
    take: 10,
  });

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          05 · your fundraise · dashboard
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">
          Every PitchOS run, every memo, in one place.
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          Your full analysis history with score deltas across versions.
          Re-uploading the same deck creates a new run; comparing runs
          surfaces what changed.
        </p>
      </header>

      {runs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-12 text-center">
          <h3 className="font-serif text-2xl font-semibold leading-tight text-foreground">
            No analyses yet.
          </h3>
          <p className="mt-2 font-serif text-[15px] leading-relaxed text-muted-foreground">
            Drop a deck and Scott&rsquo;s memo lands in under two seconds (mock mode).
          </p>
          <Link
            href="/pitchos"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            Open PitchOS →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60">
          <div className="grid grid-cols-[1.4fr_120px_120px_140px_60px] gap-5 border-b border-border/60 bg-muted/30 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <div>Company</div>
            <div className="text-right">Fundability</div>
            <div className="text-right">Likelihood</div>
            <div>Status</div>
            <div></div>
          </div>
          {runs.map((r) => (
            <Link
              key={r.id}
              href={r.report ? `/report/${r.id}` : `/runs/${r.id}`}
              className="grid grid-cols-[1.4fr_120px_120px_140px_60px] items-center gap-5 border-b border-border/60 px-5 py-4 transition last:border-b-0 hover:bg-card/50"
            >
              <div className="min-w-0">
                <div className="truncate font-serif text-[15px] font-semibold text-foreground">
                  {r.deck.project.companyName}
                </div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString()} · {r.deck.fileName}
                </div>
              </div>
              <div className="text-right font-mono text-2xl font-bold tabular-nums text-brand-gold">
                {r.report?.fundabilityScore ?? "—"}
              </div>
              <div className="text-right font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {r.report?.meetingLikelihood.replace(/_/g, " ").toLowerCase() ?? "pending"}
              </div>
              <div>
                <span
                  className={[
                    "rounded-sm border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em]",
                    r.status === "COMPLETED"
                      ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
                      : r.status === "RUNNING"
                      ? "border-brand-gold/40 bg-brand-gold/10 text-brand-gold"
                      : "border-border bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {r.status.toLowerCase()}
                </span>
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">
                →
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
