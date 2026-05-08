"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { useCoach } from "@/lib/state/coach";
import { TopBar } from "./TopBar";
import { FounderJourneyStrip } from "./FounderJourneyStrip";

// Reserves the right gutter for the Coach Rail at lg+ in three states:
//   /coach          → mr-0   (rail hidden; the page IS the Coach)
//   isOpen          → mr-420 (full docked rail)
//   default closed  → mr-12  (48px collapsed strip stays reachable)
// Below lg the rail is a modal; nothing is reserved.
//
// The page area is wrapped in <ViewTransition> so route navigations
// crossfade through document.startViewTransition. The shell chrome is
// anchored via view-transition-name in globals.css so only the content
// fades while sidebar / topbar / tabbar stay still.
export function MainColumn({ children }: { children: React.ReactNode }) {
  const { isOpen } = useCoach();
  const pathname = usePathname();
  const onCoachPage = pathname === "/coach";

  const lgMargin = onCoachPage
    ? "lg:mr-0"
    : isOpen
    ? "lg:mr-[420px]"
    : "lg:mr-12";

  return (
    <div
      className={[
        "relative flex min-w-0 flex-1 flex-col",
        "transition-[margin-right] duration-300 ease-out",
        lgMargin,
      ].join(" ")}
    >
      <TopBar />
      <FounderJourneyStrip />
      <div id="main" className="relative flex-1 pb-20 md:pb-0">
        <ViewTransition>{children}</ViewTransition>
      </div>
    </div>
  );
}
