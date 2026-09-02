import { DIFFICULTY_LABELS, type MinigameDifficulty } from "@/lib/minigame-difficulty";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: MinigameDifficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const isHigh = difficulty === "high_stakes";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        isHigh
          ? "border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#f59e0b]"
          : "border-[#28254a] bg-[#1a1935] text-[#9e9bbf]",
        className,
      )}
    >
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

interface DifficultySelectorProps {
  difficulty: MinigameDifficulty;
  onChange: (d: MinigameDifficulty) => void;
}

/** Toggle on Instructions page before entering minigames */
export function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-bold uppercase tracking-wide text-text-muted">
        Difficulty Tier
      </p>
      <div className="flex rounded-full border border-gold-muted bg-bg-card/80 p-1">
        {(["standard", "high_stakes"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold uppercase transition-colors",
              difficulty === d
                ? d === "high_stakes"
                  ? "bg-[#f59e0b] text-[#1e120d]"
                  : "bg-gold text-text-dark"
                : "text-text-muted hover:text-white",
            )}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>
      <p className="max-w-md text-center text-xs text-text-muted">
        {difficulty === "high_stakes"
          ? "Tighter timers, fewer hints, and executive-level puzzle sets."
          : "Balanced challenge for team warm-up sessions."}
      </p>
    </div>
  );
}
