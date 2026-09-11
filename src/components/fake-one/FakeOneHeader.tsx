import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { cn } from "@/lib/utils";

interface FakeOneHeaderProps {
  round: number;
  totalRounds: number;
  score: number;
  streak: number;
  timeLeft: number | null;
  timerUrgent?: boolean;
  onShowRules?: () => void;
}

export function FakeOneHeader({
  round,
  totalRounds,
  score,
  streak,
  timeLeft,
  timerUrgent,
  onShowRules,
}: FakeOneHeaderProps) {
  return (
    <header
      className={cn(
        "relative shrink-0 border-b px-[clamp(10px,2.5vw,20px)] py-[clamp(6px,1.2vh,10px)]",
        theme.header,
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-serif font-black leading-tight",
              theme.heading,
            )}
            style={{ fontSize: "clamp(13px, 2.5vh, 17px)" }}
          >
            THE FAKE ONE
          </p>
          <div
            className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 text-text-muted"
            style={{ fontSize: "clamp(9px, 1.6vh, 10px)" }}
          >
            <span className="font-bold uppercase tracking-wide">
              Round {String(round).padStart(2, "0")}/{totalRounds}
            </span>
            {streak >= 2 && (
              <span className="font-bold uppercase text-gold-light">
                Streak ×{streak}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[clamp(8px,2vw,14px)]">
          <div className="text-right">
            <p className="uppercase text-text-muted" style={{ fontSize: "clamp(8px, 1.4vh, 9px)" }}>
              Score
            </p>
            <p
              className={cn("font-mono font-bold tabular-nums", theme.statValue)}
              style={{ fontSize: "clamp(15px, 2.8vh, 22px)" }}
            >
              {score}
            </p>
          </div>
          {timeLeft !== null && (
            <div
              className={cn(
                "min-w-[2.5rem] text-right font-mono font-bold tabular-nums",
                timerUrgent ? "animate-pulse text-gold-light" : theme.body,
              )}
              style={{ fontSize: "clamp(14px, 2.6vh, 18px)" }}
            >
              {timeLeft}s
            </div>
          )}
          {onShowRules && (
            <button
              type="button"
              onClick={onShowRules}
              className="rounded-md border border-gold-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase text-gold-light hover:bg-gold/10"
              aria-label="How to play"
            >
              Rules
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
