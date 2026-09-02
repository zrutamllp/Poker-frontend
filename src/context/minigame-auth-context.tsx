import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_PLAYER_KEY,
  AUTH_TOKEN_KEY,
  getAuthToken,
  getPlayerId,
  isAuthenticated as checkAuthenticated,
} from "@/lib/minigame-api-config";

export interface MinigameAuthState {
  playerId: string | null;
  token: string | null;
}

interface MinigameAuthContextValue extends MinigameAuthState {
  isAuthenticated: boolean;
  setAuth: (auth: { playerId: string; token: string }) => void;
  clearAuth: () => void;
}

const MinigameAuthContext = createContext<MinigameAuthContextValue | null>(null);

function readInitialAuth(): MinigameAuthState {
  return {
    playerId: getPlayerId(),
    token: getAuthToken(),
  };
}

export function MinigameAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<MinigameAuthState>(readInitialAuth);

  const setAuth = useCallback(({ playerId, token }: { playerId: string; token: string }) => {
    localStorage.setItem(AUTH_PLAYER_KEY, playerId);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setAuthState({ playerId, token });
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_PLAYER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthState({ playerId: null, token: null });
  }, []);

  const value = useMemo<MinigameAuthContextValue>(
    () => ({
      ...auth,
      isAuthenticated: checkAuthenticated(),
      setAuth,
      clearAuth,
    }),
    [auth, setAuth, clearAuth],
  );

  return (
    <MinigameAuthContext.Provider value={value}>{children}</MinigameAuthContext.Provider>
  );
}

export function useMinigameAuth(): MinigameAuthContextValue {
  const ctx = useContext(MinigameAuthContext);
  if (!ctx) {
    throw new Error("useMinigameAuth must be used within MinigameAuthProvider");
  }
  return ctx;
}
