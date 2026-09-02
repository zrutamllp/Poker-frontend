import type { GameLimitsMap, MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { WheelSegment } from "@/data/minigame-puzzles";

export type MinigameId =
  | "anagram"
  | "hangman"
  | "ladder"
  | "wheel"
  | "picture"
  | "lexicode"
  | "geo";

export interface AnagramPuzzle {
  answer: string;
  category: string;
  tier: string;
}

export interface HangmanPuzzle {
  word: string;
  category: string;
  tier: string;
}

export interface LadderPuzzle {
  start: string;
  end: string;
  maxSteps: number;
  par: number;
  category: string;
  hint: string;
  tier: string;
}

export interface WheelPuzzle {
  phrase: string;
  category: string;
  tier: string;
}

export interface LexicodePuzzle {
  word: string;
  category: string;
  tier: string;
}

export interface GeoLocation {
  name: string;
  region: string;
  lat: number;
  lon: number;
  tier: string;
}

export interface PicturePuzzleData {
  gridSize: number;
}

export interface MinigamePuzzlesMap {
  anagram: AnagramPuzzle[];
  hangman: HangmanPuzzle;
  ladder: LadderPuzzle;
  wheel: WheelPuzzle;
  picture: PicturePuzzleData;
  lexicode: LexicodePuzzle;
  geo: GeoLocation[];
}

export interface MinigameSessionPayload<G extends MinigameId = MinigameId> {
  gameId: G;
  difficulty: MinigameDifficulty;
  attemptNumber: number;
  attemptsRemaining: number;
  puzzles: MinigamePuzzlesMap[G];
  limits: GameLimitsMap[G];
  sessionId?: string;
  wheelSegments?: WheelSegment[];
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
  "/minigame/word": "lexicode",
  "/minigame/geo": "geo",
  "/minigame/hangman": "hangman",
  "/minigame/anagram": "anagram",
  "/minigame/ladder": "ladder",
  "/minigame/wheel": "wheel",
};

export const MINIGAME_ID_TO_ROUTE: Record<MinigameId, string> = {
  picture: "/minigame/picture",
  lexicode: "/minigame/word",
  geo: "/minigame/geo",
  hangman: "/minigame/hangman",
  anagram: "/minigame/anagram",
  ladder: "/minigame/ladder",
  wheel: "/minigame/wheel",
};
