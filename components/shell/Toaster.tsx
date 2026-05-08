"use client";

import { useToast, type Toast } from "@/lib/state/toast";

// The toaster surface. One stack, bottom-right on desktop, full-width
// at the top on mobile so it doesn't fight the bottom tab bar.

const VARIANT_ACCENT: Record<Toast["variant"], string> = {
  info: "border-brand-gold/30 bg-bg-2/95",
  success: "border-brand-green/40 bg-bg-2/95",
  warning: "border-signal-amber/40 bg-bg-2/95",
  error: "border-destructive/40 bg-bg-2/95",
};

const VARIANT_DOT: Record<Toast["variant"], string> = {
  info: "bg-brand-gold",
  success: "bg-brand-green",
  warning: "bg-signal-amber",
  error: "bg-destructive",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-2 z-[80] flex flex-col items-stretch gap-2 px-3 sm:inset-x-auto sm:top-auto sm:bottom-6 sm:right-6 sm:max-w-sm sm:px-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.variant === "error" ? "alert" : "status"}
          className={[
            "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur",
            VARIANT_ACCENT[t.variant],
          ].join(" ")}
        >
          <span
            className={[
              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
              VARIANT_DOT[t.variant],
            ].join(" ")}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground">
              {t.title}
            </div>
            {t.description && (
              <div className="mt-1 text-[12.5px] leading-snug text-muted-foreground">
                {t.description}
              </div>
            )}
            {t.actionLabel && t.onAction && (
              <button
                type="button"
                onClick={() => {
                  t.onAction?.();
                  dismiss(t.id);
                }}
                className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold hover:text-brand-gold-2"
              >
                {t.actionLabel}
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition hover:text-foreground"
          >
            close
          </button>
        </div>
      ))}
    </div>
  );
}
