"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePalette } from "@/lib/state/palette";
import { useCoach } from "@/lib/state/coach";
import { NAV_SECTIONS } from "./nav-data";
import { COACH_EXAMPLES } from "@/lib/content/coach-exchanges";

// ⌘K command palette · the go-anywhere / run-anything surface that
// makes the chrome feel like an app rather than a doc site. v1 covers
// page navigation + Ask Scott. Library full-text search lands once
// filter state is URL-encoded (Tier 2 follow-up).
//
// Active items use cmdk's `data-selected` attribute, surfaced via
// Tailwind v4 arbitrary-data variants.
const ITEM_BASE =
  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-foreground/85 outline-none transition data-[selected=true]:bg-brand-gold/10 data-[selected=true]:text-foreground";

const HEADING =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-muted-foreground";

export function CommandPalette() {
  const { isOpen, close } = usePalette();
  const router = useRouter();
  const { open: openCoach } = useCoach();

  // Lock body scroll while open + esc to close. cmdk doesn't ship
  // either out of the box.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  function go(href: string) {
    close();
    router.push(href);
  }

  function askCoach(exchangeId: string) {
    close();
    openCoach({ exchangeId });
  }

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="fixed left-1/2 top-[12vh] z-[70] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2"
      >
        <Command
          loop
          className="overflow-hidden rounded-xl border border-border/80 bg-bg-2 shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border/60 px-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              ⌘K
            </span>
            <Command.Input
              autoFocus
              placeholder="Jump to a page · ask Scott · find a clip"
              className="flex-1 bg-transparent py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <kbd className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:inline">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto px-2 pb-2">
            <Command.Empty className="px-4 py-10 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              no matches · try wedge, deck, ICP, why-now
            </Command.Empty>

            <Command.Group heading="Go to" className={HEADING}>
              {NAV_SECTIONS.flatMap((section) =>
                section.items.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`go ${section.label} ${item.label} ${item.href}`}
                    onSelect={() => go(item.href)}
                    className={ITEM_BASE}
                  >
                    <span className="grid h-5 w-5 place-items-center text-base text-muted-foreground transition data-[selected=true]:text-brand-gold">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      {section.label.toLowerCase()}
                    </span>
                  </Command.Item>
                ))
              )}
            </Command.Group>

            <Command.Group heading="Ask Scott" className={HEADING}>
              {COACH_EXAMPLES.map((e) => (
                <Command.Item
                  key={e.id}
                  value={`ask coach scott ${e.mode} ${e.prompt}`}
                  onSelect={() => askCoach(e.id)}
                  className={ITEM_BASE}
                >
                  <span className="grid h-5 w-5 place-items-center text-base text-muted-foreground transition data-[selected=true]:text-brand-gold">
                    ✸
                  </span>
                  <span className="flex-1 truncate">{e.prompt}</span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-green">
                    {e.mode}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-bg-3/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
            <span className="text-brand-gold/70">command palette · prototype</span>
          </div>
        </Command>
      </div>
    </>
  );
}
