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
  hangman: {
    title: "Word Hunt",
    objective:
      "Guess six hidden terms across six timed rounds. Each round lasts 30 seconds.",
    steps: [
      "Click keyboard letters to guess the hidden word.",
      "Correct letters appear in the word slots; wrong guesses fill the margin.",
      "Solve the word before time runs out to earn +200 points for that round.",
      "If time expires or margin fills, the round scores 0 — then the next round starts automatically.",
      "Maximum session score is 1200 points (6 wins × 200).",
    ],
    winCondition: "Reach the target score after all six rounds.",
    loseCondition: "Finish below the target score.",
    tips: ["Vowels are a strong opener on longer phrases."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  picture: {
    title: "Picture Slider",
    objective:
      "Restore the reference image within 5 minutes, then confirm your solution.",
    steps: [
      "Tap a tile adjacent to the empty slot to slide it.",
      "Rebuild the image to match the Reference View.",
      "Press CONFIRM when you believe the puzzle is complete.",
      "You may confirm up to 3 times — each wrong confirm uses one attempt.",
      "If all confirms are used without a correct solution, the session ends with 0 points.",
    ],
    winCondition: "Confirm a correct solution within 5 minutes to earn 1200 points.",
    loseCondition:
      "Time runs out, or you use all 3 confirms without a correct solution — 0 points.",
    tips: ["Solve corners and edges first before using a confirm."],
    reward: "Win = 1200 points (+1000 Culture Coins when online).",
  },
  lexicode: {
    title: "The Daily Crossword",
    objective: "Solve the crossword grid within 2 minutes using across and down clues.",
    steps: [
      "Tap a clue or cell to select a word, then type letters on your keyboard.",
      "Use arrows or Tab to move between cells; Space toggles across/down.",
      "Press Check to validate the active word; use Hint if you are stuck.",
      "Complete every answer before the 2-minute timer runs out.",
    ],
    winCondition: "Fill the entire grid correctly within 2 minutes to earn 1000 points.",
    loseCondition: "Time runs out before the puzzle is complete — 0 points.",
    tips: ["Solve short crossing words first to unlock longer answers."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
  geo: {
    title: "The Fake One",
    objective:
      "Spot the single false statement among four options across 10 fast rounds.",
    steps: [
      "Read all four statements carefully — three are true, one is fake.",
      "Tap the statement you believe is false, then choose Lock or Double down.",
      "Lock earns +100 for a correct pick; Double down earns +200 but scores 0 if wrong.",
      "Build streaks for bonus points; each round has a 30-second timer.",
      "Reach 1000 points by the end of the session to win culture coins.",
    ],
    winCondition: "Score at least 1000 points after all 10 rounds.",
    loseCondition: "Finish below 1000 points, or the 15-minute session expires.",
    tips: ["Watch for statements that sound plausible but exaggerate a detail."],
    reward: "Win = +1000 Culture Coins (best of 2 attempts when online).",
  },
};
