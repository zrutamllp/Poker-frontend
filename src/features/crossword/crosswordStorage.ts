import type { CrosswordProgress } from "./crosswordTypes";

const STORAGE_PREFIX = "poker-crossword-progress-";

export function loadProgress(puzzleId: string): CrosswordProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${puzzleId}`);
    if (!raw) return null;
    return JSON.parse(raw) as CrosswordProgress;
  } catch {
    return null;
  }
}

export function saveProgress(progress: CrosswordProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_PREFIX}${progress.puzzleId}`, JSON.stringify(progress));
}

export function clearProgress(puzzleId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_PREFIX}${puzzleId}`);
}

export function createInitialProgress(puzzleId: string): CrosswordProgress {
  return {
    puzzleId,
    letters: {},
    selectedRow: 0,
    selectedCol: 0,
    direction: "across",
    elapsedSeconds: 0,
    hintsUsed: 0,
    mistakes: 0,
    completed: false,
    paused: false,
    startedAt: Date.now(),
    checkedCells: {},
  };
}
