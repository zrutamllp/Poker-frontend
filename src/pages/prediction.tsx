import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spade } from "lucide-react";
import { PokerTableCanvas } from "@/components/game/poker-table-canvas";
import { LeaderboardSidebar } from "@/components/game/leaderboard-sidebar";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import {
  teams,
  leaderboard,
  tournamentPredictionTeams,
  TOTAL_ROUNDS,
} from "@/data/game-data";
import { cn } from "@/lib/utils";

function PredictionTopBar() {
  return (
    <header className="shrink-0 border-b border-border px-4 py-5 sm:px-10 lg:px-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Spade className="size-8 text-gold" />
          <div>
            <h1 className="font-serif text-2xl font-black text-gold-light sm:text-[32px]">
              THE CULTURE TABLE
            </h1>
            <p className="text-[11px] font-bold uppercase text-gold-muted">
              Gamified Team Performance Tracker
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <span className="rounded border border-gold-muted bg-bg-elevated px-3 py-1.5 text-xs font-bold text-gold">
            ROUND 1 OF {TOTAL_ROUNDS}
          </span>
          <div className="text-right">
            <p className="text-[11px] text-text-muted-alt">PLAYING AS</p>
            <p className="font-serif text-lg font-black text-white sm:text-xl">THE ACES</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gold bg-bg-elevated px-4 py-2">
            <span className="flex size-[18px] items-center justify-center rounded-lg border border-white bg-gold font-serif text-[11px] font-black text-text-dark">
              $
            </span>
            <span className="text-sm font-bold text-white">
              45 <span className="text-xs text-gold">Culture Coins</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function TeamPredictionCard({
  rank,
  name,
  points,
  selected,
  onSelect,
}: {
  rank: number;
  name: string;
  points: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-2 rounded-xl border p-3.5 text-left transition-all sm:p-3.5",
        selected
          ? "border-2 border-gold bg-[#1a2238] shadow-[0_4px_6px_rgba(212,175,55,0.15)]"
          : "border-border bg-[#050709] hover:border-gold-muted/50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="rounded bg-bg-card px-1.5 py-0.5 text-[10px] font-bold text-text-muted-alt">
          #{rank}
        </span>
        <span
          className={cn(
            "size-2.5 rounded-full border",
            selected ? "border-gold bg-gold" : "border-border bg-transparent",
          )}
        />
      </div>
      <p className="truncate font-serif text-base font-black text-white">{name}</p>
      <p className="text-xs text-text-muted-alt">{points} Pts</p>
    </button>
  );
}

export default function PredictionPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("5");

  const selectedTeam = tournamentPredictionTeams.find((t) => t.id === selectedId);
  const multiplier = selectedTeam?.rank ?? 5;
  const bonusTotal = 1000 * multiplier;

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#050709] lg:flex-row">
      <NavIconBar className="absolute right-4 top-4 z-[60] sm:right-6" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col opacity-40 blur-[1px]">
        <PredictionTopBar />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-h-0 flex-1 items-center justify-center p-6 lg:p-10">
            <div className="aspect-[840/460] w-full max-w-3xl rounded-[230px] border-4 border-gold-muted bg-[#0d402f] p-4">
              <PokerTableCanvas
                teams={teams}
                currentRound={0}
                totalRounds={TOTAL_ROUNDS}
                centerLabel="PRE-GAME"
                centerSubLabel="LOCK IN BETS"
                centerStatus="WAITING TO START"
                hideSeats
              />
            </div>
          </main>
          <LeaderboardSidebar entries={leaderboard} compact />
        </div>
      </div>

      {/* Modal overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(5,7,9,0.83)] p-4 sm:p-8 lg:p-10">
        <div className="relative flex max-h-[95dvh] w-full max-w-3xl flex-col gap-6 overflow-y-auto rounded-3xl border-[2.5px] border-gold bg-bg-card-alt/95 p-6 shadow-[0_24px_24px_rgba(0,0,0,0.8)] sm:gap-7 sm:p-8">
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-black text-gold-light sm:text-[32px]">
                🏆 PRE-ROUND TOURNAMENT BET
              </h2>
              <span className="rounded border border-green bg-green/10 px-2.5 py-1 text-[11px] font-bold text-green">
                ACTIVE POT
              </span>
            </div>
            <p className="font-serif text-lg font-bold text-white">
              Which team will WIN the entire tournament?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted-alt">
              Place your prediction before the first round begins — earn{" "}
              <span className="font-bold text-gold-light">1,000 BONUS BASE POINTS</span> multiplied
              by the team&apos;s risk tier if they take the championship!
            </p>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tournamentPredictionTeams.map((team) => (
              <TeamPredictionCard
                key={team.id}
                rank={team.rank}
                name={team.name}
                points={team.points}
                selected={selectedId === team.id}
                onSelect={() => setSelectedId(team.id)}
              />
            ))}
          </div>

          {selectedTeam && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-[1.5px] border-gold bg-[#1a1512] p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-2xl bg-gold font-serif text-base font-black text-[#1c140f]">
                  ×
                </span>
                <div>
                  <p className="text-[11px] font-bold text-gold-muted">
                    YOUR SELECTED TEAM: {selectedTeam.name.toUpperCase()}
                  </p>
                  <p className="font-serif text-base font-black text-white">
                    YOUR POTENTIAL BONUS: 1,000 Pts × {multiplier}x Multiplier
                  </p>
                </div>
              </div>
              <p className="font-serif text-2xl font-black text-gold-light">
                = {bonusTotal.toLocaleString()} Points
              </p>
            </div>
          )}

          <p className="flex items-center justify-center gap-2 text-center text-[13px] text-text-muted-alt">
            <span className="size-1.5 rounded-full bg-gold" />
            You can only bet <span className="font-bold text-gold-light">ONCE</span> per game. This
            prediction locks for the entire event!
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 rounded-[30px] border-[1.5px] border-border px-8 py-4 text-base font-bold text-text-muted-alt transition-colors hover:text-white"
            >
              Skip for Now
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 rounded-[30px] border border-white bg-gold px-8 py-4 font-serif text-base font-black text-text-dark shadow-[0_4px_6px_rgba(212,175,55,0.25)] transition-opacity hover:opacity-90"
            >
              LOCK IN PREDICTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
