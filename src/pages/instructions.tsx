import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowRight,
  CircleX,
  MessageSquare,
  Star,
  Spade,
  Diamond,
} from "lucide-react";
import { DifficultySelector } from "@/components/minigames/difficulty-badge";
import {
  cultureCoinGames,
  type GameCardStatus,
} from "@/data/game-data";
import { useMinigameDifficulty } from "@/hooks/use-minigame-difficulty";
import { useMinigameLobbyStatus } from "@/hooks/use-minigame-lobby-status";
import { GameCoin } from "@/components/layout/game-ui";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { cn } from "@/lib/utils";

const gameIcons = {
  x: CircleX,
  message: MessageSquare,
  star: Star,
};

const bentoSpans: Record<number, string> = {
  1: "sm:col-span-2 lg:col-span-2",
  2: "lg:col-span-1",
  3: "lg:col-span-1",
  4: "sm:col-span-2 lg:col-span-2",
  5: "sm:col-span-2 lg:col-span-2",
  6: "sm:col-span-2 lg:col-span-2",
  7: "sm:col-span-2 lg:col-span-2",
};

function GameCardItem({
  title,
  status,
  route,
  icon,
  wide = false,
}: {
  title: string;
  status: GameCardStatus;
  route: string;
  icon: keyof typeof gameIcons;
  wide?: boolean;
}) {
  const navigate = useNavigate();
  const Icon = gameIcons[icon];

  return (
    <article
      className={cn(
        "game-card flex h-full flex-col gap-5 rounded-2xl border-[1.5px] border-gold-muted bg-[#0c1f16] p-6 shadow-lg sm:gap-5 sm:p-7",
        wide && "sm:gap-4",
      )}
    >
      {wide ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-3xl border border-gold-muted bg-gold/10">
                <Icon className="size-5 text-gold" />
              </span>
              <div>
                <h3 className="font-serif text-xl font-black text-[#f3f4f6] sm:text-[22px]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  Earn <span className="font-bold text-white">1000 culture coins</span> by
                  completing this game.
                </p>
              </div>
            </div>
            <span className="shrink-0 self-start rounded-md border border-gold-muted bg-gold/10 px-2.5 py-1 text-[11px] font-bold uppercase text-gold-light">
              {status === "completed" ? "COMPLETED" : "NOT STARTED"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate(route)}
            className="game-btn mt-auto w-full rounded-lg border border-green bg-green/10 px-3 py-2 text-left text-[13px] font-bold uppercase text-green hover:bg-green/20 sm:max-w-xs"
          >
            START GAME
          </button>
        </>
      ) : (
        <>
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
            className="game-btn mt-auto w-full rounded-lg border border-green bg-green/10 px-3 py-2 text-left text-[13px] font-bold uppercase text-green hover:bg-green/20"
          >
            START GAME
          </button>
        </>
      )}
    </article>
  );
}

export default function InstructionsPage() {
  const navigate = useNavigate();
  const { difficulty, setDifficulty } = useMinigameDifficulty();
  const { statusForRoute, refresh } = useMinigameLobbyStatus();

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  return (
    <ScrollPage className="relative bg-[radial-gradient(ellipse_at_center,#0b2d1e_0%,#05130a_100%)]">
      <Spade className="pointer-events-none absolute left-8 top-16 size-32 text-white/[0.03] sm:size-40" />
      <Diamond className="pointer-events-none absolute bottom-24 right-8 size-32 text-white/[0.03] sm:size-40" />
      <NavIconBar className="absolute right-4 top-4 z-10 sm:right-6 sm:top-4" />

      <PageContainer maxWidth="max-w-6xl" className="relative py-10 sm:py-14">
        <header className="game-stagger-in game-animate mb-10 flex flex-col items-center gap-3 text-center sm:mb-12">
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

        <div className="game-stagger-in game-animate mb-10 sm:mb-12" style={{ animationDelay: "60ms" }}>
          <DifficultySelector difficulty={difficulty} onChange={setDifficulty} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5">
          {cultureCoinGames.map((game, i) => {
            const span = bentoSpans[game.id] ?? "";
            const wide = span.includes("col-span-2");
            return (
              <div
                key={game.id}
                className={cn(span, "game-stagger-in game-animate min-h-[200px]")}
                style={{ animationDelay: `${Math.min(i * 55, 400)}ms` }}
              >
                <GameCardItem
                  {...game}
                  status={statusForRoute(game.route)}
                  wide={wide}
                />
              </div>
            );
          })}
        </div>

        <footer className="game-stagger-in game-animate mt-12 flex flex-col items-center gap-6 border-t border-border pt-8 sm:mt-14" style={{ animationDelay: "120ms" }}>
          <GameCoin
            value={
              <>
                Starting Balance: <span className="font-black text-white">1000</span> Culture Coins
              </>
            }
            pulse
            className="border-[1.5px] border-gold bg-bg-card/95 px-5 py-3 text-[15px]"
          />
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/prediction")}
              className={cn(
                "game-btn flex items-center gap-3 rounded-full border border-white bg-gold px-12 py-4",
                "font-serif text-lg font-black text-text-dark shadow-[0_8px_12px_rgba(212,175,55,0.25)]",
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
