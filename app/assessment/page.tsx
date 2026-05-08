export default function AssessmentPage() {
  const stages = [
    { n: 1, name: "Idea", trigger: "No customers, no deck", state: "past" },
    { n: 2, name: "Validation", trigger: "Pilot / LOI signal · working on first deck", state: "past" },
    { n: 3, name: "Pitch-Ready", trigger: "Deck v1+ · active customers · starting to pitch", state: "current" },
    { n: 4, name: "Active Fundraise", trigger: "Sending deck · taking partner meetings", state: "future" },
    { n: 5, name: "Post-Funding", trigger: "Round closed · operating + reporting", state: "future" },
  ] as const;

  const dims = [
    { key: "insight", label: "Insight depth", desc: "How well do you understand the problem?", score: 8.2 },
    { key: "traction", label: "Traction signal", desc: "What evidence of demand exists?", score: 6.4 },
    { key: "narrative", label: "Narrative coherence", desc: "Can you articulate the company in 60 seconds?", score: 7.1 },
    { key: "investor", label: "Investor readiness", desc: "Could you handle a partner meeting tomorrow?", score: 5.8 },
  ];

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <header className="mb-8 border-b border-border/40 pb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
          04 · founder readiness · journey rubric v1.0
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground">
          Stage 3 of 5 · Pitch-Ready
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground">
          The Founder Journey Rubric is the entry-tier diagnostic. It routes
          you to the right content, the right Coach mode, and the right
          PitchOS upsell trigger. Re-take monthly.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight text-foreground">
          Where you are
        </h2>
        <ol className="overflow-hidden rounded-xl border border-border/60">
          {stages.map((s) => (
            <li
              key={s.n}
              className={[
                "grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-border/60 px-6 py-4 last:border-b-0",
                s.state === "current" ? "bg-brand-gold/5" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full font-mono text-[12px] font-bold",
                  s.state === "current"
                    ? "bg-brand-gold text-[#0a1410]"
                    : s.state === "past"
                    ? "border border-brand-green bg-brand-green/15 text-brand-green"
                    : "border border-border bg-bg-2 text-muted-foreground",
                ].join(" ")}
              >
                {s.state === "past" ? "✓" : s.n}
              </div>
              <div>
                <div className="font-serif text-[16px] font-semibold leading-tight text-foreground">
                  Stage {s.n} · {s.name}
                </div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  {s.trigger}
                </div>
              </div>
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {s.state === "current" ? "you are here" : s.state}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-5 font-serif text-2xl font-semibold tracking-tight text-foreground">
          Your readiness scores
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {dims.map((d) => (
            <div
              key={d.key}
              className="rounded-xl border border-border/60 bg-card/30 p-5"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {d.label}
                </div>
                <div className="font-mono text-2xl font-bold tabular-nums text-brand-gold">
                  {d.score.toFixed(1)}
                  <span className="ml-0.5 text-xs text-muted-foreground">/10</span>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={[
                    "h-full rounded-full",
                    d.score >= 7 ? "bg-brand-green" : d.score >= 5 ? "bg-brand-gold" : "bg-signal-red",
                  ].join(" ")}
                  style={{ width: `${d.score * 10}%` }}
                />
              </div>
              <p className="mt-3 font-serif text-[13px] leading-snug text-muted-foreground">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold">
          ★ recommended next move
        </div>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-foreground">
          Investor readiness is your weakest dimension.
        </h3>
        <p className="mt-2 font-serif text-[15px] leading-relaxed text-foreground/85">
          The Coach in sharpening mode + a PitchOS run on your current deck
          will move this score the most before your next IC. Estimated lift:{" "}
          <span className="font-bold text-brand-gold">+1.4 to +2.1 points</span>{" "}
          per full cycle.
        </p>
      </section>
    </main>
  );
}
