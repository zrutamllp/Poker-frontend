import { useCallback, useEffect, useRef, useState } from "react";
import { useMinigameDifficulty } from "@/hooks/use-minigame-difficulty";
import { fetchMinigameSession } from "@/services/minigame/minigame-data-provider";
import { submitMinigameResult } from "@/services/minigame/minigame-result-provider";
import {
  getOnlineAttemptsRemaining,
  isOnlineGameLocked,
} from "@/services/minigame/local-minigame-store";
import { isOnlineMode } from "@/lib/minigame-api-config";
import type {
  MinigameId,
  MinigameResultPayload,
  MinigameResultResponse,
  MinigameSessionPayload,
} from "@/types/minigame-session";

export function useMinigameSession<G extends MinigameId>(gameId: G) {
  const { difficulty } = useMinigameDifficulty();
  const online = isOnlineMode();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<MinigameSessionPayload<G> | null>(null);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [resultResponse, setResultResponse] = useState<MinigameResultResponse | null>(
    null,
  );
  const [locked, setLocked] = useState(() => online && isOnlineGameLocked(gameId));

  const submittedRef = useRef(false);

  const attemptsRemaining = online
    ? (resultResponse?.attemptsRemaining ??
      getOnlineAttemptsRemaining(gameId))
    : Number.POSITIVE_INFINITY;

  const canRetry = online ? !locked && attemptsRemaining > 0 : true;

  const loadSession = useCallback(async () => {
    if (online && isOnlineGameLocked(gameId)) {
      setLocked(true);
      setLoading(false);
      setError("All attempts used for this game");
      return;
    }

    setLoading(true);
    setError(null);
    submittedRef.current = false;

    try {
      const next = await fetchMinigameSession(gameId, difficulty);
      setSession(next);
      setSessionVersion((v) => v + 1);
      setLocked(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load session");
    } finally {
      setLoading(false);
    }
  }, [gameId, difficulty, online]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const startSession = useCallback(async () => {
    if (online && (locked || isOnlineGameLocked(gameId))) {
      setLocked(true);
      return;
    }
    await loadSession();
  }, [loadSession, online, locked, gameId]);

  const submitResult = useCallback(
    async (
      partial: Omit<MinigameResultPayload, "gameId" | "difficulty" | "attemptNumber">,
    ): Promise<MinigameResultResponse | null> => {
      if (submittedRef.current || !session) return null;
      submittedRef.current = true;

      const payload: MinigameResultPayload = {
        gameId,
        difficulty,
        attemptNumber: session.attemptNumber,
        ...partial,
      };

      try {
        const response = await submitMinigameResult(payload);
        setResultResponse(response);
        setLocked(response.locked);
        return response;
      } catch (e) {
        submittedRef.current = false;
        setError(e instanceof Error ? e.message : "Failed to submit result");
        return null;
      }
    },
    [gameId, difficulty, session],
  );

  return {
    loading,
    error,
    session,
    sessionVersion,
    attemptsRemaining,
    canRetry,
    isOnlineMode: online,
    locked,
    resultResponse,
    startSession,
    submitResult,
    difficulty,
  };
}

/** Submit outcome once when game ends */
export function useMinigameOutcomeSubmit(
  status: "playing" | "won" | "lost" | string,
  submitResult: ReturnType<typeof useMinigameSession>["submitResult"],
  metadata?: Record<string, unknown>,
  score?: number,
  sessionVersion?: number,
) {
  const submittedRef = useRef(false);

  useEffect(() => {
    submittedRef.current = false;
  }, [sessionVersion]);

  useEffect(() => {
    if (status !== "won" && status !== "lost") return;
    if (submittedRef.current) return;
    submittedRef.current = true;
    void submitResult({
      outcome: status,
      score,
      metadata,
    });
  }, [status, submitResult, metadata, score, sessionVersion]);
}
