import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type PageProps = {
  params: Promise<{ deckId: string }>;
};

export default async function DeckLandingPage({ params }: PageProps) {
  const { deckId } = await params;
  const deck = await db.deck.findFirst({
    where: { id: deckId, deletedAt: null },
    include: { project: true },
  });

  if (!deck) notFound();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal-cyan">
        deck received
      </div>
      <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight text-foreground">
        {deck.project.companyName}
      </h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {deck.fileName} · {(deck.fileSizeBytes / 1024 / 1024).toFixed(2)} MB ·
        sha256 {deck.checksum.slice(0, 12)}…
      </p>

      <section className="mt-12 rounded-lg border border-border bg-card/40 p-6">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          status
        </div>
        <div className="mt-2 font-sans text-lg text-foreground">
          Stored. Analysis orchestrator is wired in Phase 4 — until then this
          page confirms the upload landed and the dedup checksum is stable.
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-y-3 font-mono text-xs uppercase tracking-widest">
          <dt className="text-muted-foreground">deck id</dt>
          <dd className="text-foreground">{deck.id}</dd>
          <dt className="text-muted-foreground">project id</dt>
          <dd className="text-foreground">{deck.project.id}</dd>
          <dt className="text-muted-foreground">storage key</dt>
          <dd className="break-all text-foreground">{deck.storageKey}</dd>
          <dt className="text-muted-foreground">uploaded</dt>
          <dd className="text-foreground">
            {deck.uploadedAt.toISOString()}
          </dd>
        </dl>
      </section>

      <Link
        href="/"
        className="mt-8 font-mono text-xs uppercase tracking-widest text-signal-cyan hover:text-signal-cyan/80"
      >
        ← upload another deck
      </Link>
    </main>
  );
}
