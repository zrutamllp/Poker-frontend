import { useEffect, useState } from "react";
import {
  getMinigameSessionRemaining,
  hasMinigameSessionStarted,
  isMinigameSessionExpired,
} from "@/lib/minigame-session-timer";

/** Polls the shared 15-minute minigame session countdown */
export function useMinigameGlobalTimer() {
  const [timeLeft, setTimeLeft] = useState(() => getMinigameSessionRemaining());
  const [started, setStarted] = useState(() => hasMinigameSessionStarted());

  useEffect(() => {
    const tick = () => {
      setStarted(hasMinigameSessionStarted());
      setTimeLeft(getMinigameSessionRemaining());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return {
    timeLeft,
    started,
    expired: started && isMinigameSessionExpired(),
  };
}
