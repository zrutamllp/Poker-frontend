import type {
  CrosswordBoard,
  CrosswordCell,
  CrosswordClue,
  CrosswordDirection,
  CrosswordPuzzle,
  CrosswordWord,
} from "./crosswordTypes";
import { cellKey } from "./crosswordTypes";

function clueId(number: number, direction: CrosswordDirection): string {
  return `${direction}-${number}`;
}

function getWordCells(
  row: number,
  col: number,
  direction: CrosswordDirection,
  length: number,
): Array<{ row: number; col: number }> {
  const cells: Array<{ row: number; col: number }> = [];
  for (let i = 0; i < length; i++) {
    cells.push(
      direction === "across"
        ? { row, col: col + i }
        : { row: row + i, col },
    );
  }
  return cells;
}

export function validatePuzzle(puzzle: CrosswordPuzzle): void {
  const { size, solution } = puzzle;
  const allClues = [...puzzle.clues.across, ...puzzle.clues.down];

  for (const clue of allClues) {
    const cells = getWordCells(clue.row, clue.col, clue.direction, clue.answer.length);
    if (cells.some((c) => c.row >= size || c.col >= size || c.row < 0 || c.col < 0)) {
      throw new Error(`Clue ${clue.number} ${clue.direction} out of bounds`);
    }
    for (let i = 0; i < clue.answer.length; i++) {
      const { row, col } = cells[i];
      const cell = solution[row][col];
      if (cell === null) {
        throw new Error(`Clue ${clue.number} ${clue.direction} hits blocked cell`);
      }
      if (cell !== clue.answer[i]) {
        throw new Error(
          `Clue ${clue.number} ${clue.direction} mismatch at (${row},${col}): expected ${clue.answer[i]}, got ${cell}`,
        );
      }
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (solution[r][c] === null) continue;
      const inAcross = allClues.some((clue) => {
        if (clue.direction !== "across") return false;
        return (
          clue.row === r &&
          c >= clue.col &&
          c < clue.col + clue.answer.length
        );
      });
      const inDown = allClues.some((clue) => {
        if (clue.direction !== "down") return false;
        return (
          clue.col === c &&
          r >= clue.row &&
          r < clue.row + clue.answer.length
        );
      });
      if (!inAcross && !inDown) {
        throw new Error(`Orphan cell at (${r},${c})`);
      }
    }
  }
}

function assignNumbers(clues: CrosswordClue[]): Map<string, number> {
  const starts = clues
    .map((c) => ({ row: c.row, col: c.col, id: clueId(c.number, c.direction) }))
    .sort((a, b) => (a.row === b.row ? a.col - b.col : a.row - b.row));

  const seen = new Map<string, number>();
  let n = 1;
  for (const start of starts) {
    const key = `${start.row},${start.col}`;
    if (!seen.has(key)) {
      seen.set(key, n++);
    }
  }
  return seen;
}

export function buildBoard(puzzle: CrosswordPuzzle): CrosswordBoard {
  validatePuzzle(puzzle);
  const { size, solution } = puzzle;
  const allClues = [...puzzle.clues.across, ...puzzle.clues.down];
  const numberMap = assignNumbers(allClues);

  const cells: CrosswordCell[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row,
      col,
      isBlock: solution[row][col] === null,
      solution: solution[row][col],
      number: null,
      acrossId: null,
      downId: null,
    })),
  );

  const words: CrosswordWord[] = allClues.map((clue) => {
    const id = clueId(clue.number, clue.direction);
    const wordCells = getWordCells(clue.row, clue.col, clue.direction, clue.answer.length);
    const startKey = `${clue.row},${clue.col}`;
    const displayNumber = numberMap.get(startKey) ?? clue.number;

    for (const { row, col } of wordCells) {
      cells[row][col].number ??= displayNumber;
      if (clue.direction === "across") {
        cells[row][col].acrossId = id;
      } else {
        cells[row][col].downId = id;
      }
    }

    return {
      id,
      number: displayNumber,
      direction: clue.direction,
      row: clue.row,
      col: clue.col,
      length: clue.answer.length,
      answer: clue.answer,
      clue: clue.clue,
      cells: wordCells,
    };
  });

  return {
    puzzle,
    cells,
    words,
    wordById: new Map(words.map((w) => [w.id, w])),
  };
}

export function getActiveWord(
  board: CrosswordBoard,
  row: number,
  col: number,
  direction: CrosswordDirection,
): CrosswordWord | null {
  const cell = board.cells[row]?.[col];
  if (!cell || cell.isBlock) return null;
  const id = direction === "across" ? cell.acrossId : cell.downId;
  if (!id) return null;
  return board.wordById.get(id) ?? null;
}

export function getWordProgress(
  board: CrosswordBoard,
  word: CrosswordWord,
  letters: Record<string, string>,
): { filled: number; total: number; complete: boolean; correct: boolean } {
  let filled = 0;
  let correct = true;
  for (const { row, col } of word.cells) {
    const letter = letters[cellKey(row, col)]?.toUpperCase();
    if (letter) filled++;
    if (letter !== board.cells[row][col].solution) correct = false;
  }
  return {
    filled,
    total: word.length,
    complete: filled === word.length,
    correct: filled === word.length && correct,
  };
}

export function countCompletedWords(
  board: CrosswordBoard,
  letters: Record<string, string>,
): { completed: number; total: number } {
  let completed = 0;
  for (const word of board.words) {
    const p = getWordProgress(board, word, letters);
    if (p.complete && p.correct) completed++;
  }
  return { completed, total: board.words.length };
}

export function isPuzzleComplete(
  board: CrosswordBoard,
  letters: Record<string, string>,
): boolean {
  for (let r = 0; r < board.puzzle.size; r++) {
    for (let c = 0; c < board.puzzle.size; c++) {
      const cell = board.cells[r][c];
      if (cell.isBlock) continue;
      const letter = letters[cellKey(r, c)]?.toUpperCase();
      if (letter !== cell.solution) return false;
    }
  }
  return true;
}

export function getCluesGrouped(board: CrosswordBoard) {
  const across = board.words
    .filter((w) => w.direction === "across")
    .sort((a, b) => a.number - b.number);
  const down = board.words
    .filter((w) => w.direction === "down")
    .sort((a, b) => a.number - b.number);
  return { across, down };
}
