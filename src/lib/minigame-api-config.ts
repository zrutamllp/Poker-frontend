export const AUTH_TOKEN_KEY = "poker-auth-token";
export const AUTH_PLAYER_KEY = "poker-auth-player-id";

export function getApiBaseUrl(): string | undefined {
  const url = import.meta.env.VITE_API_URL;
  return url && url.length > 0 ? url.replace(/\/$/, "") : undefined;
}

export function isBackendEnabled(): boolean {
  return Boolean(getApiBaseUrl());
}

export function isMockApiEnabled(): boolean {
  return import.meta.env.VITE_MINIGAME_MOCK_API === "true";
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getPlayerId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_PLAYER_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken() && getPlayerId());
}

/** Online mode: backend URL + auth token (uses API or mock when VITE_MINIGAME_MOCK_API=true) */
export function isOnlineMode(): boolean {
  return isBackendEnabled() && isAuthenticated();
}

export function minigameApiPath(gameId: string, suffix: string): string {
  const base = getApiBaseUrl();
  if (!base) throw new Error("API base URL not configured");
  return `${base}/api/minigames/${gameId}${suffix}`;
}
