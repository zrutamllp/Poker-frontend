import { buildBoard } from "@/features/crossword/crosswordEngine";
import type { CrosswordDifficulty, CrosswordPuzzle } from "@/features/crossword/crosswordTypes";
import { puzzleEasy5 } from "./puzzle-easy-5";
import { puzzleMedium7 } from "./puzzle-medium-7";
import { puzzleHard9 } from "./puzzle-hard-9";

export const CROSSWORD_PUZZLES: CrosswordPuzzle[] = [
  puzzleEasy5,
  puzzleMedium7,
  puzzleHard9,
];

/** Validate all puzzles at module load */
for (const puzzle of CROSSWORD_PUZZLES) {
  buildBoard(puzzle);
}

export function getCrosswordByDifficulty(difficulty: CrosswordDifficulty): CrosswordPuzzle {
  const match = CROSSWORD_PUZZLES.find((p) => p.difficulty === difficulty);
  return match ?? puzzleEasy5;
}

export function getCrosswordForTier(tier: "standard" | "high_stakes"): CrosswordPuzzle {
  if (tier === "high_stakes") return puzzleHard9;
  return puzzleMedium7;
}

export function getCrosswordById(id: string): CrosswordPuzzle | undefined {
  return CROSSWORD_PUZZLES.find((p) => p.id === id);
}

export function formatPuzzleDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
