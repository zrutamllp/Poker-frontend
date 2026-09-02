import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { MotionBoard, MotionKey, MotionTile, staggerDelay } from "@/components/minigames/minigame-motion";
import { MotionStreakBadge } from "@/components/layout/game-ui";
import {
  getPhraseLetters,
  getWheelPool,
  getWheelSegments,
  pickRandom,
  type WheelSegment,
} from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { WheelPuzzle } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "won" | "lost";
type Phase = "spin" | "guess";

const SEGMENT_COLORS = [
  "#8b5cf6", "#06b6d4", "#f59e0b", "#d4af37",
  "#ef4444", "#1a1935", "#219653", "#6366f1",
];

export default function WheelOfWordsPage() {
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
  } = useMinigameSession("wheel");
  const limits = session?.limits ?? getGameLimits("wheel", difficulty);
  const wheelSegments = useMemo(
    () => session?.wheelSegments ?? getWheelSegments(difficulty),
    [session?.wheelSegments, difficulty],
  );

  const [puzzle, setPuzzle] = useState<WheelPuzzle>(() =>
    pickRandom(getWheelPool(difficulty)),
  );
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set());
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("spin");
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastSegment, setLastSegment] = useState<WheelSegment | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [freeLetterPending, setFreeLetterPending] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [view, setView] = useState<MinigameView>("play");

  const phrase = puzzle.phrase;
  const letters = useMemo(() => getPhraseLetters(phrase), [phrase]);
  const uniqueLetters = useMemo(() => [...new Set(letters)], [letters]);

  useEffect(() => {
    if (!session?.puzzles) return;
    setPuzzle(session.puzzles);
    setRevealed(new Set());
    setGuessed(new Set());
    setScore(0);
    setPhase("spin");
    setLastSegment(null);
    setMessage(null);
    setFreeLetterPending(false);
    setWrongCount(0);
  }, [session, sessionVersion]);

  const status: Status = useMemo(() => {
    if (uniqueLetters.every((l) => revealed.has(l))) return "won";
    if (wrongCount >= limits.maxWrong) return "lost";
    return "playing";
  }, [uniqueLetters, revealed, wrongCount, limits.maxWrong]);

  useMinigameOutcomeSubmit(status, submitResult, { score, wrongCount, streak }, score, sessionVersion);

  const startNewGame = useCallback(() => {
    void startSession();
  }, [startSession]);

  const applySegment = useCallback((seg: WheelSegment) => {
    setLastSegment(seg);
    if (seg.type === "points") {
      setScore((s) => s + seg.value);
      setMessage(`+${seg.value} CC allocated`);
      setPhase("guess");
    } else if (seg.type === "free_letter") {
      setMessage("Complimentary letter — select a consonant");
      setFreeLetterPending(true);
      setPhase("guess");
    } else if (seg.type === "lose_turn") {
      setMessage("Turn deferred — spin again");
      setPhase("spin");
    } else if (seg.type === "bankrupt") {
      setScore(0);
      setMessage("Portfolio zeroed — spin again");
      setPhase("spin");
    }
  }, []);

  const spinWheel = useCallback(() => {
    if (status !== "playing" || spinning || phase !== "spin") return;
    setSpinning(true);
    setMessage(null);
    const segIndex = Math.floor(Math.random() * wheelSegments.length);
    const seg = wheelSegments[segIndex];
    const slice = 360 / wheelSegments.length;
    const extraSpins = 4 * 360;
    const target = extraSpins + (wheelSegments.length - segIndex) * slice - slice / 2;
    setWheelRotation((r) => r + target);
    setTimeout(() => {
      setSpinning(false);
      applySegment(seg);
    }, 3200);
  }, [status, spinning, phase, applySegment, wheelSegments]);

  const revealLetter = useCallback(
    (letter: string) => {
      if (letters.includes(letter)) {
        setRevealed((prev) => new Set([...prev, letter]));
        const count = letters.filter((l) => l === letter).length;
        setScore((s) => s + count * 100);
        return true;
      }
      return false;
    },
    [letters],
  );

  const guessLetter = useCallback(
    (letter: string) => {
      if (status !== "playing" || guessed.has(letter) || phase !== "guess") return;
      if (freeLetterPending && VOWELS.has(letter)) {
        setMessage("Complimentary letter — select a consonant");
        return;
      }

      const isVowel = VOWELS.has(letter);
      if (!freeLetterPending && isVowel && limits.vowelCost > 0) {
        if (score < limits.vowelCost) {
          setMessage(`Insufficient balance — vowels cost ${limits.vowelCost} CC`);
          return;
        }
        setScore((s) => s - limits.vowelCost);
        setMessage(`Vowel purchased (−${limits.vowelCost} CC)`);
      }

      setGuessed((g) => new Set([...g, letter]));
      const hit = revealLetter(letter);

      if (freeLetterPending) {
        setFreeLetterPending(false);
        setMessage(hit ? `${letter} confirmed on board` : "Complimentary letter — no match");
        setPhase("spin");
        return;
      }

      if (hit) {
        setMessage(`${letter} secured`);
        const nextRevealed = new Set([...revealed, letter]);
        if (uniqueLetters.every((l) => nextRevealed.has(l))) {
          setStreak((s) => s + 1);
        }
      } else {
        setWrongCount((c) => c + 1);
        setMessage(`No ${letter} on board`);
      }
      setPhase("spin");
    },
    [status, guessed, phase, freeLetterPending, revealLetter, revealed, uniqueLetters, limits.vowelCost, score],
  );

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
      <AetherArcadeShell gameLabel={MINIGAME_COPY.wheel.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.wheel.label}>
      {(status === "won" || status === "lost") && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant={status === "won" ? "win" : "loss"} />
        </Suspense>
      )}
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-8">
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-[280px]">
          <MinigameViewTabs view={view} onChange={setView} />
          {view === "play" && (
        <MinigameSidebar
          difficulty={difficulty}
          category={puzzle.category}
          onNewSession={startNewGame}
          isOnlineMode={isOnlineMode}
          attemptsRemaining={attemptsRemaining}
          canRetry={canRetry}
        >
          <div className="flex justify-between">
            <span className="text-[#64618a]">Session Score</span>
            <span className="font-mono font-extrabold text-gold-light">{score}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64618a]">Margin Used</span>
            <span className="font-mono font-extrabold text-[#f59e0b]">
              {wrongCount} / {limits.maxWrong}
            </span>
          </div>
          {limits.vowelCost > 0 && (
            <div className="flex justify-between">
              <span className="text-[#64618a]">Vowel Cost</span>
              <span className="font-mono font-extrabold text-[#f59e0b]">{limits.vowelCost} CC</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#64618a]">Streak</span>
            <span className="font-mono font-extrabold text-[#06b6d4]">
              <MotionStreakBadge streak={streak} />
            </span>
          </div>
        </MinigameSidebar>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="wheel"
            difficulty={difficulty}
            className="min-w-0 flex-1"
          />
        ) : (
        <MotionBoard className="flex min-w-0 flex-1 flex-col items-center gap-5">
          <p className="mg-panel-enter mg-animate text-center text-sm text-[#9e9bbf]">{MINIGAME_COPY.wheel.prompt}</p>

          <div className="mg-wheel-ring relative flex size-48 items-center justify-center sm:size-56">
            <div
              className="absolute inset-0 rounded-full border-4 border-gold transition-transform duration-[3200ms] ease-out"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                background: `conic-gradient(${wheelSegments.map(
                  (_, i) =>
                    `${SEGMENT_COLORS[i % SEGMENT_COLORS.length]} ${i * (360 / wheelSegments.length)}deg ${(i + 1) * (360 / wheelSegments.length)}deg`,
                ).join(", ")})`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {wheelSegments.map((seg, i) => {
                const angle = (360 / wheelSegments.length) * i + 360 / wheelSegments.length / 2;
                return (
                  <span
                    key={i}
                    className="absolute text-[9px] font-extrabold text-white drop-shadow sm:text-[10px]"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-68px) rotate(-${angle}deg)`,
                    }}
                  >
                    {seg.label}
                  </span>
                );
              })}
            </div>
            <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-gold" />
            <div className="relative z-10 size-10 rounded-full border-2 border-gold bg-[#121124]" />
          </div>

          <button
            type="button"
            onClick={spinWheel}
            disabled={status !== "playing" || spinning || phase !== "spin"}
            className="mg-btn-glow rounded-full bg-gold px-8 py-2.5 font-display text-sm font-extrabold text-[#1e120d] disabled:opacity-40"
          >
            {spinning ? MINIGAME_COPY.wheel.spinning : MINIGAME_COPY.wheel.spin}
          </button>

          {message && (
            <p className="mg-animate mg-tile-correct text-center text-sm font-semibold text-[#06b6d4]">{message}</p>
          )}
          {lastSegment && !spinning && (
            <p className="text-center text-xs text-[#64618a]">
              Outcome: <span className="text-white">{lastSegment.label}</span>
              {phase === "guess" && !freeLetterPending && " — call a letter"}
              {freeLetterPending && " — select complimentary consonant"}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {phrase.split("").map((char, i) => {
              if (char === " ") return <span key={i} className="w-3 sm:w-4" />;
              const show = revealed.has(char) || status === "lost";
              return (
                <MotionTile
                  key={i}
                  delay={staggerDelay(i, 20)}
                  state={show && revealed.has(char) ? "revealed" : "idle"}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border-2 font-display text-lg font-extrabold sm:size-11",
                    show
                      ? "border-[#06b6d4] bg-[#06b6d4]/10 text-[#06b6d4]"
                      : "border-[#28254a] bg-[#1a1935] text-transparent",
                    status === "lost" && !revealed.has(char) && "text-[#f59e0b] border-[#f59e0b]",
                  )}
                >
                  {show ? char : "_"}
                </MotionTile>
              );
            })}
          </div>

          {status === "won" && (
            <MinigameResult
              variant="won"
              title={MINIGAME_COPY.wheel.win}
              subtitle={`${MINIGAME_COPY.winReward} · Session score ${score}`}
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
              title={MINIGAME_COPY.wheel.lose}
              detail={phrase}
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
                  const disabled =
                    status !== "playing" ||
                    guessed.has(letter) ||
                    phase !== "guess";
                  return (
                    <MotionKey
                      key={letter}
                      disabled={disabled}
                      onClick={() => guessLetter(letter)}
                      className={cn(
                        "flex h-[42px] w-[38px] items-center justify-center rounded-md border text-sm font-bold sm:h-[46px] sm:w-[42px] sm:text-[15px]",
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
