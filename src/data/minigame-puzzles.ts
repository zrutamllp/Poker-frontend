/** Shared word lists for culture-coin minigames */

import type { MinigameDifficulty, PuzzleTier } from "@/lib/minigame-difficulty";
import { puzzlesForDifficulty } from "@/lib/minigame-difficulty";

export type { PuzzleTier };

export const ANAGRAM_PUZZLES = [
  { answer: "ROYAL FLUSH", category: "Poker Hand", tier: "standard" as PuzzleTier },
  { answer: "CULTURE COINS", category: "Game Currency", tier: "standard" as PuzzleTier },
  { answer: "TOURNAMENT", category: "Event Type", tier: "standard" as PuzzleTier },
  { answer: "FULL HOUSE", category: "Poker Hand", tier: "standard" as PuzzleTier },
  { answer: "HIGH ROLLERS", category: "Team Name", tier: "standard" as PuzzleTier },
  { answer: "STRATEGY", category: "Team Skill", tier: "standard" as PuzzleTier },
  { answer: "RADICAL TRANSPARENCY", category: "Culture Value", tier: "high_stakes" as PuzzleTier },
  { answer: "INNOVATION FIRST", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
  { answer: "CUSTOMER OBSESSION", category: "Culture Pillar", tier: "high_stakes" as PuzzleTier },
  { answer: "SUSTAINABLE GROWTH", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
  { answer: "THE COIN KEEPER", category: "Team Role", tier: "high_stakes" as PuzzleTier },
  { answer: "MAIN EVENT BLINDS", category: "Round Stage", tier: "high_stakes" as PuzzleTier },
] as const;

export const HANGMAN_PUZZLES = [
  { word: "ROYAL FLUSH", category: "Poker Hand", tier: "standard" as PuzzleTier },
  { word: "CULTURE COINS", category: "Game Currency", tier: "standard" as PuzzleTier },
  { word: "THE ACES", category: "Team Name", tier: "standard" as PuzzleTier },
  { word: "TOURNAMENT", category: "Event Type", tier: "standard" as PuzzleTier },
  { word: "ALL IN", category: "Poker Move", tier: "standard" as PuzzleTier },
  { word: "BLINDS", category: "Round Stage", tier: "standard" as PuzzleTier },
  { word: "RADICAL TRANSPARENCY", category: "Culture Value", tier: "high_stakes" as PuzzleTier },
  { word: "INNOVATION FIRST", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
  { word: "THE CULTURE TABLE", category: "Event", tier: "high_stakes" as PuzzleTier },
  { word: "SUSTAINABLE GROWTH", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
] as const;

export const WORD_LADDER_PUZZLES = [
  {
    start: "COLD",
    end: "CARD",
    maxSteps: 3,
    par: 2,
    category: "Table Intel",
    hint: "5-letter chain via cord",
    tier: "standard" as PuzzleTier,
  },
  {
    start: "STAKE",
    end: "STALE",
    maxSteps: 2,
    par: 1,
    category: "Betting Lexicon",
    hint: "Single-rung conversion",
    tier: "standard" as PuzzleTier,
  },
  {
    start: "POKER",
    end: "JOKER",
    maxSteps: 2,
    par: 1,
    category: "Card Room",
    hint: "One letter shift at the table",
    tier: "standard" as PuzzleTier,
  },
  {
    start: "COLD",
    end: "HAND",
    maxSteps: 5,
    par: 4,
    category: "Executive Chain",
    hint: "Four-rung path through the deck",
    tier: "high_stakes" as PuzzleTier,
  },
  {
    start: "STACK",
    end: "STARK",
    maxSteps: 3,
    par: 2,
    category: "Chip Strategy",
    hint: "Chip pile to sharp edge",
    tier: "high_stakes" as PuzzleTier,
  },
  {
    start: "TIGHT",
    end: "RIGHT",
    maxSteps: 3,
    par: 2,
    category: "Play Style",
    hint: "Conservative to correct",
    tier: "high_stakes" as PuzzleTier,
  },
] as const;

export const LADDER_WORD_SET = new Set([
  "BLIND", "BLEND", "STAKE", "STALE", "COINS", "CONES", "HEART", "HEARD",
  "COLD", "CORD", "CARD", "HARD", "HAND", "TABLE", "FABLE", "CABLE",
  "POKER", "JOKER", "QUEEN", "KINGS", "SPADE", "CLUBS", "HEAPS", "STARS",
  "BLUFF", "RAISE", "FOLDS", "CHECK", "STACK", "CHIPS", "DEALS", "RIVER",
  "FLUSH", "ROYAL", "WILD", "HOUSE", "LOOSE", "TIGHT", "RIGHT", "ANTES",
  "STARK", "TRACK", "TRICK", "TRUCK", "STICK", "STOCK", "SHOCK", "CHORD",
]);

export const WHEEL_PHRASES = [
  { phrase: "ROYAL FLUSH", category: "Poker Hand", tier: "standard" as PuzzleTier },
  { phrase: "CULTURE COINS", category: "Game Currency", tier: "standard" as PuzzleTier },
  { phrase: "HIGH ROLLERS", category: "Team Name", tier: "standard" as PuzzleTier },
  { phrase: "THE ACES", category: "Team Name", tier: "standard" as PuzzleTier },
  { phrase: "RADICAL TRANSPARENCY", category: "Culture Value", tier: "high_stakes" as PuzzleTier },
  { phrase: "INNOVATION FIRST", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
  { phrase: "THE CULTURE TABLE", category: "Event", tier: "high_stakes" as PuzzleTier },
  { phrase: "SUSTAINABLE GROWTH", category: "Betting Option", tier: "high_stakes" as PuzzleTier },
  { phrase: "THE COIN KEEPER", category: "Team Role", tier: "high_stakes" as PuzzleTier },
] as const;

export type WheelSegment =
  | { type: "points"; value: number; label: string }
  | { type: "free_letter"; label: string }
  | { type: "lose_turn"; label: string }
  | { type: "bankrupt"; label: string };

export const WHEEL_SEGMENTS_STANDARD: WheelSegment[] = [
  { type: "points", value: 200, label: "+200" },
  { type: "points", value: 300, label: "+300" },
  { type: "free_letter", label: "FREE" },
  { type: "points", value: 150, label: "+150" },
  { type: "lose_turn", label: "SKIP" },
  { type: "bankrupt", label: "BUST" },
  { type: "points", value: 250, label: "+250" },
  { type: "points", value: 100, label: "+100" },
];

export const WHEEL_SEGMENTS_HIGH_STAKES: WheelSegment[] = [
  { type: "bankrupt", label: "BUST" },
  { type: "points", value: 150, label: "+150" },
  { type: "lose_turn", label: "SKIP" },
  { type: "bankrupt", label: "ZERO" },
  { type: "points", value: 200, label: "+200" },
  { type: "lose_turn", label: "HOLD" },
  { type: "free_letter", label: "FREE" },
  { type: "lose_turn", label: "SKIP" },
];

export function getWheelSegments(difficulty: MinigameDifficulty) {
  return difficulty === "high_stakes" ? WHEEL_SEGMENTS_HIGH_STAKES : WHEEL_SEGMENTS_STANDARD;
}

export function pickAnagramPuzzles(difficulty: MinigameDifficulty, count: number) {
  const pool = puzzlesForDifficulty([...ANAGRAM_PUZZLES], difficulty);
  const indices = pool.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count).map((i) => pool[i]);
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function getHangmanPool(difficulty: MinigameDifficulty) {
  return puzzlesForDifficulty([...HANGMAN_PUZZLES], difficulty);
}

export function getLadderPool(difficulty: MinigameDifficulty) {
  return puzzlesForDifficulty([...WORD_LADDER_PUZZLES], difficulty);
}

export function getWheelPool(difficulty: MinigameDifficulty) {
  return puzzlesForDifficulty([...WHEEL_PHRASES], difficulty);
}

export function shuffleString(s: string): string {
  const chars = s.replace(/ /g, "").split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function oneLetterApart(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diffs = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) diffs++;
    if (diffs > 1) return false;
  }
  return diffs === 1;
}

export function getPhraseLetters(phrase: string): string[] {
  return phrase.split("").filter((c) => c !== " ");
}

export const LEXICODE_WORDS = [
  { word: "POKER", category: "Table Term", tier: "standard" as PuzzleTier },
  { word: "STAKE", category: "Betting Lexicon", tier: "standard" as PuzzleTier },
  { word: "BLIND", category: "Round Stage", tier: "standard" as PuzzleTier },
  { word: "HEART", category: "Suit", tier: "standard" as PuzzleTier },
  { word: "ROYAL", category: "Hand Rank", tier: "standard" as PuzzleTier },
  { word: "FLUSH", category: "Poker Hand", tier: "standard" as PuzzleTier },
  { word: "CHIPS", category: "Game Currency", tier: "standard" as PuzzleTier },
  { word: "QUEEN", category: "Face Card", tier: "standard" as PuzzleTier },
  { word: "JOKER", category: "Wild Card", tier: "standard" as PuzzleTier },
  { word: "RAISE", category: "Betting Move", tier: "standard" as PuzzleTier },
  { word: "RIVER", category: "Street", tier: "high_stakes" as PuzzleTier },
  { word: "STACK", category: "Chip Pile", tier: "high_stakes" as PuzzleTier },
  { word: "TIGHT", category: "Play Style", tier: "high_stakes" as PuzzleTier },
  { word: "BLUFF", category: "Strategy", tier: "high_stakes" as PuzzleTier },
  { word: "BUSTS", category: "Table Outcome", tier: "high_stakes" as PuzzleTier },
  { word: "ANTES", category: "Forced Bet", tier: "high_stakes" as PuzzleTier },
] as const;

export const GEO_LOCATIONS = [
  { name: "Iceland", region: "Nordic Ops", lat: 64.96, lon: -19.02, tier: "standard" as PuzzleTier },
  { name: "United States", region: "Americas Desk", lat: 39.83, lon: -98.58, tier: "standard" as PuzzleTier },
  { name: "United Kingdom", region: "Atlantic Desk", lat: 55.38, lon: -3.44, tier: "standard" as PuzzleTier },
  { name: "Japan", region: "East Intel", lat: 36.2, lon: 138.25, tier: "standard" as PuzzleTier },
  { name: "Australia", region: "Pacific Node", lat: -25.27, lon: 133.78, tier: "standard" as PuzzleTier },
  { name: "India", region: "Monsoon Relay", lat: 20.59, lon: 78.96, tier: "high_stakes" as PuzzleTier },
  { name: "Brazil", region: "LatAm Field", lat: -14.24, lon: -51.93, tier: "high_stakes" as PuzzleTier },
  { name: "United Arab Emirates", region: "Gulf Sector", lat: 23.42, lon: 53.85, tier: "high_stakes" as PuzzleTier },
  { name: "Switzerland", region: "Alpine Vault", lat: 46.82, lon: 8.23, tier: "high_stakes" as PuzzleTier },
  { name: "Singapore", region: "APAC Hub", lat: 1.35, lon: 103.82, tier: "high_stakes" as PuzzleTier },
] as const;

export function pickLexicodeWord(difficulty: MinigameDifficulty) {
  const pool = puzzlesForDifficulty([...LEXICODE_WORDS], difficulty);
  return pickRandom(pool);
}

export function pickGeoRound(difficulty: MinigameDifficulty, count: number) {
  const pool = puzzlesForDifficulty([...GEO_LOCATIONS], difficulty);
  const indices = pool.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count).map((i) => pool[i]);
}

export function getLexicodeDictionary() {
  return new Set(LEXICODE_WORDS.map((w) => w.word));
}
