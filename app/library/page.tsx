import Link from "next/link";

export default function LibraryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16">
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-gold transition hover:text-brand-gold-2"
      >
        ← back to platform
      </Link>

      <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold">
        02 · content library
      </div>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-foreground">
        The library lands once Scott&rsquo;s corpus is ingested.
      </h1>
      <p className="mt-6 font-serif text-lg leading-relaxed text-muted-foreground">
        VC Fast Pitch (~50 episodes), the Emerging Managers Podcast, Scott&rsquo;s
        guest appearances, and his long-form writing — transcribed, chaptered,
        tagged by rubric dimension, and surfaced as a structured curriculum.
      </p>
      <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
        Build plan in <code className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm">16_content_engine_plan.md</code> · 16-week sub-project · estimated $40–80K services or +5–10% equity in the cofounder structure.
      </p>

      <div className="mt-12 rounded-md border border-border bg-card/40 p-6">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          interim · until ingestion ships
        </div>
        <ul className="mt-4 space-y-3 text-foreground/90">
          <li>
            <a
              href="https://www.youtube.com/@VCFastPitch"
              target="_blank"
              rel="noreferrer"
              className="font-serif text-base font-semibold text-brand-gold hover:underline"
            >
              VC Fast Pitch · YouTube →
            </a>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Monthly live pitch events. Founders present, investors react.
            </div>
          </li>
          <li>
            <a
              href="https://www.prnewswire.com/news-releases/emerging-managers-podcast-launches-highlighting-new-players-in-venture-capital-outperforming-the-status-quo-302432523.html"
              target="_blank"
              rel="noreferrer"
              className="font-serif text-base font-semibold text-brand-gold hover:underline"
            >
              Emerging Managers Podcast →
            </a>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Why new VC funds outperform the status quo.
            </div>
          </li>
          <li>
            <a
              href="https://blackdogventurepartners.com/"
              target="_blank"
              rel="noreferrer"
              className="font-serif text-base font-semibold text-brand-gold hover:underline"
            >
              Black Dog Venture Partners →
            </a>
            <div className="mt-0.5 text-sm text-muted-foreground">
              The parent brand. 30 years of operator-investor experience.
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}
