"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { usePalette } from "@/lib/state/palette";

const TITLES: Record<string, string> = {
  "/": "Home",
  "/library": "Content library",
  "/coach": "AI Coach · Scott-bot",
  "/assessment": "Founder readiness",
  "/dashboard": "Dashboard",
  "/pitchos": "PitchOS Premium",
  "/pricing": "Pricing & tiers",
};

function deriveTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/library/")) return "Library · Clip";
  if (pathname.startsWith("/runs/")) return "PitchOS · running";
  if (pathname.startsWith("/report/")) return "PitchOS · partner memo";
  if (pathname.startsWith("/decks/")) return "Deck";
  return "Black Dog";
}

export function TopBar() {
  const pathname = usePathname();
  const title = deriveTitle(pathname);
  const { open: openPalette } = usePalette();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border/60 bg-background/85 px-4 backdrop-blur sm:px-6">
      {/* Mobile-only brand mark · sidebar's brand isn't visible at <md */}
      <Link href="/" className="flex shrink-0 items-center gap-2 md:hidden">
        <div className="grid h-7 w-9 place-items-center rounded-md bg-black">
          <div className="font-serif text-[9px] font-bold leading-none text-brand-gold">
            BD
            <div className="mt-px font-mono text-[5px] font-bold tracking-[0.1em] text-brand-green">
              VP
            </div>
          </div>
        </div>
      </Link>

      <div className="flex min-w-0 items-baseline gap-3">
        <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:inline">
          {pathname.split("/").filter(Boolean)[0] ?? "discover"}
        </span>
        <span className="hidden text-muted-foreground/60 md:inline">/</span>
        <span className="truncate font-serif text-[14px] font-semibold tracking-tight text-foreground sm:text-[15px]">
          {title}
        </span>
      </div>

      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
          className="hidden w-full max-w-lg items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 py-1.5 text-left transition hover:border-brand-gold/40 hover:bg-muted/50 lg:flex"
        >
          <SearchIcon />
          <span className="flex-1 text-[13px] text-muted-foreground/70">
            Jump anywhere · ask Scott · find a clip
          </span>
          <kbd className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Mobile / tablet · same palette, hardware-keyboardless tap target */}
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
          className="grid h-9 w-9 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-brand-gold/40 hover:text-foreground lg:hidden"
        >
          <SearchIcon />
        </button>

        {/* Stage pill · hides on phone, shows from sm */}
        <div className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/5 px-3 py-1 sm:flex">
          <span className="stage-dot-pulse h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green">
            Stage 3 · Pitch-Ready
          </span>
        </div>

        {/* Phone-only stage indicator — just the dot, tooltip-style label */}
        <div
          aria-label="Stage 3 · Pitch-Ready"
          title="Stage 3 · Pitch-Ready"
          className="grid h-9 w-9 place-items-center rounded-full border border-brand-green/30 bg-brand-green/5 sm:hidden"
        >
          <span className="stage-dot-pulse h-2 w-2 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 stroke-muted-foreground"
      fill="none"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}
