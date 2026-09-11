import type { CrosswordPuzzle } from "@/features/crossword/crosswordTypes";

/** Easy 5×5 — quick warm-up */
export const puzzleEasy5: CrosswordPuzzle = {
  id: "crossword-easy-001",
  number: 427,
  title: "Pet Parade",
  date: "2026-09-09",
  difficulty: "easy",
  size: 5,
  theme: "Everyday companions",
  estimatedMinutes: 3,
  solution: [
    ["C", "A", "T", null, null],
    ["O", "L", null, null, null],
    ["D", "O", "G", null, null],
    [null, "E", null, null, null],
    [null, null, null, null, null],
  ],
  clues: {
    across: [
      {
        number: 1,
        clue: "Feline pet",
        answer: "CAT",
        row: 0,
        col: 0,
        direction: "across",
      },
      {
        number: 3,
        clue: "Canine companion",
        answer: "DOG",
        row: 2,
        col: 0,
        direction: "across",
      },
    ],
    down: [
      {
        number: 1,
        clue: "Fish dish, informally",
        answer: "COD",
        row: 0,
        col: 0,
        direction: "down",
      },
      {
        number: 2,
        clue: "Soothing succulent",
        answer: "ALOE",
        row: 0,
        col: 1,
        direction: "down",
      },
    ],
  },
};
