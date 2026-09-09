import { Diamond, Spade } from "lucide-react";
import { formatPuzzleDate } from "@/data/crossword-puzzles";
import type { CrosswordPuzzle } from "@/features/crossword/crosswordTypes";
import { cn } from "@/lib/utils";
import { crosswordTheme as t } from "./crossword-theme";

interface CrosswordHeaderProps {
  puzzle: CrosswordPuzzle;
  timer?: string;
  timerUrgent?: boolean;
  timerLabel?: string;
  answersLabel?: string;
}

export function CrosswordHeader({
  puzzle,
  timer,
  timerUrgent,
  timerLabel = "Time left",
  answersLabel,
}: CrosswordHeaderProps) {
  const dateLabel = formatPuzzleDate(puzzle.date);

  return (
    <div className="min-w-0 flex-1 py-0.5">
      <div className="mb-0.5 flex items-center gap-1.5">
        <Spade className="size-3 text-gold-light sm:size-3.5" />
        <span
          className="font-extrabold uppercase tracking-wide text-gold-light"
          style={{ fontSize: "clamp(8px, 1.4vh, 10px)" }}
        >
          The culture table
        </span>
        <Diamond className="size-3 text-gold-light sm:size-3.5" />
      </div>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0">
        <h1
          className={cn("truncate font-serif font-black", t.heading)}
          style={{ fontSize: "clamp(13px, 2.4vh, 18px)" }}
        >
          THE DAILY CROSSWORD
        </h1>
        <p
          className={cn("truncate uppercase tracking-wide", t.body)}
          style={{ fontSize: "clamp(8px, 1.4vh, 10px)" }}
        >
          · {dateLabel.split(",")[0]?.toUpperCase()} · #{String(puzzle.number).padStart(3, "0")}
          {puzzle.theme ? ` · ${puzzle.theme}` : ""}
        </p>
      </div>
      {(timer || answersLabel) && (
        <div
          className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0"
          style={{ fontSize: "clamp(9px, 1.6vh, 11px)" }}
        >
          {timer && (
            <span
              className={cn(
                "font-mono font-bold tabular-nums",
                timerUrgent ? "text-gold-light animate-pulse" : t.emphasis,
              )}
            >
              {timerLabel} {timer}
            </span>
          )}
          {answersLabel && <span className={t.body}>{answersLabel}</span>}
        </div>
      )}
    </div>
  );
}
