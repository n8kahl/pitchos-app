"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MOBILE_TABS, NAV_SECTIONS } from "./nav-data";
import { AccountPopover } from "./AccountPopover";
import { useCoach } from "@/lib/state/coach";

export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { open: openCoach, isOpen: coachIsOpen } = useCoach();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const tabClass = (active: boolean) =>
    [
      "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.1em] transition",
      active ? "text-brand-gold" : "text-muted-foreground hover:text-foreground",
    ].join(" ");

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/60 bg-bg-2/95 backdrop-blur md:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          viewTransitionName: "app-mobile-tabbar",
        }}
      >
        {MOBILE_TABS.map((t) => {
          if (t.isMore) {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                aria-label="Open more navigation"
                className={tabClass(moreOpen)}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          }
          if (t.action === "open-coach") {
            const active = coachIsOpen;
            return (
              <button
                key={t.href}
                type="button"
                onClick={() => openCoach()}
                aria-label="Open Scott AI Coach"
                aria-expanded={active}
                className="flex flex-col items-center justify-center gap-1 py-2 transition"
              >
                <span
                  className={[
                    "flex items-center justify-center rounded-full px-3 py-1.5 transition-all duration-200",
                    active
                      ? "bg-brand-gold shadow-[0_0_12px_2px_rgba(var(--brand-gold-rgb,180,140,60),0.4)] scale-105"
                      : "bg-brand-gold/15 hover:bg-brand-gold/25",
                  ].join(" ")}
                >
                  <span className={["text-base leading-none", active ? "text-[#0a0e0c]" : "text-brand-gold"].join(" ")}>
                    {t.icon}
                  </span>
                </span>
                <span className={[
                  "font-mono text-[10px] uppercase tracking-[0.1em]",
                  active ? "text-brand-gold" : "text-brand-gold/70",
                ].join(" ")}>
                  {t.label}
                </span>
              </button>
            );
          }
          const active = isActive(t.href);
          return (
            <Link key={t.href} href={t.href} className={tabClass(active)}>
              <span
                className={[
                  "text-lg leading-none",
                  active ? "scale-110" : "",
                ].join(" ")}
              >
                {t.icon}
              </span>
              <span>{t.label}</span>
              {active && (
                <span className="absolute top-0 h-0.5 w-10 rounded-full bg-brand-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {moreOpen && (
        <MoreDrawer onClose={() => setMoreOpen(false)} pathname={pathname} />
      )}
    </>
  );
}

function MoreDrawer({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const { open: openCoach, isOpen: coachIsOpen } = useCoach();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="More navigation"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border/60 bg-bg-2 p-5 shadow-2xl md:hidden"
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-11 place-items-center rounded-md bg-black">
              <div className="font-serif text-[10px] font-bold leading-none text-brand-gold">
                BD
                <div className="mt-0.5 font-mono text-[6px] font-bold tracking-[0.1em] text-brand-green">
                  VP
                </div>
              </div>
            </div>
            <div className="font-serif text-[13px] font-semibold leading-tight">
              Black Dog
              <div className="mt-px font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                the founder platform
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md border border-border/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
          >
            close
          </button>
        </div>

        <nav className="mt-7">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <div className="px-2 pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {section.label}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isCoach = item.action === "open-coach";
                  const active = isCoach ? coachIsOpen : isActive(item.href);
                  const className = isCoach
                    ? [
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-[14px] transition border",
                        active
                          ? "border-brand-gold/60 bg-brand-gold/15 text-foreground"
                          : "border-brand-gold/25 bg-brand-gold/[0.06] text-foreground hover:bg-brand-gold/12",
                      ].join(" ")
                    : [
                        "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-[14px] transition",
                        active
                          ? "bg-brand-gold/10 text-foreground"
                          : "text-foreground/85 hover:bg-muted/40",
                      ].join(" ");
                  const inner = isCoach ? (
                    <>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-base text-brand-gold">
                        {item.icon}
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold text-foreground">{item.label}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-brand-gold/70">
                          Ask Scott anything
                        </span>
                      </span>
                      <span className="font-mono text-[10px] text-brand-gold">→</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={[
                          "flex h-5 w-5 shrink-0 items-center justify-center text-base",
                          active ? "text-brand-gold" : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-sm bg-brand-gold/15 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-brand-gold">
                          {item.badge}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <li key={item.href}>
                      {item.action === "open-coach" ? (
                        <button
                          type="button"
                          onClick={() => {
                            openCoach();
                            onClose();
                          }}
                          aria-expanded={coachIsOpen}
                          className={className}
                        >
                          {inner}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={className}
                        >
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-2 rounded-lg border border-border/60 bg-card/40 px-2 py-2">
          <AccountPopover variant="drawer" onItemClick={onClose} />
        </div>
      </aside>
    </>
  );
}
