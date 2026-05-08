"use client";

import { ViewTransition } from "react";
import { useCoach } from "@/lib/state/coach";
import { TopBar } from "./TopBar";

// On lg+ the Coach Rail docks (no backdrop, no overlay) so a founder can
// read the memo and interrogate it at the same time. Below lg the rail
// stays modal — there isn't enough horizontal room to dock without
// crushing the main column.
//
// The page area is wrapped in <ViewTransition> so route navigations
// crossfade through document.startViewTransition. The shell chrome is
// anchored via view-transition-name in globals.css so only the content
// fades while sidebar / topbar / tabbar stay still.
export function MainColumn({ children }: { children: React.ReactNode }) {
  const { isOpen } = useCoach();

  return (
    <div
      className={[
        "relative flex min-w-0 flex-1 flex-col",
        "transition-[margin-right] duration-300 ease-out",
        isOpen ? "lg:mr-[420px]" : "lg:mr-0",
      ].join(" ")}
    >
      <TopBar />
      <div id="main" className="relative flex-1 pb-20 md:pb-0">
        <ViewTransition>{children}</ViewTransition>
      </div>
    </div>
  );
}
