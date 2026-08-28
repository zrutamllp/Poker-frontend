import type { ReactNode } from "react";
import { AppTopBar } from "./app-top-bar";
import type { AppNavTab } from "@/types/social";
import { cn } from "@/lib/utils";

interface SocialShellProps {
  children: ReactNode;
  activeTab: AppNavTab;
  className?: string;
}

/** Shell for Inbox / Chat / Funds screens with shared top navigation */
export function SocialShell({ children, activeTab, className }: SocialShellProps) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg-primary">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
      <AppTopBar activeTab={activeTab} />
      <div className={cn("relative flex min-h-0 flex-1 flex-col overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
}
