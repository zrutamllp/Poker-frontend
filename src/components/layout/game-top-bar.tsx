import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameTopBarProps {
  round: number;
  totalRounds: number;
  teamName: string;
  timer?: string;
  timerLabel?: string;
  cultureCoins: number;
  className?: string;
}

export function GameTopBar({
  round,
  totalRounds,
  teamName,
  timer = "01:45",
  timerLabel = "DISCUSS",
  cultureCoins,
  className,
}: GameTopBarProps) {
  return (
    <header
      className={cn(
        "grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border/50 bg-bg-tertiary px-4 py-4 sm:px-8 md:px-10",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <span className="shrink-0 rounded border border-gold-muted bg-bg-elevated px-3 py-1.5 text-xs font-bold text-gold">
          ROUND {round} OF {totalRounds}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-text-subtle">TEAM NAME</p>
          <p className="truncate font-serif text-lg font-bold text-white sm:text-[22px]">
            {teamName.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 rounded-[30px] border border-gold bg-[#1a1512] px-4 py-2 sm:px-5">
        <Clock className="size-[18px] text-gold" />
        <span className="text-sm font-bold text-white sm:text-base">
          {timerLabel}:{" "}
          <span className="text-gold">{timer}</span>
        </span>
      </div>

      <div className="flex justify-end">
        <div className="flex shrink-0 items-center gap-2 rounded-lg border border-gold bg-bg-elevated px-3 py-2 sm:px-4">
          <span className="flex size-[18px] items-center justify-center rounded-lg border border-white bg-gold font-serif text-[11px] font-black text-text-dark">
            $
          </span>
          <span className="text-sm font-bold text-white sm:text-[15px]">
            {cultureCoins}{" "}
            <span className="text-[13px] text-gold">Culture Coins</span>
          </span>
        </div>
      </div>
    </header>
  );
}
