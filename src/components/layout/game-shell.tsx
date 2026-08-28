import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { cn } from "@/lib/utils";

interface GameShellProps {
  children: React.ReactNode;
  topBar: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Show compact Rules/Inbox/Chat/Funds nav (Figma nav-icon-bar) */
  showNav?: boolean;
}

/** Game screens: fixed top bar + scrollable main + optional fixed footer */
export function GameShell({
  children,
  topBar,
  footer,
  className,
  showNav = true,
}: GameShellProps) {
  return (
    <div className={cn("relative flex h-dvh flex-col overflow-hidden bg-bg-tertiary", className)}>
      {showNav && (
        <NavIconBar className="absolute right-3 top-3 z-50 sm:right-4 sm:top-4" />
      )}
      <div className="shrink-0">{topBar}</div>
      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</main>
      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}
