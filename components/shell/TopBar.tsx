"use client";

import { usePathname } from "next/navigation";

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
  if (pathname.startsWith("/library/")) return "Library · Clip detail";
  if (pathname.startsWith("/runs/")) return "PitchOS · analysis in progress";
  if (pathname.startsWith("/report/")) return "PitchOS · partner memo";
  if (pathname.startsWith("/decks/")) return "Deck";
  return "Black Dog";
}

export function TopBar() {
  const pathname = usePathname();
  const title = deriveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-6 border-b border-border/60 bg-background/85 px-6 backdrop-blur">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {pathname.split("/").filter(Boolean)[0] ?? "discover"}
        </span>
        <span className="text-muted-foreground/60">/</span>
        <span className="truncate font-serif text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </span>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="hidden w-full max-w-lg items-center gap-2 rounded-md border border-border/80 bg-muted/30 px-3 py-1.5 transition focus-within:border-brand-gold/60 focus-within:bg-muted/50 lg:flex">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 stroke-muted-foreground"
            fill="none"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Find Scott on… wedge clarity, founder-market fit, vanity metrics"
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/5 px-3 py-1 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)]" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-green">
            Stage 3 · Pitch-Ready
          </span>
        </div>
      </div>
    </header>
  );
}
