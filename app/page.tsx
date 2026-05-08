import { UploadDropzone } from "@/components/upload/UploadDropzone";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border/50">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              PitchOS
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              · partner-grade pitch intelligence
            </span>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            black dog vp · rubric v1.3
          </div>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-6">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-signal-cyan">
              pitch · score · fund
            </div>
            <h1 className="font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              The partner memo your deck deserves —
              <span className="text-signal-cyan"> before</span> you send it.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Upload your seed-stage pitch deck. PitchOS scores it against
              the Black Dog VP rubric, surfaces the named anti-patterns Scott
              would flag, and returns a partner-voiced memo grounded in
              every slide quote.
            </p>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li>· 11-dimension partner rubric</li>
              <li>· 16-pattern objection catalog</li>
              <li>· every claim cited to a slide</li>
              <li>· memo voice regression-tested</li>
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <UploadDropzone />
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>prototype · single-tenant local mode</span>
          <span>mock provider · prompt v0.2</span>
        </div>
      </footer>
    </main>
  );
}
