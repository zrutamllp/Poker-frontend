import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DifficultyBadge } from "@/components/minigames/difficulty-badge";
import { MotionPanel } from "@/components/minigames/minigame-motion";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
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
      <MotionPanel className={cn("p-5", theme.card)}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className={cn("text-sm font-bold uppercase", theme.body)}>
            {MINIGAME_COPY.sessionStats}
          </p>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <div className="space-y-3 text-sm">{children}</div>
        {isOnlineMode && attemptsRemaining !== undefined && (
          <div className="mt-3 flex justify-between text-sm">
            <span className={theme.statLabel}>Attempts</span>
            <span className={cn("font-mono font-extrabold", theme.accent)}>
              {attemptsRemaining > 0
                ? `${Math.max(0, 2 - attemptsRemaining)} / 2 used`
                : "Exhausted"}
            </span>
          </div>
        )}
        <hr className={cn("my-4", theme.divider)} />
        <div className="mg-shimmer-track mb-4 rounded-lg border border-gold-muted/40 bg-gold/5 p-3">
          <p className={cn("text-[10px] font-bold uppercase", theme.label)}>Classification</p>
          <p className={cn("mt-1 text-sm font-semibold", theme.heading)}>{category}</p>
        </div>
        <button
          type="button"
          onClick={onNewSession}
          disabled={!canRetry}
          className={cn(
            "mg-btn-glow flex w-full items-center justify-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-40",
            theme.btnGold,
          )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05130a]/80 px-4 backdrop-blur-sm">
      <div
        className={cn(
          "relative w-full max-w-md px-6 py-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
          theme.card,
          isWin ? "border-green/60" : "border-gold-muted/80",
        )}
      >
        <FloatingReward
          show={showReward}
          label="+1000 Culture Coins"
          className="-top-5 text-green"
          onDone={() => setShowReward(false)}
        />
        <p
          className={cn(
            "font-serif text-xl font-black",
            isWin ? "text-green" : "text-gold-light",
          )}
        >
          {title}
        </p>
        {subtitle && (
          <p className={cn("mt-2 text-base font-semibold", theme.emphasis)}>{subtitle}</p>
        )}
        {detail && <p className={cn("mt-1 text-sm", theme.body)}>{detail}</p>}
        {isOnlineMode && (
          <p className={cn("mt-2 text-xs", theme.body)}>
            Best result counts toward team balance
            {attemptsRemaining !== undefined && attemptsRemaining > 0
              ? ` · ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} left`
              : attemptsRemaining === 0
                ? " · No attempts remaining"
                : ""}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="game-btn w-full border-2 border-gold bg-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#05130a] transition-colors hover:bg-gold-light sm:w-auto"
            >
              {MINIGAME_COPY.retry}
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "game-btn w-full px-5 py-2.5 text-sm font-semibold sm:w-auto",
              theme.btnGhost,
            )}
          >
            {MINIGAME_COPY.backToLobby}
          </button>
        </div>
      </div>
    </div>
  );
}
