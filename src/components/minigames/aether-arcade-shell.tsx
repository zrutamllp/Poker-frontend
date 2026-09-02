import { Gamepad2 } from "lucide-react";
import { MinigameAmbientFx } from "@/components/minigames/minigame-motion";
import { cn } from "@/lib/utils";

interface AetherArcadeShellProps {
  gameLabel: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/** Shared Aether Arcade platform chrome for culture-coin minigames */
export function AetherArcadeShell({
  gameLabel,
  children,
  className,
  contentClassName,
}: AetherArcadeShellProps) {
  return (
    <div
      className={cn(
        "relative flex h-dvh flex-col overflow-hidden border-2 border-[#28254a] bg-[#080711]",
        className,
      )}
    >
      <MinigameAmbientFx />

      <header className="mg-header-pulse relative z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-[#28254a] bg-[#121124]/95 px-4 backdrop-blur-sm sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 animate-[mg-correct-pulse_2s_ease-in-out_infinite] items-center justify-center rounded-lg bg-[#8b5cf6] shadow-[0_0_6px_rgba(139,92,246,0.5)]">
            <Gamepad2 className="size-5 text-white" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-wide text-white sm:text-xl">
            AETHER ARCADE
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-[20px] border border-[#28254a] bg-[#1a1935] px-4 py-1.5 sm:flex">
          <span className="size-2 animate-[mg-pin-pulse_1.5s_ease-in-out_infinite] rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
          <span className="text-sm font-semibold text-white">{gameLabel}</span>
        </div>
      </header>

      <div className={cn("relative z-10 min-h-0 flex-1 overflow-y-auto", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
