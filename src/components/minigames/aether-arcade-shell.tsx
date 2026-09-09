import type { ReactNode } from "react";
import { Diamond, Spade } from "lucide-react";
import { MinigameAmbientFx } from "@/components/minigames/minigame-motion";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { GlobalSessionTimer } from "@/components/minigames/global-session-timer";
import { cn } from "@/lib/utils";

interface AetherArcadeShellProps {
  gameLabel: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Full-width custom header (e.g. crossword title block) */
  header?: ReactNode;
  /** Right side of default header (score, pause, etc.) */
  headerActions?: ReactNode;
}

/** Shared culture-table shell for all minigames */
export function AetherArcadeShell({
  gameLabel,
  subtitle,
  children,
  className,
  contentClassName,
  header,
  headerActions,
}: AetherArcadeShellProps) {
  return (
    <div
      className={cn(
        "relative flex h-dvh flex-col overflow-hidden",
        theme.pageBg,
        className,
      )}
    >
      <MinigameAmbientFx />
      <Spade className="pointer-events-none absolute left-8 top-16 size-32 text-white/[0.03] sm:size-40" />
      <Diamond className="pointer-events-none absolute bottom-24 right-8 size-32 text-white/[0.03] sm:size-40" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        {header ? (
          <div
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 border-b px-[clamp(10px,2.5vw,24px)] py-[clamp(6px,1.2vh,10px)]",
              theme.header,
            )}
          >
            {header}
            <div className="flex shrink-0 items-center gap-2">
              <GlobalSessionTimer />
              <NavIconBar />
            </div>
          </div>
        ) : (
          <header
            className={cn(
              "relative shrink-0 border-b px-[clamp(10px,2.5vw,24px)] py-[clamp(6px,1.2vh,10px)]",
              theme.header,
            )}
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <Spade className="size-3 text-gold-light sm:size-3.5" />
                  <span
                    className="font-extrabold uppercase tracking-wide text-gold-light"
                    style={{ fontSize: "clamp(9px, 1.6vh, 10px)" }}
                  >
                    The culture table
                  </span>
                  <Diamond className="size-3 text-gold-light sm:size-3.5" />
                </div>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0">
                  <p
                    className="truncate font-serif font-black text-gold-light"
                    style={{ fontSize: "clamp(14px, 2.6vh, 20px)" }}
                  >
                    {gameLabel}
                  </p>
                  {subtitle && (
                    <p
                      className="truncate text-text-muted"
                      style={{ fontSize: "clamp(9px, 1.6vh, 10px)" }}
                    >
                      · {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {headerActions}
                <GlobalSessionTimer />
                <NavIconBar />
              </div>
            </div>
          </header>
        )}

        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col",
            contentClassName ?? "overflow-y-auto",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
