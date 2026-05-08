"use client";

import { useCoach } from "@/lib/state/coach";

type Props = {
  primingPrompt: string;
  exchangeId?: string;
  variant?: "primary" | "ghost";
  className?: string;
  children?: React.ReactNode;
};

export function AskCoachButton({
  primingPrompt,
  exchangeId,
  variant = "ghost",
  className,
  children,
}: Props) {
  const { open } = useCoach();
  const palette =
    variant === "primary"
      ? "bg-brand-gold text-[#0a1410] hover:bg-brand-gold-2"
      : "border border-brand-gold/40 bg-brand-gold/5 text-brand-gold hover:bg-brand-gold/10";
  return (
    <button
      type="button"
      onClick={() => open({ exchangeId, primingPrompt })}
      className={[
        "inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition",
        palette,
        className ?? "",
      ].join(" ")}
    >
      {children ?? "✸ ask coach"}
    </button>
  );
}
