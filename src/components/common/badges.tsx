import { cn } from "@/lib/utils";
import type { RoundStatus } from "@/types/game";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "live" | "gold" | "green" | "muted" | "ready" | "joining";
}

export function Badge({ children, className, variant = "muted" }: BadgeProps) {
  const variants = {
    live: "bg-green/10 border-green text-green",
    gold: "bg-gold/10 border-gold-muted text-gold",
    green: "bg-green/10 border-green text-green",
    muted: "bg-bg-card border-border text-text-muted-alt",
    ready: "bg-green/15 border-green/40 text-green",
    joining: "bg-gold/10 border-gold-muted/40 text-gold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[11px] font-bold uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-[#219653] bg-[rgba(226,240,217,0.08)] px-2.5 py-1 text-[11px] font-bold uppercase text-[#219653]">
      <span className="game-live-dot size-2 rounded-full bg-[#219653]" />
      BROADCAST LIVE
    </span>
  );
}

export function CultureCoinPill({ amount }: { amount: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold/10 border border-gold-muted/30 px-2 py-0.5 text-xs font-bold text-gold">
      <span className="text-gold-bright">★</span>
      {amount}
    </span>
  );
}

export function RoundSlotBadge({
  label,
  status,
}: {
  label: string;
  status: RoundStatus;
}) {
  const styles = {
    completed: "bg-[rgba(33,150,83,0.06)] border border-[#219653] text-white",
    active: "bg-[rgba(242,201,76,0.06)] border-2 border-[#f2c94c] text-white",
    upcoming: "bg-[#1a202e] border border-[#1f2535] text-[#8f9cae]",
  };

  const dotStyles = {
    completed: "bg-[#219653]",
    active: "bg-[#f2c94c]",
    upcoming: "bg-[#2d3748]",
  };

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md px-3 py-2",
        styles[status],
      )}
    >
      <span className="text-[10px] font-bold">{label}</span>
      <span className={cn("size-2 rounded-sm", dotStyles[status])} />
    </div>
  );
}
