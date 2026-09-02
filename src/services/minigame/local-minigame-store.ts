import type {
  MinigameGameStatus,
  MinigameId,
  MinigameResultPayload,
  MinigameResultResponse,
} from "@/types/minigame-session";
import { MAX_ONLINE_ATTEMPTS, MINIGAME_COIN_REWARD } from "@/types/minigame-session";

const OFFLINE_RESULTS_KEY = "poker-minigame-results";
const ONLINE_ATTEMPTS_KEY = "poker-minigame-online-attempts";

interface OfflineGameRecord {
  attempts: MinigameResultPayload[];
  bestOutcome: "won" | "lost" | null;
  coinsAwarded: number;
}

type OfflineStore = Partial<Record<MinigameId, OfflineGameRecord>>;

interface OnlineAttemptRecord {
  attempts: MinigameResultPayload[];
  bestOutcome: "won" | "lost" | null;
  coinsAwarded: number;
}

type OnlineStore = Partial<Record<MinigameId, OnlineAttemptRecord>>;

function readOfflineStore(): OfflineStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OFFLINE_RESULTS_KEY);
    return raw ? (JSON.parse(raw) as OfflineStore) : {};
  } catch {
    return {};
  }
}

function writeOfflineStore(store: OfflineStore) {
  localStorage.setItem(OFFLINE_RESULTS_KEY, JSON.stringify(store));
}

function readOnlineStore(): OnlineStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ONLINE_ATTEMPTS_KEY);
    return raw ? (JSON.parse(raw) as OnlineStore) : {};
  } catch {
    return {};
  }
}

function writeOnlineStore(store: OnlineStore) {
  localStorage.setItem(ONLINE_ATTEMPTS_KEY, JSON.stringify(store));
}

function computeBestOutcome(
  attempts: MinigameResultPayload[],
): "won" | "lost" | null {
  if (attempts.length === 0) return null;
  return attempts.some((a) => a.outcome === "won") ? "won" : "lost";
}

function computeCoins(bestOutcome: "won" | "lost" | null): number {
  return bestOutcome === "won" ? MINIGAME_COIN_REWARD : 0;
}

export function getOfflineGameStatus(gameId: MinigameId): MinigameGameStatus {
  const record = readOfflineStore()[gameId];
  return {
    gameId,
    status: record?.bestOutcome === "won" ? "completed" : "not_started",
    bestOutcome: record?.bestOutcome ?? null,
    coinsAwarded: record?.coinsAwarded ?? 0,
    attemptsUsed: record?.attempts.length ?? 0,
  };
}

export function getAllOfflineGameStatuses(): MinigameGameStatus[] {
  const ids: MinigameId[] = [
    "picture",
    "lexicode",
    "geo",
    "anagram",
    "hangman",
    "ladder",
    "wheel",
  ];
  return ids.map(getOfflineGameStatus);
}

export function saveOfflineResult(
  payload: MinigameResultPayload,
): MinigameResultResponse {
  const store = readOfflineStore();
  const record = store[payload.gameId] ?? {
    attempts: [],
    bestOutcome: null,
    coinsAwarded: 0,
  };
  record.attempts = [...record.attempts, payload];
  record.bestOutcome = computeBestOutcome(record.attempts);
  record.coinsAwarded = computeCoins(record.bestOutcome);
  store[payload.gameId] = record;
  writeOfflineStore(store);

  return {
    accepted: true,
    attemptsRemaining: Number.POSITIVE_INFINITY,
    bestOutcome: record.bestOutcome,
    coinsAwarded: record.coinsAwarded,
    locked: false,
  };
}

export function getOnlineAttemptsUsed(gameId: MinigameId): number {
  return readOnlineStore()[gameId]?.attempts.length ?? 0;
}

export function getOnlineAttemptsRemaining(gameId: MinigameId): number {
  return Math.max(0, MAX_ONLINE_ATTEMPTS - getOnlineAttemptsUsed(gameId));
}

export function isOnlineGameLocked(gameId: MinigameId): boolean {
  return getOnlineAttemptsUsed(gameId) >= MAX_ONLINE_ATTEMPTS;
}

export function saveOnlineResult(
  payload: MinigameResultPayload,
): MinigameResultResponse {
  const store = readOnlineStore();
  const record = store[payload.gameId] ?? {
    attempts: [],
    bestOutcome: null,
    coinsAwarded: 0,
  };
  record.attempts = [...record.attempts, payload];
  record.bestOutcome = computeBestOutcome(record.attempts);
  record.coinsAwarded = computeCoins(record.bestOutcome);
  store[payload.gameId] = record;
  writeOnlineStore(store);

  const attemptsUsed = record.attempts.length;
  const attemptsRemaining = Math.max(0, MAX_ONLINE_ATTEMPTS - attemptsUsed);
  const locked = attemptsUsed >= MAX_ONLINE_ATTEMPTS;

  return {
    accepted: true,
    attemptsRemaining,
    bestOutcome: record.bestOutcome,
    coinsAwarded: record.coinsAwarded,
    locked,
  };
}

export function getOnlineGameStatus(gameId: MinigameId): MinigameGameStatus {
  const record = readOnlineStore()[gameId];
  const attemptsUsed = record?.attempts.length ?? 0;
  return {
    gameId,
    status: record?.bestOutcome === "won" ? "completed" : "not_started",
    bestOutcome: record?.bestOutcome ?? null,
    coinsAwarded: record?.coinsAwarded ?? 0,
    attemptsUsed,
  };
}

export function getAllOnlineGameStatuses(): MinigameGameStatus[] {
  const ids: MinigameId[] = [
    "picture",
    "lexicode",
    "geo",
    "anagram",
    "hangman",
    "ladder",
    "wheel",
  ];
  return ids.map(getOnlineGameStatus);
}
