import { Sidebar } from "./Sidebar";
import { MainColumn } from "./MainColumn";
import { CoachRail } from "./CoachRail";
import { MobileTabBar } from "./MobileTabBar";
import { CommandPalette } from "./CommandPalette";
import { CoachProvider } from "@/lib/state/coach";
import { PaletteProvider } from "@/lib/state/palette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
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
      </CoachProvider>
    </PaletteProvider>
  );
}
