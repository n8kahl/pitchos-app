import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProgressView } from "@/components/runs/ProgressView";

type PageProps = {
  params: Promise<{ runId: string }>;
  searchParams: Promise<{ demo?: string }>;
};

// The chrome renders immediately; only the run header + progress
// view wait on the DB. The skeleton preserves the layout shape so
// content lands without shifting under the cursor.
export default async function RunPage({ params, searchParams }: PageProps) {
  const { runId } = await params;
  const { demo } = await searchParams;
  const isDemo = demo === "1";
  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <Suspense fallback={<RunPageSkeleton />}>
        <RunPageBody runId={runId} isDemo={isDemo} />
      </Suspense>
    </main>
  );
}

async function RunPageBody({
  runId,
  isDemo,
}: {
  runId: string;
  isDemo: boolean;
}) {
  const run = await db.analysisRun.findUnique({
    where: { id: runId },
    include: {
      deck: { include: { project: true } },
    },
  });

  if (!run) notFound();

  return (
    <>
      <header className="mb-8 flex items-baseline justify-between border-b border-border/40 pb-6">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            ★ pitchos · analysis in progress
          </div>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl tracking-tight text-foreground">
            {run.deck.project.companyName}
          </h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {run.deck.fileName} · {run.rubricVersion} · {run.partnerProfileVersion}
          </p>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <div>run id</div>
          <div className="text-foreground">{run.id.slice(-12)}</div>
        </div>
      </header>

      {isDemo && (
        <div className="mb-6 rounded-xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent p-5">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            ★ demo run · meshops fixture · seed-stage saas
          </div>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-foreground/85">
            About to score a 12-slide deck against the partner rubric. Watch
            the chain — the ticking stages below are the same nine
            transformations a real deck runs through. The mock provider
            returns deterministic Scott-voiced output, so the memo at the
            end is the same one Scott reads as the voice baseline.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>~2 second analysis</span>
            <span aria-hidden>·</span>
            <span>9 stages</span>
            <span aria-hidden>·</span>
            <span>partner memo lands at /report</span>
          </div>
        </div>
      )}

      <ProgressView
        runId={run.id}
        initialStage={run.stage}
        initialStatus={run.status}
        initialProgress={run.progress}
      />
    </>
  );
}

function RunPageSkeleton() {
  return (
    <div aria-hidden>
      <header className="mb-8 flex items-baseline justify-between border-b border-border/40 pb-6">
        <div className="space-y-3">
          <div className="h-2.5 w-56 animate-pulse rounded-full bg-muted/50" />
          <div className="h-9 w-72 animate-pulse rounded-md bg-muted/40" />
          <div className="h-2.5 w-80 max-w-full animate-pulse rounded-full bg-muted/50" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-2.5 w-16 animate-pulse rounded-full bg-muted/50" />
          <div className="ml-auto h-3 w-24 animate-pulse rounded-md bg-muted/40" />
        </div>
      </header>

      <div className="space-y-3">
        <div className="h-3 w-full animate-pulse rounded-full bg-muted/40" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg border border-border/60 bg-card/30"
          />
        ))}
      </div>
    </div>
  );
}
