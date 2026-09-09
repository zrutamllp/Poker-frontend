import { cn } from "@/lib/utils";
import type { CrosswordBoard, CrosswordDirection, CrosswordWord } from "@/features/crossword/crosswordTypes";
import { getWordProgress } from "@/features/crossword/crosswordEngine";
import { crosswordTheme as t } from "./crossword-theme";

interface CrosswordCluesProps {
  board: CrosswordBoard;
  title: string;
  words: CrosswordWord[];
  activeWordId: string | null;
  letters: Record<string, string>;
  onClueSelect: (word: CrosswordWord) => void;
}

function ClueItem({
  board,
  word,
  isActive,
  letters,
  onSelect,
}: {
  board: CrosswordBoard;
  word: CrosswordWord;
  isActive: boolean;
  letters: Record<string, string>;
  onSelect: () => void;
}) {
  const progress = getWordProgress(board, word, letters);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg px-2 py-1.5 text-left transition-colors",
        "hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
        isActive && t.clueActive,
        progress.complete && progress.correct && t.clueDone,
      )}
    >
      <span className={cn("font-semibold tabular-nums", t.heading)}>{word.number}.</span>{" "}
      <span className={cn("text-sm", t.emphasis)}>{word.clue}</span>
    </button>
  );
}

export function CrosswordClues({
  board,
  title,
  words,
  activeWordId,
  letters,
  onClueSelect,
}: CrosswordCluesProps) {
  return (
    <section className={cn("relative min-w-0 overflow-hidden p-4", t.card)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-100",
          t.cardAccent,
        )}
        aria-hidden
      />
      <h3
        className={cn(
          "relative mb-2 border-b pb-1 font-serif text-sm font-bold uppercase tracking-wider",
          t.divider,
          t.heading,
        )}
      >
        {title}
      </h3>
      <ul className="relative space-y-0.5">
        {words.map((word) => (
          <li key={word.id}>
            <ClueItem
              board={board}
              word={word}
              isActive={word.id === activeWordId}
              letters={letters}
              onSelect={() => onClueSelect(word)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CurrentClueBanner({
  word,
  direction,
}: {
  word: CrosswordWord | null;
  direction: CrosswordDirection;
}) {
  if (!word) return null;
  return (
    <div className={cn("relative overflow-hidden rounded-2xl px-4 py-3", t.card)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br",
          t.cardAccent,
        )}
        aria-hidden
      />
      <p className={cn("relative text-[10px] font-bold uppercase tracking-widest", t.label)}>
        {direction} · {word.number}
      </p>
      <p className={cn("relative mt-1 font-serif text-base sm:text-lg", t.emphasis)}>
        {word.clue}
      </p>
    </div>
  );
}
