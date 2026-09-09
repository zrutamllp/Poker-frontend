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
    standard: {
      rounds: 6,
      secondsPerRound: 30,
      maxWrong: 6,
      pointsPerWin: 200,
      maxScore: 1200,
      winScore: 1000,
    },
    high_stakes: {
      rounds: 6,
      secondsPerRound: 30,
      maxWrong: 4,
      pointsPerWin: 200,
      maxScore: 1200,
      winScore: 1000,
    },
  },
  picture: {
    standard: { gridSize: 4, seconds: 300, confirmsMax: 3, winScore: 1200, maxScore: 1200 },
    high_stakes: { gridSize: 4, seconds: 300, confirmsMax: 3, winScore: 1200, maxScore: 1200 },
  },
  lexicode: {
    standard: { hintsMax: 3, seconds: 120, winScore: 1000, maxScore: 1000 },
    high_stakes: { hintsMax: 1, seconds: 120, winScore: 1000, maxScore: 1000 },
  },
  geo: {
    standard: { totalRounds: 10, winScore: 1000, maxScore: 2400 },
    high_stakes: { totalRounds: 10, winScore: 1000, maxScore: 2400 },
  },
} as const;

export type MinigameId = keyof typeof GAME_LIMITS;

export type GameLimitsMap = {
  hangman: (typeof GAME_LIMITS)["hangman"][MinigameDifficulty];
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
  hangman: {
    label: "WORD HUNT",
    win: "Round solved.",
    lose: "Round lost.",
  },
  picture: {
    label: "PICTURE SLIDER",
    prompt: "Slide tiles into place, then press Confirm when the image matches the reference.",
    win: "Image reconstructed — 1200 points.",
    lose: "Session ended — 0 points.",
    loseWrongConfirm: "Incorrect — no confirms left.",
    loseTimeout: "Time expired — puzzle archived.",
    loseSessionExpired: "15-minute session ended — 0 points.",
    shuffle: "SHUFFLE BOARD",
    confirm: "CONFIRM",
    reset: "RESET BOARD",
  },
  lexicode: {
    label: "DAILY CROSSWORD",
    prompt: "Tap clues or cells to navigate. Use Check and Hint when stuck.",
    win: "Crossword complete — 1000 points.",
    lose: "Time expired — 0 points.",
    loseSessionExpired: "15-minute session ended — 0 points.",
  },
  geo: {
    label: "THE FAKE ONE",
    prompt: "Three statements are true. One is fake. Find it before time runs out.",
    win: "Session complete — culture coins earned.",
    lose: "Session ended below the win threshold.",
    loseSessionExpired: "15-minute session ended.",
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
