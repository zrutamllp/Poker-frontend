import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shuffle, Timer } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { MotionBoard, MotionKey, MotionPanel, MotionTile, staggerDelay } from "@/components/minigames/minigame-motion";
import { MotionStreakBadge } from "@/components/layout/game-ui";
import { shuffleString } from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { AnagramPuzzle } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "won" | "lost";

export default function AnagramPage() {
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
  } = useMinigameSession("anagram");

  const limits = session?.limits;
  const puzzlesPerRound = limits?.puzzlesPerRound ?? 3;
  const seconds = limits?.seconds ?? 90;

  const [roundPuzzles, setRoundPuzzles] = useState<AnagramPuzzle[]>([]);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState("");
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [view, setView] = useState<MinigameView>("play");
  const validatingRef = useRef(false);

  const puzzle = roundPuzzles[puzzleIdx] ?? roundPuzzles[0];
  const target = puzzle?.answer.replace(/ /g, "") ?? "";

  const status: Status = useMemo(() => {
    if (!puzzle || roundPuzzles.length === 0) return "playing";
    if (solved >= puzzlesPerRound) return "won";
    if (timeLeft <= 0) return "lost";
    return "playing";
  }, [solved, timeLeft, puzzlesPerRound, puzzle, roundPuzzles.length]);

  useMinigameOutcomeSubmit(status, submitResult, { streak, solved }, undefined, sessionVersion);

  const initPuzzle = useCallback((index: number, puzzles: AnagramPuzzle[]) => {
    validatingRef.current = false;
    const p = puzzles[index] ?? puzzles[0];
    if (!p) return;
    const letters = shuffleString(p.answer);
    setScrambled(letters);
    setPool(letters.split(""));
    setAnswer([]);
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (!session?.puzzles) return;
    setRoundPuzzles(session.puzzles);
    setPuzzleIdx(0);
    setSolved(0);
    setStreak(0);
    setTimeLeft(session.limits.seconds);
    initPuzzle(0, session.puzzles);
  }, [session, sessionVersion, initPuzzle]);

  const startNewRound = useCallback(() => {
    void startSession();
  }, [startSession]);

  useEffect(() => {
    if (status !== "playing" || view === "instructions") return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, view]);

  useEffect(() => {
    if (answer.length !== target.length || status !== "playing" || !target) return;
    if (validatingRef.current) return;

    validatingRef.current = true;
    const attempt = answer.join("");

    if (attempt === target) {
      setSolved((s) => s + 1);
      setStreak((s) => s + 1);

      if (puzzleIdx + 1 < puzzlesPerRound) {
        setFeedback(MINIGAME_COPY.anagram.correct);
        const timeoutId = window.setTimeout(() => {
          const nextIdx = puzzleIdx + 1;
          setPuzzleIdx(nextIdx);
          initPuzzle(nextIdx, roundPuzzles);
        }, 600);
        return () => window.clearTimeout(timeoutId);
      }

      validatingRef.current = false;
      return;
    }

    setFeedback(MINIGAME_COPY.anagram.wrong);
    const timeoutId = window.setTimeout(() => {
      validatingRef.current = false;
      setPool(scrambled.split(""));
      setAnswer([]);
      setFeedback(null);
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [answer, target, status, puzzleIdx, roundPuzzles, initPuzzle, scrambled, puzzlesPerRound]);

  function pickLetter(i: number) {
    if (status !== "playing") return;
    setPool((p) => {
      const char = p[i];
      if (!char) return p;
      setAnswer((a) => [...a, char]);
      return [...p.slice(0, i), ...p.slice(i + 1)];
    });
  }

  function unpickLetter(i: number) {
    if (status !== "playing") return;
    setAnswer((a) => {
      const next = [...a];
      const [char] = next.splice(i, 1);
      setPool((p) => [...p, char]);
      return next;
    });
  }

  function reshuffle() {
    if (status !== "playing") return;
    const all = [...answer, ...pool];
    const shuffledLetters = shuffleString(all.join(""));
    setScrambled(shuffledLetters);
    setPool(shuffledLetters.split(""));
    setAnswer([]);
  }

  if (loading && !puzzle) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.anagram.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  if (!puzzle) return null;

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.anagram.label}>
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
          onNewSession={startNewRound}
          isOnlineMode={isOnlineMode}
          attemptsRemaining={attemptsRemaining}
          canRetry={canRetry}
          footer={
            <button
              type="button"
              onClick={reshuffle}
              disabled={status !== "playing"}
              className="mg-btn-glow flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-5 py-3 text-sm font-semibold text-[#9e9bbf] disabled:opacity-40"
            >
              <Shuffle className="size-4 text-[#f59e0b]" />
              RE-SCRAMBLE
            </button>
          }
        >
          <div className="flex justify-between">
            <span className="text-[#64618a]">Briefs Decoded</span>
            <span className="font-mono font-extrabold text-[#06b6d4]">
              {solved} / {puzzlesPerRound}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Time Remaining</span>
            <span className="font-mono font-extrabold text-[#f59e0b]">{Math.max(0, timeLeft)}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Streak</span>
            <span className="font-mono font-extrabold text-white">
              <MotionStreakBadge streak={streak} />
            </span>
          </div>
        </MinigameSidebar>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="anagram"
            difficulty={difficulty}
            className="min-w-0 flex-1"
          />
        ) : (
        <MotionBoard className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <MotionPanel className="flex items-center gap-2 rounded-full border border-[#28254a] bg-[#121124]/95 px-4 py-2 text-sm text-[#9e9bbf] backdrop-blur-sm">
            <Timer className="size-4 text-[#06b6d4]" />
            {MINIGAME_COPY.anagram.prompt}
          </MotionPanel>

          <div className="flex min-h-[56px] flex-wrap justify-center gap-2">
            {answer.map((char, i) => (
              <MotionTile
                key={`a-${i}`}
                delay={staggerDelay(i, 24)}
                state="correct"
                className="flex size-12 cursor-pointer items-center justify-center rounded-lg border-2 border-[#06b6d4] bg-[#06b6d4]/15 font-display text-xl font-extrabold text-[#06b6d4]"
                onClick={() => unpickLetter(i)}
                role="button"
                tabIndex={status === "playing" ? 0 : -1}
                onKeyDown={(e) => e.key === "Enter" && unpickLetter(i)}
              >
                {char}
              </MotionTile>
            ))}
            {Array.from({ length: Math.max(0, target.length - answer.length) }).map((_, i) => (
              <MotionTile
                key={`slot-${i}`}
                delay={staggerDelay(answer.length + i, 24)}
                className="flex size-12 items-center justify-center rounded-lg border-2 border-dashed border-[#28254a] bg-[#1a1935]/50"
              />
            ))}
          </div>

          {feedback && (
            <p
              className={cn(
                "mg-animate text-sm font-semibold",
                feedback === MINIGAME_COPY.anagram.correct ? "mg-tile-correct text-green" : "mg-tile-wrong text-[#f59e0b]",
              )}
            >
              {feedback}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {pool.map((char, i) => (
              <MotionKey
                key={`p-${i}-${char}`}
                disabled={status !== "playing"}
                onClick={() => pickLetter(i)}
                className="flex size-11 items-center justify-center rounded-lg border border-[#28254a] bg-[#1a1935] font-display text-lg font-bold text-white hover:border-[#8b5cf6]"
              >
                {char}
              </MotionKey>
            ))}
          </div>

          {status === "won" && (
            <MinigameResult
              variant="won"
              title={MINIGAME_COPY.anagram.win}
              subtitle={MINIGAME_COPY.winReward}
              onRetry={startNewRound}
              onBack={() => navigate("/instructions")}
              canRetry={canRetry}
              isOnlineMode={isOnlineMode}
              attemptsRemaining={attemptsRemaining}
            />
          )}
          {status === "lost" && (
            <MinigameResult
              variant="lost"
              title={MINIGAME_COPY.anagram.lose}
              detail={`Last brief: ${puzzle.answer}`}
              onRetry={startNewRound}
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
