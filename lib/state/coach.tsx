"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Global Coach state · so any surface (home cards, objection cards, clip
// detail buttons) can open the rail and pre-select an exchange or seed
// the input with a context-aware question.

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
  const [activeExchangeId, setActiveExchangeId] = useState<string | null>(null);
  const [primingPrompt, setPrimingPrompt] = useState<string | null>(null);

  const open = useCallback(
    (opts?: { exchangeId?: string; primingPrompt?: string }) => {
      if (opts?.exchangeId) setActiveExchangeId(opts.exchangeId);
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
