import { Trophy } from "lucide-react";
import { MotionPanel } from "@/components/minigames/minigame-motion";
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
    <MotionPanel
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-[#28254a] bg-[#121124]/95 p-5 backdrop-blur-sm sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#64618a]">
            How to Play
          </p>
          <h2 className="font-display text-xl font-extrabold text-white sm:text-2xl">
            {info.title}
          </h2>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <p className="text-sm leading-relaxed text-[#9e9bbf]">{info.objective}</p>

      <div>
        <p className="mb-3 text-xs font-bold uppercase text-[#06b6d4]">Steps</p>
        <ol className="space-y-2.5">
          {info.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#9e9bbf]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#06b6d4]/40 bg-[#06b6d4]/10 font-mono text-xs font-bold text-[#06b6d4]">
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
          <p className="text-sm leading-relaxed text-[#9e9bbf]">{info.winCondition}</p>
        </div>
        <div className="rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/5 p-4">
          <p className="mb-1 text-[10px] font-bold uppercase text-[#f59e0b]">Lose</p>
          <p className="text-sm leading-relaxed text-[#9e9bbf]">{info.loseCondition}</p>
        </div>
      </div>

      {info.tips && info.tips.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-[#8b5cf6]">Tips</p>
          <ul className="space-y-1.5">
            {info.tips.map((tip, i) => (
              <li key={i} className="text-sm text-[#64618a]">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-gold-muted/40 bg-gold/5 px-4 py-3">
        <Trophy className="size-4 shrink-0 text-gold" />
        <p className="text-sm font-semibold text-gold-light">{info.reward}</p>
      </div>
    </MotionPanel>
  );
}
