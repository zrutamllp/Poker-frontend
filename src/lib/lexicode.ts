/** Lexicode (5-letter Wordle-style) helpers */

export type LetterState = "correct" | "present" | "absent" | "empty" | "pending";

export const WORD_LENGTH = 5;

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent");
  const answerChars = answer.split("");
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answerChars[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = answerChars.findIndex((c, j) => !used[j] && c === guess[i]);
    if (idx !== -1) {
      result[i] = "present";
      used[idx] = true;
    }
  }

  return result;
}

export function mergeKeyStates(
  guesses: { word: string; states: LetterState[] }[],
): Record<string, LetterState> {
  const rank: Record<LetterState, number> = {
    empty: 0,
    pending: 0,
    absent: 1,
    present: 2,
    correct: 3,
  };
  const keys: Record<string, LetterState> = {};

  for (const { word, states } of guesses) {
    word.split("").forEach((letter, i) => {
      const state = states[i];
      if (!keys[letter] || rank[state] > rank[keys[letter]]) {
        keys[letter] = state;
      }
    });
  }

  return keys;
}

export function isValidGuess(word: string, dictionary: Set<string>): boolean {
  return word.length === WORD_LENGTH && dictionary.has(word);
}
