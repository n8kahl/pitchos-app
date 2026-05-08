"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// Global Coach state · so any surface (home cards, objection cards, clip
// detail buttons) can open the rail and pre-select an exchange or seed
// the input with a context-aware question.
//
// activeExchangeId is persisted to sessionStorage so reopening the rail
// after a reload returns to the same context. isOpen and primingPrompt
// stay ephemeral on purpose — popping the rail open on every reload is
// jarring, and the priming text is contextual to the surface that
// triggered open().
//
// The persisted value is read through useSyncExternalStore — sessionStorage
// is the source of truth, so writes from open() show up in every consumer
// without a setState-in-effect cascade.

const STORAGE_KEY = "coach.activeExchangeId";
const STORE_EVENT = "coach:storage";

function readSavedExchange(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSavedExchange(value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.sessionStorage.setItem(STORAGE_KEY, value);
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  } catch {
    // sessionStorage unavailable (private mode, sandbox) — drop the write.
  }
}

function subscribeSavedExchange(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(STORE_EVENT, listener);
  // Cross-tab updates also bubble through the native `storage` event.
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(STORE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

type CoachState = {
  isOpen: boolean;
  activeExchangeId: string | null;
  // Optional pre-filled prompt (e.g. "Ask Scott about this objection")
  primingPrompt: string | null;
  open: (opts?: { exchangeId?: string; primingPrompt?: string }) => void;
  close: () => void;
};

const CoachContext = createContext<CoachState | null>(null);

export function CoachProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [primingPrompt, setPrimingPrompt] = useState<string | null>(null);

  const activeExchangeId = useSyncExternalStore(
    subscribeSavedExchange,
    readSavedExchange,
    () => null
  );

  const open = useCallback(
    (opts?: { exchangeId?: string; primingPrompt?: string }) => {
      if (opts?.exchangeId) writeSavedExchange(opts.exchangeId);
      if (opts?.primingPrompt) setPrimingPrompt(opts.primingPrompt);
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
    // Keep the last selection so reopening returns to context, but clear
    // priming after a tick so it doesn't auto-fill on next manual open.
    setTimeout(() => setPrimingPrompt(null), 250);
  }, []);

  const value = useMemo<CoachState>(
    () => ({ isOpen, activeExchangeId, primingPrompt, open, close }),
    [isOpen, activeExchangeId, primingPrompt, open, close]
  );

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
}

export function useCoach(): CoachState {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error("useCoach must be used within CoachProvider");
  return ctx;
}
