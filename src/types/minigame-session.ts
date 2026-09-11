import type { GameLimitsMap, MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { FakeOneSession } from "@/types/fake-one";

export type MinigameId = "hangman" | "picture" | "lexicode" | "geo";

export interface HangmanPuzzle {
  word: string;
  Hint: string;
  tier: string;
}

export interface PicturePuzzleData {
  gridSize: number;
}

export interface LexicodePuzzle {
  puzzleId: string;
  category: string;
  tier: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface MinigamePuzzlesMap {
  hangman: HangmanPuzzle[];
  picture: PicturePuzzleData;
  lexicode: LexicodePuzzle;
  geo: FakeOneSession;
}

export interface MinigameSessionPayload<G extends MinigameId = MinigameId> {
  gameId: G;
  difficulty: MinigameDifficulty;
  attemptNumber: number;
  attemptsRemaining: number;
  puzzles: MinigamePuzzlesMap[G];
  limits: GameLimitsMap[G];
  sessionId?: string;
}

export interface MinigameResultPayload {
  gameId: MinigameId;
  difficulty: MinigameDifficulty;
  attemptNumber: number;
  outcome: "won" | "lost";
  score?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface MinigameResultResponse {
  accepted: boolean;
  attemptsRemaining: number;
  bestOutcome: "won" | "lost" | null;
  coinsAwarded: number;
  locked: boolean;
}

export interface MinigameGameStatus {
  gameId: MinigameId;
  status: "not_started" | "completed";
  bestOutcome: "won" | "lost" | null;
  coinsAwarded: number;
  attemptsUsed: number;
}

export const MINIGAME_COIN_REWARD = 1000;
export const MAX_ONLINE_ATTEMPTS = 2;

/** Maps cultureCoinGames route paths to MinigameId */
export const ROUTE_TO_MINIGAME_ID: Record<string, MinigameId> = {
  "/minigame/picture": "picture",
  "/minigame/hangman": "hangman",
  "/minigame/word": "lexicode",
  "/minigame/geo": "geo",
};

export const MINIGAME_ID_TO_ROUTE: Record<MinigameId, string> = {
  picture: "/minigame/picture",
  hangman: "/minigame/hangman",
  lexicode: "/minigame/word",
  geo: "/minigame/geo",
};
