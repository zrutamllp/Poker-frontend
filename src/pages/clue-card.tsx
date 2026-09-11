import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { GameTopBar } from "@/components/layout/game-top-bar";
import { GameShell } from "@/components/layout/game-shell";
import { Button } from "@/components/ui/button";
import { TOTAL_ROUNDS } from "@/data/game-data";

export default function ClueCardPage() {
  const navigate = useNavigate();

  return (
    <GameShell
      topBar={
        <GameTopBar
          round={3}
          totalRounds={TOTAL_ROUNDS}
          teamName="The Aces"
          cultureCoins={45}
          timerLabel="CLUE"
          timer="00:30"
        />
      }
    >
      <div className="flex min-h-full flex-col items-center justify-center gap-5 p-4 sm:gap-6 sm:p-6 md:gap-8">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-muted">
          Your Private Clue
        </p>

        <div className="relative w-full max-w-md">
          <div className="game-clue-reveal game-animate rounded-2xl border-2 border-gold bg-gradient-to-br from-[#f7f5f0] to-[#e8e4dc] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <span className="rounded-pill bg-gold/20 px-3 py-1 text-xs font-bold text-gold-muted">
                CLUE CARD
              </span>
              <Eye className="size-5 text-gold-muted" />
            </div>
            <p className="font-serif text-lg font-bold leading-relaxed text-text-dark sm:text-xl md:text-2xl">
              &ldquo;Mentioned in the CEO keynote during the Q2 all-hands&rdquo;
            </p>
            <div className="mt-8 border-t border-gold-muted/30 pt-4">
              <p className="text-xs text-text-muted">
                Share this clue with your team during the discussion phase
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/round")}
          size="xl"
          className="font-serif font-black"
        >
          <ArrowRight className="size-5" />
          REVEAL TO TEAM
        </Button>
      </div>
    </GameShell>
  );
}
