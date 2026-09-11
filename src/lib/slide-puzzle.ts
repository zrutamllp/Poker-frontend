/** Classic N×N sliding tile puzzle (empty = 0, tiles 1…N²−1) */

export const PUZZLE_ART = {
  title: "Neon Citadel Horizon",
  category: "Visual Intel",
  gradient:
    "linear-gradient(135deg, #4c1d95 0%, #0e7490 35%, #f59e0b 65%, #06b6d4 100%)",
} as const;

export function solvedBoard(size: number): number[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) => (i === total - 1 ? 0 : i + 1));
}

export function isSolved(board: number[], size: number): boolean {
  const goal = solvedBoard(size);
  return board.length === goal.length && board.every((v, i) => v === goal[i]);
}

export function indexToRowCol(index: number, size: number) {
  return { row: Math.floor(index / size), col: index % size };
}

export function rowColToIndex(row: number, col: number, size: number) {
  return row * size + col;
}

export function getAdjacentIndices(index: number, size: number): number[] {
  const { row, col } = indexToRowCol(index, size);
  const neighbors: number[] = [];
  if (row > 0) neighbors.push(rowColToIndex(row - 1, col, size));
  if (row < size - 1) neighbors.push(rowColToIndex(row + 1, col, size));
  if (col > 0) neighbors.push(rowColToIndex(row, col - 1, size));
  if (col < size - 1) neighbors.push(rowColToIndex(row, col + 1, size));
  return neighbors;
}

export function canSlide(board: number[], fromIndex: number, size: number): boolean {
  const emptyIndex = board.indexOf(0);
  return getAdjacentIndices(emptyIndex, size).includes(fromIndex);
}

export function slideTile(board: number[], fromIndex: number, size: number): number[] {
  if (!canSlide(board, fromIndex, size)) return board;
  const emptyIndex = board.indexOf(0);
  const next = [...board];
  [next[fromIndex], next[emptyIndex]] = [next[emptyIndex], next[fromIndex]];
  return next;
}

/** Solvable shuffle via random valid moves from solved state */
export function shuffledBoard(size: number, scrambleMoves = 240): number[] {
  let board = solvedBoard(size);
  let emptyIndex = board.indexOf(0);

  for (let i = 0; i < scrambleMoves; i++) {
    const neighbors = getAdjacentIndices(emptyIndex, size);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    board = slideTile(board, pick, size);
    emptyIndex = pick;
  }

  if (isSolved(board, size)) {
    const neighbors = getAdjacentIndices(emptyIndex, size);
    board = slideTile(board, neighbors[0], size);
  }

  return board;
}

/** Background slice for a tile value in its correct position */
export function tileSliceStyle(tile: number, size: number) {
  if (tile === 0) return undefined;
  const idx = tile - 1;
  const col = idx % size;
  const row = Math.floor(idx / size);
  const step = size > 1 ? 100 / (size - 1) : 0;
  return {
    backgroundImage: PUZZLE_ART.gradient,
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: `${col * step}% ${row * step}%`,
  } as const;
}

export function fullImageStyle() {
  return {
    backgroundImage: PUZZLE_ART.gradient,
    backgroundSize: "cover",
    backgroundPosition: "center",
  } as const;
}

/** One helpful move: tile adjacent to empty that is not yet home */
export function findHintIndex(board: number[], size: number): number | null {
  const emptyIndex = board.indexOf(0);
  const candidates = getAdjacentIndices(emptyIndex, size).filter((i) => board[i] !== 0);

  for (const i of candidates) {
    const tile = board[i];
    if (tile !== i + 1) return i;
  }

  return candidates[0] ?? null;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
