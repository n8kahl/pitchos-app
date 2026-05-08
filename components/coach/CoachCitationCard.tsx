import Link from "next/link";
import type { CoachCitation } from "@/lib/content/coach-exchanges";
import { getClipById, SHOW_LABELS } from "@/lib/content/sample-clips";
import { getEpisodeById } from "@/lib/content/podcast-episodes";
import { getResourceById } from "@/lib/content/resources";

// Single citation chip used in the Coach rail and on the /coach page.
// Discriminates on `kind` so each media type renders its own icon,
// metadata row, and click target. Returns null and logs in dev if a
// citation references a missing asset id (catch corpus drift early).

export function CoachCitationCard({
  citation,
  onSelect,
}: {
  citation: CoachCitation;
  onSelect?: () => void;
}) {
  if (citation.kind === "video") {
    const clip = getClipById(citation.clipId);
    if (!clip) return null;
    return (
      <Link
        href={`/library/${clip.id}?t=${citation.at}`}
        onClick={onSelect}
        className="block rounded-md border border-brand-gold/20 bg-brand-gold/5 px-3.5 py-3 transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
      >
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-gold">
          <span className="flex items-center gap-1.5">
            <PlayGlyph />
            video · {SHOW_LABELS[clip.show]}
          </span>
          <span className="shrink-0">play at {citation.at} →</span>
        </div>
        <p className="mt-1.5 font-prose text-[13px] italic leading-snug text-foreground/85">
          &ldquo;{citation.excerpt}&rdquo;
        </p>
      </Link>
    );
  }

  if (citation.kind === "podcast") {
    const ep = getEpisodeById(citation.episodeId);
    if (!ep) return null;
    return (
      <Link
        href={`/library/podcasts/${ep.id}?t=${citation.at}`}
        onClick={onSelect}
        className="block rounded-md border border-brand-green/25 bg-brand-green/5 px-3.5 py-3 transition hover:border-brand-green/50 hover:bg-brand-green/10"
      >
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-green">
          <span className="flex items-center gap-1.5">
            <MicGlyph />
            podcast · {ep.show}
          </span>
          <span className="shrink-0">cued at {citation.at} →</span>
        </div>
        <p className="mt-1.5 font-prose text-[13px] italic leading-snug text-foreground/85">
          &ldquo;{citation.excerpt}&rdquo;
        </p>
      </Link>
    );
  }

  // resource
  const resource = getResourceById(citation.resourceId);
  if (!resource) return null;
  // Route to the internal viewer; pass `?t=<pageRef>` so the viewer
  // can deep-link the iframe to the right page when the user lands.
  const href = citation.pageRef
    ? `/library/resources/${resource.id}?t=${encodeURIComponent(citation.pageRef)}`
    : `/library/resources/${resource.id}`;
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="block rounded-md border border-sage/25 bg-sage/5 px-3.5 py-3 transition hover:border-sage/50 hover:bg-sage/10"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-sage">
        <span className="flex items-center gap-1.5">
          <DocGlyph />
          {resource.kind === "pdf" ? "pdf" : "infographic"} · {resource.source}
        </span>
        <span className="shrink-0">
          {citation.pageRef ?? "open"} →
        </span>
      </div>
      <p className="mt-1.5 font-prose text-[13px] italic leading-snug text-foreground/85">
        &ldquo;{citation.excerpt}&rdquo;
      </p>
    </Link>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function MicGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5v6a4.5 4.5 0 0 0 9 0V6A4.5 4.5 0 0 0 12 1.5z" />
      <path d="M3.75 11.25v.75a8.25 8.25 0 0 0 16.5 0v-.75" />
      <path d="M12 20.25V22.5" />
    </svg>
  );
}

function DocGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M9 14h6" />
      <path d="M9 18h6" />
    </svg>
  );
}
