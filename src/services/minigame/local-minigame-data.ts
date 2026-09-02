import {
  getHangmanPool,
  getLadderPool,
  getWheelPool,
  getWheelSegments,
  pickAnagramPuzzles,
  pickGeoRound,
  pickLexicodeWord,
  pickRandom,
} from "@/data/minigame-puzzles";
import { getGameLimits } from "@/lib/minigame-difficulty";
import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { MinigameId, MinigameSessionPayload } from "@/types/minigame-session";
import {
  getOnlineAttemptsRemaining,
  getOnlineAttemptsUsed,
} from "@/services/minigame/local-minigame-store";
import { MAX_ONLINE_ATTEMPTS } from "@/types/minigame-session";

export function createLocalSession<G extends MinigameId>(
  gameId: G,
  difficulty: MinigameDifficulty,
  attemptNumber = 1,
): MinigameSessionPayload<G> {
  const limits = getGameLimits(gameId, difficulty);

  switch (gameId) {
    case "anagram": {
      const puzzles = pickAnagramPuzzles(
        difficulty,
        getGameLimits("anagram", difficulty).puzzlesPerRound,
      );
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles,
        limits,
      } as MinigameSessionPayload<G>;
    }
    case "hangman":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: pickRandom(getHangmanPool(difficulty)),
        limits,
      } as MinigameSessionPayload<G>;
    case "ladder":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: pickRandom(getLadderPool(difficulty)),
        limits,
      } as MinigameSessionPayload<G>;
    case "wheel":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: pickRandom(getWheelPool(difficulty)),
        limits,
        wheelSegments: getWheelSegments(difficulty),
      } as MinigameSessionPayload<G>;
    case "picture":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: { gridSize: getGameLimits("picture", difficulty).gridSize },
        limits,
      } as MinigameSessionPayload<G>;
    case "lexicode":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: pickLexicodeWord(difficulty),
        limits,
      } as MinigameSessionPayload<G>;
    case "geo":
      return {
        gameId,
        difficulty,
        attemptNumber,
        attemptsRemaining: Number.POSITIVE_INFINITY,
        puzzles: pickGeoRound(difficulty, getGameLimits("geo", difficulty).rounds),
        limits,
      } as MinigameSessionPayload<G>;
    default:
      throw new Error(`Unknown minigame: ${gameId}`);
  }
}

export function createOnlineMockSession<G extends MinigameId>(
  gameId: G,
  difficulty: MinigameDifficulty,
): MinigameSessionPayload<G> {
  const used = getOnlineAttemptsUsed(gameId);
  const attemptNumber = Math.min(used + 1, MAX_ONLINE_ATTEMPTS);
  const session = createLocalSession(gameId, difficulty, attemptNumber);
  return {
    ...session,
    attemptsRemaining: getOnlineAttemptsRemaining(gameId),
    sessionId: `mock-${gameId}-${Date.now()}`,
  } as MinigameSessionPayload<G>;
}
