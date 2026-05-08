// Shared nav definitions · used by Sidebar (desktop) + MobileTabBar +
// MobileMenuDrawer + CommandPalette so the IA stays consistent across
// viewports and surfaces.
//
// `action` is set on items that should run an in-app handler instead
// of routing — currently only the AI Coach, which opens the persistent
// rail rather than navigating away.

export type NavAction = "open-coach";

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  action?: NavAction;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Discover",
    items: [
      { href: "/", label: "Home", icon: "◎" },
      { href: "/library", label: "Content library", icon: "▤" },
      { href: "/coach", label: "AI Coach", icon: "✸", action: "open-coach" },
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

// 5-slot mobile tab bar · the 5 most-used surfaces. Everything else
// lives in the drawer (More tab).
export type MobileTab = {
  href: string;
  label: string;
  icon: string;
  isMore?: boolean;
  action?: NavAction;
};

export const MOBILE_TABS: MobileTab[] = [
  { href: "/", label: "Home", icon: "◎" },
  { href: "/library", label: "Library", icon: "▤" },
  { href: "/coach", label: "Coach", icon: "✸", action: "open-coach" },
  { href: "/pitchos", label: "PitchOS", icon: "★" },
  { href: "#more", label: "More", icon: "···", isMore: true },
];
