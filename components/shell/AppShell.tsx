import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
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
        <div className="relative flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div id="main" className="relative flex-1 pb-20 md:pb-0">
            {children}
          </div>
        </div>
        <CoachRail />
      </div>
      <MobileTabBar />
    </CoachProvider>
  );
}
