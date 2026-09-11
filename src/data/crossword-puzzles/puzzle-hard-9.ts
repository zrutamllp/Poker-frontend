import type { CrosswordPuzzle } from "@/features/crossword/crosswordTypes";

/** Hard 9×9 — poker & culture terms */
export const puzzleHard9: CrosswordPuzzle = {
  id: "crossword-hard-001",
  number: 429,
  title: "High Stakes Grid",
  date: "2026-09-09",
  difficulty: "hard",
  size: 9,
  theme: "On the move — betting & culture",
  estimatedMinutes: 15,
  solution: [
    [null, "P", "O", "K", "E", "R", null, null, null],
    [null, "O", null, null, null, null, null, null, null],
    [null, "K", null, null, null, null, null, null, null],
    [null, "E", null, "C", "H", "I", "P", "S", null],
    [null, "R", null, "B", null, null, null, null, null],
    [null, null, null, "L", null, null, null, null, null],
    [null, null, null, "I", null, null, null, null, null],
    [null, null, null, "N", null, null, null, null, null],
    [null, null, null, "D", null, null, null, null, null],
  ],
  clues: {
    across: [
      {
        number: 1,
        clue: "Card game played at the culture table",
        answer: "POKER",
        row: 0,
        col: 1,
        direction: "across",
      },
      {
        number: 6,
        clue: "What you stack before betting",
        answer: "CHIPS",
        row: 3,
        col: 3,
        direction: "across",
      },
    ],
    down: [
      {
        number: 1,
        clue: "Card game read top to bottom",
        answer: "POKER",
        row: 0,
        col: 1,
        direction: "down",
      },
      {
        number: 7,
        clue: "Unable to see the flop",
        answer: "BLIND",
        row: 4,
        col: 3,
        direction: "down",
      },
    ],
  },
};
