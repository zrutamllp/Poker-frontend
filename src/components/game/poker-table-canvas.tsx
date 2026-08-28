import type { Team } from "@/types/game";
import { getEllipticalSeatStyle } from "@/lib/seat-layout";
import { SeatBadge } from "./seat-badge";

interface PokerTableCanvasProps {
  teams: Team[];
  currentRound?: number;
  totalRounds?: number;
  /** Optional per-team coin deltas (team id → change) */
  teamDeltas?: Record<string, number>;
  centerStatus?: string;
  centerLabel?: string;
  centerSubLabel?: string;
  hideSeats?: boolean;
}

export function PokerTableCanvas({
  teams,
  currentRound = 0,
  totalRounds = 12,
  teamDeltas,
  centerStatus = "CURRENT MATCH",
  centerLabel,
  centerSubLabel,
  hideSeats = false,
}: PokerTableCanvasProps) {
  const visibleTeams = teams.slice(0, 13);

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-[#07090c] p-2 sm:p-3">
      {/* Table arena — wide ellipse, scales with available space */}
      <div className="relative aspect-[2/1] h-full max-h-full w-full max-w-full">
        {/* Glow */}
        <div className="absolute inset-0 rounded-[50%] bg-green/10 blur-3xl" />

        {/* Wood rim */}
        <div className="absolute inset-[2%] rounded-[50%] table-rim shadow-[0_8px_32px_rgba(0,0,0,0.5)]" />

        {/* Leather bumper */}
        <div className="absolute inset-[5%] rounded-[50%] border-4 border-[#2d1c14] bg-[#1a100a]" />

        {/* Felt */}
        <div className="absolute inset-[8%] rounded-[50%] felt-gradient shadow-inner" />

        {/* Accent ring */}
        <div className="absolute inset-[18%] rounded-[50%] border border-[#f2c94c]/20" />

        {/* Center hub */}
        <div className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-1/5 min-w-20 max-w-44 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-0.5 rounded-full border-2 border-[#f2c94c] bg-[rgba(9,14,23,0.92)] shadow-[0_8px_16px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:gap-1.5">
          <div className="pointer-events-none absolute inset-[4%] rounded-full border border-[#f2c94c]/30" />
          <div className="pointer-events-none absolute inset-[8%] rounded-full border border-[#219653]/20" />
          <p className="relative text-[8px] font-bold uppercase tracking-wider text-[#8f9cae] sm:text-[10px]">
            {centerStatus}
          </p>
          <p className="relative font-display text-lg font-black leading-none text-[#f2c94c] sm:text-xl md:text-2xl">
            {centerLabel ?? `RD ${currentRound}`}
          </p>
          <p className="relative text-[9px] text-white sm:text-[11px]">
            {centerSubLabel ?? `OF ${totalRounds} ROUNDS`}
          </p>
        </div>

        {/* Seat badges — evenly distributed around the table rim */}
        {!hideSeats &&
          visibleTeams.map((team, index) => (
          <SeatBadge
            key={team.id}
            team={team}
            delta={teamDeltas?.[team.id]}
            style={getEllipticalSeatStyle(index, visibleTeams.length)}
          />
          ))}
      </div>
    </div>
  );
}
