import {
  getApiBaseUrl,
  getAuthToken,
  isMockApiEnabled,
  isOnlineMode,
  minigameApiPath,
} from "@/lib/minigame-api-config";
import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import type {
  MinigameGameStatus,
  MinigameId,
  MinigameResultPayload,
  MinigameResultResponse,
  MinigameSessionPayload,
} from "@/types/minigame-session";
import { createOnlineMockSession } from "@/services/minigame/local-minigame-data";
import {
  getAllOnlineGameStatuses,
  saveOnlineResult,
} from "@/services/minigame/local-minigame-store";

class MinigameApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MinigameApiError";
  }
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) throw new MinigameApiError("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new MinigameApiError(text || res.statusText, res.status);
  }
  return res.json() as Promise<T>;
}

/**
 * GET /api/minigames/:gameId/session?difficulty=...
 * Falls back to mock local session when VITE_MINIGAME_MOCK_API=true.
 */
export async function fetchSessionFromApi<G extends MinigameId>(
  gameId: G,
  difficulty: MinigameDifficulty,
): Promise<MinigameSessionPayload<G>> {
  if (isMockApiEnabled()) {
    return createOnlineMockSession(gameId, difficulty);
  }

  const url = `${minigameApiPath(gameId, "/session")}?difficulty=${encodeURIComponent(difficulty)}`;
  const res = await fetch(url, { headers: authHeaders() });
  return parseJson<MinigameSessionPayload<G>>(res);
}

/**
 * POST /api/minigames/:gameId/results
 * Falls back to mock local store when VITE_MINIGAME_MOCK_API=true.
 */
export async function postResultToApi(
  payload: MinigameResultPayload,
): Promise<MinigameResultResponse> {
  if (isMockApiEnabled()) {
    return saveOnlineResult(payload);
  }

  const url = minigameApiPath(payload.gameId, "/results");
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parseJson<MinigameResultResponse>(res);
}

/**
 * GET /api/minigames/status
 * Falls back to mock local store when VITE_MINIGAME_MOCK_API=true.
 */
export async function fetchAllGameStatusFromApi(): Promise<MinigameGameStatus[]> {
  if (isMockApiEnabled()) {
    return getAllOnlineGameStatuses();
  }

  const base = getApiBaseUrl();
  if (!base) throw new MinigameApiError("API base URL not configured");
  const url = `${base}/api/minigames/status`;
  const res = await fetch(url, { headers: authHeaders() });
  return parseJson<MinigameGameStatus[]>(res);
}

export { MinigameApiError, isOnlineMode };
