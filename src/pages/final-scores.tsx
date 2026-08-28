import { Award, Trophy, Medal, Coins, Share2 } from "lucide-react";
import { teams, TOTAL_ROUNDS } from "@/data/game-data";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { cn } from "@/lib/utils";

const confettiPieces = [
  { top: "12%", left: "8%", color: "bg-[#ffd700]", rotate: "rotate-[25deg]", w: "w-3", h: "h-5" },
  { top: "5%", left: "18%", color: "bg-red-500", rotate: "-rotate-[15deg]", w: "w-3.5", h: "h-3.5" },
  { top: "14%", left: "26%", color: "bg-[#cd7f32]", rotate: "rotate-45", w: "w-2", h: "h-[18px]" },
  { top: "25%", left: "4%", color: "bg-red-500", rotate: "rotate-30", w: "w-2.5", h: "h-6" },
  { top: "8%", right: "12%", color: "bg-[#ffd700]", rotate: "rotate-12", w: "w-2.5", h: "h-5" },
  { top: "15%", right: "8%", color: "bg-red-500", rotate: "rotate-55", w: "w-4", h: "h-4" },
  { top: "10%", right: "22%", color: "bg-blue-500", rotate: "-rotate-[35deg]", w: "w-2", h: "h-[18px]" },
  { top: "28%", right: "18%", color: "bg-[#ffd700]", rotate: "rotate-15", w: "w-3", h: "h-6" },
  { top: "6%", left: "50%", color: "bg-[#ffd700]", rotate: "rotate-10", w: "w-3", h: "h-[22px]" },
];

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

function PodiumCard({
  team,
  rank,
}: {
  team: (typeof teams)[0];
  rank: 1 | 2 | 3;
}) {
  const isChampion = rank === 1;
  const Icon = rank === 1 ? Trophy : rank === 2 ? Trophy : Medal;
  const badge =
    rank === 1 ? "🏆 CHAMPION" : rank === 2 ? "🥈 2ND PLACE" : "🥉 3RD PLACE";
  const heights = { 1: "min-h-[340px] sm:min-h-[400px]", 2: "min-h-[280px] sm:min-h-[320px]", 3: "min-h-[240px] sm:min-h-[280px]" };

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col items-center justify-between overflow-hidden rounded-[20px] p-5 sm:p-6",
        isChampion
          ? "border border-gold shadow-[0_12px_16px_rgba(255,215,0,0.15)]"
          : "border border-white/10",
        heights[rank],
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[20px]",
          isChampion ? "bg-[#2c180e]" : "bg-[#1f110a]",
        )}
      />
      {isChampion && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12)_0%,transparent_70%)] sm:size-60" />
      )}

      <div className="relative flex flex-col items-center gap-2">
        <Icon
          className={cn(
            isChampion ? "size-10 sm:size-12 text-gold" : "size-8 sm:size-9 text-gold-muted",
          )}
        />
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-[11px] font-bold sm:text-xs",
            isChampion
              ? "border border-gold bg-gold/10 text-gold"
              : "bg-white/[0.07] text-white",
          )}
        >
          {badge}
        </span>
      </div>

      <div className="relative flex flex-col items-center gap-3">
        <TeamAvatar name={team.name} size={isChampion ? "lg" : "md"} gold={isChampion} />
        <div className="text-center">
          <p
            className={cn(
              "truncate font-bold uppercase tracking-wide",
              isChampion
                ? "font-serif text-xl text-gold sm:text-[28px]"
                : "text-base text-white sm:text-xl",
            )}
          >
            {team.name}
          </p>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Coins className="size-3.5 text-gold" />
            <span className="text-[11px] font-semibold uppercase text-gold sm:text-[13px]">
              {team.cultureCoins} Culture Coins
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
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
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confettiPieces.map((c, i) => (
          <span
            key={i}
            className={cn(
              "absolute rounded-sm opacity-85",
              c.color,
              c.rotate,
              c.w,
              c.h,
            )}
            style={{ top: c.top, left: c.left, right: c.right }}
          />
        ))}
      </div>

      {/* Compact nav — top right */}
      <NavIconBar className="absolute right-3 top-3 z-10 sm:right-6 sm:top-4" />

      <PageContainer maxWidth="max-w-5xl" className="relative py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <header className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-12">
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
        <div className="-mx-4 mb-10 overflow-x-auto px-4 sm:mx-0 sm:mb-12 sm:overflow-visible sm:px-0">
          <div className="flex min-w-[640px] items-end gap-3 sm:min-w-0 sm:gap-6">
            {podiumDisplay.map((team) => (
              <PodiumCard key={team.id} team={team} rank={team.rank as 1 | 2 | 3} />
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1f110a] shadow-[0_16px_32px_rgba(0,0,0,0.25)]">
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
                      className="h-full rounded-full bg-[#c59b27]"
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
            className="flex w-full max-w-xl items-center justify-center gap-2 rounded-xl border-[1.5px] border-white px-10 py-4 text-base font-bold uppercase text-white transition-colors hover:bg-white/5"
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
