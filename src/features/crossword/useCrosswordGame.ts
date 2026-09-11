import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildBoard, countCompletedWords, getActiveWord, isPuzzleComplete } from "./crosswordEngine";
import {
  findFirstOpenCell,
  getNextClueWord,
  moveArrow,
  moveSelection,
  toggleDirection,
} from "./crosswordNavigation";
import {
  clearProgress,
  createInitialProgress,
  loadProgress,
  saveProgress,
} from "./crosswordStorage";
import type { CrosswordDirection, CrosswordPuzzle } from "./crosswordTypes";
import { cellKey } from "./crosswordTypes";

export interface UseCrosswordGameOptions {
  puzzle: CrosswordPuzzle;
  hintsMax: number;
  onComplete?: () => void;
  /** When false, elapsed timer does not run (e.g. before intro OK) */
  timerActive?: boolean;
  /** Blocks letter entry and selection (e.g. after timeout) */
  inputLocked?: boolean;
}

export function useCrosswordGame({
  puzzle,
  hintsMax,
  onComplete,
  timerActive = true,
  inputLocked = false,
}: UseCrosswordGameOptions) {
  const board = useMemo(() => buildBoard(puzzle), [puzzle]);
  const [progress, setProgress] = useState(() => {
    const saved = loadProgress(puzzle.id);
    if (saved && !saved.completed) return saved;
    const initial = createInitialProgress(puzzle.id);
    const first = findFirstOpenCell(board, {});
    return { ...initial, selectedRow: first.row, selectedCol: first.col, direction: first.direction };
  });

  const completedRef = useRef(progress.completed);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!timerActive || progress.completed || progress.paused) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      setProgress((p) => ({ ...p, elapsedSeconds: p.elapsedSeconds + 1 }));
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [timerActive, progress.completed, progress.paused]);

  useEffect(() => {
    if (isPuzzleComplete(board, progress.letters) && !progress.completed) {
      setProgress((p) => ({ ...p, completed: true }));
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
    }
  }, [board, progress.letters, progress.completed, onComplete]);

  const activeWord = getActiveWord(
    board,
    progress.selectedRow,
    progress.selectedCol,
    progress.direction,
  );

  const wordProgress = countCompletedWords(board, progress.letters);
  const hintsRemaining = hintsMax - progress.hintsUsed;

  const selectCell = useCallback(
    (row: number, col: number, forceDirection?: CrosswordDirection) => {
      if (inputLocked) return;
      const cell = board.cells[row]?.[col];
      if (!cell || cell.isBlock) return;

      setProgress((p) => {
        const sameCell = p.selectedRow === row && p.selectedCol === col;
        let direction = forceDirection ?? p.direction;

        if (sameCell && !forceDirection) {
          direction = toggleDirection(
            p.direction,
            Boolean(cell.acrossId),
            Boolean(cell.downId),
          );
        } else if (!forceDirection) {
          if (direction === "across" && !cell.acrossId && cell.downId) direction = "down";
          if (direction === "down" && !cell.downId && cell.acrossId) direction = "across";
        }

        return { ...p, selectedRow: row, selectedCol: col, direction };
      });
    },
    [board, inputLocked],
  );

  const selectWord = useCallback(
    (word: { row: number; col: number; direction: CrosswordDirection }) => {
      selectCell(word.row, word.col, word.direction);
    },
    [selectCell],
  );

  const setLetter = useCallback(
    (letter: string) => {
      if (inputLocked || progress.completed || progress.paused) return;
      const { selectedRow, selectedCol, direction } = progress;
      const cell = board.cells[selectedRow][selectedCol];
      if (cell.isBlock) return;

      const key = cellKey(selectedRow, selectedCol);
      setProgress((p) => ({
        ...p,
        letters: { ...p.letters, [key]: letter.toUpperCase() },
      }));

      const next = moveSelection(board, selectedRow, selectedCol, direction, 1);
      if (!board.cells[next.row][next.col].isBlock) {
        setProgress((p) => ({
          ...p,
          selectedRow: next.row,
          selectedCol: next.col,
          direction: next.direction,
        }));
      }
    },
    [board, inputLocked, progress],
  );

  const backspace = useCallback(() => {
    if (inputLocked || progress.completed || progress.paused) return;
    const { selectedRow, selectedCol, direction, letters } = progress;
    const key = cellKey(selectedRow, selectedCol);

    if (letters[key]) {
      setProgress((p) => {
        const next = { ...p.letters };
        delete next[key];
        return { ...p, letters: next };
      });
      return;
    }

    const prev = moveSelection(board, selectedRow, selectedCol, direction, -1);
    if (prev.row === selectedRow && prev.col === selectedCol) return;

    const prevKey = cellKey(prev.row, prev.col);
    setProgress((p) => {
      const next = { ...p.letters };
      delete next[prevKey];
      return {
        ...p,
        letters: next,
        selectedRow: prev.row,
        selectedCol: prev.col,
        direction: prev.direction,
      };
    });
  }, [board, inputLocked, progress]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (inputLocked || progress.completed || progress.paused) return;

      if (e.key === "Tab") {
        e.preventDefault();
        const next = getNextClueWord(board, activeWord?.id ?? null, e.shiftKey);
        if (next) selectCell(next.row, next.col, next.direction);
        return;
      }
      if (e.key === " ") {
        e.preventDefault();
        const cell = board.cells[progress.selectedRow][progress.selectedCol];
        const dir = toggleDirection(
          progress.direction,
          Boolean(cell.acrossId),
          Boolean(cell.downId),
        );
        setProgress((p) => ({ ...p, direction: dir }));
        return;
      }
      if (e.key === "Escape") {
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = moveArrow(board, progress.selectedRow, progress.selectedCol, progress.direction, "up");
        selectCell(next.row, next.col, next.direction);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = moveArrow(board, progress.selectedRow, progress.selectedCol, progress.direction, "down");
        selectCell(next.row, next.col, next.direction);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const next = moveArrow(board, progress.selectedRow, progress.selectedCol, progress.direction, "left");
        selectCell(next.row, next.col, next.direction);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = moveArrow(board, progress.selectedRow, progress.selectedCol, progress.direction, "right");
        selectCell(next.row, next.col, next.direction);
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        setLetter(e.key);
      }
    },
    [activeWord?.id, backspace, board, inputLocked, progress, selectCell, setLetter],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const check = useCallback(
    (scope: "cell" | "word" | "puzzle") => {
      if (inputLocked) return;
      setProgress((p) => {
        const checked = { ...p.checkedCells };
        let mistakes = p.mistakes;

        const markCell = (row: number, col: number) => {
          const key = cellKey(row, col);
          const letter = p.letters[key]?.toUpperCase();
          if (!letter) return;
          checked[key] = true;
          if (letter !== board.cells[row][col].solution) mistakes++;
        };

        if (scope === "cell") {
          markCell(p.selectedRow, p.selectedCol);
        } else if (scope === "word" && activeWord) {
          for (const c of activeWord.cells) markCell(c.row, c.col);
        } else if (scope === "puzzle") {
          for (let r = 0; r < board.puzzle.size; r++) {
            for (let c = 0; c < board.puzzle.size; c++) {
              if (!board.cells[r][c].isBlock) markCell(r, c);
            }
          }
        }

        return { ...p, checkedCells: checked, mistakes };
      });
    },
    [activeWord, board, inputLocked],
  );

  const reveal = useCallback(
    (scope: "cell" | "word" | "puzzle") => {
      if (scope === "puzzle") {
        const ok = window.confirm("Reveal entire puzzle?");
        if (!ok) return;
      }

      setProgress((p) => {
        const letters = { ...p.letters };

        const revealCell = (row: number, col: number) => {
          letters[cellKey(row, col)] = board.cells[row][col].solution ?? "";
        };

        if (scope === "cell") {
          revealCell(p.selectedRow, p.selectedCol);
        } else if (scope === "word" && activeWord) {
          for (const c of activeWord.cells) revealCell(c.row, c.col);
        } else if (scope === "puzzle") {
          for (let r = 0; r < board.puzzle.size; r++) {
            for (let c = 0; c < board.puzzle.size; c++) {
              if (!board.cells[r][c].isBlock) revealCell(r, c);
            }
          }
        }

        return { ...p, letters };
      });
    },
    [activeWord, board],
  );

  const hint = useCallback(() => {
    if (inputLocked || progress.hintsUsed >= hintsMax || !activeWord) return;

    setProgress((p) => {
      const empty = activeWord!.cells.find((c) => !p.letters[cellKey(c.row, c.col)]);
      if (!empty) return p;
      return {
        ...p,
        hintsUsed: p.hintsUsed + 1,
        letters: {
          ...p.letters,
          [cellKey(empty.row, empty.col)]: board.cells[empty.row][empty.col].solution ?? "",
        },
      };
    });
  }, [activeWord, board, hintsMax, inputLocked, progress.hintsUsed]);

  const togglePause = useCallback(() => {
    setProgress((p) => ({ ...p, paused: !p.paused }));
  }, []);

  const resetProgress = useCallback(() => {
    clearProgress(puzzle.id);
    const first = findFirstOpenCell(board, {});
    setProgress({
      ...createInitialProgress(puzzle.id),
      selectedRow: first.row,
      selectedCol: first.col,
      direction: first.direction,
    });
    completedRef.current = false;
  }, [board, puzzle.id]);

  return {
    board,
    progress,
    activeWord,
    wordProgress,
    hintsRemaining,
    selectCell,
    selectWord,
    setLetter,
    backspace,
    check,
    reveal,
    hint,
    togglePause,
    resetProgress,
    getClues: () => ({
      across: board.words.filter((w) => w.direction === "across").sort((a, b) => a.number - b.number),
      down: board.words.filter((w) => w.direction === "down").sort((a, b) => a.number - b.number),
    }),
  };
}

export type CrosswordGame = ReturnType<typeof useCrosswordGame>;
