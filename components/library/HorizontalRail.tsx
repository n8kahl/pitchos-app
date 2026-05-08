"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Horizontal scroller used for the library's secondary media sections
// (podcasts, resources) and the home rails. Keeps three+ cards visible
// without burning vertical real estate. Chevron arrows fade in only when
// there's overflow to scroll into · touch swipe is the primary mobile
// interaction.

type Props = {
  children: ReactNode;
  itemWidthClass?: string; // tailwind sizing for each rail item
  ariaLabel?: string;
};

export function HorizontalRail({
  children,
  itemWidthClass = "w-[300px] sm:w-[340px]",
  ariaLabel,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflowLeft, setHasOverflowLeft] = useState(false);
  const [hasOverflowRight, setHasOverflowRight] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setHasOverflowLeft(el.scrollLeft > 4);
      setHasOverflowRight(
        el.scrollLeft + el.clientWidth < el.scrollWidth - 4
      );
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function nudge(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(280, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className="relative" aria-label={ariaLabel} role={ariaLabel ? "region" : undefined}>
      {/* Track */}
      <div
        ref={trackRef}
        className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Each child becomes a fixed-width snap target */}
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                className={`${itemWidthClass} shrink-0 snap-start`}
              >
                {child}
              </div>
            ))
          : (
              <div className={`${itemWidthClass} shrink-0 snap-start`}>
                {children}
              </div>
            )}
      </div>

      {/* Chevron · left */}
      {hasOverflowLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className="pointer-events-auto absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-bg-2/95 font-mono text-[12px] text-foreground shadow-lg transition hover:border-brand-gold/50 hover:text-brand-gold md:grid"
        >
          ◀
        </button>
      )}
      {/* Chevron · right */}
      {hasOverflowRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className="pointer-events-auto absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full border border-border/80 bg-bg-2/95 font-mono text-[12px] text-foreground shadow-lg transition hover:border-brand-gold/50 hover:text-brand-gold md:grid"
        >
          ▶
        </button>
      )}

      {/* Edge fades · subtle hint that there's more on each side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent"
        style={{ opacity: hasOverflowLeft ? 1 : 0, transition: "opacity 200ms" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent"
        style={{ opacity: hasOverflowRight ? 1 : 0, transition: "opacity 200ms" }}
      />
    </div>
  );
}
