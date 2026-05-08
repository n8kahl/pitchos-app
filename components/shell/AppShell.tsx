import { Sidebar } from "./Sidebar";
import { MainColumn } from "./MainColumn";
import { CoachRail } from "./CoachRail";
import { MobileTabBar } from "./MobileTabBar";
import { CommandPalette } from "./CommandPalette";
import { GlobalShortcuts } from "./GlobalShortcuts";
import { Toaster } from "./Toaster";
import { CoachProvider } from "@/lib/state/coach";
import { PaletteProvider } from "@/lib/state/palette";
import { ToastProvider } from "@/lib/state/toast";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PaletteProvider>
        <CoachProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <div className="flex min-h-screen">
            <Sidebar />
            <MainColumn>{children}</MainColumn>
            <CoachRail />
          </div>
          <MobileTabBar />
          <CommandPalette />
          <GlobalShortcuts />
          <Toaster />
        </CoachProvider>
      </PaletteProvider>
    </ToastProvider>
  );
}
