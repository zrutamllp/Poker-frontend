import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CrosswordDifficulty } from "@/features/crossword/crosswordTypes";
import { crosswordTheme as t } from "./crossword-theme";

interface CrosswordCompletionProps {
  elapsedSeconds: number;
  hintsUsed: number;
  mistakes: number;
  difficulty: CrosswordDifficulty;
  puzzleNumber: number;
  wordsTotal: number;
  score: number;
  onContinue: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function CrosswordCompletion({
  elapsedSeconds,
  hintsUsed,
  mistakes,
  difficulty,
  puzzleNumber,
  wordsTotal,
  score,
  onContinue,
}: CrosswordCompletionProps) {
  return (
    <div className={cn("relative mx-auto max-w-md overflow-hidden p-6 text-center", t.card)}>
      <div
        className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", t.cardAccent)}
        aria-hidden
      />
      <h2 className={cn("relative font-serif text-2xl font-black", t.heading)}>
        Puzzle Complete
      </h2>
      <p className={cn("relative mt-1 font-serif text-lg italic", t.body)}>Well solved.</p>
      <p className={cn("relative mt-4 font-mono text-3xl font-bold tabular-nums", t.emphasis)}>
        {formatTime(elapsedSeconds)}
      </p>
      <p className={cn("relative mt-2 text-xs font-bold uppercase tracking-widest", t.body)}>
        {difficulty}
      </p>
      <p className={cn("relative mt-1 text-sm font-semibold", t.emphasis)}>
        {score} points · {wordsTotal} / {wordsTotal} answers
      </p>
      <dl className="relative mt-4 grid grid-cols-2 gap-3 text-left text-sm">
        <div>
          <dt className={t.body}>Hints</dt>
          <dd className={cn("font-semibold", t.emphasis)}>{hintsUsed}</dd>
        </div>
        <div>
          <dt className={t.body}>Mistakes</dt>
          <dd className={cn("font-semibold", t.emphasis)}>{mistakes}</dd>
        </div>
        <div>
          <dt className={t.body}>Puzzle</dt>
          <dd className={cn("font-semibold", t.emphasis)}>#{puzzleNumber}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onContinue}
        className={cn("relative mt-6 inline-flex items-center gap-2", t.btnGold)}
      >
        Return to games
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
