export type FakeOneCategory =
  | "science"
  | "technology"
  | "psychology"
  | "business"
  | "history"
  | "geography"
  | "human body"
  | "space"
  | "animals"
  | "food"
  | "money"
  | "everyday life"
  | "engineering"
  | "language"
  | "productivity"
  | "inventions"
  | "numbers"
  | "nature"
  | "internet"
  | "entertainment";

export type FakeOneQuestionDifficulty = 1 | 2 | 3 | 4;

export interface FakeOneQuestion {
  id: string;
  category: FakeOneCategory;
  difficulty: FakeOneQuestionDifficulty;
  statements: [string, string, string, string];
  fakeIndex: 0 | 1 | 2 | 3;
  explanation: string;
  source?: string;
  tier: "standard" | "high_stakes";
}

export interface FakeOneSession {
  questions: FakeOneQuestion[];
  totalRounds: number;
  seed: number;
  tier: "standard" | "high_stakes";
}

export type FakeOneRisk = "lock" | "double";

export type FakeOnePhase = "playing" | "risk" | "reveal" | "complete";

export interface FakeOneRoundResult {
  round: number;
  questionId: string;
  selectedIndex: number | null;
  fakeIndex: number;
  correct: boolean;
  timedOut: boolean;
  risk: FakeOneRisk | null;
  pointsEarned: number;
  streakAfter: number;
}

export interface FakeOneState {
  phase: FakeOnePhase;
  round: number;
  totalRounds: number;
  score: number;
  winScore: number;
  streak: number;
  longestStreak: number;
  correctCount: number;
  doubleDownAttempts: number;
  doubleDownWins: number;
  results: FakeOneRoundResult[];
  selectedIndex: number | null;
  risk: FakeOneRisk | null;
  timeLeft: number;
  seed: number;
}
