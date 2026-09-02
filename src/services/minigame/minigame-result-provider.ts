import type { MinigameResultPayload, MinigameResultResponse } from "@/types/minigame-session";
import { postResultToApi } from "@/services/minigame/minigame-api-client";
import { saveOfflineResult } from "@/services/minigame/local-minigame-store";
import { isOnlineMode } from "@/lib/minigame-api-config";

export async function submitMinigameResult(
  payload: MinigameResultPayload,
): Promise<MinigameResultResponse> {
  if (isOnlineMode()) {
    return postResultToApi(payload);
  }
  return saveOfflineResult(payload);
}
