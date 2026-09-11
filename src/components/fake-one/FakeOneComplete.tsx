import { ArrowRight } from "lucide-react";
import { accuracyPercent, performanceLabel } from "@/engine/fake-one/scoringEngine";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import type { FakeOneState } from "@/types/fake-one";
import { cn } from "@/lib/utils";

interface FakeOneCompleteProps {
  state: FakeOneState;
  won: boolean;
  onContinue: () => void;
  onPlayAgain: () => void;
}

export function FakeOneComplete({
  state,
  won,
  onContinue,
  onPlayAgain,
}: FakeOneCompleteProps) {
  const accuracy = accuracyPercent(state.correctCount, state.totalRounds);
  const rating = performanceLabel(accuracy);

  return (
    <div
      className={cn(
        "relative flex w-full max-w-md flex-col overflow-hidden text-center",
        theme.card,
      )}
      style={{ padding: "clamp(12px, 2.5vh, 24px)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-transparent" />
      <p
        className={cn("relative font-bold uppercase tracking-widest", theme.heading)}
        style={{ fontSize: "clamp(9px, 1.6vh, 11px)" }}
      >
        Final score
      </p>
      <h2
        className={cn("relative font-serif font-black tabular-nums", theme.emphasis)}
        style={{ fontSize: "clamp(28px, 6vh, 40px)" }}
      >
        {state.score.toLocaleString()}
      </h2>

      <p
        className={cn("relative font-serif font-bold", theme.heading)}
        style={{ fontSize: "clamp(14px, 2.6vh, 18px)", marginTop: "clamp(6px, 1.2vh, 12px)" }}
      >
        {rating}
      </p>

      <dl
        className="relative grid grid-cols-2 gap-x-3 gap-y-2 text-left"
        style={{
          marginTop: "clamp(10px, 2vh, 16px)",
          fontSize: "clamp(11px, 2vh, 13px)",
        }}
      >
        <div>
          <dt className={theme.body}>Accuracy</dt>
          <dd className={cn("font-semibold", theme.emphasis)}>{accuracy}%</dd>
        </div>
        <div>
          <dt className={theme.body}>Best streak</dt>
          <dd className={cn("font-semibold", theme.emphasis)}>{state.longestStreak}</dd>
        </div>
        <div>
          <dt className={theme.body}>Correct</dt>
          <dd className={cn("font-semibold", theme.emphasis)}>
            {state.correctCount} / {state.totalRounds}
          </dd>
        </div>
        <div>
          <dt className={theme.body}>Double downs won</dt>
          <dd className={cn("font-semibold", theme.emphasis)}>
            {state.doubleDownWins} / {state.doubleDownAttempts}
          </dd>
        </div>
      </dl>

      {won ? (
        <p className="relative text-green" style={{ marginTop: "clamp(8px, 1.6vh, 12px)", fontSize: "clamp(11px, 2vh, 13px)" }}>
          +1000 Culture Coins earned
        </p>
      ) : (
        <p className={cn("relative", theme.body)} style={{ marginTop: "clamp(8px, 1.6vh, 12px)", fontSize: "clamp(11px, 2vh, 13px)" }}>
          Reach {state.winScore} points to earn culture coins
        </p>
      )}

      <div className="relative flex flex-col gap-2" style={{ marginTop: "clamp(10px, 2vh, 16px)" }}>
        <button
          type="button"
          onClick={onContinue}
          className="game-btn inline-flex items-center justify-center gap-2 rounded-full border border-white bg-gold font-serif font-black text-text-dark"
          style={{
            fontSize: "clamp(12px, 2.2vh, 14px)",
            padding: "clamp(8px, 1.6vh, 12px) clamp(20px, 4vw, 32px)",
          }}
        >
          Return to games
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className={cn("font-semibold uppercase tracking-wide hover:underline", theme.heading)}
          style={{ fontSize: "clamp(10px, 1.8vh, 11px)" }}
        >
          Play again
        </button>
      </div>
    </div>
  );
}
