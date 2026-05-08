"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  body: string;
};

/**
 * Renders the memo prose with [slide N] citations as clickable jumps to
 * the matching slide review further down the page. Anchor scroll +
 * 1.2s flash highlight on the target.
 */
export function MemoBody({ body }: Props) {
  const [pulsing, setPulsing] = useState<number | null>(null);

  const onCite = useCallback((slideNumber: number) => {
    window.dispatchEvent(
      new CustomEvent("pitchos:slide-cite", { detail: { slideNumber } })
    );
    const el = document.getElementById(`slide-${slideNumber}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setPulsing(slideNumber);
  }, []);

  useEffect(() => {
    if (pulsing == null) return;
    const t = setTimeout(() => setPulsing(null), 1400);
    return () => clearTimeout(t);
  }, [pulsing]);

  // Re-run on every render to find the pulsing element and add/remove class.
  useEffect(() => {
    if (pulsing == null) return;
    const el = document.getElementById(`slide-${pulsing}`);
    if (!el) return;
    el.classList.add("memo-cite-pulse");
    const t = setTimeout(() => el.classList.remove("memo-cite-pulse"), 1400);
    return () => clearTimeout(t);
  }, [pulsing]);

  const paragraphs = body.split(/\n\s*\n/);
  return (
    <article className="font-prose text-[17px] leading-[1.75] text-foreground/95">
      {paragraphs.map((para, i) => (
        <p key={i} className="mb-6 max-w-prose">
          {renderCitations(para, onCite)}
        </p>
      ))}
    </article>
  );
}

function renderCitations(
  text: string,
  onCite: (slideNumber: number) => void
): React.ReactNode {
  const parts = text.split(/(\[slide \d+\])/g);
  return parts.map((part, i) => {
    const m = part.match(/^\[slide (\d+)\]$/);
    if (m) {
      const n = Number(m[1]);
      return (
        <button
          key={i}
          onClick={() => onCite(n)}
          aria-label={`Jump to slide ${n} review`}
          className="ml-0.5 inline-block translate-y-[-1px] cursor-pointer rounded-sm border border-border bg-muted/60 px-1.5 py-px align-baseline font-mono text-[10px] tabular-nums tracking-tight text-brand-gold transition hover:border-brand-gold/60 hover:bg-brand-gold/10 hover:text-brand-gold-2"
        >
          {n}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
