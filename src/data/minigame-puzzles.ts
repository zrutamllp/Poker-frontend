/** Shared word lists for culture-coin minigames */

import { getCrosswordForTier } from "@/data/crossword-puzzles";
import { pickFakeOneSession } from "@/data/fake-one";
import type { MinigameDifficulty, PuzzleTier } from "@/lib/minigame-difficulty";
import { puzzlesForDifficulty } from "@/lib/minigame-difficulty";

export { pickFakeOneSession };

export type { PuzzleTier };

export const HANGMAN_PUZZLES = [
  { word: "OWNER", Hint: "Treats it like it's theirs, because it is.", tier: "standard" as PuzzleTier },
  { word: "COURAGE", Hint: "The thing fear needs to be worth it.", tier: "standard" as PuzzleTier },
  { word: "WIN TOGETHER", Hint: "Scoreboard reads we, not me. ", tier: "standard" as PuzzleTier },
  { word: "AMBITION", Hint: "Refuses to settle for good enough.", tier: "standard" as PuzzleTier },
  { word: "RESOURCES", Hint: "People, money, time — what every plan needs.", tier: "standard" as PuzzleTier },
  { word: "STAKEHOLDER", Hint: "Not the owner, but still affected by the outcome use the harder wala", tier: "standard" as PuzzleTier },
] as const;

export function getHangmanPool(difficulty: MinigameDifficulty) {
  return puzzlesForDifficulty([...HANGMAN_PUZZLES], difficulty);
}

export function pickHangmanRound(difficulty: MinigameDifficulty, count: number) {
  const pool = [...getHangmanPool(difficulty)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Array.from({ length: count }, (_, i) => pool[i % pool.length]);
}

export function pickLexicodeWord(difficulty: MinigameDifficulty) {
  const puzzle = getCrosswordForTier(difficulty);
  return {
    puzzleId: puzzle.id,
    category: puzzle.theme ?? "Daily Crossword",
    tier: difficulty,
    difficulty: puzzle.difficulty,
  };
}
