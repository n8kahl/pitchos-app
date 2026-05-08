"use client";

import { useEffect, useRef, useState } from "react";
import type { LibraryResource } from "@/lib/content/resources";
import { recordVisit } from "@/lib/state/watch-history";

// Branded viewer for a PDF or infographic resource. PDFs render in the
// browser's native PDF viewer via an iframe; infographics render as an
// image. Same gold pulse + cued toast vocabulary as PlayerFrame and
// PodcastEmbed so all three media types share interaction language.

type Props = {
  resource: LibraryResource;
  initialT?: string;
};

export function ResourceViewer({ resource, initialT }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [seekToast, setSeekToast] = useState<string | null>(null);
  const [t] = useState<string | undefined>(initialT);

  // Track the open the same way clip views are tracked. Treat each
  // resource as a "watched" entry so it can show up in continue-reading
  // surfaces later.
  useEffect(() => {
    recordVisit(resource.id, resource.kind === "pdf" ? resource.pages ?? 1 : 1, t);
  }, [resource.id, resource.kind, resource.pages, t]);

  useEffect(() => {
    if (!t) return;
    const el = frameRef.current;
    if (!el) return;
    el.classList.add("memo-cite-pulse");
    setSeekToast(`Cued to ${t}`);
    const t1 = setTimeout(() => el.classList.remove("memo-cite-pulse"), 1400);
    const t2 = setTimeout(() => setSeekToast(null), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [t]);

  // For PDFs, append #page=N when a citation pageRef is "p. N" — most
  // browsers' native viewer honors the fragment.
  const pdfHash = (() => {
    if (!t) return "";
    const m = t.match(/p\.\s*(\d+)/i) ?? t.match(/^(\d+)$/);
    return m ? `#page=${m[1]}` : "";
  })();

  return (
    <div
      ref={frameRef}
      className="relative overflow-hidden rounded-xl border border-border/80 bg-bg-2 transition"
    >
      {resource.kind === "pdf" ? (
        <iframe
          src={`${resource.fileUrl}${pdfHash}`}
          title={resource.title}
          loading="lazy"
          className="block aspect-[8.5/11] w-full border-0 bg-[#0a1410] sm:aspect-[16/10]"
        />
      ) : (
        // Infographics are single-image — render at natural aspect with
        // a brand-true backdrop so the image breathes inside the chrome.
        <div className="relative bg-gradient-to-br from-forest to-[#0c1812] p-4 sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resource.fileUrl}
            alt={resource.title}
            className="mx-auto block max-h-[78vh] w-auto rounded-md shadow-2xl"
          />
        </div>
      )}

      {seekToast && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-md border border-brand-gold/40 bg-bg-2/90 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {seekToast}
        </div>
      )}
    </div>
  );
}
