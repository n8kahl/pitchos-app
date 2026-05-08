import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProgressView } from "@/components/runs/ProgressView";

type PageProps = {
  params: Promise<{ runId: string }>;
};

// The chrome renders immediately; only the run header + progress
// view wait on the DB. The skeleton preserves the layout shape so
// content lands without shifting under the cursor.
export default async function RunPage({ params }: PageProps) {
  const { runId } = await params;
  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <Suspense fallback={<RunPageSkeleton />}>
        <RunPageBody runId={runId} />
      </Suspense>
    </main>
  );
}

async function RunPageBody({ runId }: { runId: string }) {
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
          <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl tracking-tight text-foreground">
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
