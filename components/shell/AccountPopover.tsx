"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Account popover · the chrome's only "real menu" surface. The Demo
// seat block is now a clickable trigger that opens this popover with
// theme, profile, watched-history, and sign-out entries (all
// placeholder behavior since auth isn't wired yet).
//
// Used by both Sidebar (desktop · opens upward from a bottom-anchored
// trigger) and the More drawer (mobile · same content, no positioning
// concern since the drawer is already a sheet).

type Variant = "sidebar" | "drawer";

type Props = {
  variant?: Variant;
  onItemClick?: () => void;
};

export function AccountPopover({ variant = "sidebar", onItemClick }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click + Esc.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleItemClick() {
    setOpen(false);
    onItemClick?.();
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open account menu"
        className={[
          "flex w-full items-center gap-3 rounded-md px-1.5 py-1.5 text-left transition",
          open ? "bg-muted/40" : "hover:bg-muted/30",
        ].join(" ")}
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-[11px] font-bold text-brand-gold">
          ◐
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-foreground">
            Demo seat
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            founder pro · stage 3
          </div>
        </div>
        <span
          className={[
            "shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition",
            open ? "rotate-180 text-brand-gold" : "text-muted-foreground",
          ].join(" ")}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="menu"
          aria-label="Account menu"
          className={[
            "absolute z-50 w-[260px] overflow-hidden rounded-lg border border-border/80 bg-bg-2 shadow-2xl",
            // Sidebar trigger is at the bottom of the viewport — open
            // upward. Drawer trigger isn't, but the drawer is full
            // bottom-sheet so opening downward overflows the sheet;
            // open upward there too.
            variant === "sidebar"
              ? "bottom-full left-0 mb-2"
              : "bottom-full left-0 mb-2",
          ].join(" ")}
        >
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-gold to-brand-green text-[12px] font-bold text-[#0a1410]">
              ◐
            </div>
            <div className="min-w-0">
              <div className="truncate font-serif text-[14px] font-semibold leading-tight text-foreground">
                Demo seat
              </div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-green">
                founder pro · stage 3
              </div>
            </div>
          </div>

          <ul className="py-1">
            <MenuItem
              label="Profile"
              shortcut="g p"
              icon="◌"
              onClick={handleItemClick}
              kind="link"
              href="/members/profile"
              disabled
            />
            <MenuItem
              label="Watched history"
              shortcut="g l"
              icon="▤"
              onClick={handleItemClick}
              kind="link"
              href="/library"
            />
            <MenuItem
              label="Theme · dark"
              shortcut="—"
              icon="☾"
              onClick={handleItemClick}
              kind="button"
              disabled
            />
          </ul>

          <div className="border-t border-border/60 px-4 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              ⌘K · jump anywhere
            </div>
            <div className="mt-1 text-[11px] leading-snug text-muted-foreground/80">
              Use the command palette for navigation, citations, and the
              full library.
            </div>
          </div>

          <ul className="border-t border-border/60 py-1">
            <MenuItem
              label="Sign out"
              shortcut="—"
              icon="⏻"
              onClick={handleItemClick}
              kind="button"
              variant="danger"
              disabled
            />
          </ul>
          <div className="border-t border-border/60 bg-bg-3/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            prototype · auth lands phase 7
          </div>
        </div>
      )}
    </div>
  );
}

type MenuItemProps =
  | {
      kind: "link";
      label: string;
      icon: string;
      shortcut: string;
      href: string;
      onClick: () => void;
      disabled?: boolean;
      variant?: "default" | "danger";
    }
  | {
      kind: "button";
      label: string;
      icon: string;
      shortcut: string;
      onClick: () => void;
      disabled?: boolean;
      variant?: "default" | "danger";
    };

function MenuItem(props: MenuItemProps) {
  const { label, icon, shortcut, disabled, variant = "default" } = props;
  const className = [
    "flex w-full items-center gap-3 px-4 py-2 text-left text-[12.5px] transition",
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:bg-muted/40 hover:text-foreground",
    variant === "danger" ? "text-destructive" : "text-foreground/85",
  ].join(" ");

  const inner = (
    <>
      <span className="grid h-5 w-5 place-items-center text-base text-muted-foreground">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/80">
        {shortcut}
      </span>
    </>
  );

  if (props.kind === "link" && !disabled) {
    return (
      <li>
        <Link href={props.href} onClick={props.onClick} className={className} role="menuitem">
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={disabled ? undefined : props.onClick}
        disabled={disabled}
        className={className}
        role="menuitem"
      >
        {inner}
      </button>
    </li>
  );
}
