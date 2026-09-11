import { cn } from "@/lib/utils";
import type { CrosswordDirection } from "@/features/crossword/crosswordTypes";
import { crosswordTheme as t } from "./crossword-theme";

interface CrosswordCellProps {
  row: number;
  col: number;
  isBlock: boolean;
  number: number | null;
  letter: string;
  isSelected: boolean;
  isInWord: boolean;
  isError: boolean;
  isCorrect: boolean;
  direction: CrosswordDirection;
  onSelect: (row: number, col: number) => void;
}

export function CrosswordCell({
  row,
  col,
  isBlock,
  number,
  letter,
  isSelected,
  isInWord,
  isError,
  isCorrect,
  direction,
  onSelect,
}: CrosswordCellProps) {
  if (isBlock) {
    return <div className={cn("aspect-square", t.gridBlock)} aria-hidden />;
  }

  const ariaLabel = [
    `Cell ${row + 1}, ${col + 1}`,
    number ? `Clue ${number}` : null,
    letter ? `Letter ${letter}` : "Empty",
    isSelected ? `Selected ${direction}` : null,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <button
      type="button"
      onClick={() => onSelect(row, col)}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className={cn(
        "relative aspect-square transition-colors duration-150",
        t.gridCell,
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold",
        isInWord && !isSelected && t.gridCellWord,
        isSelected && t.gridCellSelected,
        isError && t.gridCellError,
        isCorrect && letter && t.gridCellCorrect,
      )}
    >
      {number !== null && (
        <span
          className={cn(
            "absolute left-0.5 top-0 font-sans text-[8px] font-semibold leading-none sm:text-[9px]",
            t.gridNumber,
          )}
        >
          {number}
        </span>
      )}
      <span
        className={cn(
          "flex size-full items-center justify-center font-serif text-base font-bold uppercase sm:text-lg",
          t.gridLetter,
        )}
      >
        {letter}
      </span>
    </button>
  );
}
