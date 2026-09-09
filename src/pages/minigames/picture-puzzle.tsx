import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, RefreshCcw, Redo2, Shuffle } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MotionBoard, MotionPanel } from "@/components/minigames/minigame-motion";
import { MinigameIntroGate } from "@/components/minigames/minigame-intro-gate";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { useMinigameIntro } from "@/hooks/use-minigame-intro";
import { MinigameResult } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import {
  formatTime,
  fullImageStyle,
  isSolved,
  PUZZLE_ART,
  shuffledBoard,
  slideTile,
  tileSliceStyle,
} from "@/lib/slide-puzzle";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { effectiveGameSeconds } from "@/lib/minigame-session-timer";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "won" | "lost";
type LoseReason = "timeout" | "wrong_confirm" | "session_expired" | null;

function initGame(gridSize: number) {
  const board = shuffledBoard(gridSize);
  return {
    board,
    initialBoard: board,
    moves: 0,
  };
}

export default function PicturePuzzlePage() {
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
  } = useMinigameSession("picture");
  const limits = session?.limits ?? getGameLimits("picture", difficulty);
  const gridSize = session?.puzzles.gridSize ?? limits.gridSize;

  const [game, setGame] = useState(() => initGame(gridSize));
  const [timeLeft, setTimeLeft] = useState<number>(limits.seconds);
  const [confirmsUsed, setConfirmsUsed] = useState(0);
  const [won, setWon] = useState(false);
  const [loseReason, setLoseReason] = useState<LoseReason>(null);
  const [confirmFeedback, setConfirmFeedback] = useState<string | null>(null);
  const [view, setView] = useState<MinigameView>("play");
  const { introAcked, ackIntro } = useMinigameIntro(sessionVersion);

  useEffect(() => {
    if (!session?.puzzles) return;
    const size = session.puzzles.gridSize;
    setGame(initGame(size));
    setTimeLeft(effectiveGameSeconds(session.limits.seconds));
    setConfirmsUsed(0);
    setWon(false);
    setLoseReason(null);
    setConfirmFeedback(null);
  }, [session, sessionVersion]);

  const { board, moves } = game;
  const confirmsLeft = limits.confirmsMax - confirmsUsed;

  const status: Status = useMemo(() => {
    if (won) return "won";
    if (loseReason !== null || timeLeft <= 0) return "lost";
    return "playing";
  }, [won, loseReason, timeLeft]);

  const totalScore = status === "won" ? limits.winScore : 0;

  useMinigameOutcomeSubmit(
    status,
    submitResult,
    { moves, confirmsUsed },
    totalScore,
    sessionVersion,
  );

  const startNewSession = useCallback(() => {
    void startSession();
  }, [startSession]);

  const trySlide = useCallback(
    (index: number) => {
      if (!introAcked || status !== "playing") return;
      setGame((g) => {
        const nextBoard = slideTile(g.board, index, gridSize);
        if (nextBoard === g.board) return g;
        return { ...g, board: nextBoard, moves: g.moves + 1 };
      });
      setConfirmFeedback(null);
    },
    [introAcked, status, gridSize],
  );

  const shuffleBoard = useCallback(() => {
    if (!introAcked || status !== "playing") return;
    const board = shuffledBoard(gridSize);
    setGame((g) => ({ ...g, board, initialBoard: board, moves: 0 }));
    setConfirmFeedback(null);
  }, [introAcked, status, gridSize]);

  const resetBoard = useCallback(() => {
    if (!introAcked || status !== "playing") return;
    setGame((g) => ({
      ...g,
      board: [...g.initialBoard],
      moves: 0,
    }));
    setConfirmFeedback(null);
  }, [introAcked, status]);

  const confirmSolution = useCallback(() => {
    if (!introAcked || status !== "playing" || confirmsLeft <= 0) return;

    if (isSolved(board, gridSize)) {
      setWon(true);
      setConfirmFeedback(null);
      return;
    }

    const nextUsed = confirmsUsed + 1;
    setConfirmsUsed(nextUsed);

    if (nextUsed >= limits.confirmsMax) {
      setLoseReason("wrong_confirm");
      setConfirmFeedback(null);
      return;
    }

    const remaining = limits.confirmsMax - nextUsed;
    setConfirmFeedback(
      `Not correct — ${remaining} confirm${remaining === 1 ? "" : "s"} left`,
    );
  }, [introAcked, status, confirmsLeft, board, gridSize, confirmsUsed, limits.confirmsMax]);

  useEffect(() => {
    if (!introAcked || status !== "playing" || view === "instructions") return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          setLoseReason((r) => r ?? "timeout");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [introAcked, status, view]);

  const showViewTabs = !(introAcked && status === "playing");

  useEffect(() => {
    if (introAcked && status === "playing") setView("play");
  }, [introAcked, status]);

  const loseTitle =
    loseReason === "wrong_confirm"
      ? MINIGAME_COPY.picture.loseWrongConfirm
      : loseReason === "session_expired"
        ? MINIGAME_COPY.picture.loseSessionExpired
      : loseReason === "timeout"
        ? MINIGAME_COPY.picture.loseTimeout
        : MINIGAME_COPY.picture.lose;

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.picture.label}>
        <div className={cn("flex min-h-[40vh] items-center justify-center p-8", theme.body)}>
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell
      gameLabel={MINIGAME_COPY.picture.label}
      subtitle={`5 min · ${limits.confirmsMax} confirms · ${limits.winScore} pts max`}
      contentClassName="overflow-hidden"
    >
      {(status === "won" || status === "lost") && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant={status === "won" ? "win" : "loss"} />
        </Suspense>
      )}

      <MinigameIntroGate
        gameId="picture"
        difficulty={difficulty}
        introAcked={introAcked}
        onAck={ackIntro}
      >
        <div className="flex h-full min-h-0 flex-col gap-[clamp(6px,1.2vh,12px)] overflow-hidden p-[clamp(8px,2vw,16px)] lg:flex-row lg:gap-[clamp(8px,1.6vh,16px)]">
          {showViewTabs && (
            <div className="order-0 shrink-0">
              <MinigameViewTabs
                view={view}
                onChange={setView}
                playLabel="Play"
                instructionsLabel="Instructions"
              />
            </div>
          )}

          {view === "instructions" ? (
            <MinigameInstructionsPanel
              gameId="picture"
              difficulty={difficulty}
              className="order-1 min-h-0 min-w-0 flex-1 overflow-y-auto lg:order-2"
            />
          ) : (
            <MotionBoard className="relative order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:order-2">
              <MotionPanel className="mb-2 flex shrink-0 flex-wrap items-center justify-center gap-6 py-1 sm:gap-8">
                <div>
                  <p className={cn("text-[10px] font-bold uppercase", theme.statLabel)}>
                    Time remaining
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className={cn("size-4", theme.highlight)} />
                    <span
                      className={cn(
                        "font-mono text-xl font-bold",
                        timeLeft <= 30 ? theme.warn : theme.highlight,
                      )}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase", theme.statLabel)}>Moves</p>
                  <div className="flex items-center gap-2">
                    <RefreshCcw className={cn("size-4", theme.warn)} />
                    <span className={cn("font-mono text-xl font-bold", theme.warn)}>
                      {String(moves).padStart(3, "0")}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={cn("text-[10px] font-bold uppercase", theme.statLabel)}>
                    Confirms left
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={cn("size-4", theme.highlight)} />
                    <span className={cn("font-mono text-xl font-bold", theme.highlight)}>
                      {confirmsLeft}/{limits.confirmsMax}
                    </span>
                  </div>
                </div>
              </MotionPanel>

              <p className={cn("mb-1 shrink-0 text-center text-xs", theme.body)}>
                {MINIGAME_COPY.picture.prompt}
              </p>

              {confirmFeedback && (
                <p
                  className={cn(
                    "mb-1 shrink-0 text-center font-bold text-gold-light",
                    "animate-pulse",
                  )}
                  style={{ fontSize: "clamp(11px, 2vh, 13px)" }}
                >
                  {confirmFeedback}
                </p>
              )}

              <div className="flex min-h-0 flex-1 items-center justify-center">
                <div
                  className={cn(
                    "mg-shimmer-track aspect-square h-full max-h-full w-full max-w-full border-2 p-1.5",
                    theme.panel,
                  )}
                >
                  <div
                    className="grid h-full gap-1"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {board.map((tile, index) => {
                      const isEmpty = tile === 0;
                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={status !== "playing" || isEmpty}
                          onClick={() => trySlide(index)}
                          aria-label={isEmpty ? "Empty slot" : `Tile ${tile}`}
                          className={cn(
                            "mg-btn-glow relative overflow-hidden rounded-md border transition-transform active:scale-95",
                            isEmpty
                              ? cn("cursor-default", theme.tileEmpty)
                              : cn(
                                  "cursor-pointer",
                                  theme.tileBorder,
                                  theme.tileBg,
                                  theme.tileHover,
                                ),
                          )}
                        >
                          {!isEmpty && (
                            <>
                              <div
                                className="absolute inset-0 opacity-95"
                                style={tileSliceStyle(tile, gridSize)}
                              />
                              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/50 px-0.5 font-mono text-[8px] font-bold text-white/80">
                                {tile}
                              </span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {status === "playing" && (
                <div className="mt-2 flex shrink-0 justify-center">
                  <button
                    type="button"
                    onClick={confirmSolution}
                    disabled={confirmsLeft <= 0}
                    className={cn(
                      "mg-btn-glow flex items-center justify-center gap-2 px-8 py-2.5 text-sm font-bold uppercase",
                      theme.btnGold,
                    )}
                  >
                    <CheckCircle2 className="size-4" />
                    {MINIGAME_COPY.picture.confirm} ({confirmsLeft})
                  </button>
                </div>
              )}

              {(status === "won" || status === "lost") && (
                <MinigameResult
                  variant={status === "won" ? "won" : "lost"}
                  title={status === "won" ? MINIGAME_COPY.picture.win : loseTitle}
                  subtitle={
                    status === "won"
                      ? `${totalScore} points · ${moves} moves`
                      : `${totalScore} points`
                  }
                  detail={
                    status === "lost"
                      ? `Confirms used: ${confirmsUsed}/${limits.confirmsMax}`
                      : undefined
                  }
                  onRetry={startNewSession}
                  onBack={() => navigate("/instructions")}
                  canRetry={canRetry}
                  isOnlineMode={isOnlineMode}
                  attemptsRemaining={attemptsRemaining}
                />
              )}
            </MotionBoard>
          )}

          {view === "play" && (
            <aside className="order-3 hidden shrink-0 lg:flex lg:w-[220px] lg:flex-col">
              <MotionPanel
                delay={100}
                className={cn("flex h-full min-h-0 flex-col p-3", theme.panel)}
              >
                <p className={cn("mb-2 shrink-0 text-[11px] font-bold uppercase", theme.label)}>
                  Reference View
                </p>
                <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
                  <div className="aspect-square h-full max-h-full w-full" style={fullImageStyle()} />
                </div>
                <p className={cn("mt-2 shrink-0 text-center text-[10px]", theme.body)}>
                  &quot;{PUZZLE_ART.title}&quot;
                </p>
              </MotionPanel>
            </aside>
          )}

          {view === "play" && status === "playing" && (
            <div className="order-4 flex shrink-0 gap-2 lg:hidden">
              <button
                type="button"
                onClick={shuffleBoard}
                className={cn(
                  "mg-btn-glow flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-[11px]",
                  theme.btnPrimary,
                )}
              >
                <Shuffle className="size-3.5" />
                Shuffle
              </button>
              <button
                type="button"
                onClick={resetBoard}
                className={cn(
                  "mg-btn-glow flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-[11px]",
                  theme.btnGhost,
                )}
              >
                <Redo2 className="size-3.5" />
                Reset
              </button>
            </div>
          )}
        </div>
      </MinigameIntroGate>
    </AetherArcadeShell>
  );
}
