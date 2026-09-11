import { Clock } from "lucide-react";
import { useMinigameGlobalTimer } from "@/hooks/use-minigame-global-timer";
import { formatSessionTime } from "@/lib/minigame-session-timer";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { cn } from "@/lib/utils";

export function GlobalSessionTimer({ className }: { className?: string }) {
  const { timeLeft, started, expired } = useMinigameGlobalTimer();

  if (!started) return null;

  const urgent = timeLeft <= 60 && !expired;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1",
        expired
          ? "border-gold/40 bg-gold/10"
          : urgent
            ? "border-gold/60 bg-gold/15"
            : "border-green/40 bg-green/10",
        className,
      )}
      title="Total time remaining for all culture-coin games"
    >
      <Clock className={cn("size-3.5", urgent || expired ? "text-gold-light" : theme.highlight)} />
      <div className="text-right leading-none">
        <p className="text-[8px] font-bold uppercase tracking-wide text-text-muted">Session</p>
        <p
          className={cn(
            "font-mono text-xs font-bold tabular-nums",
            expired ? "text-gold-light" : urgent ? "animate-pulse text-gold-light" : theme.emphasis,
          )}
        >
          {expired ? "00:00" : formatSessionTime(timeLeft)}
        </p>
      </div>
    </div>
  );
}
