import { Sidebar } from "./Sidebar";
import { MainColumn } from "./MainColumn";
import { CoachRail } from "./CoachRail";
import { MobileTabBar } from "./MobileTabBar";
import { CoachProvider } from "@/lib/state/coach";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
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
    </CoachProvider>
  );
}
