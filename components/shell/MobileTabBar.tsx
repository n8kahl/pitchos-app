"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MOBILE_TABS, NAV_SECTIONS } from "./nav-data";

export function MobileTabBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/60 bg-bg-2/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {MOBILE_TABS.map((t) => {
          const active = !t.isMore && isActive(t.href);
          if (t.isMore) {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                aria-label="Open more navigation"
                className={[
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.1em] transition",
                  moreOpen ? "text-brand-gold" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-[0.1em] transition",
                active
                  ? "text-brand-gold"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
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
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={[
                          "flex items-center gap-3 rounded-md px-3 py-3 text-[14px] transition",
                          active
                            ? "bg-brand-gold/10 text-foreground"
                            : "text-foreground/85 hover:bg-muted/40",
                        ].join(" ")}
                      >
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
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-2 flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest text-[11px] font-bold text-brand-gold">
            ◐
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-foreground">
              Demo seat
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              founder pro · stage 3
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
