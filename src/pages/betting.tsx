import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Minus, Plus, Sparkles, Star } from "lucide-react";
import { BettingTopBar } from "@/components/layout/betting-top-bar";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { bettingOptions, lobbyTeams, TOTAL_ROUNDS } from "@/data/game-data";
import { cn } from "@/lib/utils";

const initialBets: Record<string, number> = {
  A: 15,
  B: 5,
  C: 20,
  D: 5,
};

function CoinStack() {
  return (
    <div className="relative size-9">
      {[18, 15.5, 13].map((top) => (
        <div
          key={top}
          className="absolute left-0.5 h-3 w-7 rounded-[14px] border border-[#d49e29] bg-gold-light shadow-sm"
          style={{ top }}
        />
      ))}
    </div>
  );
}

function BetOptionRow({
  label,
  text,
  amount,
  onDecrease,
  onIncrease,
}: {
  label: string;
  text: string;
  amount: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-gold-light bg-[#0f2116] p-4 shadow-[0_0_4px_rgba(245,196,83,0.2)] sm:p-[18px]">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[18px] border-2 border-[#d49e29] bg-gold-light font-display text-lg font-extrabold text-[#0b1d14]">
          {label}
        </span>
        <p className="truncate text-base font-medium text-white">{text}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <CoinStack />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDecrease}
            className="flex size-8 items-center justify-center rounded-lg border border-[#23412b] bg-[#061a0e] text-white hover:bg-[#0f2116]"
            aria-label={`Decrease bet on ${label}`}
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-8 text-center text-lg font-bold text-white">{amount}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="flex size-8 items-center justify-center rounded-lg border border-[#23412b] bg-[#061a0e] text-white hover:bg-[#0f2116]"
            aria-label={`Increase bet on ${label}`}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BettingPage() {
  const navigate = useNavigate();
  const [bets, setBets] = useState(initialBets);
  const [sideTeam, setSideTeam] = useState("Royal Flush");
  const [sideOption, setSideOption] = useState("C");

  const totalPlaced = Object.values(bets).reduce((a, b) => a + b, 0);
  const maxCoins = 45;

  function adjustBet(id: string, delta: number) {
    setBets((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  }

  function resetAll() {
    setBets({ A: 0, B: 0, C: 0, D: 0 });
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden border-[16px] border-[#1c0d07] bg-[#0a291a]">
      <NavIconBar className="absolute right-4 top-4 z-50 sm:right-6" />
      <BettingTopBar
        round={3}
        totalRounds={TOTAL_ROUNDS}
        teamName="The Aces"
        cultureCoins={maxCoins}
        timer="01:45"
      />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 xl:flex-row xl:gap-12">
          {/* Left — main bets */}
          <section className="min-w-0 flex-1">
            <div className="mb-6">
              <div className="mb-1.5 flex items-center gap-3">
                <span className="flex size-5 items-center justify-center rounded-[10px] border-[1.5px] border-[#d49e29] bg-gold-light font-serif text-[10px] font-black text-text-dark">
                  $
                </span>
                <h2 className="font-display text-xl font-extrabold text-gold-light sm:text-[22px]">
                  PLACE YOUR BETS
                </h2>
              </div>
              <p className="text-sm text-[#a3bca9]">
                Distribute your Culture Coins across the options
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-[#23412b] bg-[#061a0e] p-5">
              <p className="text-xs font-bold text-green-muted">ACTIVE QUESTION</p>
              <p className="mt-2 text-base font-medium leading-relaxed text-white">
                Which company value was introduced in our Q2 all-hands meeting?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {bettingOptions.map((opt) => (
                <BetOptionRow
                  key={opt.id}
                  label={opt.label}
                  text={opt.text}
                  amount={bets[opt.id] ?? 0}
                  onDecrease={() => adjustBet(opt.id, -5)}
                  onIncrease={() => adjustBet(opt.id, 5)}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#a3bca9]">Culture Coins Placed</span>
                <span className="font-bold text-gold-light">
                  {totalPlaced} / {maxCoins} Coins
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#061a0e]">
                <div
                  className="h-full rounded-full bg-gold-light transition-all"
                  style={{ width: `${Math.min(100, (totalPlaced / maxCoins) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#668870]">
                {totalPlaced === maxCoins
                  ? "All available coins have been successfully placed for this round."
                  : `Place ${maxCoins - totalPlaced} more coins to complete your bets.`}
              </p>
            </div>
          </section>

          {/* Right — side bets */}
          <section className="w-full shrink-0 xl:w-[380px]">
            <div className="mb-6">
              <div className="mb-1.5 flex items-center gap-3">
                <Star className="size-5 text-gold-light" />
                <h2 className="font-display text-xl font-extrabold text-gold-light sm:text-[22px]">
                  SIDE BETS
                </h2>
              </div>
              <p className="text-sm text-[#a3bca9]">
                Optional side-pots for huge final multipliers.
              </p>
            </div>

            <div className="rounded-xl border-[1.5px] border-gold bg-[#061a0e] p-5">
              <div className="mb-4 flex justify-end">
                <span className="rounded-full border border-gold-muted bg-gold/10 px-2.5 py-1 text-[11px] font-bold text-gold">
                  2x MULTIPLIER
                </span>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-white">
                Which team will place the MOST coins on the correct answer this round?
              </p>

              <label className="mb-2 block text-[11px] font-bold uppercase text-green-muted">
                Target Team
              </label>
              <div className="mb-5 flex items-center justify-between rounded-lg border border-[#23412b] bg-[#0f2116] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-md bg-gold font-serif text-[10px] font-black text-text-dark">
                    $
                  </span>
                  <span className="font-medium text-white">{sideTeam}</span>
                </div>
                <select
                  value={sideTeam}
                  onChange={(e) => setSideTeam(e.target.value)}
                  className="sr-only"
                  aria-label="Select target team"
                />
                <button
                  type="button"
                  onClick={() => {
                    const teams = lobbyTeams.map((t) => t.name);
                    const idx = teams.indexOf(sideTeam);
                    setSideTeam(teams[(idx + 1) % teams.length]);
                  }}
                  className="text-gold"
                  aria-label="Cycle target team"
                >
                  <ChevronDown className="size-5" />
                </button>
              </div>

              <p className="mb-2 text-[11px] font-bold uppercase text-green-muted">
                Predicted Option
              </p>
              <div className="mb-4 flex gap-2">
                {["A", "B", "C", "D"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSideOption(opt)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full border-2 font-display text-sm font-extrabold transition-colors",
                      sideOption === opt
                        ? "border-gold bg-gold text-text-dark"
                        : "border-[#23412b] bg-[#0f2116] text-[#a3bca9] hover:border-gold-muted",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <p className="flex items-center gap-2 text-xs text-gold">
                <Sparkles className="size-3.5" />
                Correct guess = 2x coin bonus!
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="shrink-0 border-t-4 border-[#1c0d07] bg-[#061a0e] px-4 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <p className="flex items-center gap-2 text-sm text-gold-light">
            <span className="flex size-5 items-center justify-center rounded-md bg-gold font-serif text-[10px] font-black text-text-dark">
              $
            </span>
            <span>
              Bets Locked In: Answer Bet: {totalPlaced} coins | Team Side Bet: {sideTeam} on{" "}
              {sideOption}
            </span>
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={resetAll}
              className="text-sm font-medium text-[#a3bca9] hover:text-white"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={() => navigate("/round")}
              className="flex items-center gap-2 rounded-xl bg-gold-light px-6 py-3 font-display text-base font-extrabold text-[#0b1d14] shadow-[0_0_12px_rgba(245,196,83,0.3)] transition-opacity hover:opacity-90"
            >
              <span className="flex size-5 items-center justify-center rounded-full border border-[#0b1d14]/20 bg-[#0b1d14]/10 font-serif text-[10px]">
                $
              </span>
              CONFIRM BETS
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
