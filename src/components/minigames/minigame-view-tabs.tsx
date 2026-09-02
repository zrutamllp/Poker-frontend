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
    <div
      className={cn(
        "flex rounded-lg border border-[#28254a] bg-[#1a1935] p-0.5",
        className,
      )}
      role="tablist"
    >
      {(["play", "instructions"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={view === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors sm:text-xs",
            view === tab
              ? "bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]"
              : "text-[#9e9bbf] hover:text-white",
          )}
        >
          {tab === "play" ? playLabel : instructionsLabel}
        </button>
      ))}
    </div>
  );
}
