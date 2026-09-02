import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MotionBoard, MotionKey, MotionPanel, MotionTile, staggerDelay } from "@/components/minigames/minigame-motion";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { getLexicodeDictionary } from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import {
  evaluateGuess,
  mergeKeyStates,
  WORD_LENGTH,
  type LetterState,
  isValidGuess,
} from "@/lib/lexicode";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

const tileColors: Record<LetterState, string> = {
  correct: "bg-[#06b6d4] border-[#06b6d4]",
  present: "bg-[#f59e0b] border-[#f59e0b]",
  absent: "bg-[#2e2d4d] border-[#2e2d4d]",
  empty: "bg-[#1a1935] border-[#28254a]",
  pending: "bg-[#1a1935] border-[#28254a]",
};

const keyColors: Record<LetterState, string> = {
  correct: "bg-[#06b6d4] border-[#06b6d4] text-white",
  present: "bg-[#f59e0b] border-[#28254a] text-white",
  absent: "bg-[#2e2d4d] border-[#28254a] text-[#64618a]",
  empty: "bg-[#1a1935] border-[#28254a] text-white",
  pending: "bg-[#1a1935] border-[#28254a] text-white",
};

type Status = "playing" | "won" | "lost";

export default function WordPuzzlePage() {
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
  } = useMinigameSession("lexicode");
  const limits = session?.limits ?? getGameLimits("lexicode", difficulty);
  const dictionary = useMemo(() => getLexicodeDictionary(), []);

  const [gameState, setGameState] = useState(() => ({
    answer: "",
    category: "",
    guesses: [] as { word: string; states: LetterState[] }[],
    current: "",
    revealRow: null as number | null,
  }));
  const [view, setView] = useState<MinigameView>("play");
  const { answer, category, guesses, current, revealRow } = gameState;

  useEffect(() => {
    if (!session?.puzzles) return;
    const p = session.puzzles;
    setGameState({
      answer: p.word,
      category: p.category,
      guesses: [],
      current: "",
      revealRow: null,
    });
  }, [session, sessionVersion]);

  const status: Status = useMemo(() => {
    if (guesses.some((g) => g.word === answer)) return "won";
    if (guesses.length >= limits.maxGuesses) return "lost";
    return "playing";
  }, [guesses, answer, limits.maxGuesses]);

  const keyStates = useMemo(() => mergeKeyStates(guesses), [guesses]);

  useMinigameOutcomeSubmit(status, submitResult, { guesses: guesses.length }, undefined, sessionVersion);

  const startNewSession = useCallback(() => {
    void startSession();
  }, [startSession]);

  const submitGuess = useCallback(() => {
    if (status !== "playing" || current.length !== WORD_LENGTH) return;
    if (!isValidGuess(current, dictionary)) return;

    const states = evaluateGuess(current, answer);
    const rowIndex = guesses.length;

    setGameState((s) => ({
      ...s,
      revealRow: rowIndex,
      guesses: [...s.guesses, { word: current, states }],
      current: "",
    }));

    window.setTimeout(() => {
      setGameState((s) => ({ ...s, revealRow: null }));
    }, 600);
  }, [status, current, dictionary, answer, guesses.length]);

  const pressKey = useCallback(
    (key: string) => {
      if (status !== "playing") return;
      if (key === "ENTER") {
        submitGuess();
        return;
      }
      if (key === "DELETE") {
        setGameState((s) => ({ ...s, current: s.current.slice(0, -1) }));
        return;
      }
      if (key.length === 1 && current.length < WORD_LENGTH) {
        setGameState((s) => ({ ...s, current: s.current + key }));
      }
    },
    [status, current, submitGuess],
  );

  const totalRows = limits.maxGuesses;
  const activeRow = guesses.length;

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.lexicode.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.lexicode.label}>
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
          category={category}
          onNewSession={startNewSession}
          isOnlineMode={isOnlineMode}
          attemptsRemaining={attemptsRemaining}
          canRetry={canRetry}
        >
          <div className="flex justify-between">
            <span className="text-[#64618a]">Attempts Used</span>
            <span className="font-mono font-extrabold text-[#06b6d4]">
              {guesses.length} / {limits.maxGuesses}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Letters</span>
            <span className="font-mono font-extrabold text-white">{WORD_LENGTH}</span>
          </div>
        </MinigameSidebar>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="lexicode"
            difficulty={difficulty}
            className="min-w-0 flex-1"
          />
        ) : (
        <MotionBoard className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <MotionPanel className="text-center text-sm text-[#9e9bbf]">
            {MINIGAME_COPY.lexicode.prompt}
          </MotionPanel>

          <div className="flex flex-col gap-1.5">
            {Array.from({ length: totalRows }, (_, ri) => {
              const guess = guesses[ri];
              const isActive = ri === activeRow && status === "playing";
              const isRevealing = revealRow === ri;
              const letters =
                guess?.word ??
                (isActive ? current.padEnd(WORD_LENGTH, " ") : "     ");

              return (
                <div
                  key={ri}
                  className={cn("flex gap-1.5", isRevealing && "mg-row-flip mg-animate")}
                >
                  {Array.from({ length: WORD_LENGTH }, (_, ci) => {
                    const letter = letters[ci]?.trim() ?? "";
                    const state: LetterState =
                      guess?.states[ci] ?? (letter ? "pending" : "empty");
                    const motionState =
                      state === "correct"
                        ? "correct"
                        : state === "present"
                          ? "revealed"
                          : state === "absent" && guess
                            ? "wrong"
                            : "idle";

                    return (
                      <MotionTile
                        key={ci}
                        delay={isRevealing ? staggerDelay(ci, 80) : staggerDelay(ci, 24)}
                        state={guess ? motionState : "idle"}
                        className={cn(
                          "flex size-[52px] items-center justify-center rounded-lg border-2 font-display text-[22px] font-extrabold text-white",
                          guess || letter ? tileColors[state] : tileColors.empty,
                          isActive && !letter && "border-dashed",
                        )}
                      >
                        {letter}
                      </MotionTile>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {status === "won" && (
            <MinigameResult
              variant="won"
              title={MINIGAME_COPY.lexicode.win}
              subtitle={MINIGAME_COPY.winReward}
              onRetry={startNewSession}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}
          {status === "lost" && (
            <MinigameResult
              variant="lost"
              title={MINIGAME_COPY.lexicode.lose}
              detail={`Term: ${answer}`}
              onRetry={startNewSession}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}

          <div className="flex w-full max-w-xl flex-col gap-1.5">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5">
                {row.map((key) => {
                  const isWide = key === "ENTER" || key === "DELETE";
                  const state =
                    key.length === 1 ? (keyStates[key] ?? "empty") : "empty";
                  return (
                    <MotionKey
                      key={key}
                      onClick={() => pressKey(key)}
                      disabled={status !== "playing"}
                      className={cn(
                        "flex h-[46px] items-center justify-center rounded-md border font-bold",
                        isWide ? "min-w-[70px] text-[11px]" : "w-[42px] text-[15px]",
                        key.length === 1
                          ? keyColors[state]
                          : "border-[#28254a] bg-[#1a1935] text-[11px] text-white",
                        status !== "playing" && "opacity-50",
                      )}
                    >
                      {key}
                    </MotionKey>
                  );
                })}
              </div>
            ))}
          </div>
        </MotionBoard>
        )}
      </div>
    </AetherArcadeShell>
  );
}
