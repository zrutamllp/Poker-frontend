import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Full-height flex column for single-screen minigame layouts */
export function MinigameViewport({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MinigameViewportMain({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        className,
      )}
    >
      {children}
    </main>
  );
}

export function MinigameViewportFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-border/30 pt-[clamp(6px,1.2vh,10px)]",
        className,
      )}
    >
      {children}
    </footer>
  );
}
