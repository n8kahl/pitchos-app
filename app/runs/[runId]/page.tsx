import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProgressView } from "@/components/runs/ProgressView";

type PageProps = {
  params: Promise<{ runId: string }>;
};

export default async function RunPage({ params }: PageProps) {
  const { runId } = await params;
  const run = await db.analysisRun.findUnique({
    where: { id: runId },
    include: {
      deck: { include: { project: true } },
    },
  });

  if (!run) notFound();

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
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
    </main>
  );
}
