export type RoundStatus = "completed" | "active" | "upcoming";
export type TeamStatus = "ready" | "joining";
export type PlayerRole =
  | "The Captain"
  | "The Coin Keeper"
  | "The Connector"
  | "The Storyteller"
  | "The Mirror";

export interface Team {
  id: string;
  name: string;
  points: number;
  cultureCoins: number;
  rank: number;
}

export interface LobbyTeam {
  id: string;
  name: string;
  playersJoined: number;
  maxPlayers: number;
  status: TeamStatus;
}

export interface RoundSlot {
  id: number;
  label: string;
  status: RoundStatus;
}

export interface BettingOption {
  id: string;
  label: string;
  text: string;
  bet?: number;
}

export interface PlayerClue {
  id: string;
  name: string;
  initials: string;
  color: string;
  clue: string;
}

export interface LeaderboardEntry extends Team {}

export interface GameState {
  gameCode: string;
  teamName: string;
  playerName: string;
  role: PlayerRole;
  cultureCoins: number;
  currentRound: number;
  totalRounds: number;
}
