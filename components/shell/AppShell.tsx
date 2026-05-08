import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CoachRail } from "./CoachRail";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="relative flex-1">{children}</div>
      </div>
      <CoachRail />
    </div>
  );
}
