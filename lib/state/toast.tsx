"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Lightweight toast queue. Hand-rolled to stay dependency-free and to
// match the brand surface exactly (no Sonner / Radix theming dance).
//
// The Toaster renders the queue and is mounted once in AppShell.
// Anywhere can call useToast().toast({...}) to enqueue.

export type ToastVariant = "info" | "success" | "warning" | "error";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  // Auto-dismiss after this many ms. Pass 0 for sticky.
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

export type Toast = ToastOptions & {
  id: number;
  variant: ToastVariant;
};

type ToastContextValue = {
  toasts: Toast[];
  toast: (opts: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 3_500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (opts: ToastOptions): number => {
      const id = ++idCounter.current;
      const next: Toast = {
        ...opts,
        id,
        variant: opts.variant ?? "info",
      };
      setToasts((prev) => [...prev, next]);
      const duration = opts.durationMs ?? DEFAULT_DURATION_MS;
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
      return id;
    },
    []
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
