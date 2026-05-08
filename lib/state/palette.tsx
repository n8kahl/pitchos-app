"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Global ⌘K command palette state. Listener attaches once at the
// provider so any surface can also call open() / toggle() directly
// (e.g. the TopBar search button).

type PaletteState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const PaletteContext = createContext<PaletteState | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  // Global ⌘K / Ctrl+K. Esc is handled inside the palette dialog.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isHotkey = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (!isHotkey) return;
      // Don't fight a user typing ⌘K inside a contenteditable element.
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      e.preventDefault();
      setIsOpen((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<PaletteState>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle]
  );

  return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>;
}

export function usePalette(): PaletteState {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within PaletteProvider");
  return ctx;
}
