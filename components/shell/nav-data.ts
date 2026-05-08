// Shared nav definitions · used by Sidebar (desktop) + MobileTabBar +
// MobileMenuDrawer so the IA stays consistent across viewports.

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
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

// 5-slot mobile tab bar · the 5 most-used surfaces. Everything else
// lives in the drawer (More tab).
export const MOBILE_TABS: Array<{
  href: string;
  label: string;
  icon: string;
  isMore?: boolean;
}> = [
  { href: "/", label: "Home", icon: "◎" },
  { href: "/library", label: "Library", icon: "▤" },
  { href: "/coach", label: "Coach", icon: "✸" },
  { href: "/pitchos", label: "PitchOS", icon: "★" },
  { href: "#more", label: "More", icon: "···", isMore: true },
];
