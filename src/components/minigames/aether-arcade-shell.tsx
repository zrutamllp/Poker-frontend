import { Award, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AetherArcadeShellProps {
  gameLabel: string;
  children: React.ReactNode;
  className?: string;
}

/** Shared Aether Arcade platform chrome for culture-coin minigames */
export function AetherArcadeShell({ gameLabel, children, className }: AetherArcadeShellProps) {
  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden border-2 border-[#28254a] bg-[#080711]",
        className,
      )}
    >
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#28254a] bg-[#121124] px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#8b5cf6] shadow-[0_0_6px_rgba(139,92,246,0.5)]">
            <Gamepad2 className="size-5 text-white" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-wide text-white sm:text-xl">
            AETHER ARCADE
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-[20px] border border-[#28254a] bg-[#1a1935] px-4 py-1.5 sm:flex">
          <span className="size-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4]" />
          <span className="text-sm font-semibold text-white">{gameLabel}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-1.5 sm:flex">
            <Award className="size-4 text-[#f59e0b]" />
            <span className="font-mono text-[13px] font-bold text-[#f59e0b]">24,850 XP</span>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-white">VortexGamer</p>
            <p className="text-[11px] text-[#8b5cf6]">Level 42 Elite</p>
          </div>
          <div className="size-10 shrink-0 rounded-full border-2 border-[#8b5cf6] bg-gradient-to-br from-[#4c1d95] to-[#06b6d4]" />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
