import { useEffect, useState } from "react";
import { fetchAllGameStatusFromApi } from "@/services/minigame/minigame-api-client";
import { getAllOfflineGameStatuses } from "@/services/minigame/local-minigame-store";
import { isOnlineMode } from "@/lib/minigame-api-config";
import type { MinigameGameStatus, MinigameId } from "@/types/minigame-session";
import { ROUTE_TO_MINIGAME_ID } from "@/types/minigame-session";

export function useMinigameLobbyStatus() {
  const [statuses, setStatuses] = useState<MinigameGameStatus[]>(() =>
    isOnlineMode() ? [] : getAllOfflineGameStatuses(),
  );

  useEffect(() => {
    if (isOnlineMode()) {
      void fetchAllGameStatusFromApi()
        .then(setStatuses)
        .catch(() => setStatuses(getAllOfflineGameStatuses()));
    } else {
      setStatuses(getAllOfflineGameStatuses());
    }
  }, []);

  function statusForRoute(route: string): "completed" | "not_started" {
    const gameId = ROUTE_TO_MINIGAME_ID[route];
    if (!gameId) return "not_started";
    const record = statuses.find((s) => s.gameId === gameId);
    return record?.status ?? "not_started";
  }

  return { statuses, statusForRoute, refresh: () => setStatuses(getAllOfflineGameStatuses()) };
}

export function gameIdFromRoute(route: string): MinigameId | undefined {
  return ROUTE_TO_MINIGAME_ID[route];
}
