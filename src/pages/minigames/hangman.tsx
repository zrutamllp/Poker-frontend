import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { MotionBoard, MotionKey, MotionTile, staggerDelay } from "@/components/minigames/minigame-motion";
import { MotionStreakBadge } from "@/components/layout/game-ui";
import { getHangmanPool, pickRandom } from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { HangmanPuzzle } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type GameStatus = "playing" | "won" | "lost";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

function getLetters(word: string) {
  return word.split("").filter((c) => c !== " ");
}

function isWordComplete(word: string, guessed: Set<string>) {
  return getLetters(word).every((l) => guessed.has(l));
}

function HangmanFigure({ wrongCount, maxWrong }: { wrongCount: number; maxWrong: number }) {
  const stroke = "#f59e0b";
  const gallows = "#d4af37";
  const parts = [
    wrongCount >= 1 && (
      <circle key="head" cx="130" cy="60" r="15" stroke={stroke} strokeWidth="3" fill="none" />
    ),
    wrongCount >= 2 && (
      <line key="body" x1="130" y1="75" x2="130" y2="130" stroke={stroke} strokeWidth="3" />
    ),
    wrongCount >= 3 && (
      <line key="la" x1="130" y1="90" x2="105" y2="110" stroke={stroke} strokeWidth="3" />
    ),
    wrongCount >= 4 && (
      <line key="ra" x1="130" y1="90" x2="155" y2="110" stroke={stroke} strokeWidth="3" />
    ),
    maxWrong >= 5 && wrongCount >= 5 && (
      <line key="ll" x1="130" y1="130" x2="110" y2="165" stroke={stroke} strokeWidth="3" />
    ),
    maxWrong >= 6 && wrongCount >= 6 && (
      <line key="rl" x1="130" y1="130" x2="150" y2="165" stroke={stroke} strokeWidth="3" />
    ),
  ];

  return (
    <svg viewBox="0 0 200 220" className="h-full w-full max-h-[220px]" aria-hidden>
      <line x1="20" y1="210" x2="160" y2="210" stroke={gallows} strokeWidth="4" />
      <line x1="50" y1="210" x2="50" y2="20" stroke={gallows} strokeWidth="4" />
      <line x1="50" y1="20" x2="130" y2="20" stroke={gallows} strokeWidth="4" />
      <line x1="130" y1="20" x2="130" y2="45" stroke={gallows} strokeWidth="3" />
      {parts}
    </svg>
  );
}

export default function HangmanPage() {
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
  } = useMinigameSession("hangman");
  const limits = session?.limits ?? getGameLimits("hangman", difficulty);

  const [puzzle, setPuzzle] = useState<HangmanPuzzle>(() =>
    pickRandom(getHangmanPool(difficulty)),
  );
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [view, setView] = useState<MinigameView>("play");

  useEffect(() => {
    if (!session?.puzzles) return;
    setPuzzle(session.puzzles);
    setGuessed(new Set());
    setWrongCount(0);
    setHintsUsed(0);
  }, [session, sessionVersion]);

  const word = puzzle.word;
  const letters = useMemo(() => getLetters(word), [word]);
  const hintsLeft = limits.hintsMax - hintsUsed;

  const status: GameStatus = useMemo(() => {
    if (isWordComplete(word, guessed)) return "won";
    if (wrongCount >= limits.maxWrong) return "lost";
    return "playing";
  }, [word, guessed, wrongCount, limits.maxWrong]);

  useMinigameOutcomeSubmit(status, submitResult, { wrongCount, streak }, undefined, sessionVersion);

  const startNewGame = useCallback(() => {
    void startSession();
  }, [startSession]);

  const handleWin = useCallback(() => {
    setStreak((s) => s + 1);
  }, []);

  const guessLetter = useCallback(
    (letter: string) => {
      if (status !== "playing" || guessed.has(letter)) return;

      const next = new Set(guessed);
      next.add(letter);

      if (letters.includes(letter)) {
        setGuessed(next);
        if (isWordComplete(word, next)) handleWin();
      } else {
        setGuessed(next);
        setWrongCount((c) => c + 1);
      }
    },
    [status, guessed, letters, word, handleWin],
  );

  const useHint = useCallback(() => {
    if (status !== "playing" || hintsUsed >= limits.hintsMax) return;

    const unguessed = letters.filter((l) => !guessed.has(l));
    if (unguessed.length === 0) return;

    const hintLetter = unguessed[Math.floor(Math.random() * unguessed.length)];
    const next = new Set([...guessed, hintLetter]);
    setGuessed(next);
    setHintsUsed((h) => h + 1);
    if (isWordComplete(word, next)) handleWin();
  }, [status, hintsUsed, limits.hintsMax, letters, guessed, word, handleWin]);

  function getKeyState(letter: string): "correct" | "wrong" | "unused" {
    if (!guessed.has(letter)) return "unused";
    return letters.includes(letter) ? "correct" : "wrong";
  }

  const keyStyles = {
    correct: "bg-[#06b6d4] border-[#06b6d4] text-white",
    wrong: "bg-[#2e2d4d] border-[#28254a] text-[#64618a] line-through opacity-60",
    unused: "bg-[#1a1935] border-[#28254a] text-white hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/20",
  };

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.hangman.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.hangman.label}>
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
            <button
              type="button"
              onClick={useHint}
              disabled={status !== "playing" || hintsLeft <= 0}
              className="mg-btn-glow flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-5 py-3 text-sm font-semibold text-[#9e9bbf] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Lightbulb className="size-4 text-[#f59e0b]" />
              INTEL HINT ({hintsLeft} left)
            </button>
          }
        >
          <div className="flex justify-between">
            <span className="text-[#64618a]">Win Streak</span>
            <span className="font-mono font-extrabold text-[#06b6d4]">
              <MotionStreakBadge streak={streak} />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Margin Used</span>
            <span className="font-mono font-extrabold text-[#f59e0b]">
              {wrongCount} / {limits.maxWrong}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Hints Remaining</span>
            <span className="font-mono font-extrabold text-white">{hintsLeft}</span>
          </div>
        </MinigameSidebar>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="hangman"
            difficulty={difficulty}
            className="min-w-0 flex-1"
          />
        ) : (
        <MotionBoard className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <div
            key={wrongCount}
            className="mg-animate flex h-[220px] w-full max-w-sm items-center justify-center rounded-2xl border-2 border-[#28254a] bg-[#121124]/95 p-4 backdrop-blur-sm"
          >
            <HangmanFigure wrongCount={wrongCount} maxWrong={limits.maxWrong} />
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {word.split("").map((char, i) => {
              if (char === " ") {
                return <span key={i} className="w-4 sm:w-6" />;
              }
              const revealed = guessed.has(char) || status === "lost";
              const tileState = revealed
                ? guessed.has(char)
                  ? "revealed"
                  : "wrong"
                : "idle";
              return (
                <MotionTile
                  key={i}
                  delay={staggerDelay(i)}
                  state={tileState}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg border-2 font-display text-xl font-extrabold sm:size-12 sm:text-2xl",
                    revealed
                      ? "border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]"
                      : "border-[#28254a] bg-[#1a1935] text-transparent",
                    status === "lost" && !guessed.has(char) && "border-[#f59e0b] text-[#f59e0b]",
                  )}
                >
                  {revealed ? char : "_"}
                </MotionTile>
              );
            })}
          </div>

          {status === "won" && (
            <MinigameResult
              variant="won"
              title={MINIGAME_COPY.hangman.win}
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
              title={MINIGAME_COPY.hangman.lose}
              detail={`Target term: ${word}`}
              onRetry={startNewGame}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}

          <div className="flex w-full max-w-xl flex-col gap-1.5">
            {KEYBOARD_ROWS.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5">
                {row.map((letter) => {
                  const keyState = getKeyState(letter);
                  const disabled = status !== "playing" || guessed.has(letter);
                  return (
                    <MotionKey
                      key={letter}
                      disabled={disabled}
                      onClick={() => guessLetter(letter)}
                      className={cn(
                        "flex h-[46px] w-[42px] items-center justify-center rounded-md border text-[15px] font-bold",
                        keyStyles[keyState],
                        disabled && keyState === "unused" && "opacity-50",
                      )}
                    >
                      {letter}
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
