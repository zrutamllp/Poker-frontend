import { Award, ArrowDown, ArrowUp } from "lucide-react";
import type { Team } from "@/types/game";
import { cn } from "@/lib/utils";

interface SeatBadgeProps {
  team: Team;
  className?: string;
  style?: React.CSSProperties;
  /** Round-over coin change, e.g. +20 or -5 */
  delta?: number;
}

const rankBorderStyles: Record<number, string> = {
  1: "border-2 border-[#f2c94c]",
  2: "border-2 border-[#b3c1d1]",
  3: "border-2 border-[#e09c6a]",
};

const rankBadgeStyles: Record<number, string> = {
  1: "bg-[#f2c94c] text-black",
  2: "bg-[#b3c1d1] text-black",
  3: "bg-[#e09c6a] text-black",
};

export function SeatBadge({ team, className, style, delta }: SeatBadgeProps) {
  const borderClass =
    rankBorderStyles[team.rank] ?? "border border-[#1f2535]";

  return (
    <div
      className={cn(
        "absolute z-10 flex w-[clamp(4.25rem,10vw,7rem)] flex-col justify-center gap-0.5 rounded-lg bg-[#11141d]/95 p-1.5 shadow-[0_6px_6px_rgba(0,0,0,0.5)] backdrop-blur-sm sm:gap-1 sm:p-2",
        borderClass,
        className,
      )}
      style={style}
    >
      <div className="flex w-full items-center justify-between">
        <span className="min-w-0 flex-1 truncate text-[9px] font-bold text-white sm:text-[11px]">
          {team.name}
        </span>
        {team.rank <= 3 && (
          <span
            className={cn(
              "flex size-3 shrink-0 items-center justify-center rounded-md text-[8px] font-black",
              rankBadgeStyles[team.rank],
            )}
          >
            {team.rank}
          </span>
        )}
      </div>

      <div className="flex w-full items-center justify-between">
        <div>
          <p className="text-[8px] text-[#8f9cae] sm:text-[9px]">POINTS</p>
          <p className="font-display text-sm font-extrabold leading-tight text-white sm:text-base">
            {team.points}
          </p>
        </div>
        <CultureCoinPill amount={team.cultureCoins} />
      </div>

      {delta !== undefined && (
        <div
          className={cn(
            "flex items-center justify-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold",
            delta >= 0 ? "text-green" : "text-red-400",
          )}
        >
          {delta >= 0 ? (
            <ArrowUp className="size-2.5" />
          ) : (
            <ArrowDown className="size-2.5" />
          )}
          {delta >= 0 ? `+${delta}` : delta}
        </div>
      )}
    </div>
  );
}

export function CultureCoinPill({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-[#f2c94c] bg-[rgba(242,201,76,0.08)] px-1.5 py-0.5">
      <Award className="size-3.5 shrink-0 text-[#f2c94c]" strokeWidth={2.5} />
      <span className="text-[11px] font-bold text-[#f2c94c]">{amount}</span>
    </span>
  );
}
