import { useCallback, useState } from "react";
import {
  getStoredDifficulty,
  setStoredDifficulty,
  type MinigameDifficulty,
} from "@/lib/minigame-difficulty";

export function useMinigameDifficulty() {
  const [difficulty, setDifficultyState] = useState<MinigameDifficulty>(getStoredDifficulty);

  const setDifficulty = useCallback((d: MinigameDifficulty) => {
    setStoredDifficulty(d);
    setDifficultyState(d);
  }, []);

  return {
    difficulty,
    setDifficulty,
    isHighStakes: difficulty === "high_stakes",
  };
}
