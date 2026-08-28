import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BettingTopBarProps {
  round: number;
  totalRounds: number;
  teamName: string;
  cultureCoins: number;
  timer?: string;
  className?: string;
}

/** Felt-trim top bar for the betting screen */
export function BettingTopBar({
  round,
  totalRounds,
  teamName,
  cultureCoins,
  timer = "01:45",
  className,
}: BettingTopBarProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-4 border-b-4 border-[#1c0d07] bg-[#061a0e] px-4 py-4 sm:px-8 lg:px-12",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <span className="shrink-0 rounded-md border border-[#23412b] bg-[#1c0d07] px-3.5 py-2 text-xs font-bold text-[#a3bca9]">
          ROUND {round} OF {totalRounds}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-green-muted">PLAYING AS</p>
          <p className="truncate font-display text-lg font-extrabold text-gold-light sm:text-[22px]">
            {teamName.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2.5 rounded-[20px] border-[1.5px] border-[#d49e29] bg-[#0f2116] px-4 py-2.5 shadow-[0_0_6px_rgba(245,196,83,0.2)]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-[#d49e29] bg-gold-light font-serif text-[10px] font-black text-text-dark">
            $
          </span>
          <span className="text-base font-bold text-white">{cultureCoins}</span>
          <span className="hidden text-sm text-[#a3bca9] sm:inline">Culture Coins Available</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#ff5e5e] bg-[#3a1616] px-4 py-2.5">
          <Clock className="size-4 text-[#ff5e5e]" />
          <span className="font-display text-xl font-bold text-[#ff5e5e]">{timer}</span>
        </div>
      </div>
    </header>
  );
}
