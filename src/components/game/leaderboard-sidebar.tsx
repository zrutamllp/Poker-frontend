import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/types/game";
import { CultureCoinPill } from "@/components/game/seat-badge";
import { cn } from "@/lib/utils";

interface LeaderboardSidebarProps {
  entries: LeaderboardEntry[];
  className?: string;
  /** Simpler rows for prediction overlay background */
  compact?: boolean;
}

const topRowStyles: Record<number, { row: string; rank: string; rankText: string }> = {
  1: {
    row: "bg-[rgba(242,201,76,0.03)] border-[rgba(242,201,76,0.13)]",
    rank: "bg-[rgba(242,201,76,0.1)]",
    rankText: "text-[#f2c94c]",
  },
  2: {
    row: "bg-[rgba(179,193,209,0.03)] border-[rgba(179,193,209,0.13)]",
    rank: "bg-[rgba(179,193,209,0.1)]",
    rankText: "text-[#b3c1d1]",
  },
  3: {
    row: "bg-[rgba(224,156,106,0.03)] border-[rgba(224,156,106,0.13)]",
    rank: "bg-[rgba(224,156,106,0.1)]",
    rankText: "text-[#e09c6a]",
  },
};

export function LeaderboardSidebar({ entries, className, compact = false }: LeaderboardSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col gap-3 self-stretch border-t border-[#1f2535] bg-[#11141d] p-4 sm:gap-4 sm:p-5",
        "lg:h-full lg:w-96 lg:shrink-0 lg:border-l lg:border-t-0",
        "max-h-[35vh] lg:max-h-none",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-[#f2c94c]" strokeWidth={2} />
          <h2 className="font-display text-lg font-extrabold tracking-wide text-white">
            LEADERBOARD
          </h2>
        </div>
        <span className="rounded bg-[#1f2535] px-2 py-1 text-[10px] font-bold text-[#8f9cae]">
          {entries.length} TEAMS
        </span>
      </div>

      <hr className="border-[#1f2535]" />

      <ul className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-thin">
        {entries.map((entry) => {
          const topStyle = topRowStyles[entry.rank];
          const isYou = entry.id === "1";

          if (compact) {
            return (
              <li
                key={entry.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5",
                  isYou ? "bg-[rgba(242,201,76,0.03)]" : "bg-[#1c1f2b]",
                )}
              >
                <p className="truncate text-sm font-semibold text-white">
                  {entry.name}
                  {isYou ? " (You)" : ""}
                </p>
                <p className={cn("text-xs", isYou ? "text-gold-light" : "text-text-muted-alt")}>
                  {entry.points} Pts
                </p>
              </li>
            );
          }

          return (
            <li
              key={entry.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-[#1a202e]/50",
                topStyle?.row ?? "border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold",
                  topStyle?.rank ?? "",
                  topStyle?.rankText ?? "text-[#8f9cae]",
                )}
              >
                {entry.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {entry.name}
                </p>
                <p className="text-[11px] text-[#8f9cae]">
                  {entry.points} culture coins
                </p>
              </div>
              <CultureCoinPill amount={entry.cultureCoins} />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
