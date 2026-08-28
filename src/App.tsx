import { Navigate, Route, Routes } from "react-router-dom";
import JoinGamePage from "@/pages/join-game";
import TeamSetupPage from "@/pages/team-setup";
import TeamLobbyPage from "@/pages/team-lobby";
import InstructionsPage from "@/pages/instructions";
import DashboardPage from "@/pages/dashboard";
import PredictionPage from "@/pages/prediction";
import RoundGameplayPage from "@/pages/round-gameplay";
import BettingPage from "@/pages/betting";
import ClueCardPage from "@/pages/clue-card";
import AnswerRevealPage from "@/pages/answer-reveal";
import RoundCompletePage from "@/pages/round-complete";
import FinalScoresPage from "@/pages/final-scores";
import InboxPage from "@/pages/inbox";
import ChatPage from "@/pages/chat";
import FundsPage from "@/pages/funds";
import GameEndPage from "@/pages/game-end";
import PicturePuzzlePage from "@/pages/minigames/picture-puzzle";
import WordPuzzlePage from "@/pages/minigames/word-puzzle";
import GeoGuesserPage from "@/pages/minigames/geo-guesser";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/join" replace />} />
      <Route path="/join" element={<JoinGamePage />} />
      <Route path="/team-setup" element={<TeamSetupPage />} />
      <Route path="/lobby" element={<TeamLobbyPage />} />
      <Route path="/instructions" element={<InstructionsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/prediction" element={<PredictionPage />} />
      <Route path="/round" element={<RoundGameplayPage />} />
      <Route path="/betting" element={<BettingPage />} />
      <Route path="/clue" element={<ClueCardPage />} />
      <Route path="/reveal" element={<AnswerRevealPage />} />
      <Route path="/round-complete" element={<RoundCompletePage />} />
      <Route path="/scores" element={<FinalScoresPage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/funds" element={<FundsPage />} />
      <Route path="/game-end" element={<GameEndPage />} />
      <Route path="/minigame/picture" element={<PicturePuzzlePage />} />
      <Route path="/minigame/word" element={<WordPuzzlePage />} />
      <Route path="/minigame/geo" element={<GeoGuesserPage />} />
    </Routes>
  );
}
