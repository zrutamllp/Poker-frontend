export type CrosswordDirection = "across" | "down";

export type CrosswordDifficulty = "easy" | "medium" | "hard";

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  direction: CrosswordDirection;
}

export interface CrosswordPuzzle {
  id: string;
  number: number;
  title: string;
  date: string;
  difficulty: CrosswordDifficulty;
  size: number;
  /** Solution grid — null = blocked cell */
  solution: (string | null)[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  theme?: string;
  estimatedMinutes?: number;
}

export interface CrosswordCell {
  row: number;
  col: number;
  isBlock: boolean;
  solution: string | null;
  number: number | null;
  acrossId: string | null;
  downId: string | null;
}

export interface CrosswordWord {
  id: string;
  number: number;
  direction: CrosswordDirection;
  row: number;
  col: number;
  length: number;
  answer: string;
  clue: string;
  cells: Array<{ row: number; col: number }>;
}

export interface CrosswordBoard {
  puzzle: CrosswordPuzzle;
  cells: CrosswordCell[][];
  words: CrosswordWord[];
  wordById: Map<string, CrosswordWord>;
}

export interface CrosswordProgress {
  puzzleId: string;
  letters: Record<string, string>;
  selectedRow: number;
  selectedCol: number;
  direction: CrosswordDirection;
  elapsedSeconds: number;
  hintsUsed: number;
  mistakes: number;
  completed: boolean;
  paused: boolean;
  startedAt: number;
  checkedCells: Record<string, boolean>;
}

export interface CrosswordHintLevel {
  text: string;
}

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}
