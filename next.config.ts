import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Route navigations run through document.startViewTransition, giving
    // the main content a smooth crossfade by default. Chrome elements
    // (sidebar, topbar, tabbar, coach rail) are anchored in globals.css
    // so they stay still while content fades.
    viewTransition: true,
  },
};

export default nextConfig;
