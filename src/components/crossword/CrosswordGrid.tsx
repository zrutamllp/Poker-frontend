import type { CrosswordBoard, CrosswordDirection } from "@/features/crossword/crosswordTypes";
import { cellKey } from "@/features/crossword/crosswordTypes";
import { getActiveWord } from "@/features/crossword/crosswordEngine";
import { cn } from "@/lib/utils";
import { crosswordTheme as t } from "./crossword-theme";
import { CrosswordCell } from "./CrosswordCell";

interface CrosswordGridProps {
  board: CrosswordBoard;
  letters: Record<string, string>;
  selectedRow: number;
  selectedCol: number;
  direction: CrosswordDirection;
  checkedCells: Record<string, boolean>;
  onSelect: (row: number, col: number) => void;
}

export function CrosswordGrid({
  board,
  letters,
  selectedRow,
  selectedCol,
  direction,
  checkedCells,
  onSelect,
}: CrosswordGridProps) {
  const activeWord = getActiveWord(board, selectedRow, selectedCol, direction);
  const activeCellSet = new Set(
    activeWord?.cells.map((c) => cellKey(c.row, c.col)) ?? [],
  );

  const size = board.puzzle.size;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[min(100%,420px)] p-0.5 sm:max-w-[480px]",
        t.gridFrame,
      )}
      role="grid"
      aria-label="Crossword grid"
    >
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {board.cells.map((row) =>
          row.map((cell) => {
            const key = cellKey(cell.row, cell.col);
            const letter = letters[key]?.toUpperCase() ?? "";
            const solution = cell.solution ?? "";
            const isChecked = checkedCells[key];
            const isError =
              isChecked && letter.length > 0 && letter !== solution;
            const isCorrect =
              isChecked && letter.length > 0 && letter === solution;

            return (
              <CrosswordCell
                key={key}
                row={cell.row}
                col={cell.col}
                isBlock={cell.isBlock}
                number={cell.number}
                letter={letter}
                isSelected={cell.row === selectedRow && cell.col === selectedCol}
                isInWord={activeCellSet.has(key)}
                isError={isError}
                isCorrect={isCorrect}
                direction={direction}
                onSelect={onSelect}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}
