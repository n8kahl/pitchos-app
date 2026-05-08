"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    label: "Discover",
    items: [
      { href: "/", label: "Home", icon: "◎" },
      { href: "/library", label: "Content library", icon: "▤" },
      { href: "/coach", label: "AI Coach", icon: "✸" },
      { href: "/assessment", label: "Founder readiness", icon: "◫" },
    ],
  },
  {
    label: "Your fundraise",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "◉" },
      { href: "/pitchos", label: "PitchOS Premium", icon: "★", badge: "premium" },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/pricing", label: "Pricing & tiers", icon: "❑" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-bg-2/60 backdrop-blur md:flex">
      <Link href="/" className="flex items-center gap-3 border-b border-border/60 px-5 py-5">
        <div className="grid h-9 w-11 place-items-center rounded-md bg-black">
          <div className="font-serif text-[10px] font-bold leading-none text-brand-gold">
            BD
            <div className="mt-0.5 font-mono text-[6px] font-bold tracking-[0.1em] text-brand-green">VP</div>
          </div>
        </div>
        <div className="font-serif text-[13px] font-semibold leading-tight">
          Black Dog
          <div className="mt-px font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            the founder platform
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-7 last:mb-0">
            <div className="px-3 pb-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {section.label}
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition",
                        active
                          ? "bg-brand-gold/10 text-foreground shadow-[inset_2px_0_0_var(--color-brand-gold)]"
                          : "text-foreground/75 hover:bg-muted/40 hover:text-foreground",
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

      <div className="border-t border-border/60 px-4 py-4">
        <Link
          href="/pitchos"
          className="block rounded-lg border border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 to-transparent p-3.5 transition hover:border-brand-gold/50 hover:from-brand-gold/15"
        >
          <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-brand-gold">
            ★ pitchos premium
          </div>
          <div className="mt-1.5 font-serif text-[13px] font-semibold leading-tight text-foreground">
            Score a deck →
          </div>
        </Link>
        <div className="mt-3 flex items-center gap-3 px-1">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest text-[11px] font-bold text-brand-gold">
            N
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-semibold text-foreground">Nate</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              founder pro
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
