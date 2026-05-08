import Link from "next/link";
import { UploadDropzone } from "@/components/upload/UploadDropzone";

export default function PitchOSPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-baseline gap-3 transition hover:opacity-80"
          >
            <span className="font-serif text-sm font-semibold tracking-tight text-foreground">
              Black Dog
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              · platform · pitchos
            </span>
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-gold transition hover:text-brand-gold-2"
          >
            ← back to platform
          </Link>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-6">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
              ★ pitchos premium · the deep-grade exam
            </div>
            <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground">
              The partner memo your deck deserves —
              <span className="text-brand-gold"> before</span> you send it.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Upload a seed-stage pitch deck. PitchOS scores it against the
              Black Dog VP rubric v1.3, surfaces the named anti-patterns
              Scott would flag, and returns a partner-voiced memo grounded
              in every slide quote.
            </p>
            <ul className="space-y-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <li>· 11-dimension partner rubric</li>
              <li>· 16-pattern objection catalog · closed</li>
              <li>· every claim cited to a slide</li>
              <li>· memo voice regression-tested</li>
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <UploadDropzone />
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>prototype · single-tenant local mode</span>
          <span>mock provider · prompt v0.2 · rubric v1.3</span>
        </div>
      </footer>
    </main>
  );
}
