/** Shared culture-coin phase budget across all minigames */
export const MINIGAME_SESSION_TOTAL_SECONDS = 15 * 60;

const DEADLINE_KEY = "poker-minigame-session-deadline";

export function hasMinigameSessionStarted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEADLINE_KEY) !== null;
}

export function markMinigameSessionStarted(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(DEADLINE_KEY)) return;
  const deadline = Date.now() + MINIGAME_SESSION_TOTAL_SECONDS * 1000;
  localStorage.setItem(DEADLINE_KEY, String(deadline));
}

export function getMinigameSessionRemaining(): number {
  if (typeof window === "undefined") return MINIGAME_SESSION_TOTAL_SECONDS;
  const raw = localStorage.getItem(DEADLINE_KEY);
  if (!raw) return MINIGAME_SESSION_TOTAL_SECONDS;
  const deadline = Number(raw);
  if (!Number.isFinite(deadline)) return 0;
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
}

export function isMinigameSessionExpired(): boolean {
  return hasMinigameSessionStarted() && getMinigameSessionRemaining() <= 0;
}

/** Per-game timer limit (session cap disabled — games stay playable after session ends) */
export function effectiveGameSeconds(localLimit: number): number {
  return localLimit;
}

export function formatSessionTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
