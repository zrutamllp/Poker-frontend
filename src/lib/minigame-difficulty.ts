export type MinigameDifficulty = "standard" | "high_stakes";

const STORAGE_KEY = "poker-minigame-difficulty";

export function getStoredDifficulty(): MinigameDifficulty {
  if (typeof window === "undefined") return "standard";
  return localStorage.getItem(STORAGE_KEY) === "high_stakes" ? "high_stakes" : "standard";
}

export function setStoredDifficulty(d: MinigameDifficulty) {
  localStorage.setItem(STORAGE_KEY, d);
}

export const DIFFICULTY_LABELS: Record<MinigameDifficulty, string> = {
  standard: "Standard",
  high_stakes: "High Stakes",
};

export const GAME_LIMITS = {
  hangman: {
    standard: { maxWrong: 6, hintsMax: 2 },
    high_stakes: { maxWrong: 4, hintsMax: 1 },
  },
  anagram: {
    standard: { puzzlesPerRound: 3, seconds: 60 },
    high_stakes: { puzzlesPerRound: 4, seconds: 45 },
  },
  ladder: {
    standard: { hintsMax: 1 },
    high_stakes: { hintsMax: 0 },
  },
  wheel: {
    standard: { maxWrong: 6, vowelCost: 0 },
    high_stakes: { maxWrong: 4, vowelCost: 250 },
  },
  picture: {
    standard: { gridSize: 4, seconds: 300, hintsMax: 3 },
    high_stakes: { gridSize: 4, seconds: 180, hintsMax: 1 },
  },
  lexicode: {
    standard: { maxGuesses: 6, wordLength: 5 },
    high_stakes: { maxGuesses: 5, wordLength: 5 },
  },
  geo: {
    standard: { rounds: 5, winScore: 3200 },
    high_stakes: { rounds: 5, winScore: 4000 },
  },
} as const;

export type MinigameId = keyof typeof GAME_LIMITS;

export type GameLimitsMap = {
  hangman: (typeof GAME_LIMITS)["hangman"][MinigameDifficulty];
  anagram: (typeof GAME_LIMITS)["anagram"][MinigameDifficulty];
  ladder: (typeof GAME_LIMITS)["ladder"][MinigameDifficulty];
  wheel: (typeof GAME_LIMITS)["wheel"][MinigameDifficulty];
  picture: (typeof GAME_LIMITS)["picture"][MinigameDifficulty];
  lexicode: (typeof GAME_LIMITS)["lexicode"][MinigameDifficulty];
  geo: (typeof GAME_LIMITS)["geo"][MinigameDifficulty];
};

export function getGameLimits<G extends MinigameId>(
  game: G,
  difficulty: MinigameDifficulty,
): GameLimitsMap[G] {
  return GAME_LIMITS[game][difficulty] as GameLimitsMap[G];
}

/** Corporate-facing copy — restrained, event-appropriate */
export const MINIGAME_COPY = {
  sessionStats: "Session Stats",
  newSession: "NEW SESSION",
  backToLobby: "Return to Games",
  retry: "Retry Session",
  winReward: "+1000 CC credited to team balance",
  difficulty: "Difficulty Tier",
  anagram: {
    label: "DECODE BRIEF",
    prompt: "Reconstruct the classified phrase from scrambled intel.",
    win: "Brief decoded.",
    lose: "Time expired — intel withheld.",
    correct: "Verified.",
    wrong: "Sequence invalid — reattempt.",
  },
  ladder: {
    label: "THE CLIMB",
    prompt: "Advance one letter at a time toward the target term.",
    win: "Ladder cleared.",
    lose: "Step limit reached.",
    climb: "SUBMIT RUNG",
    placeholder: "Enter next term…",
  },
  wheel: {
    label: "HIGH STAKES WHEEL",
    prompt: "Spin, then call letters to decode the board phrase.",
    win: "Phrase secured.",
    lose: "Margin exhausted.",
    spin: "SPIN WHEEL",
    spinning: "Resolving…",
  },
  hangman: {
    label: "WORD HUNT",
    win: "Term identified.",
    lose: "Attempts exhausted.",
  },
  picture: {
    label: "PICTURE SLIDER",
    prompt: "Slide tiles into place to restore the reference image.",
    win: "Image reconstructed.",
    lose: "Time expired — puzzle archived.",
    shuffle: "SHUFFLE BOARD",
    hint: "INTEL HINT",
    reset: "RESET BOARD",
  },
  lexicode: {
    label: "LEXICODE",
    prompt: "Decode the five-letter table term in limited attempts.",
    win: "Lexicon cracked.",
    lose: "Attempts exhausted.",
  },
  geo: {
    label: "WORLD SCOUT",
    prompt: "Find the country on the world map and drop your pin.",
    win: "All sectors verified.",
    lose: "Score threshold missed.",
    confirm: "CONFIRM GUESS",
    next: "NEXT SECTOR",
  },
} as const;

export type PuzzleTier = "standard" | "high_stakes";

export function puzzlesForDifficulty<T extends { tier: PuzzleTier }>(
  puzzles: readonly T[],
  difficulty: MinigameDifficulty,
): T[] {
  if (difficulty === "high_stakes") {
    return puzzles.filter((p) => p.tier === "high_stakes");
  }
  return puzzles.filter((p) => p.tier === "standard");
}
