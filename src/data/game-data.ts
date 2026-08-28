import type {
  BettingOption,
  LeaderboardEntry,
  LobbyTeam,
  PlayerClue,
  RoundSlot,
  Team,
} from "@/types/game";

export const TOTAL_ROUNDS = 12;

export const teams: Team[] = [
  { id: "1", name: "The Aces", points: 95, cultureCoins: 28, rank: 1 },
  { id: "2", name: "Royal Flush", points: 91, cultureCoins: 24, rank: 2 },
  { id: "3", name: "Wild Cards", points: 86, cultureCoins: 20, rank: 3 },
  { id: "4", name: "Full House", points: 79, cultureCoins: 18, rank: 4 },
  { id: "5", name: "High Rollers", points: 74, cultureCoins: 15, rank: 5 },
  { id: "6", name: "Pocket Kings", points: 68, cultureCoins: 14, rank: 6 },
  { id: "7", name: "All In", points: 61, cultureCoins: 12, rank: 7 },
  { id: "8", name: "The Bluffers", points: 55, cultureCoins: 10, rank: 8 },
  { id: "9", name: "Card Sharks", points: 49, cultureCoins: 8, rank: 9 },
  { id: "10", name: "Chip Leaders", points: 42, cultureCoins: 7, rank: 10 },
  { id: "11", name: "The Dealers", points: 36, cultureCoins: 5, rank: 11 },
  { id: "12", name: "The Jokers", points: 29, cultureCoins: 3, rank: 12 },
  { id: "13", name: "Straight Shooters", points: 18, cultureCoins: 1, rank: 13 },
];

export const roundSlots: RoundSlot[] = [
  { id: 1, label: "R1", status: "completed" },
  { id: 2, label: "R2", status: "completed" },
  { id: 3, label: "R3", status: "completed" },
  { id: 4, label: "R4", status: "completed" },
  { id: 5, label: "R5", status: "completed" },
  { id: 6, label: "R6", status: "completed" },
  { id: 7, label: "R7", status: "active" },
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 8,
    label: `R${i + 8}`,
    status: "upcoming" as const,
  })),
];

export const lobbyTeams: LobbyTeam[] = [
  { id: "1", name: "The Aces", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "2", name: "Royal Flush", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "3", name: "High Rollers", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "4", name: "Wild Cards", playersJoined: 4, maxPlayers: 5, status: "joining" },
  { id: "5", name: "Full House", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "6", name: "Chip Leaders", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "7", name: "The Bluffers", playersJoined: 2, maxPlayers: 5, status: "joining" },
  { id: "8", name: "Card Sharks", playersJoined: 5, maxPlayers: 5, status: "ready" },
  { id: "9", name: "Pocket Kings", playersJoined: 3, maxPlayers: 5, status: "joining" },
  { id: "10", name: "Straight Shooters", playersJoined: 4, maxPlayers: 5, status: "joining" },
];

export const playerRoles = [
  "The Captain",
  "The Coin Keeper",
  "The Connector",
  "The Storyteller",
  "The Mirror",
] as const;

export const bettingOptions: BettingOption[] = [
  { id: "A", label: "A", text: "Innovation First", bet: 15 },
  { id: "B", label: "B", text: "Customer Obsession" },
  { id: "C", label: "C", text: "Radical Transparency", bet: 30 },
  { id: "D", label: "D", text: "Sustainable Growth" },
];

export const playerClues: PlayerClue[] = [
  { id: "1", name: "Alex", initials: "AL", color: "#ef4444", clue: "Mentioned in the CEO keynote" },
  { id: "2", name: "Jordan", initials: "JO", color: "#8b5cf6", clue: "Starts with the letter R" },
  { id: "3", name: "Sam", initials: "SA", color: "#f59e0b", clue: "Related to openness" },
  { id: "4", name: "Taylor", initials: "TA", color: "#8b5cf6", clue: "NOT Innovation First" },
  { id: "5", name: "Morgan", initials: "MO", color: "#10b981", clue: "Was voted on by employees" },
];

export const leaderboard: LeaderboardEntry[] = teams;

/** Round slots displayed in Figma order: R7 active first, then R1–R6, then R8–R12 */
export const dashboardRoundOrder = [7, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12] as const;

export const howToWinSteps = [
  {
    step: 1,
    title: "Receive Your Clue",
    description: "Each team member gets a unique clue card at the start of every round.",
  },
  {
    step: 2,
    title: "Discuss & Strategize",
    description: "Share clues with your team during the discussion phase. Connect the dots!",
  },
  {
    step: 3,
    title: "Place Your Bets",
    description: "Use Culture Coins to bet on the correct answer. Higher bets = bigger rewards.",
  },
  {
    step: 4,
    title: "Reveal & Score",
    description: "When answers are revealed, winning bets earn Culture Coins and points.",
  },
  {
    step: 5,
    title: "Climb the Leaderboard",
    description: "Accumulate the most Culture Coins across 12 rounds to win the tournament.",
  },
];

export const predictionOptions = [
  { id: "A", text: "Team A will win Round 3", odds: "2:1" },
  { id: "B", text: "Over 80% accuracy this round", odds: "3:1" },
  { id: "C", text: "Wild Cards takes the lead", odds: "5:1" },
  { id: "D", text: "Lowest bet wins big", odds: "8:1" },
];

export type GameCardStatus = "not_started" | "completed";

export const cultureCoinGames = [
  {
    id: 1,
    title: "GAME 01",
    status: "not_started" as GameCardStatus,
    route: "/minigame/picture",
    icon: "x" as const,
  },
  {
    id: 2,
    title: "GAME 2",
    status: "completed" as GameCardStatus,
    route: "/minigame/word",
    icon: "message" as const,
  },
  {
    id: 3,
    title: "GAME 03",
    status: "completed" as GameCardStatus,
    route: "/minigame/geo",
    icon: "x" as const,
  },
  {
    id: 4,
    title: "GAME 04",
    status: "not_started" as GameCardStatus,
    route: "/minigame/picture",
    icon: "star" as const,
  },
  {
    id: 5,
    title: "GAME 05",
    status: "not_started" as GameCardStatus,
    route: "/minigame/word",
    icon: "x" as const,
  },
];

/** Per-team coin delta after a round (team id → change) */
export const round3TeamDeltas: Record<string, number> = {
  "1": 20,
  "2": 30,
  "3": -5,
  "4": 25,
  "5": 35,
  "6": 25,
  "7": 40,
  "8": -15,
  "9": 25,
  "10": 20,
  "11": 15,
  "12": 10,
  "13": 10,
};

export const TABLE_CODE = "GP-701A";

export const suggestedTeamNames = [
  "The Aces",
  "Royal Flush",
  "High Rollers",
  "Wild Cards",
  "Full House",
] as const;

/** Teams available for pre-round tournament prediction (excludes current team) */
export const tournamentPredictionTeams = teams.filter((t) => t.id !== "1");

export const roundCompleteSummary = {
  round: 3,
  nextRound: 4,
  correctAnswer: { label: "C", text: "Radical Transparency" },
  countdown: "00:45",
  mvp: { team: "All In", delta: 40 },
  biggestBet: { team: "High Rollers", amount: 35, option: "C" },
  sideBetWinners: 3,
};
