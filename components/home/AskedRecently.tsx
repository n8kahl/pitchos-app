"use client";

import { useCoach } from "@/lib/state/coach";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";

export function AskedRecently() {
  const { open } = useCoach();
  const items = COACH_EXAMPLES.slice(0, 3);

  return (
    <section className="rounded-xl border border-border/80 bg-card/40 p-6">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold">
        asked recently · scott replied
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((q) => (
          <li key={q.id}>
            <button
              type="button"
              onClick={() => open({ exchangeId: q.id })}
              className="block w-full rounded-md border border-border/60 bg-bg-2/60 px-3.5 py-2.5 text-left text-[13px] leading-snug text-foreground/85 transition hover:border-brand-gold/40 hover:bg-bg-2 hover:text-foreground"
            >
              {q.prompt}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        tap any to play it back · grounded in real clips
      </div>
    </section>
  );
}
