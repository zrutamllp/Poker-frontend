import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, Lightbulb } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { MotionBoard, MotionPanel, MotionRung, staggerDelay } from "@/components/minigames/minigame-motion";
import { MotionStreakBadge } from "@/components/layout/game-ui";
import {
  getLadderPool,
  LADDER_WORD_SET,
  oneLetterApart,
  pickRandom,
} from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { LadderPuzzle } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "won" | "lost";

export default function WordLadderPage() {
  const navigate = useNavigate();
  const {
    session,
    sessionVersion,
    loading,
    canRetry,
    isOnlineMode,
    attemptsRemaining,
    startSession,
    submitResult,
    difficulty,
  } = useMinigameSession("ladder");
  const limits = session?.limits ?? getGameLimits("ladder", difficulty);

  const initLadderGame = useCallback(() => {
    const puzzle = pickRandom(getLadderPool(difficulty)) as LadderPuzzle;
    return { puzzle, ladder: [puzzle.start] as string[] };
  }, [difficulty]);

  const [game, setGame] = useState<{ puzzle: LadderPuzzle; ladder: string[] }>(initLadderGame);
  const { puzzle, ladder } = game;
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [view, setView] = useState<MinigameView>("play");

  useEffect(() => {
    if (!session?.puzzles) return;
    const p = session.puzzles;
    setGame({ puzzle: p, ladder: [p.start] });
    setInput("");
    setError(null);
    setHintsUsed(0);
  }, [session, sessionVersion]);

  const current = ladder[ladder.length - 1];
  const stepsUsed = ladder.length - 1;
  const hintsLeft = limits.hintsMax - hintsUsed;

  const status: Status = useMemo(() => {
    if (current === puzzle.end) return "won";
    if (stepsUsed >= puzzle.maxSteps) return "lost";
    return "playing";
  }, [current, puzzle.end, puzzle.maxSteps, stepsUsed]);

  useMinigameOutcomeSubmit(status, submitResult, { stepsUsed, streak }, undefined, sessionVersion);

  const startNewGame = useCallback(() => {
    void startSession();
  }, [startSession]);

  const submitWord = useCallback(() => {
    if (status !== "playing") return;
    const word = input.toUpperCase().trim();
    if (word.length !== puzzle.start.length) {
      setError(`Must be ${puzzle.start.length} letters`);
      return;
    }
    if (!oneLetterApart(current, word)) {
      setError("Change exactly one letter from the last word");
      return;
    }
    if (!LADDER_WORD_SET.has(word)) {
      setError("Not in the approved lexicon");
      return;
    }
    if (ladder.includes(word)) {
      setError("Term already submitted");
      return;
    }
    setError(null);
    setInput("");
    setGame((g) => ({
      ...g,
      ladder: [...g.ladder, word],
    }));
    if (word === puzzle.end) setStreak((s) => s + 1);
  }, [status, input, puzzle, current, ladder]);

  const useHint = useCallback(() => {
    if (status !== "playing" || hintsUsed >= limits.hintsMax) return;
    setHintsUsed((h) => h + 1);
    setError(puzzle.hint);
  }, [status, hintsUsed, limits.hintsMax, puzzle.hint]);

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.ladder.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.ladder.label}>
      {(status === "won" || status === "lost") && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant={status === "won" ? "win" : "loss"} />
        </Suspense>
      )}
      <div className="flex flex-col gap-6 p-4 sm:flex-row sm:p-8">
        <aside className="flex w-full shrink-0 flex-col gap-3 sm:w-[280px]">
          <MinigameViewTabs view={view} onChange={setView} />
          {view === "play" && (
        <MinigameSidebar
          difficulty={difficulty}
          category={puzzle.category}
          onNewSession={startNewGame}
          isOnlineMode={isOnlineMode}
          attemptsRemaining={attemptsRemaining}
          canRetry={canRetry}
          footer={
            limits.hintsMax > 0 ? (
              <button
                type="button"
                onClick={useHint}
                disabled={status !== "playing" || hintsLeft <= 0}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-5 py-3 text-sm font-semibold text-[#9e9bbf] disabled:opacity-40"
              >
                <Lightbulb className="size-4 text-[#f59e0b]" />
                INTEL HINT ({hintsLeft} left)
              </button>
            ) : undefined
          }
        >
          <div className="flex justify-between">
            <span className="text-[#64618a]">Rungs Used</span>
            <span className="font-mono font-extrabold text-[#06b6d4]">
              {stepsUsed} / {puzzle.maxSteps}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Par Target</span>
            <span className="font-mono font-extrabold text-gold-light">{puzzle.par}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Win Streak</span>
            <span className="font-mono font-extrabold text-white">
              <MotionStreakBadge streak={streak} />
            </span>
          </div>
        </MinigameSidebar>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="ladder"
            difficulty={difficulty}
            className="min-w-0 flex-1"
          />
        ) : (
        <MotionBoard className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <MotionPanel delay={80} className="text-center text-sm text-[#9e9bbf]">
            {MINIGAME_COPY.ladder.prompt}
          </MotionPanel>

          <MotionPanel
            delay={120}
            className="flex w-full max-w-sm items-center justify-between gap-4 rounded-2xl border border-[#28254a] bg-[#121124]/95 p-5 backdrop-blur-sm"
          >
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-[#64618a]">Origin</p>
              <p className="font-display text-2xl font-extrabold text-[#06b6d4]">{puzzle.start}</p>
            </div>
            <ArrowDown className="size-5 shrink-0 text-gold" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-[#64618a]">Target</p>
              <p className="font-display text-2xl font-extrabold text-gold-light">{puzzle.end}</p>
            </div>
          </MotionPanel>

          <div className="flex w-full max-w-sm flex-col gap-2">
            {ladder.map((word, i) => (
              <MotionRung
                key={`${word}-${i}`}
                delay={staggerDelay(i, 50)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-center font-display text-lg font-extrabold",
                  i === ladder.length - 1
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/15 text-white"
                    : "border-[#28254a] bg-[#1a1935] text-[#9e9bbf]",
                  word === puzzle.end && "border-green bg-green/10 text-green",
                )}
              >
                {word}
              </MotionRung>
            ))}
          </div>

          {status === "playing" && (
            <div className="flex w-full max-w-sm flex-col gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && submitWord()}
                maxLength={puzzle.start.length}
                placeholder={MINIGAME_COPY.ladder.placeholder}
                className="rounded-lg border border-[#28254a] bg-[#1a1935] px-4 py-3 text-center font-display text-lg font-bold uppercase text-white outline-none transition-shadow focus:border-[#8b5cf6] focus:shadow-[0_0_16px_rgba(139,92,246,0.35)]"
              />
              <button
                type="button"
                onClick={submitWord}
                className="mg-btn-glow rounded-lg bg-[#8b5cf6] py-3 text-sm font-semibold text-white"
              >
                {MINIGAME_COPY.ladder.climb}
              </button>
              {error && <p className="text-center text-sm text-[#f59e0b]">{error}</p>}
            </div>
          )}

          {status === "won" && (
            <MinigameResult
              variant="won"
              title={MINIGAME_COPY.ladder.win}
              subtitle={MINIGAME_COPY.winReward}
              onRetry={startNewGame}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}
          {status === "lost" && (
            <MinigameResult
              variant="lost"
              title={MINIGAME_COPY.ladder.lose}
              detail={`Target term: ${puzzle.end}`}
              onRetry={startNewGame}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}
        </MotionBoard>
        )}
      </div>
    </AetherArcadeShell>
  );
}
