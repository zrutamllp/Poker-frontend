import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameTopBar } from "@/components/layout/game-top-bar";
import { GameShell } from "@/components/layout/game-shell";
import { Button } from "@/components/ui/button";
import { bettingOptions, playerClues, TOTAL_ROUNDS } from "@/data/game-data";
import { cn } from "@/lib/utils";

function BettingCard({
  option,
  onSelect,
  selected,
}: {
  option: (typeof bettingOptions)[0];
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full max-w-xs flex-col gap-2 rounded-xl border-[1.5px] border-gold bg-bg-felt-light p-3 text-left shadow-md transition-all hover:scale-[1.02] hover:shadow-lg sm:max-w-sm sm:gap-3 sm:p-4",
        selected && "ring-2 ring-gold-bright",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex size-7 items-center justify-center rounded-full bg-gold font-serif text-base font-black text-text-dark">
          {option.label}
        </span>
        <span className="text-[11px] font-bold text-gold">BET AREA</span>
      </div>
      <p className="min-h-9 text-sm font-semibold text-white sm:min-h-11 sm:text-base">
        {option.text}
      </p>
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gold-muted bg-black/30 p-2">
        {option.bet ? (
          <span className="flex items-center gap-1.5 rounded-pill bg-gold px-2.5 py-1 text-xs font-bold text-text-dark">
            <span className="size-3 rounded-full bg-text-dark/20" />
            {option.bet} Coins
          </span>
        ) : (
          <span className="text-xs text-text-subtle">Place your bet</span>
        )}
      </div>
    </button>
  );
}

function PlayerClueCard({ player }: { player: (typeof playerClues)[0] }) {
  return (
    <div className="flex w-full max-w-xs min-h-40 flex-col justify-between rounded-lg border-2 border-gold bg-gradient-to-b from-[#1a1512] to-[#0d0c0e] p-3 shadow-[0_0_12px_rgba(212,175,55,0.19)] sm:max-w-sm sm:min-h-44 sm:p-3.5">
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ backgroundColor: player.color }}
        >
          {player.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#ffebcc]">{player.name}</p>
          <p className="text-[10px] font-semibold text-gold-muted">CLUE CARD</p>
        </div>
      </div>
      <div className="mt-2 rounded-md border border-black/10 bg-black/5 p-2 sm:mt-3 sm:p-2.5">
        <p className="text-xs font-medium uppercase text-text-subtle">Revealed Clue</p>
        <p className="mt-1 font-serif text-[13px] font-semibold italic text-text-dark/90">
          &ldquo;{player.clue}&rdquo;
        </p>
      </div>
    </div>
  );
}

export default function RoundGameplayPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("A");

  return (
    <GameShell
      topBar={
        <GameTopBar
          round={3}
          totalRounds={TOTAL_ROUNDS}
          teamName="The Aces"
          cultureCoins={45}
        />
      }
      footer={
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-border bg-bg-tertiary px-4 py-4 sm:px-8 md:px-10">
          <p className="flex items-center gap-2 text-sm text-text-subtle">
            <span className="size-2.5 rounded-full bg-gold-bright" />
            Discuss strategy. Your clues pinpoint the winning option!
          </p>

          <Button onClick={() => navigate("/betting")} className="font-serif font-black">
            <span className="flex size-[22px] items-center justify-center rounded-[11px] border border-white bg-text-dark font-serif text-[11px] font-black text-gold">
              $
            </span>
            PLACE BET
          </Button>
        </footer>
      }
    >
      <div className="flex flex-col items-center gap-5 px-3 py-5 sm:gap-6 sm:px-4 sm:py-6 md:gap-8 md:px-10 md:py-8">
        {/* Poker table arena */}
        <div className="relative w-full max-w-6xl">
          <div className="mx-auto aspect-[5/2] w-full rounded-[50%] border-4 border-gold bg-[#1e120d] p-2 shadow-[0_12px_12px_rgba(0,0,0,0.5)] sm:p-3">
            <div className="flex h-full flex-col items-center justify-between rounded-[50%] border-8 border-[#2d1c14] bg-bg-felt p-3 sm:border-[12px] sm:p-4 md:p-6">
              {/* Top betting row */}
              <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-6 md:gap-[120px]">
                {bettingOptions.slice(0, 2).map((opt) => (
                  <BettingCard
                    key={opt.id}
                    option={opt}
                    selected={selectedOption === opt.id}
                    onSelect={() => setSelectedOption(opt.id)}
                  />
                ))}
              </div>

              {/* Question card */}
              <div className="relative mx-auto w-full max-w-md rounded-xl border-[3px] border-gold bg-[#f7f5f0] p-3 shadow-[inset_0_0_4px_#d4af37] sm:p-4 md:p-5">
                <p className="text-center font-serif text-[10px] font-bold text-gold-muted sm:text-xs">
                  COMMUNITY QUESTION
                </p>
                <p className="mt-1 text-center font-serif text-sm font-bold leading-snug text-text-dark sm:mt-2 sm:text-base">
                  Which company value was introduced in our Q2 all-hands meeting?
                </p>
              </div>

              {/* Bottom betting row */}
              <div className="flex w-full flex-wrap justify-center gap-3 sm:gap-6 md:gap-[120px]">
                {bettingOptions.slice(2, 4).map((opt) => (
                  <BettingCard
                    key={opt.id}
                    option={opt}
                    selected={selectedOption === opt.id}
                    onSelect={() => setSelectedOption(opt.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Player clues */}
        <section className="w-full">
          <h2 className="mb-3 text-center font-serif text-sm font-bold text-gold sm:mb-4">
            YOUR TEAM&apos;S REVEALED HANDS
          </h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
            {playerClues.map((player) => (
              <PlayerClueCard key={player.id} player={player} />
            ))}
          </div>
        </section>
      </div>
    </GameShell>
  );
}
