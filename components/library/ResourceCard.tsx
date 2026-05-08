import Link from "next/link";
import type { LibraryResource } from "@/lib/content/resources";

// PDF / infographic card. Uses a brand-true SVG/CSS cover instead of
// hosted thumbnail imagery so every resource ships with consistent
// chrome and zero extra asset overhead. View routes to the internal
// /library/resources/[id] viewer page; Download forces a save of the
// underlying file with its original filename.

const ACCENT_GRADIENT: Record<LibraryResource["coverAccent"], string> = {
  gold: "from-[#1a2218] via-[#1c2a1c] to-[#2a3520]",
  green: "from-[#11201a] via-[#143025] to-[#1c4030]",
  sage: "from-[#101a13] via-[#16241a] to-[#202f18]",
};

const ACCENT_TEXT: Record<LibraryResource["coverAccent"], string> = {
  gold: "text-brand-gold",
  green: "text-brand-green",
  sage: "text-sage",
};

export function ResourceCard({ resource }: { resource: LibraryResource }) {
  const filename = resource.fileUrl.split("/").pop() ?? "resource";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card/40 transition hover:-translate-y-0.5 hover:border-brand-gold/40">
      <div
        className={`relative aspect-[16/10] bg-gradient-to-br ${ACCENT_GRADIENT[resource.coverAccent]}`}
      >
        {/* Subtle gold/green grain · tiny accent that matches Home cards */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,200,66,0.10),transparent_60%),radial-gradient(circle_at_75%_70%,rgba(60,169,74,0.08),transparent_60%)]" />
        <div className="absolute inset-x-5 top-5">
          <div
            className={`font-mono text-[9px] font-bold uppercase tracking-[0.18em] ${ACCENT_TEXT[resource.coverAccent]}`}
          >
            {resource.coverEyebrow}
          </div>
        </div>
        <div className="absolute inset-x-5 bottom-5">
          <div className="font-serif text-2xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
            {resource.coverTitle}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {resource.kind === "pdf"
              ? `pdf · ${resource.pages ?? "?"} pages · ${formatSize(resource.fileSizeKB)}`
              : "infographic · single page"}
          </div>
        </div>
        {/* Type badge top-right */}
        <span className="absolute right-4 top-4 rounded-sm bg-black/55 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-tight text-foreground">
          {resource.kind === "pdf" ? "PDF" : "JPG"}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-4 sm:px-6 sm:py-5">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {resource.source}
        </div>
        <h3 className="mt-2 font-serif text-lg font-semibold leading-tight tracking-tight text-foreground">
          {resource.title}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
          {resource.blurb}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
          {resource.rubricDims.slice(0, 2).map((d) => (
            <span
              key={d}
              className="rounded-sm bg-brand-gold/10 px-1.5 py-0.5 text-brand-gold"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
          <Link
            href={`/library/resources/${resource.id}`}
            className="rounded-md bg-brand-gold px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0a1410] transition hover:bg-brand-gold-2"
          >
            View →
          </Link>
          <a
            href={resource.fileUrl}
            download={filename}
            className="rounded-md border border-border/80 px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/85 transition hover:border-brand-gold/40 hover:text-foreground"
          >
            Download
          </a>
          <Link
            href={`/library/resources/${resource.id}/podcast?generate=1`}
            className="col-span-2 rounded-md border border-brand-green/30 bg-brand-green/5 px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green transition hover:border-brand-green/60 hover:bg-brand-green/10"
          >
            ★ Generate podcast →
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatSize(kb?: number): string {
  if (!kb) return "";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
