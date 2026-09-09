import type { CrosswordPuzzle } from "@/features/crossword/crosswordTypes";

/** Medium 7×7 — culture table vocabulary */
export const puzzleMedium7: CrosswordPuzzle = {
  id: "crossword-medium-001",
  number: 428,
  title: "At the Table",
  date: "2026-09-09",
  difficulty: "medium",
  size: 7,
  theme: "Words from the culture table",
  estimatedMinutes: 8,
  solution: [
    [null, "H", "E", "A", "R", "T", null],
    [null, "E", null, null, null, null, null],
    [null, "A", "G", "E", null, null, null],
    [null, "R", null, null, null, null, null],
    [null, "T", "E", "A", "M", null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ],
  clues: {
    across: [
      {
        number: 1,
        clue: "Vital organ; also courage",
        answer: "HEART",
        row: 0,
        col: 1,
        direction: "across",
      },
      {
        number: 6,
        clue: "Maturity, or a poker term for three",
        answer: "AGE",
        row: 2,
        col: 1,
        direction: "across",
      },
      {
        number: 7,
        clue: "Group playing together",
        answer: "TEAM",
        row: 4,
        col: 1,
        direction: "across",
      },
    ],
    down: [
      {
        number: 1,
        clue: "Same as 1-Across, read vertically",
        answer: "HEART",
        row: 0,
        col: 1,
        direction: "down",
      },
    ],
  },
};
