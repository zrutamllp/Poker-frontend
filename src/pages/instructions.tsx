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
import {
  cultureCoinGames,
  type GameCardStatus,
} from "@/data/game-data";
import { useMinigameGlobalTimer } from "@/hooks/use-minigame-global-timer";
import { useMinigameLobbyStatus } from "@/hooks/use-minigame-lobby-status";
import { formatSessionTime } from "@/lib/minigame-session-timer";
import { GameCoin } from "@/components/layout/game-ui";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { cn } from "@/lib/utils";

const gameIcons = {
  x: CircleX,
  message: MessageSquare,
  star: Star,
};

/** Bento placement for the 4 active culture-coin games */
const bentoLayout: Record<number, string> = {
  1: "sm:col-span-2 lg:col-span-3 lg:row-span-2",
  2: "lg:col-span-3 lg:row-span-2",
  3: "sm:col-span-1 lg:col-span-3",
  4: "sm:col-span-1 lg:col-span-3",
};

const bentoAccent: Record<number, string> = {
  1: "from-[#d4af37]/20 via-transparent to-transparent",
  2: "from-[#8b5cf6]/15 via-transparent to-transparent",
  3: "from-[#06b6d4]/15 via-transparent to-transparent",
  4: "from-[#f59e0b]/12 via-transparent to-transparent",
};

function GameCardItem({
  title,
  status,
  route,
  icon,
  gameId,
  featured = false,
}: {
  title: string;
  status: GameCardStatus;
  route: string;
  icon: keyof typeof gameIcons;
  gameId: number;
  featured?: boolean;
}) {
  const navigate = useNavigate();
  const Icon = gameIcons[icon];

  return (
    <article
      className={cn(
        "game-card group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gold-muted/80 bg-[#0c1f16]/95 p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.24)] backdrop-blur-sm sm:p-4",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity group-hover:opacity-100",
          bentoAccent[gameId] ?? "from-gold/10 via-transparent to-transparent",
        )}
      />
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gold/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-gold-muted/70 bg-gold/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <Icon className="size-4 text-gold" />
        </span>
        <span className="rounded-full border border-gold-muted/60 bg-black/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold-light">
          {status === "completed" ? "Completed" : "Not started"}
        </span>
      </div>

      <div className="relative mt-2.5 flex flex-1 flex-col">
        <h3
          className={cn(
            "font-serif font-black leading-tight text-[#f3f4f6]",
            featured ? "text-lg sm:text-xl" : "text-base sm:text-lg",
          )}
        >
          {title}
        </h3>
        <p className="mt-1 max-w-sm text-xs leading-snug text-text-muted">
          Earn <span className="font-bold text-white">1000 culture coins</span> by completing
          this game.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate(route)}
        className={cn(
          "game-btn relative mt-3 w-full rounded-lg border border-green/60 bg-green/10 px-3 py-1.5 text-left text-[11px] font-bold uppercase tracking-wide text-green transition-colors hover:bg-green/20",
          featured ? "sm:max-w-[10rem]" : "",
        )}
      >
        Start game
      </button>
    </article>
  );
}

export default function InstructionsPage() {
  const navigate = useNavigate();
  const { statusForRoute, refresh } = useMinigameLobbyStatus();
  const { timeLeft, started, expired } = useMinigameGlobalTimer();

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

      <PageContainer maxWidth="max-w-4xl" className="relative py-8 sm:py-10">
        <header className="game-stagger-in game-animate mb-7 flex flex-col items-center gap-2 text-center sm:mb-8">
          <div className="flex items-center gap-3">
            <Spade className="size-5 text-gold-light" />
            <span className="text-xs font-extrabold uppercase tracking-wide text-gold-light">
              The culture table
            </span>
            <Diamond className="size-5 text-gold-light" />
          </div>
          <h1 className="font-serif text-3xl font-black text-gold-light sm:text-4xl">
            WIN CULTURE COINS
          </h1>
          <p className="max-w-xl text-sm text-text-muted">
            Your chance to win extra culture coins. Complete as many games as possible in
            15 minutes. Each completed game gets you coins.
          </p>
          {started && (
            <p
              className={cn(
                "font-mono text-sm font-bold tabular-nums",
                expired ? "text-gold-light" : timeLeft <= 60 ? "animate-pulse text-gold-light" : "text-green",
              )}
            >
              Session time left: {expired ? "00:00" : formatSessionTime(timeLeft)}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[220px] lg:gap-3.5">
          {cultureCoinGames.map((game, i) => (
            <div
              key={game.id}
              className={cn(
                bentoLayout[game.id] ?? "",
                "game-stagger-in game-animate min-h-[220px] lg:min-h-0",
              )}
              style={{ animationDelay: `${Math.min(i * 55, 400)}ms` }}
            >
              <GameCardItem
                {...game}
                gameId={game.id}
                status={statusForRoute(game.route)}
                featured={game.id === 1}
              />
            </div>
          ))}
        </div>

        <footer className="game-stagger-in game-animate mt-8 flex flex-col items-center gap-5 border-t border-border pt-6 sm:mt-10" style={{ animationDelay: "120ms" }}>
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
