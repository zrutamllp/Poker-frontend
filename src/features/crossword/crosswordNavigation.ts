import type { CrosswordBoard, CrosswordDirection } from "./crosswordTypes";

export function toggleDirection(
  direction: CrosswordDirection,
  hasAcross: boolean,
  hasDown: boolean,
): CrosswordDirection {
  if (hasAcross && hasDown) {
    return direction === "across" ? "down" : "across";
  }
  if (hasDown) return "down";
  return "across";
}

export function moveSelection(
  board: CrosswordBoard,
  row: number,
  col: number,
  direction: CrosswordDirection,
  delta: number,
): { row: number; col: number; direction: CrosswordDirection } {
  const word = direction === "across"
    ? board.cells[row][col].acrossId
      ? board.wordById.get(board.cells[row][col].acrossId!)!
      : null
    : board.cells[row][col].downId
      ? board.wordById.get(board.cells[row][col].downId!)!
      : null;

  if (word) {
    const idx = word.cells.findIndex((c) => c.row === row && c.col === col);
    const nextIdx = idx + delta;
    if (nextIdx >= 0 && nextIdx < word.cells.length) {
      return { ...word.cells[nextIdx], direction };
    }
  }

  return moveByArrow(board, row, col, direction, delta > 0 ? 1 : -1);
}

function moveByArrow(
  board: CrosswordBoard,
  row: number,
  col: number,
  direction: CrosswordDirection,
  step: 1 | -1,
): { row: number; col: number; direction: CrosswordDirection } {
  const size = board.puzzle.size;
  let r = row;
  let c = col;

  if (direction === "across") {
    c += step;
    while (c >= 0 && c < size && board.cells[r][c].isBlock) c += step;
  } else {
    r += step;
    while (r >= 0 && r < size && board.cells[r][c].isBlock) r += step;
  }

  if (r < 0 || r >= size || c < 0 || c >= size || board.cells[r][c].isBlock) {
    return { row, col, direction };
  }
  return { row: r, col: c, direction };
}

export function moveArrow(
  board: CrosswordBoard,
  row: number,
  col: number,
  direction: CrosswordDirection,
  arrow: "up" | "down" | "left" | "right",
): { row: number; col: number; direction: CrosswordDirection } {
  const size = board.puzzle.size;
  let r = row;
  let c = col;

  switch (arrow) {
    case "up":
      r--;
      break;
    case "down":
      r++;
      break;
    case "left":
      c--;
      break;
    case "right":
      c++;
      break;
  }

  while (r >= 0 && r < size && c >= 0 && c < size && board.cells[r][c].isBlock) {
    switch (arrow) {
      case "up":
        r--;
        break;
      case "down":
        r++;
        break;
      case "left":
        c--;
        break;
      case "right":
        c++;
        break;
    }
  }

  if (r < 0 || r >= size || c < 0 || c >= size || board.cells[r][c].isBlock) {
    return { row, col, direction };
  }

  const cell = board.cells[r][c];
  const newDir =
    direction === "across" && cell.acrossId
      ? "across"
      : direction === "down" && cell.downId
        ? "down"
        : cell.acrossId
          ? "across"
          : cell.downId
            ? "down"
            : direction;

  return { row: r, col: c, direction: newDir };
}

export function getNextClueWord(
  board: CrosswordBoard,
  currentWordId: string | null,
  reverse = false,
): { row: number; col: number; direction: CrosswordDirection } | null {
  const sorted = [...board.words].sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    if (a.col !== b.col) return a.col - b.col;
    return a.direction === "across" ? -1 : 1;
  });

  if (sorted.length === 0) return null;

  if (!currentWordId) {
    const first = sorted[0];
    return { row: first.row, col: first.col, direction: first.direction };
  }

  const idx = sorted.findIndex((w) => w.id === currentWordId);
  const nextIdx = reverse
    ? (idx - 1 + sorted.length) % sorted.length
    : (idx + 1) % sorted.length;
  const next = sorted[nextIdx];
  return { row: next.row, col: next.col, direction: next.direction };
}

export function findFirstOpenCell(
  board: CrosswordBoard,
  letters: Record<string, string>,
): { row: number; col: number; direction: CrosswordDirection } {
  for (const word of board.words) {
    for (const { row, col } of word.cells) {
      const key = `${row},${col}`;
      if (!letters[key]) {
        return { row, col, direction: word.direction };
      }
    }
  }
  const first = board.words[0];
  return { row: first.row, col: first.col, direction: first.direction };
}
