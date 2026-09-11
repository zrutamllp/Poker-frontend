import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { MinigameId, MinigameSessionPayload } from "@/types/minigame-session";
import { fetchSessionFromApi } from "@/services/minigame/minigame-api-client";
import { createLocalSession } from "@/services/minigame/local-minigame-data";
import { isOnlineGameLocked } from "@/services/minigame/local-minigame-store";
import { isOnlineMode } from "@/lib/minigame-api-config";

export async function fetchMinigameSession<G extends MinigameId>(
  gameId: G,
  difficulty: MinigameDifficulty,
): Promise<MinigameSessionPayload<G>> {
  if (isOnlineMode()) {
    if (isOnlineGameLocked(gameId)) {
      throw new Error("All attempts used for this game");
    }
    return fetchSessionFromApi(gameId, difficulty);
  }
  return createLocalSession(gameId, difficulty);
}
