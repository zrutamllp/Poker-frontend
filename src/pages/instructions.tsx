import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleX,
  MessageSquare,
  Star,
  Coins,
  Spade,
  Diamond,
} from "lucide-react";
import {
  cultureCoinGames,
  type GameCardStatus,
} from "@/data/game-data";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { cn } from "@/lib/utils";

const gameIcons = {
  x: CircleX,
  message: MessageSquare,
  star: Star,
};

function GameCard({
  title,
  status,
  route,
  icon,
}: {
  title: string;
  status: GameCardStatus;
  route: string;
  icon: keyof typeof gameIcons;
}) {
  const navigate = useNavigate();
  const Icon = gameIcons[icon];

  return (
    <article className="flex flex-col gap-5 rounded-2xl border-[1.5px] border-gold-muted bg-[#0c1f16] p-6 shadow-lg sm:gap-5 sm:p-7">
      <div className="flex items-center justify-between">
        <span className="flex size-12 items-center justify-center rounded-3xl border border-gold-muted bg-gold/10">
          <Icon className="size-5 text-gold" />
        </span>
        <span className="rounded-md border border-gold-muted bg-gold/10 px-2.5 py-1 text-[11px] font-bold uppercase text-gold-light">
          {status === "completed" ? "COMPLETED" : "NOT STARTED"}
        </span>
      </div>
      <div>
        <h3 className="font-serif text-xl font-black text-[#f3f4f6] sm:text-[22px]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Earn <span className="font-bold text-white">1000 culture coins</span> by
          completing this game.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate(route)}
        className="w-full rounded-lg border border-green bg-green/10 px-3 py-2 text-left text-[13px] font-bold uppercase text-green transition-colors hover:bg-green/20"
      >
        START GAME
      </button>
    </article>
  );
}

export default function InstructionsPage() {
  const navigate = useNavigate();
  const topRow = cultureCoinGames.slice(0, 3);
  const bottomRow = cultureCoinGames.slice(3);

  return (
    <ScrollPage className="relative bg-[radial-gradient(ellipse_at_center,#0b2d1e_0%,#05130a_100%)]">
      <Spade className="pointer-events-none absolute left-8 top-16 size-32 text-white/[0.03] sm:size-40" />
      <Diamond className="pointer-events-none absolute bottom-24 right-8 size-32 text-white/[0.03] sm:size-40" />
      <NavIconBar className="absolute right-4 top-4 z-10 sm:right-6 sm:top-4" />

      <PageContainer maxWidth="max-w-6xl" className="relative py-10 sm:py-14">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-12">
          <div className="flex items-center gap-4">
            <Spade className="size-6 text-gold-light" />
            <span className="text-sm font-extrabold uppercase tracking-wide text-gold-light">
              The culture table
            </span>
            <Diamond className="size-6 text-gold-light" />
          </div>
          <h1 className="font-serif text-4xl font-black text-gold-light sm:text-[44px]">
            WIN CULTURE COINS
          </h1>
          <p className="max-w-2xl text-base text-text-muted">
            Your chance to win extra culture coins. Complete as many games as possible in
            15 minutes. Each completed game gets you coins.
          </p>
        </header>

        {/* Game cards grid */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {topRow.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {bottomRow.map((game) => (
              <GameCard key={game.id} {...game} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-6 border-t border-border pt-8 sm:mt-14">
          <div className="flex items-center gap-2.5 rounded-full border-[1.5px] border-gold bg-bg-card/95 px-5 py-3">
            <Coins className="size-5 text-gold" />
            <p className="text-[15px] font-bold text-gold-light">
              Starting Balance:{" "}
              <span className="font-black text-white">1000</span> Culture Coins
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/prediction")}
              className={cn(
                "flex items-center gap-3 rounded-full border border-white bg-gold px-12 py-4",
                "font-serif text-lg font-black text-text-dark shadow-[0_8px_12px_rgba(212,175,55,0.25)]",
                "transition-opacity hover:opacity-90",
              )}
            >
              ENTER THE GAME
              <ArrowRight className="size-4" />
            </button>
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <span className="size-2 rounded-full bg-gold" />
              Round 1 begins in 00:15
            </p>
          </div>
        </footer>
      </PageContainer>
    </ScrollPage>
  );
}
