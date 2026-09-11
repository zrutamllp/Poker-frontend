import { Check, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { crosswordTheme as t } from "./crossword-theme";

interface CrosswordToolbarProps {
  hintsRemaining: number;
  onCheck: (scope: "cell" | "word" | "puzzle") => void;
  onHint: () => void;
  disabled?: boolean;
}

export function CrosswordToolbar({
  hintsRemaining,
  onCheck,
  onHint,
  disabled,
}: CrosswordToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ToolbarButton icon={Check} label="Check" onClick={() => onCheck("word")} disabled={disabled} />
      <ToolbarButton
        icon={Lightbulb}
        label={`Hint (${hintsRemaining})`}
        onClick={onHint}
        disabled={disabled || hintsRemaining <= 0}
      />
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof Check;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(t.btnGhost, "inline-flex items-center gap-1.5 disabled:opacity-40")}
    >
      <Icon className="size-3.5 text-gold" />
      {label}
    </button>
  );
}
