import {
  teams,
  roundSlots,
  leaderboard,
  TOTAL_ROUNDS,
  dashboardRoundOrder,
} from "@/data/game-data";
import { LiveBadge, RoundSlotBadge } from "@/components/common/badges";
import { PokerTableCanvas } from "@/components/game/poker-table-canvas";
import { LeaderboardSidebar } from "@/components/game/leaderboard-sidebar";
import { NavIconBar } from "@/components/layout/nav-icon-bar";

const orderedRoundSlots = dashboardRoundOrder.map(
  (id) => roundSlots.find((s) => s.id === id)!,
);

export default function DashboardPage() {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#07090c] lg:flex-row">
      <NavIconBar className="absolute right-4 top-4 z-50 sm:right-6 sm:top-4" />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-4 sm:gap-4 sm:p-5 lg:p-6">
        {/* Header */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-col gap-0.5">
            <h1 className="font-display text-xl font-extrabold text-white sm:text-2xl lg:text-3xl">
              THE CULTURE TABLE
            </h1>
            <p className="text-xs text-[#8f9cae] sm:text-sm">
              Gamified Team performance Tracker • Season Finale
            </p>
          </div>
          <LiveBadge />
        </div>

        {/* Round tracker */}
        <section className="flex shrink-0 flex-col gap-2 rounded-xl border border-[#1f2535] bg-[#11141d] p-3 sm:gap-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-display text-xs font-extrabold text-white sm:text-sm">
              ROUNDS COMPLETED: 0 / {TOTAL_ROUNDS}
            </p>
            <p className="text-[10px] text-[#8f9cae] sm:text-xs">Stage: Main Event Blinds</p>
          </div>
          <div className="-mx-1 overflow-x-auto px-1 pb-0.5">
            <div className="flex min-w-max gap-1.5 sm:gap-2">
              {orderedRoundSlots.map((slot) => (
                <RoundSlotBadge key={slot.id} label={slot.label} status={slot.status} />
              ))}
            </div>
          </div>
        </section>

        {/* Poker table — fills remaining viewport height */}
        <div className="relative min-h-0 flex-1">
          <PokerTableCanvas
            teams={teams}
            currentRound={0}
            totalRounds={TOTAL_ROUNDS}
          />
        </div>
      </main>

      <LeaderboardSidebar entries={leaderboard} />
    </div>
  );
}
