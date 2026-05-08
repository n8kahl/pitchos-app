import Link from "next/link";
import { db } from "@/lib/db";

// Server component fetching the most recent run. Wrapped in Suspense
// at the call site so the rest of Home renders before the DB lands.

export async function LatestRun() {
  const lastRun = await db.analysisRun.findFirst({
    orderBy: { createdAt: "desc" },
    include: { deck: { include: { project: true } }, report: true },
  });

  if (!lastRun) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-card/20 p-8 text-center sm:p-10">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          no analyses yet
        </div>
        <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
          Drop a deck. Scott&rsquo;s memo lands in two seconds.
        </h3>
        <Link
          href="/pitchos"
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
        >
          Open PitchOS →
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={lastRun.report ? `/report/${lastRun.id}` : `/runs/${lastRun.id}`}
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-card/40 px-5 py-5 transition hover:border-brand-gold/40 sm:px-7 sm:py-6"
    >
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {new Date(lastRun.createdAt).toLocaleDateString()} · run {lastRun.id.slice(-10)}
        </div>
        <div className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
          {lastRun.deck.project.companyName}
        </div>
        <div className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {lastRun.rubricVersion} · {lastRun.status.toLowerCase()}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {lastRun.report && (
          <div className="text-right">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              fundability
            </div>
            <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-brand-gold">
              {lastRun.report.fundabilityScore}
              <span className="ml-0.5 text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        )}
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          open →
        </span>
      </div>
    </Link>
  );
}

// Shape-preserving skeleton — same border, same padding, same row, so
// content swaps in without the layout shifting under the user's cursor.
export function LatestRunSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/80 bg-card/40 px-5 py-5 sm:px-7 sm:py-6"
    >
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-2.5 w-44 animate-pulse rounded-full bg-muted/50" />
        <div className="h-7 w-64 max-w-full animate-pulse rounded-md bg-muted/40" />
        <div className="h-2.5 w-32 animate-pulse rounded-full bg-muted/50" />
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right space-y-2">
          <div className="ml-auto h-2.5 w-20 animate-pulse rounded-full bg-muted/50" />
          <div className="ml-auto h-8 w-20 animate-pulse rounded-md bg-muted/40" />
        </div>
      </div>
    </div>
  );
}
