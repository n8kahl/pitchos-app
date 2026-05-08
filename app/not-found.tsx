import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-start justify-center px-5 py-16 sm:px-8">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
        404 · not in the corpus
      </div>
      <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
        That URL doesn&rsquo;t resolve to anything Scott has filed.
      </h1>
      <p className="mt-4 max-w-prose font-serif text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
        Either the link is wrong or that surface ships in a later phase.
        The platform&rsquo;s build plan lives in the parent strategy folder
        if you&rsquo;re curious.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-bold text-[#0a1410] transition hover:bg-brand-gold-2"
        >
          Back home →
        </Link>
        <Link
          href="/library"
          className="inline-flex items-center gap-2 rounded-md border border-border/80 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-muted-foreground hover:bg-muted/40"
        >
          Open the library
        </Link>
      </div>
      <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        ask the Coach if you&rsquo;re looking for something specific
      </div>
    </main>
  );
}
