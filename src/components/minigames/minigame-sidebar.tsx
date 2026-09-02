import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DifficultyBadge } from "@/components/minigames/difficulty-badge";
import { MotionPanel } from "@/components/minigames/minigame-motion";
import { FloatingReward } from "@/components/layout/game-ui";
import { MINIGAME_COPY, type MinigameDifficulty } from "@/lib/minigame-difficulty";
import { cn } from "@/lib/utils";
interface MinigameSidebarProps {
  difficulty: MinigameDifficulty;
  category: string;
  onNewSession: () => void;
  children: ReactNode;
  footer?: ReactNode;
  isOnlineMode?: boolean;
  attemptsRemaining?: number;
  canRetry?: boolean;
}

export function MinigameSidebar({
  difficulty,
  category,
  onNewSession,
  children,
  footer,
  isOnlineMode = false,
  attemptsRemaining,
  canRetry = true,
}: MinigameSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 sm:w-[280px]">
      <MotionPanel className="rounded-2xl border border-[#28254a] bg-[#121124]/95 p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-sm font-bold uppercase text-[#9e9bbf]">{MINIGAME_COPY.sessionStats}</p>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <div className="space-y-3 text-sm">
          {children}
          {isOnlineMode && attemptsRemaining !== undefined && (
            <div className="flex justify-between">
              <span className="text-[#64618a]">Attempts</span>
              <span className="font-mono font-extrabold text-[#8b5cf6]">
                {attemptsRemaining > 0
                  ? `${Math.max(0, 2 - attemptsRemaining)} / 2 used`
                  : "Exhausted"}
              </span>
            </div>
          )}
        </div>
        <hr className="my-4 border-[#28254a]" />
        <div className="mg-shimmer-track mb-4 rounded-lg border border-gold-muted/40 bg-gold/5 p-3">
          <p className="text-[10px] font-bold uppercase text-gold-muted">Classification</p>
          <p className="mt-1 text-sm font-semibold text-gold-light">{category}</p>
        </div>
        <button
          type="button"
          onClick={onNewSession}
          disabled={!canRetry}
          className="mg-btn-glow flex w-full items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {MINIGAME_COPY.newSession}
        </button>
      </MotionPanel>
      {footer}
    </aside>
  );
}

interface MinigameResultProps {
  variant: "won" | "lost";
  title: string;
  subtitle?: string;
  detail?: string;
  onRetry: () => void;
  onBack: () => void;
  canRetry?: boolean;
  isOnlineMode?: boolean;
  attemptsRemaining?: number;
}

export function MinigameResult({
  variant,
  title,
  subtitle,
  detail,
  onRetry,
  onBack,
  canRetry = true,
  isOnlineMode = false,
  attemptsRemaining,
}: MinigameResultProps) {
  const isWin = variant === "won";
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (isWin) {
      const id = window.setTimeout(() => setShowReward(true), 150);
      return () => window.clearTimeout(id);
    }
    setShowReward(false);
  }, [isWin]);

  return (
    <div
      className={cn(
        "relative z-10 px-6 py-3 text-center",
        isWin
          ? "mg-win-burst mg-animate rounded-xl border border-green bg-green/10 shadow-[0_0_24px_rgba(34,197,94,0.2)]"
          : "mg-animate mg-tile-wrong rounded-xl border border-[#f59e0b] bg-[#f59e0b]/10",
      )}
    >
      <FloatingReward
        show={showReward}
        label="+1000 Culture Coins"
        className="-top-5 text-green"
        onDone={() => setShowReward(false)}
      />
      <p className={`font-display text-lg font-extrabold ${isWin ? "text-green" : "text-[#f59e0b]"}`}>
        {title}
      </p>
      {subtitle && <p className="mt-1 text-sm text-[#9e9bbf]">{subtitle}</p>}
      {detail && <p className="mt-1 text-sm text-[#9e9bbf]">{detail}</p>}
      {isOnlineMode && (
        <p className="mt-2 text-xs text-[#64618a]">
          Best result counts toward team balance
          {attemptsRemaining !== undefined && attemptsRemaining > 0
            ? ` · ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left`
            : attemptsRemaining === 0
              ? " · No attempts remaining"
              : ""}
        </p>
      )}
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mg-btn-glow rounded-lg bg-[#8b5cf6] px-5 py-2 text-sm font-semibold text-white"
          >
            {MINIGAME_COPY.retry}
          </button>
        )}
        {isWin && (
          <button
            type="button"
            onClick={onBack}
            className="mg-btn-glow rounded-lg border border-gold-muted bg-gold/10 px-5 py-2 text-sm font-semibold text-gold-light"
          >
            {MINIGAME_COPY.backToLobby}
          </button>
        )}
      </div>
    </div>
  );
}
