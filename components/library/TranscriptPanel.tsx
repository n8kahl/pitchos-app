"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SampleClip } from "@/lib/content/sample-clips";

// AI-generated transcript panel · expands below the player when the
// user clicks "Show transcript". Built at runtime by interleaving
// the clip's structured chapters and pulled key-moment quotes into a
// chronological list. Each line is a Link with `?t=` so clicking
// any segment seeks the YouTube iframe to that timestamp via the
// existing PlayerFrame remount-on-key pattern.

type TranscriptLine =
  | { kind: "chapter"; at: string; title: string; summary: string }
  | { kind: "moment"; at: string; quote: string };

function timecodeToSeconds(t: string): number {
  const parts = t.split(":").map((n) => parseInt(n, 10));
  if (parts.some((p) => Number.isNaN(p))) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function buildTranscript(clip: SampleClip): TranscriptLine[] {
  const lines: TranscriptLine[] = [];
  for (const c of clip.chapters) {
    lines.push({
      kind: "chapter",
      at: c.at,
      title: c.title,
      summary: c.summary,
    });
  }
  for (const m of clip.keyMoments) {
    lines.push({ kind: "moment", at: m.at, quote: m.quote });
  }
  lines.sort((a, b) => timecodeToSeconds(a.at) - timecodeToSeconds(b.at));
  return lines;
}

export function TranscriptPanel({ clip }: { clip: SampleClip }) {
  const [open, setOpen] = useState(false);
  const lines = useMemo(() => buildTranscript(clip), [clip]);

  return (
    <section className="mt-6 rounded-xl border border-border/60 bg-card/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-card/50"
      >
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            ai-extracted transcript · structured passages
          </div>
          <div className="mt-1 text-[13px] leading-snug text-muted-foreground">
            {lines.length} segment{lines.length === 1 ? "" : "s"} · click any
            timestamp to seek the player
          </div>
        </div>
        <span
          className={[
            "shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition",
            open ? "rotate-180 text-brand-gold" : "text-muted-foreground",
          ].join(" ")}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && (
        <ol className="border-t border-border/60">
          {lines.map((line, i) => (
            <li
              key={`${line.at}-${i}`}
              className="grid grid-cols-[68px_1fr] gap-4 border-b border-border/60 px-5 py-4 transition last:border-b-0 hover:bg-card/50"
            >
              <Link
                href={`?t=${line.at}`}
                className="font-mono text-[12px] font-semibold tabular-nums text-brand-gold hover:text-brand-gold-2"
              >
                {line.at}
              </Link>
              {line.kind === "chapter" ? (
                <div>
                  <div className="text-[14px] font-semibold leading-snug text-foreground">
                    {line.title}
                  </div>
                  <p className="mt-1 font-prose text-[13.5px] leading-[1.7] text-foreground/85">
                    {line.summary}
                  </p>
                </div>
              ) : (
                <blockquote className="border-l-2 border-brand-green/60 pl-3 font-prose text-[14px] italic leading-snug text-foreground/90">
                  &ldquo;{line.quote}&rdquo;
                </blockquote>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
