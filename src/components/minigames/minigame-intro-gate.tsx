import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { MinigameId } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

interface MinigameIntroGateProps {
  gameId: MinigameId;
  difficulty: MinigameDifficulty;
  introAcked: boolean;
  onAck: () => void;
  /** Optional wrapper for loading state behind the gate */
  className?: string;
  panelClassName?: string;
  children: React.ReactNode;
}

export function MinigameIntroGate({
  gameId,
  difficulty,
  introAcked,
  onAck,
  className,
  panelClassName,
  children,
}: MinigameIntroGateProps) {
  if (introAcked) {
    return (
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-1 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <MinigameInstructionsPanel
            gameId={gameId}
            difficulty={difficulty}
            className={cn("w-full", panelClassName)}
          />
          <button
            type="button"
            onClick={onAck}
            className="game-btn shrink-0 rounded-full border border-white bg-gold px-12 py-3 font-serif text-base font-black text-text-dark shadow-[0_8px_12px_rgba(212,175,55,0.25)] transition-transform hover:scale-[1.02]"
          >
            OK — Start game
          </button>
        </div>
      </div>
    </div>
  );
}
