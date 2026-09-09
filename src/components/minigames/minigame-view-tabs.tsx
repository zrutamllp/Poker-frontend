import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import { cn } from "@/lib/utils";

export type MinigameView = "play" | "instructions";

interface MinigameViewTabsProps {
  view: MinigameView;
  onChange: (view: MinigameView) => void;
  className?: string;
  playLabel?: string;
  instructionsLabel?: string;
}

export function MinigameViewTabs({
  view,
  onChange,
  className,
  playLabel = "Play",
  instructionsLabel = "Instructions",
}: MinigameViewTabsProps) {
  return (
    <div className={cn(theme.tabList, className)} role="tablist">
      {(["play", "instructions"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={view === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors sm:text-xs",
            view === tab ? theme.tabActive : theme.tabInactive,
          )}
        >
          {tab === "play" ? playLabel : instructionsLabel}
        </button>
      ))}
    </div>
  );
}
