import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FakeOneComplete } from "@/components/fake-one/FakeOneComplete";
import { FakeOneHeader } from "@/components/fake-one/FakeOneHeader";
import { FakeOnePlayBoard } from "@/components/fake-one/FakeOnePlayBoard";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameIntroGate } from "@/components/minigames/minigame-intro-gate";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { MinigameViewport, MinigameViewportMain } from "@/components/minigames/minigame-viewport";
import { useFakeOne } from "@/features/fake-one/useFakeOne";
import { useMinigameIntro } from "@/hooks/use-minigame-intro";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { FakeOneSession } from "@/types/fake-one";
import { cn } from "@/lib/utils";

export default function FakeOnePage() {
  const navigate = useNavigate();
  const {
    session,
    sessionVersion,
    loading,
    difficulty,
    submitResult,
    startSession,
  } = useMinigameSession("geo");

  const limits = session?.limits ?? getGameLimits("geo", difficulty);
  const [showRules, setShowRules] = useState(false);
  const { introAcked, ackIntro } = useMinigameIntro(sessionVersion);

  const fakeSession: FakeOneSession = useMemo(
    () =>
      session?.puzzles ?? {
        questions: [],
        totalRounds: limits.totalRounds,
        seed: Date.now(),
        tier: difficulty,
      },
    [session?.puzzles, limits.totalRounds, difficulty],
  );

  const game = useFakeOne(fakeSession, limits.winScore, introAcked);
  const { state, currentQuestion, lastResult, won } = game;

  const status =
    state.phase === "complete" ? (won ? "won" : "lost") : "playing";

  useMinigameOutcomeSubmit(
    status,
    submitResult,
    {
      score: state.score,
      correct: state.correctCount,
      accuracy: state.correctCount / Math.max(1, state.totalRounds),
      doubleDownWins: state.doubleDownWins,
    },
    state.score,
    sessionVersion,
  );

  const handlePlayAgain = useCallback(() => {
    void startSession();
    game.reset();
    setShowRules(false);
  }, [startSession, game]);

  const timerUrgent = state.timeLeft <= 4 && state.phase === "playing";
  const showTimer =
    state.phase !== "complete" && state.phase !== "reveal";

  const compactHeader =
    state.phase !== "complete" ? (
      <FakeOneHeader
        round={state.round}
        totalRounds={state.totalRounds}
        score={state.score}
        streak={state.streak}
        timeLeft={showTimer ? state.timeLeft : null}
        timerUrgent={timerUrgent}
        onShowRules={() => setShowRules((v) => !v)}
      />
    ) : undefined;

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.geo.label} contentClassName="overflow-hidden">
        <div className={cn("flex flex-1 items-center justify-center", theme.body)}>
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell
      gameLabel={MINIGAME_COPY.geo.label}
      header={compactHeader}
      contentClassName="overflow-hidden"
    >
      <MinigameIntroGate
        gameId="geo"
        difficulty={difficulty}
        introAcked={introAcked}
        onAck={ackIntro}
        panelClassName={cn(theme.card, "p-4")}
      >
        <MinigameViewport>
          {showRules && (
            <div className="absolute inset-0 z-30 flex flex-col overflow-hidden bg-[#05130a]/95 p-[clamp(10px,2.5vw,16px)] backdrop-blur-sm">
              <div className="mb-2 flex shrink-0 items-center justify-between">
                <p className={cn("font-serif font-black", theme.heading)} style={{ fontSize: "clamp(14px, 2.6vh, 18px)" }}>
                  How to play
                </p>
                <button
                  type="button"
                  onClick={() => setShowRules(false)}
                  className={cn("text-xs font-bold uppercase", theme.btnGhost, "px-3 py-1")}
                >
                  Close
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
                <MinigameInstructionsPanel gameId="geo" difficulty={difficulty} />
              </div>
            </div>
          )}

          {state.phase === "complete" ? (
            <MinigameViewportMain className="items-center justify-center p-[clamp(8px,2vh,16px)]">
              <FakeOneComplete
                state={state}
                won={won}
                onContinue={() => navigate("/instructions")}
                onPlayAgain={handlePlayAgain}
              />
            </MinigameViewportMain>
          ) : !currentQuestion ? (
            <MinigameViewportMain className="items-center justify-center">
              <p className={theme.body}>No questions available.</p>
            </MinigameViewportMain>
          ) : (
            <FakeOnePlayBoard
              state={state}
              question={currentQuestion}
              lastResult={lastResult}
              onSelect={game.selectAnswer}
              onLock={() => game.submitRisk("lock")}
              onDouble={() => game.submitRisk("double")}
            />
          )}
        </MinigameViewport>
      </MinigameIntroGate>
    </AetherArcadeShell>
  );
}
