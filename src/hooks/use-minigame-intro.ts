import { useCallback, useEffect, useState } from "react";
import { markMinigameSessionStarted } from "@/lib/minigame-session-timer";

/** Resets when session reloads; set true after player acknowledges how-to-play intro */
export function useMinigameIntro(sessionVersion: number) {
  const [introAcked, setIntroAcked] = useState(false);

  useEffect(() => {
    setIntroAcked(false);
  }, [sessionVersion]);

  const ackIntro = useCallback(() => {
    markMinigameSessionStarted();
    setIntroAcked(true);
  }, []);

  return { introAcked, ackIntro };
}
