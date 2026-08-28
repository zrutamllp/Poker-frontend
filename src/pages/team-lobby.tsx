import { useNavigate } from "react-router-dom";
import { Check, Spade } from "lucide-react";
import { lobbyTeams } from "@/data/game-data";
import { getEllipticalSeatStyle } from "@/lib/seat-layout";
import { Badge } from "@/components/common/badges";
import { AppShellPage } from "@/components/layout/page-layouts";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LobbyTeam } from "@/types/game";

function TeamLobbyCard({ team }: { team: LobbyTeam }) {
  const isReady = team.status === "ready";

  return (
    <div
      className={cn(
        "w-full max-w-36 rounded-xl border bg-bg-card-alt/95 p-2.5 backdrop-blur-sm transition-shadow sm:max-w-40 sm:p-3",
        isReady
          ? "border-green/40 shadow-[0_0_12px_rgba(33,150,83,0.2)]"
          : "border-gold-muted/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]",
      )}
    >
      <div className="mb-2">
        <p className="truncate text-sm font-semibold text-white">{team.name}</p>
        <p className="text-[11px] text-text-muted-alt">
          {team.playersJoined}/{team.maxPlayers} Players
        </p>
      </div>

      <div className="mb-2 flex gap-1">
        {Array.from({ length: team.maxPlayers }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "flex size-5 items-center justify-center rounded-full border text-[10px] sm:size-6",
              i < team.playersJoined
                ? isReady
                  ? "border-green bg-green/20 text-green"
                  : "border-gold bg-gold/20 text-gold"
                : "border-gold-muted/30 bg-transparent",
            )}
          >
            {i < team.playersJoined && <Check className="size-3" />}
          </span>
        ))}
      </div>

      <Badge variant={isReady ? "ready" : "joining"} className="w-full justify-center text-[10px]">
        {isReady ? "✓ READY" : "● JOINING"}
      </Badge>
    </div>
  );
}

export default function TeamLobbyPage() {
  const navigate = useNavigate();
  const readyCount = lobbyTeams.filter((t) => t.status === "ready").length;
  const joiningCount = lobbyTeams.filter((t) => t.status === "joining").length;

  return (
    <AppShellPage
      className="relative bg-bg-secondary"
      header={
        <>
          <NavIconBar className="absolute right-4 top-4 z-50 sm:right-6 sm:top-4" />
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 md:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Spade className="size-8 shrink-0 text-white/10 sm:size-10" />
            <div className="min-w-0">
              <h1 className="truncate font-serif text-xl font-black text-gold-light sm:text-2xl md:text-3xl">
                THE CULTURE TABLE
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-green sm:text-xs">
                Tournament Lobby
              </p>
            </div>
          </div>

          <div className="rounded-pill border border-gold-muted px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
            GAME CODE: <span className="font-bold text-white">CP-7842</span>
          </div>

          <div className="w-full min-w-0 sm:w-auto sm:min-w-44">
            <p className="mb-1 text-xs text-white sm:text-sm">47 / 60 Players Joined</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-card sm:h-2">
              <div className="h-full w-[78%] rounded-full bg-gold" />
            </div>
          </div>
        </header>
        </>
      }
      footer={
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-bg-card px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:px-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold sm:size-10">
              ZL
            </div>
            <div>
              <p className="text-[10px] uppercase text-text-muted-alt">Game Host</p>
              <p className="text-sm font-semibold text-white">Zrutam LLP</p>
            </div>
          </div>

          <p className="flex items-center gap-2 text-xs text-text-muted-alt sm:text-sm">
            <span className="size-2 shrink-0 rounded-full bg-gold-bright" />
            Game starts automatically when all teams are locked in
          </p>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
            <Badge variant="joining">{joiningCount} teams still joining</Badge>
            <Button onClick={() => navigate("/instructions")} className="font-serif font-black">
              START GAME
            </Button>
          </div>
        </footer>
      }
    >
      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto p-4 sm:p-6 md:p-8 lg:justify-center lg:p-10">
        <div className="relative aspect-[2/1] w-full max-w-4xl min-h-0 flex-1 lg:max-h-full lg:flex-none">
          {/* Table */}
          <div className="absolute inset-[10%] rounded-[50%] table-rim shadow-[0_0_40px_rgba(212,175,55,0.15)]">
            <div className="absolute inset-[4%] rounded-[50%] felt-gradient" />
          </div>

          {/* Center status */}
          <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-border bg-bg-card/95 px-5 py-4 backdrop-blur-sm sm:px-8 sm:py-6">
            <div className="relative mb-2 size-14 sm:mb-3 sm:size-16">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2535" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="3"
                  strokeDasharray={`${(readyCount / lobbyTeams.length) * 100} 100`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gold">
                {readyCount}/{lobbyTeams.length}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted-alt">
              Waiting for all teams
            </p>
            <p className="text-sm font-semibold text-white sm:text-base">
              {readyCount} of {lobbyTeams.length} Teams Ready
            </p>
          </div>

          {/* Team cards — evenly distributed around the table on desktop */}
          <div className="absolute inset-0 hidden lg:block">
            {lobbyTeams.map((team, i) => (
              <div
                key={team.id}
                className="absolute"
                style={getEllipticalSeatStyle(i, lobbyTeams.length, {
                  radiusX: 44,
                  radiusY: 38,
                })}
              >
                <TeamLobbyCard team={team} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet team grid */}
        <div className="mt-4 grid w-full max-w-4xl shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:hidden">
          {lobbyTeams.map((team) => (
            <TeamLobbyCard key={team.id} team={team} />
          ))}
        </div>
      </main>
    </AppShellPage>
  );
}
