import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { CrosswordClues, CurrentClueBanner } from "@/components/crossword/CrosswordClues";
import { CrosswordCompletion } from "@/components/crossword/CrosswordCompletion";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordHeader } from "@/components/crossword/CrosswordHeader";
import { CrosswordKeyboard } from "@/components/crossword/CrosswordKeyboard";
import { CrosswordToolbar } from "@/components/crossword/CrosswordToolbar";
import { crosswordTheme as t } from "@/components/crossword/crossword-theme";
import { MinigameIntroGate } from "@/components/minigames/minigame-intro-gate";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult } from "@/components/minigames/minigame-sidebar";
import {
  MinigameViewport,
  MinigameViewportFooter,
  MinigameViewportMain,
} from "@/components/minigames/minigame-viewport";
import { useMinigameIntro } from "@/hooks/use-minigame-intro";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { getCrosswordById, getCrosswordForTier } from "@/data/crossword-puzzles";
import { useCrosswordGame } from "@/features/crossword/useCrosswordGame";
import { getNextClueWord } from "@/features/crossword/crosswordNavigation";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import { effectiveGameSeconds } from "@/lib/minigame-session-timer";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function WordPuzzlePage() {
  const navigate = useNavigate();
  const {
    session,
    sessionVersion,
    loading,
    difficulty,
    submitResult,
    canRetry,
    isOnlineMode,
    attemptsRemaining,
    startSession,
  } = useMinigameSession("lexicode");

  const limits = session?.limits ?? getGameLimits("lexicode", difficulty);
  const [view, setView] = useState<MinigameView>("play");
  const [timeLeft, setTimeLeft] = useState<number>(limits.seconds);
  const { introAcked, ackIntro } = useMinigameIntro(sessionVersion);
  const submittedRef = useRef(false);

  const puzzle = useMemo(() => {
    const puzzleId = session?.puzzles?.puzzleId;
    if (puzzleId) {
      return getCrosswordById(puzzleId) ?? getCrosswordForTier(difficulty);
    }
    return getCrosswordForTier(difficulty);
  }, [session?.puzzles?.puzzleId, difficulty]);

  const onComplete = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
  }, []);

  const timedOut = timeLeft <= 0;
  const sessionEnded = timedOut;

  const game = useCrosswordGame({
    puzzle,
    hintsMax: limits.hintsMax,
    onComplete,
    timerActive: introAcked && !sessionEnded,
    inputLocked: sessionEnded,
  });

  useEffect(() => {
    if (!session) return;
    setTimeLeft(effectiveGameSeconds(session.limits.seconds));
    submittedRef.current = false;
    game.resetProgress();
  }, [session, sessionVersion, game.resetProgress]);

  const status = game.progress.completed ? "won" : timedOut ? "lost" : "playing";
  const playing = introAcked && status === "playing" && view === "play";
  const showViewTabs = !playing;
  const totalScore = status === "won" ? limits.winScore : status === "lost" ? 0 : undefined;

  useMinigameOutcomeSubmit(
    status,
    submitResult,
    {
      elapsedSeconds: limits.seconds - timeLeft,
      hintsUsed: game.progress.hintsUsed,
      mistakes: game.progress.mistakes,
    },
    totalScore,
    sessionVersion,
  );

  useEffect(() => {
    if (!introAcked || status !== "playing" || view === "instructions") return;

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [introAcked, status, view, sessionVersion]);

  const compactHeader = (
    <CrosswordHeader
      puzzle={puzzle}
      timer={formatTime(timeLeft)}
      timerUrgent={timeLeft <= 15 && status === "playing"}
      answersLabel={`${game.wordProgress.completed} of ${game.wordProgress.total} answers`}
    />
  );

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.lexicode.label} contentClassName="overflow-hidden">
        <div className={cn("flex flex-1 items-center justify-center font-serif", t.body)}>
          Loading today&apos;s crossword…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell
      gameLabel={MINIGAME_COPY.lexicode.label}
      subtitle={`2 min · ${limits.winScore} pts max`}
      contentClassName="overflow-hidden"
      header={compactHeader}
    >
      <MinigameIntroGate
        gameId="lexicode"
        difficulty={difficulty}
        introAcked={introAcked}
        onAck={ackIntro}
        panelClassName={cn(t.card, "p-4")}
      >
        <MinigameViewport className="gap-[clamp(6px,1.2vh,12px)] px-[clamp(8px,2vw,16px)] py-[clamp(6px,1.2vh,12px)]">
          {showViewTabs && (
            <aside className="shrink-0 lg:w-44">
              <MinigameViewTabs view={view} onChange={setView} />
            </aside>
          )}

          {view === "instructions" ? (
            <MinigameInstructionsPanel
              gameId="lexicode"
              difficulty={difficulty}
              className={cn("min-h-0 min-w-0 flex-1 overflow-y-auto p-4", t.card)}
            />
          ) : game.progress.completed ? (
            <MinigameViewportMain className="items-center justify-center">
              <CrosswordCompletion
                elapsedSeconds={limits.seconds - timeLeft}
                hintsUsed={game.progress.hintsUsed}
                mistakes={game.progress.mistakes}
                difficulty={puzzle.difficulty}
                puzzleNumber={puzzle.number}
                wordsTotal={game.wordProgress.total}
                score={limits.winScore}
                onContinue={() => navigate("/instructions")}
              />
            </MinigameViewportMain>
          ) : timedOut ? (
            <MinigameViewportMain className="items-center justify-center">
              <MinigameResult
                variant="lost"
                title={MINIGAME_COPY.lexicode.lose}
                subtitle={`${totalScore ?? 0} points`}
                detail={`Hints used: ${game.progress.hintsUsed} · ${formatTime(limits.seconds - timeLeft)} elapsed`}
                onRetry={() => void startSession()}
                onBack={() => navigate("/instructions")}
                canRetry={canRetry}
                isOnlineMode={isOnlineMode}
                attemptsRemaining={attemptsRemaining}
              />
            </MinigameViewportMain>
          ) : (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[clamp(6px,1.2vh,12px)] lg:flex-row lg:gap-4">
              <MinigameViewportMain className="min-w-0 gap-[clamp(6px,1.2vh,10px)]">
                <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto py-1">
                  <CrosswordGrid
                    board={game.board}
                    letters={game.progress.letters}
                    selectedRow={game.progress.selectedRow}
                    selectedCol={game.progress.selectedCol}
                    direction={game.progress.direction}
                    checkedCells={game.progress.checkedCells}
                    onSelect={game.selectCell}
                  />
                </div>

                <div className="shrink-0 lg:hidden">
                  <CurrentClueBanner word={game.activeWord} direction={game.progress.direction} />
                </div>

                <MinigameViewportFooter className="shrink-0 border-t-0 pt-0">
                  <CrosswordToolbar
                    hintsRemaining={game.hintsRemaining}
                    onCheck={game.check}
                    onHint={game.hint}
                  />
                  <p className={cn("mt-2 text-center text-xs", t.body)}>
                    {MINIGAME_COPY.lexicode.prompt}
                  </p>
                </MinigameViewportFooter>
              </MinigameViewportMain>

              <aside className="hidden min-h-0 w-72 shrink-0 flex-col gap-3 overflow-hidden xl:w-80 lg:flex">
                <div className={cn("min-h-0 flex-1 overflow-y-auto p-3", t.card)}>
                  <CrosswordClues
                    board={game.board}
                    title="Across"
                    words={game.getClues().across}
                    activeWordId={game.activeWord?.direction === "across" ? game.activeWord.id : null}
                    letters={game.progress.letters}
                    onClueSelect={game.selectWord}
                  />
                </div>
                <div className={cn("min-h-0 flex-1 overflow-y-auto p-3", t.card)}>
                  <CrosswordClues
                    board={game.board}
                    title="Down"
                    words={game.getClues().down}
                    activeWordId={game.activeWord?.direction === "down" ? game.activeWord.id : null}
                    letters={game.progress.letters}
                    onClueSelect={game.selectWord}
                  />
                </div>
              </aside>
            </div>
          )}

          {playing && (
            <MinigameViewportFooter className="shrink-0 lg:hidden">
              <CrosswordKeyboard
                onKey={game.setLetter}
                onBackspace={game.backspace}
                onPrev={() => {
                  const next = getNextClueWord(game.board, game.activeWord?.id ?? null, true);
                  if (next) game.selectCell(next.row, next.col, next.direction);
                }}
                onNext={() => {
                  const next = getNextClueWord(game.board, game.activeWord?.id ?? null, false);
                  if (next) game.selectCell(next.row, next.col, next.direction);
                }}
                onToggleDirection={() => {
                  game.selectCell(
                    game.progress.selectedRow,
                    game.progress.selectedCol,
                    game.progress.direction === "across" ? "down" : "across",
                  );
                }}
              />
            </MinigameViewportFooter>
          )}
        </MinigameViewport>
      </MinigameIntroGate>
    </AetherArcadeShell>
  );
}
