import { useNavigate } from "react-router-dom";
import { Crown, Spade, Diamond } from "lucide-react";
import { ViewportFitPage } from "@/components/layout/page-layouts";
import { GameConfetti } from "@/components/layout/game-ui";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { TOTAL_ROUNDS } from "@/data/game-data";

export default function GameEndPage() {
  const navigate = useNavigate();

  return (
    <ViewportFitPage className="relative overflow-hidden bg-bg-primary">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(21,66,40,0.12)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
      <Spade className="pointer-events-none absolute left-6 top-24 size-20 text-white/[0.03] sm:left-12 sm:size-28" />
      <Diamond className="pointer-events-none absolute bottom-24 right-6 size-20 text-white/[0.03] sm:right-12 sm:size-28" />

      <GameConfetti />

      <div className="relative flex w-full max-w-4xl flex-col items-center justify-between gap-6 py-6 sm:gap-8 sm:py-8">
        {/* Top branding + nav */}
        <div className="game-stagger-in game-animate flex w-full flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-extrabold text-white sm:text-2xl">
              THE CULTURE TABLE
            </p>
            <p className="text-xs text-[#8f9cae]">GAMIFIED PERFORMANCE TRACKER</p>
          </div>
          <NavIconBar />
        </div>

        {/* Celebration center */}
        <div className="game-stagger-in game-animate flex flex-col items-center gap-6 text-center sm:gap-8" style={{ animationDelay: "80ms" }}>
          <div className="game-coin-pulse game-animate flex aspect-[8/5] w-32 items-center justify-center rounded-full border-2 border-gold bg-[rgba(17,21,32,0.92)] p-6 shadow-[0_0_32px_rgba(212,175,55,0.25)] sm:w-40">
            <Crown className="size-14 text-gold sm:size-16" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-4xl font-black leading-tight text-gold sm:text-5xl lg:text-6xl xl:text-7xl">
              ALL ROUNDS COMPLETED!
            </h1>
            <p className="mt-3 text-base font-semibold uppercase tracking-wide text-[#8f9cae] sm:text-lg">
              The Culture Table • Season Finale
            </p>
          </div>
          <hr className="w-72 border-border sm:w-80" />
          <span className="rounded-full border-[1.5px] border-gold/50 bg-bg-card px-6 py-2.5 text-base font-bold text-white sm:text-lg">
            {TOTAL_ROUNDS} / {TOTAL_ROUNDS} ROUNDS
          </span>
          <p className="max-w-xl text-base leading-relaxed text-white sm:text-lg">
            What an incredible tournament! All teams have given their best and battled
            fiercely for every single culture coin. The final standings will be revealed
            shortly...
          </p>
        </div>

        {/* Bottom actions */}
        <div className="game-stagger-in game-animate flex flex-col items-center gap-4" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center gap-2">
            <span className="game-live-dot size-2 rounded-full bg-gold" />
            <p className="text-sm font-semibold uppercase text-gold">
              Preparing final results...
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/scores")}
            className="game-btn text-[13px] font-semibold uppercase text-gold underline underline-offset-2 hover:text-gold-light"
          >
            View Final Scores
          </button>
          <button
            type="button"
            onClick={() => navigate("/join")}
            className="text-[13px] font-semibold uppercase text-[#8f9cae] underline underline-offset-2 hover:text-white"
          >
            Close Game
          </button>
        </div>
      </div>
    </ViewportFitPage>
  );
}
