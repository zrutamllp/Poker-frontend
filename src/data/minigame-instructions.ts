import type { MinigameId } from "@/types/minigame-session";

export interface MinigameInstructions {
  title: string;
  objective: string;
  steps: string[];
  winCondition: string;
  loseCondition: string;
  tips?: string[];
  reward: string;
}

export const MINIGAME_INSTRUCTIONS: Record<MinigameId, MinigameInstructions> = {
  anagram: {
    title: "Decode Brief",
    objective: "Reconstruct classified phrases from scrambled letters before time runs out.",
    steps: [
      "Tap letters from the pool to fill the answer slots.",
      "Tap a placed letter to return it to the pool.",
      "Use RE-SCRAMBLE to shuffle remaining letters if stuck.",
      "Solve all briefs in the round to win.",
    ],
    winCondition: "Decode every brief in the round before the timer hits zero.",
    loseCondition: "Timer reaches zero before all briefs are solved.",
    tips: ["Wrong sequences reset your current attempt after a short delay."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  hangman: {
    title: "Word Hunt",
    objective: "Guess the hidden term letter by letter before running out of attempts.",
    steps: [
      "Click keyboard letters to guess.",
      "Correct letters appear in the word slots.",
      "Wrong guesses add to the margin used counter.",
      "Use INTEL HINT to reveal a random unguessed letter (limited uses).",
    ],
    winCondition: "Reveal every letter in the target term.",
    loseCondition: "Wrong guesses reach the maximum allowed.",
    tips: ["Vowels are a good starting strategy on longer phrases."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  ladder: {
    title: "The Climb",
    objective: "Transform the start word into the target word one letter at a time.",
    steps: [
      "Type a new word and submit each rung.",
      "Each step must change exactly one letter from the previous word.",
      "Words must be in the approved lexicon and not already used.",
      "Use INTEL HINT if available for a clue about the path.",
    ],
    winCondition: "Reach the target term within the step limit.",
    loseCondition: "Use all allowed steps without reaching the target.",
    tips: ["Try to beat the par target for bragging rights."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  wheel: {
    title: "High Stakes Wheel",
    objective: "Spin the wheel, earn points, and decode the hidden phrase.",
    steps: [
      "Spin the wheel to land on a segment.",
      "Points segments let you guess a letter; correct guesses add to your score.",
      "FREE reveals a consonant; SKIP and BUST segments defer or zero your session score.",
      "Guess letters on the keyboard when it is your turn to call.",
    ],
    winCondition: "Reveal every letter in the phrase.",
    loseCondition: "Too many wrong guesses exhaust your margin.",
    tips: ["On High Stakes, buying vowels costs Culture Coins from your session score."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  lexicode: {
    title: "Lexicode",
    objective: "Decode the five-letter table term in limited attempts.",
    steps: [
      "Type a valid five-letter word and press ENTER.",
      "Tiles change color: cyan = correct spot, gold = wrong spot, gray = not in word.",
      "Use keyboard colors to narrow down the answer.",
      "You have a fixed number of guesses per round.",
    ],
    winCondition: "Guess the exact target word.",
    loseCondition: "Use all guesses without finding the word.",
    tips: ["Start with words that use common vowels and consonants."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  geo: {
    title: "World Scout",
    objective: "Find named countries on the world map as accurately as you can.",
    steps: [
      "Read the country name shown above the map.",
      "Tap the world map to drop a pin on your guess.",
      "Press CONFIRM GUESS to lock in and reveal the actual location.",
      "Wrong guesses show the correct country highlighted on the map.",
      "Score points based on how close your pin is to the real location.",
    ],
    winCondition: "Reach the required total score across all rounds.",
    loseCondition: "Final score falls below the win threshold.",
    tips: ["Use region names as hints — they describe the general area."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  picture: {
    title: "Picture Slider",
    objective: "Slide tiles into place to restore the reference image before time runs out.",
    steps: [
      "Tap a tile adjacent to the empty slot to slide it.",
      "Rebuild the image to match the Reference View on the right.",
      "Use SHUFFLE BOARD to mix tiles again (resets move count).",
      "Use INTEL HINT to highlight a correct tile placement (limited uses).",
      "Use RESET BOARD to return to the starting layout.",
    ],
    winCondition: "Complete the puzzle before the timer expires.",
    loseCondition: "Timer reaches zero before the image is restored.",
    tips: ["Solve corners and edges first to reduce complexity."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
};
