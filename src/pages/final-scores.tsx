import { useEffect, useMemo, useRef } from "react";
import { Award, Trophy, Medal, Coins, Share2 } from "lucide-react";
import { teams, TOTAL_ROUNDS } from "@/data/game-data";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { StaggerIn } from "@/components/layout/game-ui";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { cn } from "@/lib/utils";

const avatarColors = [
  "#ef4444",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

function teamInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function teamColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return avatarColors[hash % avatarColors.length];
}

function TeamAvatar({
  name,
  size = "md",
  gold = false,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  gold?: boolean;
}) {
  const sizeClass =
    size === "lg" ? "size-16 sm:size-20" : size === "sm" ? "size-8" : "size-14 sm:size-16";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 font-bold text-white",
        sizeClass,
        gold ? "border-gold" : "border-white/10",
      )}
      style={{ backgroundColor: teamColor(name) }}
    >
      <span className={size === "sm" ? "text-[10px]" : size === "lg" ? "text-xl" : "text-sm"}>
        {teamInitials(name)}
      </span>
    </div>
  );
}

const confettiColors = ["bg-gold", "bg-green", "bg-[#06b6d4]", "bg-[#f59e0b]", "bg-white/70", "bg-[#ec4899]"];
const confettiSizes = ["h-2 w-1", "h-3 w-1.5", "h-4 w-2", "h-4 w-2.5 sm:h-5 sm:w-2.5"];

const PIECES_PER_SIDE = 100;

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

interface ConfettiPiece {
  color: string;
  sizeClass: string;
  driftX: number;
  swayX: number;
  fallY: number;
  rot: number;
  delay: number;
  duration: number;
  spawnTop: string;
  spawnSide: string;
}

/** Rain-style confetti: spawn along the top of each half, fall straight down with light drift. */
function buildSidePieces(side: "left" | "right", count: number): ConfettiPiece[] {
  const sideSeed = side === "left" ? 0 : 5000;

  return Array.from({ length: count }, (_, i) => {
    const seed = i + sideSeed;
    const spawnAlongTop = pseudoRandom(seed * 19) * 50;
    const spawnAbove = -6 + pseudoRandom(seed * 23) * 10;
    const driftDirection = side === "left" ? 1 : -1;
    const driftX = driftDirection * (2 + pseudoRandom(seed * 3) * 14);
    const swayX = (pseudoRandom(seed * 29) - 0.5) * 8;
    const fallY = 95 + pseudoRandom(seed * 31) * 20;

    return {
      color: confettiColors[Math.floor(pseudoRandom(seed * 7) * confettiColors.length)]!,
      sizeClass: confettiSizes[Math.floor(pseudoRandom(seed * 5) * confettiSizes.length)]!,
      driftX,
      swayX,
      fallY,
      rot: Math.round((pseudoRandom(seed * 11) - 0.5) * 900),
      delay: pseudoRandom(seed * 13) * 4,
      duration: 2.8 + pseudoRandom(seed * 17) * 2.2,
      spawnTop: `${spawnAbove}vh`,
      spawnSide: `${spawnAlongTop}vw`,
    };
  });
}

function ConfettiPiece({
  side,
  piece,
}: {
  side: "left" | "right";
  piece: ConfettiPiece;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const { driftX, swayX, fallY, rot } = piece;
    const anim = el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 0 },
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1, offset: 0.06 },
        {
          transform: `translate(${driftX * 0.35 + swayX}vw, ${fallY * 0.55}vh) rotate(${rot * 0.45}deg)`,
          opacity: 1,
          offset: 0.55,
        },
        {
          transform: `translate(${driftX + swayX * 0.4}vw, ${fallY}vh) rotate(${rot}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: piece.duration * 1000,
        delay: piece.delay * 1000,
        fill: "forwards",
        easing: "cubic-bezier(0.45, 0, 0.85, 0.6)",
      },
    );

    return () => anim.cancel();
  }, [piece]);

  return (
    <span
      ref={ref}
      className={cn("absolute rounded-sm opacity-0", piece.sizeClass, piece.color)}
      style={
        side === "left"
          ? { top: piece.spawnTop, left: piece.spawnSide }
          : { top: piece.spawnTop, right: piece.spawnSide }
      }
    />
  );
}

function ScoresConfetti() {
  const leftPieces = useMemo(() => buildSidePieces("left", PIECES_PER_SIDE), []);
  const rightPieces = useMemo(() => buildSidePieces("right", PIECES_PER_SIDE), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {leftPieces.map((p, i) => (
        <ConfettiPiece key={`l-${i}`} side="left" piece={p} />
      ))}
      {rightPieces.map((p, i) => (
        <ConfettiPiece key={`r-${i}`} side="right" piece={p} />
      ))}
    </div>
  );
}

const podiumTheme = {
  1: {
    label: "CHAMPION",
    medal: "🥇",
    pedestal: "h-28 sm:h-36",
    cardMinH: "min-h-[200px] sm:min-h-[220px]",
    accent: "from-[#ffd700]/90 via-[#d4af37]/70 to-[#8b6914]/40",
    border: "border-gold/80",
    glow: "shadow-[0_0_40px_rgba(255,215,0,0.35),0_16px_32px_rgba(0,0,0,0.4)]",
    badge: "border-gold/60 bg-gold/15 text-gold",
    rankColor: "text-gold/20",
    iconClass: "size-11 text-gold sm:size-12",
  },
  2: {
    label: "2ND PLACE",
    medal: "🥈",
    pedestal: "h-20 sm:h-24",
    cardMinH: "min-h-[170px] sm:min-h-[190px]",
    accent: "from-[#e2e8f0]/80 via-[#94a3b8]/50 to-[#475569]/30",
    border: "border-white/25",
    glow: "shadow-[0_12px_24px_rgba(0,0,0,0.35)]",
    badge: "border-white/20 bg-white/10 text-white",
    rankColor: "text-white/10",
    iconClass: "size-9 text-[#cbd5e1]",
  },
  3: {
    label: "3RD PLACE",
    medal: "🥉",
    pedestal: "h-14 sm:h-16",
    cardMinH: "min-h-[150px] sm:min-h-[170px]",
    accent: "from-[#f59e0b]/70 via-[#d97706]/45 to-[#92400e]/30",
    border: "border-[#d97706]/40",
    glow: "shadow-[0_10px_20px_rgba(0,0,0,0.35)]",
    badge: "border-[#d97706]/40 bg-[#d97706]/10 text-[#fbbf24]",
    rankColor: "text-[#d97706]/15",
    iconClass: "size-9 text-[#d97706]",
  },
} as const;

function PodiumCard({
  team,
  rank,
}: {
  team: (typeof teams)[0];
  rank: 1 | 2 | 3;
}) {
  const isChampion = rank === 1;
  const theme = podiumTheme[rank];
  const Icon = rank === 1 ? Trophy : rank === 2 ? Trophy : Medal;

  return (
    <div className="relative flex flex-1 flex-col items-center">
      {/* Card */}
      <div
        className={cn(
          "game-card relative z-10 flex w-full flex-col items-center justify-between overflow-hidden rounded-2xl border p-4 sm:rounded-[20px] sm:p-5",
          theme.border,
          theme.glow,
          theme.cardMinH,
          isChampion && "podium-champion-glow -mt-2 sm:-mt-3",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2c180e] via-[#1f110a] to-[#140a06]" />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
            theme.accent,
          )}
        />
        <span
          className={cn(
            "pointer-events-none absolute -right-2 -top-4 select-none font-display text-7xl font-black sm:text-8xl",
            theme.rankColor,
          )}
          aria-hidden
        >
          {rank}
        </span>
        {isChampion && (
          <>
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.18)_0%,transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,215,0,0.06)_50%,transparent_60%)]" />
          </>
        )}

        <div className="relative flex flex-col items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-full border p-2",
              isChampion ? "border-gold/40 bg-gold/10" : "border-white/10 bg-white/5",
            )}
          >
            <Icon className={theme.iconClass} />
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-[10px] font-bold sm:text-[11px]", theme.badge)}>
            {theme.medal} {theme.label}
          </span>
        </div>

        <div className="relative flex flex-col items-center gap-2.5 sm:gap-3">
          <TeamAvatar name={team.name} size={isChampion ? "lg" : "md"} gold={isChampion} />
          <div className="text-center">
            <p
              className={cn(
                "truncate font-bold uppercase tracking-wide",
                isChampion
                  ? "font-serif text-lg text-gold sm:text-2xl"
                  : "text-sm text-white sm:text-lg",
              )}
            >
              {team.name}
            </p>
            <div className="mt-1 flex items-center justify-center gap-1">
              <Coins className="size-3.5 text-gold" />
              <span className="text-[10px] font-semibold uppercase text-gold sm:text-xs">
                {team.cultureCoins} Culture Coins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pedestal column */}
      <div
        className={cn(
          "relative z-0 mt-2 w-full overflow-hidden rounded-b-xl border-x border-b sm:rounded-b-2xl",
          theme.pedestal,
          theme.border,
        )}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-b", theme.accent)} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,transparent_45%,rgba(0,0,0,0.15)_100%)]" />
        <div className="absolute inset-x-3 bottom-2 h-px bg-white/20" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-2xl font-black text-black/25 sm:text-3xl">
          {rank}
        </span>
      </div>
    </div>
  );
}

export default function FinalScoresPage() {
  const sorted = [...teams].sort((a, b) => a.rank - b.rank);
  const byRank = Object.fromEntries(sorted.map((t) => [t.rank, t]));
  const podiumDisplay = [byRank[2], byRank[1], byRank[3]].filter(Boolean) as typeof teams;
  const rest = sorted.filter((t) => t.rank > 3);
  const maxCoins = Math.max(...teams.map((t) => t.cultureCoins), 1);

  return (
    <ScrollPage className="relative bg-[radial-gradient(ellipse_at_center,#0b2d1e_0%,#05130a_100%)]">
      <ScoresConfetti />

      {/* Compact nav — top right */}
      <NavIconBar className="absolute right-3 top-3 z-10 sm:right-6 sm:top-4" />

      <PageContainer maxWidth="max-w-5xl" className="relative py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <header className="game-stagger-in game-animate mb-10 flex flex-col items-center gap-4 text-center sm:mb-12">
          <div className="rounded-full p-2">
            <Award className="size-12 text-gold sm:size-14" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-normal text-[#ffd700] sm:text-5xl lg:text-6xl">
              TOURNAMENT COMPLETE
            </h1>
            <div className="inline-flex rounded-full border border-gold/20 bg-white/5 px-5 py-2">
              <p className="text-xs font-bold text-white sm:text-sm">
                {TOTAL_ROUNDS} ROUNDS • {teams.length} TEAMS • 1 CHAMPION
              </p>
            </div>
          </div>
        </header>

        {/* Podium cards — 2nd | 1st | 3rd */}
        <div className="mb-10 flex justify-center sm:mb-12">
          <div className="relative w-full max-w-4xl px-2 sm:px-0">
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.12)_0%,transparent_70%)] podium-spotlight sm:h-56" />
            <StaggerIn
              className="relative flex w-full items-end justify-center gap-3 sm:gap-5 [&>div]:min-w-0 [&>div]:flex-1"
              stepMs={90}
              baseDelayMs={100}
            >
              {podiumDisplay.map((team) => (
                <PodiumCard key={team.id} team={team} rank={team.rank as 1 | 2 | 3} />
              ))}
            </StaggerIn>
            <div className="relative mx-auto mt-3 h-3 max-w-[92%] rounded-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent sm:mt-4" />
            <div className="mx-auto mt-1 h-1.5 max-w-[85%] rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="game-stagger-in game-animate overflow-hidden rounded-3xl border border-white/10 bg-[#1f110a] shadow-[0_16px_32px_rgba(0,0,0,0.25)]" style={{ animationDelay: "200ms" }}>
          <div className="grid grid-cols-[40px_1fr] gap-x-4 bg-white/[0.04] px-4 py-3 text-[11px] font-bold uppercase text-white/40 sm:grid-cols-[48px_1fr_140px_120px] sm:px-6">
            <span>Rank</span>
            <span>Team Name</span>
            <span className="hidden sm:block">Progress</span>
            <span className="hidden text-right sm:block">Total Score</span>
          </div>

          <ul>
            {rest.map((team, idx) => {
              const progress = (team.cultureCoins / maxCoins) * 100;
              const rowOpacity = 1 - idx * 0.05;
              return (
                <li
                  key={team.id}
                  className="grid grid-cols-[40px_1fr_auto] items-center gap-x-4 border-b border-white/10 px-4 py-3.5 last:border-0 sm:grid-cols-[48px_1fr_140px_120px] sm:px-6 sm:py-3.5"
                  style={{ opacity: Math.max(rowOpacity, 0.5) }}
                >
                  <span className="text-sm font-bold text-white/70">#{team.rank}</span>
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamAvatar name={team.name} size="sm" />
                    <span className="truncate text-sm font-semibold text-white sm:text-[15px]">
                      {team.name}
                    </span>
                  </div>

                  {/* Progress — desktop */}
                  <div className="hidden h-1.5 overflow-hidden rounded-full bg-white/10 sm:block">
                    <div
                      className="game-progress-fill h-full rounded-full bg-[#c59b27]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Score */}
                  <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <span className="text-sm font-bold text-white sm:text-[15px]">
                      {team.cultureCoins}
                    </span>
                    <span className="hidden text-xs text-white/40 sm:inline">Coins</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer actions */}
        <div className="mt-10 flex flex-col items-center gap-6 pb-10 sm:mt-12">
          <button
            type="button"
            className="game-btn flex w-full max-w-xl items-center justify-center gap-2 rounded-xl border-[1.5px] border-white px-10 py-4 text-base font-bold uppercase text-white hover:bg-white/5"
          >
            <Share2 className="size-4" />
            Share Results
          </button>
          <button
            type="button"
            className="text-sm font-medium text-[#ffd700] underline underline-offset-2 hover:text-gold-light"
          >
            View Round-by-Round Breakdown
          </button>
        </div>
      </PageContainer>
    </ScrollPage>
  );
}
