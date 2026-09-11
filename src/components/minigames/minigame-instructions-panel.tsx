import { Trophy } from "lucide-react";
import { MotionPanel } from "@/components/minigames/minigame-motion";
import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { DifficultyBadge } from "@/components/minigames/difficulty-badge";
import { MINIGAME_INSTRUCTIONS } from "@/data/minigame-instructions";
import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import type { MinigameId } from "@/types/minigame-session";
import { cn } from "@/lib/utils";

interface MinigameInstructionsPanelProps {
  gameId: MinigameId;
  difficulty: MinigameDifficulty;
  className?: string;
}

export function MinigameInstructionsPanel({
  gameId,
  difficulty,
  className,
}: MinigameInstructionsPanelProps) {
  const info = MINIGAME_INSTRUCTIONS[gameId];

  return (
    <MotionPanel className={cn("flex flex-col gap-5 p-5 sm:p-6", theme.card, className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn("text-[10px] font-bold uppercase tracking-wide", theme.label)}>
            How to Play
          </p>
          <h2 className={cn("font-serif text-xl font-black sm:text-2xl", theme.heading)}>
            {info.title}
          </h2>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <p className={cn("text-sm leading-relaxed", theme.body)}>{info.objective}</p>

      <div>
        <p className={cn("mb-3 text-xs font-bold uppercase", theme.highlight)}>Steps</p>
        <ol className="space-y-2.5">
          {info.steps.map((step, i) => (
            <li key={i} className={cn("flex gap-3 text-sm", theme.body)}>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-green/40 bg-green/10 font-mono text-xs font-bold text-green">
                {i + 1}
              </span>
              <span className="pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-green/30 bg-green/5 p-4">
          <p className="mb-1 text-[10px] font-bold uppercase text-green">Win</p>
          <p className={cn("text-sm leading-relaxed", theme.body)}>{info.winCondition}</p>
        </div>
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
          <p className={cn("mb-1 text-[10px] font-bold uppercase", theme.warn)}>Lose</p>
          <p className={cn("text-sm leading-relaxed", theme.body)}>{info.loseCondition}</p>
        </div>
      </div>

      {info.tips && info.tips.length > 0 && (
        <div>
          <p className={cn("mb-2 text-xs font-bold uppercase", theme.heading)}>Tips</p>
          <ul className="space-y-1.5">
            {info.tips.map((tip, i) => (
              <li key={i} className={cn("text-sm", theme.body)}>
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-gold-muted/40 bg-gold/5 px-4 py-3">
        <Trophy className="size-4 shrink-0 text-gold" />
        <p className={cn("text-sm font-semibold", theme.heading)}>{info.reward}</p>
      </div>
    </MotionPanel>
  );
}
