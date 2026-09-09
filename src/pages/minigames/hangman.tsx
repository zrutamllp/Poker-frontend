import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MinigameIntroGate } from "@/components/minigames/minigame-intro-gate";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MotionPanel } from "@/components/minigames/minigame-motion";
import { useMinigameIntro } from "@/hooks/use-minigame-intro";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { MotionKey, MotionTile, staggerDelay } from "@/components/minigames/minigame-motion";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { HangmanPuzzle } from "@/types/minigame-session";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { MinigameViewport, MinigameViewportMain } from "@/components/minigames/minigame-viewport";
import { cn } from "@/lib/utils";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const ROUND_ADVANCE_MS = 900;

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
  const stroke = "#d4af37";
  const gallows = "#219653";
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
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden>
      <line x1="20" y1="210" x2="160" y2="210" stroke={gallows} strokeWidth="4" />
      <line x1="50" y1="210" x2="50" y2="20" stroke={gallows} strokeWidth="4" />
      <line x1="50" y1="20" x2="130" y2="20" stroke={gallows} strokeWidth="4" />
      <line x1="130" y1="20" x2="130" y2="45" stroke={gallows} strokeWidth="3" />
      {parts}
    </svg>
  );
}

function initRoundState(secondsPerRound: number) {
  return {
    guessed: new Set<string>(),
    wrongCount: 0,
    timeLeft: secondsPerRound,
    roundResolved: false,
    lastRoundPoints: null as number | null,
  };
}

export default function HangmanPage() {
  const navigate = useNavigate();
  const {
    session,
    sessionVersion,
    loading,
    submitResult,
    difficulty,
  } = useMinigameSession("hangman");
  const limits = session?.limits ?? getGameLimits("hangman", difficulty);

  const [words, setWords] = useState<HangmanPuzzle[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundState, setRoundState] = useState(() => initRoundState(limits.secondsPerRound));
  const [sessionComplete, setSessionComplete] = useState(false);
  const [view, setView] = useState<MinigameView>("play");
  const { introAcked, ackIntro } = useMinigameIntro(sessionVersion);

  const advanceTimerRef = useRef<number | null>(null);
  const roundResolvedRef = useRef(false);

  const puzzle = words[roundIndex];
  const word = puzzle?.word ?? "";
  const letters = useMemo(() => getLetters(word), [word]);
  const { guessed, wrongCount, timeLeft, roundResolved, lastRoundPoints } = roundState;

  const roundWon = word.length > 0 && isWordComplete(word, guessed);
  const roundLost = wrongCount >= limits.maxWrong;
  const roundActive = !roundResolved && !sessionComplete;

  useEffect(() => {
    if (!session?.puzzles) return;
    const list = session.puzzles;
    setWords(list);
    setRoundIndex(0);
    setTotalScore(0);
    setSessionComplete(false);
    setRoundState(initRoundState(limits.secondsPerRound));
    roundResolvedRef.current = false;
  }, [session, sessionVersion, limits.secondsPerRound]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const advanceRound = useCallback(
    (won: boolean) => {
      if (roundResolvedRef.current || sessionComplete) return;
      roundResolvedRef.current = true;

      const points = won ? limits.pointsPerWin : 0;
      setTotalScore((s) => s + points);
      setRoundState((s) => ({
        ...s,
        roundResolved: true,
        lastRoundPoints: points,
      }));

      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = window.setTimeout(() => {
        if (roundIndex >= limits.rounds - 1) {
          setSessionComplete(true);
          return;
        }
        roundResolvedRef.current = false;
        setRoundIndex((i) => i + 1);
        setRoundState(initRoundState(limits.secondsPerRound));
      }, ROUND_ADVANCE_MS);
    },
    [limits.pointsPerWin, limits.rounds, limits.secondsPerRound, roundIndex, sessionComplete],
  );

  useEffect(() => {
    if (!introAcked || !roundActive || view !== "play" || !word) return;

    if (roundWon) {
      advanceRound(true);
      return;
    }
    if (roundLost) {
      advanceRound(false);
    }
  }, [introAcked, roundActive, view, word, roundWon, roundLost, advanceRound]);

  useEffect(() => {
    if (!introAcked || !roundActive || view !== "play") return;

    const id = window.setInterval(() => {
      setRoundState((s) => {
        if (s.roundResolved) return s;
        if (s.timeLeft <= 1) {
          window.clearInterval(id);
          return { ...s, timeLeft: 0 };
        }
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [introAcked, roundActive, view, roundIndex, sessionVersion]);

  useEffect(() => {
    if (timeLeft === 0 && roundActive && introAcked && view === "play" && !roundWon) {
      advanceRound(false);
    }
  }, [timeLeft, roundActive, introAcked, view, roundWon, advanceRound]);

  const sessionWon = sessionComplete && totalScore >= limits.winScore;
  const sessionStatus = sessionComplete ? (sessionWon ? "won" : "lost") : "playing";

  useMinigameOutcomeSubmit(
    sessionStatus,
    submitResult,
    { totalScore, rounds: limits.rounds },
    totalScore,
    sessionVersion,
  );

  const guessLetter = useCallback(
    (letter: string) => {
      if (!introAcked || !roundActive || guessed.has(letter) || !word) return;

      const next = new Set(guessed);
      next.add(letter);

      if (letters.includes(letter)) {
        setRoundState((s) => ({ ...s, guessed: next }));
      } else {
        setRoundState((s) => ({ ...s, guessed: next, wrongCount: s.wrongCount + 1 }));
      }
    },
    [introAcked, roundActive, guessed, letters, word],
  );

  function getKeyState(letter: string): "correct" | "wrong" | "unused" {
    if (!guessed.has(letter)) return "unused";
    return letters.includes(letter) ? "correct" : "wrong";
  }

  const keyStyles = {
    correct: theme.keyCorrect,
    wrong: theme.keyWrong,
    unused: theme.keyUnused,
  };

  const headerActions = !sessionComplete ? (
    <div className="flex items-center gap-[clamp(10px,2vw,16px)]">
      <div className="text-right">
        <p className={theme.statLabel} style={{ fontSize: "clamp(8px, 1.4vh, 9px)" }}>
          Score
        </p>
        <p
          className={cn("font-mono font-bold tabular-nums", theme.statValue)}
          style={{ fontSize: "clamp(15px, 2.8vh, 20px)" }}
        >
          {totalScore}
          <span className="text-text-muted">/{limits.maxScore}</span>
        </p>
      </div>
      <div className="text-right">
        <p className={theme.statLabel} style={{ fontSize: "clamp(8px, 1.4vh, 9px)" }}>
          Round
        </p>
        <p
          className={cn("font-mono font-bold tabular-nums", theme.emphasis)}
          style={{ fontSize: "clamp(14px, 2.6vh, 18px)" }}
        >
          {Math.min(roundIndex + 1, limits.rounds)}/{limits.rounds}
        </p>
      </div>
      {roundActive && (
        <div className="flex items-center gap-1.5">
          <Clock className={cn("size-3.5", timeLeft <= 8 ? theme.warn : theme.highlight)} />
          <span
            className={cn(
              "font-mono font-bold tabular-nums",
              timeLeft <= 8 ? "text-gold-light animate-pulse" : theme.highlight,
            )}
            style={{ fontSize: "clamp(14px, 2.6vh, 18px)" }}
          >
            {timeLeft}s
          </span>
        </div>
      )}
    </div>
  ) : null;

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.hangman.label} contentClassName="overflow-hidden">
        <div className={cn("flex flex-1 items-center justify-center", theme.body)}>
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell
      gameLabel={MINIGAME_COPY.hangman.label}
      subtitle={`${limits.rounds} rounds · ${limits.secondsPerRound}s each · +${limits.pointsPerWin} per win`}
      headerActions={headerActions}
      contentClassName="overflow-hidden"
    >
      {sessionComplete && sessionWon && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant="win" />
        </Suspense>
      )}
      <MinigameIntroGate
        gameId="hangman"
        difficulty={difficulty}
        introAcked={introAcked}
        onAck={ackIntro}
      >
        <MinigameViewport className="gap-[clamp(6px,1.2vh,12px)] p-[clamp(8px,2vw,16px)] sm:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-2 sm:w-[200px]">
            <MinigameViewTabs view={view} onChange={setView} />
            {view === "play" && !sessionComplete && puzzle && (
              <MotionPanel className={cn("p-3", theme.card)}>
                <p className={cn("text-[10px] font-bold uppercase", theme.label)}>Hint</p>
                <p className={cn("mt-1 text-sm font-semibold", theme.heading)}>{puzzle.Hint}</p>
                <p className={cn("mt-3 text-[10px] font-bold uppercase", theme.label)}>Round pts</p>
                <p className={cn("mt-0.5 text-sm", theme.body)}>+{limits.pointsPerWin} per win</p>
              </MotionPanel>
            )}
          </aside>

          {view === "instructions" ? (
            <MinigameInstructionsPanel
              gameId="hangman"
              difficulty={difficulty}
              className="min-h-0 min-w-0 flex-1 overflow-y-auto"
            />
          ) : sessionComplete ? (
            <MinigameViewportMain className="min-w-0 items-center justify-center">
              <MotionPanel className={cn("w-full max-w-md p-[clamp(12px,2.5vh,24px)] text-center", theme.card)}>
                <p className={cn("text-xs font-bold uppercase tracking-widest", theme.heading)}>
                  Session complete
                </p>
                <h2
                  className={cn("mt-2 font-serif font-black tabular-nums", theme.emphasis)}
                  style={{ fontSize: "clamp(28px, 6vh, 40px)" }}
                >
                  {totalScore}
                </h2>
                <p className={cn("text-sm", theme.body)}>
                  {totalScore}/{limits.maxScore} points ·{" "}
                  {Math.round((totalScore / limits.maxScore) * 100)}% of max
                </p>
                {sessionWon ? (
                  <p className="mt-3 text-sm text-green">{MINIGAME_COPY.winReward}</p>
                ) : (
                  <p className={cn("mt-3 text-sm", theme.body)}>
                    Reach {limits.winScore} points to earn culture coins
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => navigate("/instructions")}
                  className={cn("game-btn mt-5 w-full", theme.btnGold)}
                >
                  Return to games
                </button>
              </MotionPanel>
            </MinigameViewportMain>
          ) : (
            <MinigameViewportMain className="min-w-0 items-center gap-[clamp(6px,1.2vh,12px)]">
              {lastRoundPoints !== null && roundResolved && (
                <p
                  className={cn(
                    "shrink-0 font-mono font-bold",
                    lastRoundPoints > 0 ? "text-green" : theme.body,
                  )}
                  style={{ fontSize: "clamp(12px, 2.2vh, 15px)" }}
                >
                  {lastRoundPoints > 0 ? `+${lastRoundPoints}` : "No points"} — next round…
                </p>
              )}

              <div
                className={cn(
                  "flex w-full max-w-sm min-h-0 flex-1 items-center justify-center border-2 p-[clamp(6px,1.2vh,10px)]",
                  theme.panel,
                )}
                style={{ maxHeight: "clamp(90px, 20vh, 160px)" }}
              >
                <HangmanFigure wrongCount={wrongCount} maxWrong={limits.maxWrong} />
              </div>

              <div className="flex shrink-0 flex-wrap justify-center gap-1.5 sm:gap-2">
                {word.split("").map((char, i) => {
                  if (char === " ") {
                    return <span key={i} className="w-4 sm:w-6" />;
                  }
                  const revealed = guessed.has(char) || roundResolved;
                  const tileState = revealed
                    ? guessed.has(char)
                      ? "revealed"
                      : "wrong"
                    : "idle";
                  return (
                    <MotionTile
                      key={`${roundIndex}-${i}`}
                      delay={staggerDelay(i)}
                      state={tileState}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border-2 font-display text-lg font-extrabold sm:size-10 sm:text-xl",
                        revealed && guessed.has(char)
                          ? "border-green bg-green/10 text-green"
                          : cn(theme.tileBorder, theme.tileBg, "text-transparent"),
                        roundResolved && !guessed.has(char) && "border-gold text-gold-light",
                      )}
                    >
                      {revealed ? char : "_"}
                    </MotionTile>
                  );
                })}
              </div>

              <div className="flex w-full max-w-xl shrink-0 flex-col gap-1">
                {KEYBOARD_ROWS.map((row, ri) => (
                  <div key={ri} className="flex justify-center gap-1.5">
                    {row.map((letter) => {
                      const keyState = getKeyState(letter);
                      const disabled = !roundActive || guessed.has(letter);
                      return (
                        <MotionKey
                          key={letter}
                          disabled={disabled}
                          onClick={() => guessLetter(letter)}
                          className={cn(
                            "flex h-[clamp(34px,6.5vh,42px)] w-[clamp(32px,6vh,38px)] items-center justify-center rounded-md border text-[clamp(11px,2vh,13px)] font-bold",
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
            </MinigameViewportMain>
          )}
        </MinigameViewport>
      </MinigameIntroGate>
    </AetherArcadeShell>
  );
}
