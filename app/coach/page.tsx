import Link from "next/link";

export default function CoachPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-gold transition hover:text-brand-gold-2"
      >
        ← back to platform
      </Link>

      <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
        03 · ai coach · scott-bot
      </div>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground">
        The Coach lands after PitchOS demos to Scott.
      </h1>
      <p className="mt-6 font-serif text-lg leading-relaxed text-muted-foreground">
        Scott-bot is RAG over the full content corpus plus the partner-voice
        profile. Three modes: <em className="font-medium text-foreground">discovery</em>{" "}
        for stage-1 founders, <em className="font-medium text-foreground">structuring</em>{" "}
        for stage-2, <em className="font-medium text-foreground">sharpening</em>{" "}
        for stage-3+ pre-PitchOS. Every answer cites real Scott moments with
        deep links to the source clip.
      </p>

      <div className="mt-12 rounded-md border border-border bg-card/40 p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          architecture · 11_content_platform_strategy.md §5.2
        </div>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] leading-[1.7] text-muted-foreground">{`User question
  → semantic retrieval over content corpus
  → top 5 relevant clips (transcript chunks)
  → constructed prompt with:
      · Scott's voice samples (PartnerProfile)
      · Banned phrases (regression test)
      · Retrieved content as grounding
      · User's Journey Rubric stage
      · User's recent activity context
  → Claude Sonnet response
  → answer + specific clip references + suggested next action`}</pre>
      </div>

      <div className="mt-8 rounded-md border border-brand-gold/30 bg-brand-gold/5 p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-brand-gold">
          sequence
        </div>
        <p className="mt-3 font-serif text-base leading-relaxed text-foreground">
          The Coach is the second-most-important feature after PitchOS itself.
          It lands in Phase 5 of the platform build — after PitchOS premium
          ships and the content corpus is ingested.
        </p>
      </div>
    </main>
  );
}
