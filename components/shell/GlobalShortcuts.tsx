"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePalette } from "@/lib/state/palette";
import { useToast } from "@/lib/state/toast";

// Global keyboard shortcuts that make the chrome feel like an app:
// - g h / g l / g c / g d / g p / g r → go-anywhere chords
// - /                                  → open the command palette
// All chords are suppressed while the user is typing in inputs,
// textareas, contenteditable surfaces, or while the palette is open
// (cmdk owns its own keymap).

const CHORD_TIMEOUT_MS = 1_200;

type GoTarget = { href: string; label: string };

const GO_TARGETS: Record<string, GoTarget> = {
  h: { href: "/", label: "Home" },
  l: { href: "/library", label: "Content library" },
  c: { href: "/coach", label: "AI Coach" },
  d: { href: "/dashboard", label: "Dashboard" },
  p: { href: "/pitchos", label: "PitchOS Premium" },
  r: { href: "/assessment", label: "Founder readiness" },
};

function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function GlobalShortcuts() {
  const router = useRouter();
  const { isOpen: paletteOpen, open: openPalette } = usePalette();
  const { toast } = useToast();
  const leaderActive = useRef(false);
  const leaderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function clearLeader() {
      leaderActive.current = false;
      if (leaderTimer.current) {
        clearTimeout(leaderTimer.current);
        leaderTimer.current = null;
      }
    }

    function onKey(e: KeyboardEvent) {
      if (paletteOpen) return;
      if (isTextInput(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // `/` is the universal "focus search / open palette" alias.
      if (key === "/" && !leaderActive.current) {
        e.preventDefault();
        openPalette();
        return;
      }

      // `g` opens the chord window.
      if (key === "g" && !leaderActive.current) {
        e.preventDefault();
        leaderActive.current = true;
        leaderTimer.current = setTimeout(clearLeader, CHORD_TIMEOUT_MS);
        return;
      }

      // Second key of a g-chord.
      if (leaderActive.current) {
        const target = GO_TARGETS[key];
        clearLeader();
        if (target) {
          e.preventDefault();
          router.push(target.href);
          // Light confirmation that the chord fired — also doubles as
          // discoverability for new users learning the keymap.
          toast({
            title: `→ ${target.label}`,
            description: `g ${key}`,
            durationMs: 1_800,
          });
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      clearLeader();
      window.removeEventListener("keydown", onKey);
    };
  }, [router, paletteOpen, openPalette, toast]);

  return null;
}
