import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, RefreshCcw, Redo2, Shuffle, Sparkles } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { MotionBoard, MotionPanel } from "@/components/minigames/minigame-motion";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import {
  findHintIndex,
  formatTime,
  fullImageStyle,
  isSolved,
  PUZZLE_ART,
  shuffledBoard,
  slideTile,
  tileSliceStyle,
} from "@/lib/slide-puzzle";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "won" | "lost";

function initGame(gridSize: number) {
  const board = shuffledBoard(gridSize);
  return {
    board,
    initialBoard: board,
    moves: 0,
    hintsUsed: 0,
    hintTile: null as number | null,
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
  const [hintFlash, setHintFlash] = useState<number | null>(null);
  const [view, setView] = useState<MinigameView>("play");

  useEffect(() => {
    if (!session?.puzzles) return;
    const size = session.puzzles.gridSize;
    setGame(initGame(size));
    setTimeLeft(session.limits.seconds);
    setHintFlash(null);
  }, [session, sessionVersion]);

  const { board, moves, hintsUsed } = game;
  const hintsLeft = limits.hintsMax - hintsUsed;

  const status: Status = useMemo(() => {
    if (isSolved(board, gridSize)) return "won";
    if (timeLeft <= 0) return "lost";
    return "playing";
  }, [board, gridSize, timeLeft]);

  useMinigameOutcomeSubmit(status, submitResult, { moves, hintsUsed }, undefined, sessionVersion);

  const startNewSession = useCallback(() => {
    void startSession();
  }, [startSession]);

  const trySlide = useCallback(
    (index: number) => {
      if (status !== "playing") return;
      setGame((g) => {
        const nextBoard = slideTile(g.board, index, gridSize);
        if (nextBoard === g.board) return g;
        return { ...g, board: nextBoard, moves: g.moves + 1, hintTile: null };
      });
      setHintFlash(null);
    },
    [status, gridSize],
  );

  const shuffleBoard = useCallback(() => {
    if (status !== "playing") return;
    const board = shuffledBoard(gridSize);
    setGame((g) => ({ ...g, board, initialBoard: board, moves: 0, hintTile: null }));
    setHintFlash(null);
  }, [status, gridSize]);

  const resetBoard = useCallback(() => {
    if (status !== "playing") return;
    setGame((g) => ({
      ...g,
      board: [...g.initialBoard],
      moves: 0,
      hintTile: null,
    }));
    setHintFlash(null);
  }, [status]);

  const useHint = useCallback(() => {
    if (status !== "playing" || hintsLeft <= 0) return;
    let hintIndex: number | null = null;
    setGame((g) => {
      hintIndex = findHintIndex(g.board, gridSize);
      return {
        ...g,
        hintsUsed: g.hintsUsed + 1,
        hintTile: hintIndex,
      };
    });
    if (hintIndex !== null) {
      setHintFlash(hintIndex);
      window.setTimeout(() => setHintFlash(null), 2000);
    }
  }, [status, hintsLeft, gridSize]);

  useEffect(() => {
    if (status !== "playing" || view === "instructions") return;
    const id = window.setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearInterval(id);
  }, [status, view]);

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.picture.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell
      gameLabel={MINIGAME_COPY.picture.label}
      contentClassName="overflow-hidden"
    >
      {(status === "won" || status === "lost") && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant={status === "won" ? "win" : "loss"} />
        </Suspense>
      )}

      <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-3 lg:flex-row lg:gap-4 lg:p-4">
        <div className="order-0 shrink-0 lg:hidden">
          <MinigameViewTabs
            view={view}
            onChange={setView}
            playLabel="Play"
            instructionsLabel="Instructions"
          />
        </div>

        <aside className="order-2 hidden shrink-0 flex-col gap-2 lg:order-1 lg:flex lg:w-[220px]">
          <MinigameViewTabs
            view={view}
            onChange={setView}
            playLabel="Controls"
            instructionsLabel="Instructions"
          />
          {view === "play" && (
          <MotionPanel
            delay={160}
            className="flex min-h-0 flex-1 flex-col rounded-2xl border border-[#28254a] bg-[#121124]/95 p-4 backdrop-blur-sm"
          >
            <p className="mb-3 shrink-0 text-sm font-bold text-white">CONTROLS</p>
            <div className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={shuffleBoard}
                disabled={status !== "playing"}
                className="mg-btn-glow flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Shuffle className="size-4" />
                {MINIGAME_COPY.picture.shuffle}
              </button>
              <button
                type="button"
                onClick={useHint}
                disabled={status !== "playing" || hintsLeft <= 0}
                className="mg-btn-glow flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-4 py-2.5 text-xs font-semibold text-[#9e9bbf] disabled:opacity-40"
              >
                <Sparkles className="size-4 text-[#f59e0b]" />
                {MINIGAME_COPY.picture.hint} ({hintsLeft} left)
              </button>
              <button
                type="button"
                onClick={resetBoard}
                disabled={status !== "playing"}
                className="mg-btn-glow flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-4 py-2.5 text-xs font-semibold text-[#9e9bbf] disabled:opacity-40"
              >
                <Redo2 className="size-4" />
                {MINIGAME_COPY.picture.reset}
              </button>
            </div>
          </MotionPanel>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="picture"
            difficulty={difficulty}
            className="order-1 min-h-0 min-w-0 flex-1 overflow-y-auto lg:order-2"
          />
        ) : (
        <MotionBoard className="relative order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:order-2">
          <MotionPanel className="mb-2 flex shrink-0 items-center justify-center gap-8 py-1">
            <div>
              <p className="text-[10px] text-[#64618a]">TIME REMAINING</p>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-[#06b6d4]" />
                <span
                  className={cn(
                    "font-mono text-xl font-bold",
                    timeLeft <= 30 ? "text-[#f59e0b]" : "text-[#06b6d4]",
                  )}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#64618a]">MOVES</p>
              <div className="flex items-center gap-2">
                <RefreshCcw className="size-4 text-[#f59e0b]" />
                <span className="font-mono text-xl font-bold text-[#f59e0b]">
                  {String(moves).padStart(3, "0")}
                </span>
              </div>
            </div>
          </MotionPanel>

          <p className="mb-2 shrink-0 text-center text-xs text-[#9e9bbf]">
            {MINIGAME_COPY.picture.prompt}
          </p>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="mg-shimmer-track aspect-square h-full max-h-full w-full max-w-full rounded-2xl border-2 border-[#28254a] bg-[#121124]/95 p-1.5 backdrop-blur-sm">
              <div
                className="grid h-full gap-1"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {board.map((tile, index) => {
                  const isEmpty = tile === 0;
                  const isHint = hintFlash === index || game.hintTile === index;
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
                          ? "cursor-default border-[#28254a] bg-[#080711]"
                          : "cursor-pointer border-[#28254a] hover:border-[#8b5cf6] hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]",
                        isHint && "z-10 border-2 border-[#f59e0b] shadow-[0_0_16px_rgba(245,158,11,0.5)]",
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

          {(status === "won" || status === "lost") && (
            <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center px-4">
              <MinigameResult
                variant={status === "won" ? "won" : "lost"}
                title={status === "won" ? MINIGAME_COPY.picture.win : MINIGAME_COPY.picture.lose}
                subtitle={
                  status === "won"
                    ? `${MINIGAME_COPY.winReward} · ${moves} moves`
                    : undefined
                }
                detail={status === "lost" ? `Moves used: ${moves}` : undefined}
                onRetry={startNewSession}
                onBack={() => navigate("/instructions")}
                canRetry={canRetry}
                isOnlineMode={isOnlineMode}
                attemptsRemaining={attemptsRemaining}
              />
            </div>
          )}
        </MotionBoard>
        )}

        {view === "play" && (
        <aside className="order-3 hidden shrink-0 lg:flex lg:w-[220px] lg:flex-col">
          <MotionPanel
            delay={100}
            className="flex h-full min-h-0 flex-col rounded-2xl border border-[#28254a] bg-[#121124]/95 p-3 backdrop-blur-sm"
          >
            <p className="mb-2 shrink-0 text-[11px] font-bold uppercase text-[#9e9bbf]">
              Reference View
            </p>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
              <div className="aspect-square h-full max-h-full w-full" style={fullImageStyle()} />
            </div>
            <p className="mt-2 shrink-0 text-center text-[10px] text-[#64618a]">
              &quot;{PUZZLE_ART.title}&quot;
            </p>
          </MotionPanel>
        </aside>
        )}

        {view === "play" && (
        <div className="order-4 flex shrink-0 gap-2 lg:hidden">
          <button
            type="button"
            onClick={shuffleBoard}
            disabled={status !== "playing"}
            className="mg-btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#8b5cf6] px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-40"
          >
            <Shuffle className="size-3.5" />
            Shuffle
          </button>
          <button
            type="button"
            onClick={useHint}
            disabled={status !== "playing" || hintsLeft <= 0}
            className="mg-btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#28254a] bg-[#1a1935] px-3 py-2 text-[11px] font-semibold text-[#9e9bbf] disabled:opacity-40"
          >
            <Sparkles className="size-3.5 text-[#f59e0b]" />
            Hint ({hintsLeft})
          </button>
          <button
            type="button"
            onClick={resetBoard}
            disabled={status !== "playing"}
            className="mg-btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#28254a] bg-[#1a1935] px-3 py-2 text-[11px] font-semibold text-[#9e9bbf] disabled:opacity-40"
          >
            <Redo2 className="size-3.5" />
            Reset
          </button>
        </div>
        )}
      </div>
    </AetherArcadeShell>
  );
}
