import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Children, isValidElement, useEffect, useState } from "react";
import { useMotionTrigger } from "@/hooks/use-motion-trigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function staggerStep(index: number, stepMs = 55, maxMs = 400) {
  return Math.min(index * stepMs, maxMs);
}

/** Subtle felt-table ambient — main app routes only */
export function GameAmbientFx() {
  return (
    <div className="game-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="game-orb game-orb-gold" />
      <div className="game-orb game-orb-green" />
      <div className="game-orb game-orb-felt" />
      <div className="game-sparkle-sweep" />
    </div>
  );
}

interface StaggerInProps {
  children: ReactNode;
  className?: string;
  stepMs?: number;
  baseDelayMs?: number;
}

/** Stagger children with CSS-only entrance */
export function StaggerIn({ children, className, stepMs = 55, baseDelayMs = 0 }: StaggerInProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        return (
          <div
            key={child.key ?? i}
            className="game-stagger-in game-animate"
            style={{ animationDelay: `${baseDelayMs + staggerStep(i, stepMs)}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
}

export function GameCard({ children, className, delay = 0, style, ...props }: GameCardProps) {
  return (
    <div
      className={cn("game-card game-stagger-in game-animate", className)}
      style={{ ...style, animationDelay: `${delay}ms` } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}

interface GameCoinProps {
  value: ReactNode;
  className?: string;
  pulse?: boolean;
}

export function GameCoin({ value, className, pulse }: GameCoinProps) {
  return (
    <span
      className={cn(
        "game-coin inline-flex items-center gap-1.5 rounded-full border border-gold-muted bg-gold/10 px-3 py-1 font-mono text-sm font-bold text-gold-light",
        pulse && "game-coin-pulse-once game-animate",
        className,
      )}
    >
      <span className="size-2 rounded-full bg-gold shadow-[0_0_6px_#d4af37]" />
      {value}
    </span>
  );
}

interface AnimatedValueProps {
  value: number | string;
  className?: string;
  children?: (display: number | string) => ReactNode;
}

/** One-shot scale pulse when numeric/text value changes */
export function AnimatedValue({ value, className, children }: AnimatedValueProps) {
  const motionClass = useMotionTrigger(value, "game-score-pop game-animate");
  return (
    <span className={cn("inline-block tabular-nums", className, motionClass)}>
      {children ? children(value) : value}
    </span>
  );
}

interface FloatingRewardProps {
  show: boolean;
  label: string;
  className?: string;
  onDone?: () => void;
}

/** Lightweight +N float that auto-unmounts */
export function FloatingReward({ show, label, className, onDone }: FloatingRewardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show || prefersReducedMotion) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const id = window.setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 480);
    return () => window.clearTimeout(id);
  }, [show, prefersReducedMotion, onDone, label]);

  if (!visible) return null;

  return (
    <span
      className={cn(
        "game-float-reward game-animate pointer-events-none absolute left-1/2 z-10 whitespace-nowrap font-display text-sm font-extrabold text-gold-light",
        className,
      )}
      aria-hidden
    >
      {label}
    </span>
  );
}

interface GameProgressBarProps {
  value: number;
  max: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}

/** Progress bar with smooth width transition + one-shot pulse at 100% */
export function GameProgressBar({
  value,
  max,
  className,
  trackClassName,
  fillClassName,
}: GameProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const isComplete = max > 0 && value >= max;
  const completeClass = useMotionTrigger(isComplete, "game-progress-complete game-animate");

  return (
    <div
      className={cn("game-progress-track overflow-hidden rounded-full", className, trackClassName)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cn("game-progress-fill h-full rounded-full", fillClassName, isComplete && completeClass)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

interface MotionStreakBadgeProps {
  streak: number;
  className?: string;
}

/** Escalating one-shot pulse when streak increments */
export function MotionStreakBadge({ streak, className }: MotionStreakBadgeProps) {
  const motionClass = useMotionTrigger(streak, "game-streak-pop game-animate");
  const scale = Math.min(1.12, 1 + streak * 0.02);

  return (
    <span
      className={cn("inline-block tabular-nums", className, motionClass)}
      style={{ "--streak-scale": scale } as CSSProperties}
    >
      {streak}
    </span>
  );
}

/** Floating confetti chips — CSS only, for celebrations */
export function GameConfetti({ className }: { className?: string }) {
  const pieces = [
    { top: "8%", left: "12%", color: "bg-gold", rot: "12deg", delay: 0 },
    { top: "14%", right: "18%", color: "bg-green", rot: "-18deg", delay: 0.4 },
    { top: "22%", left: "28%", color: "bg-[#06b6d4]", rot: "45deg", delay: 0.8 },
    { bottom: "18%", right: "12%", color: "bg-gold", rot: "-30deg", delay: 0.2 },
    { bottom: "24%", left: "8%", color: "bg-[#f59e0b]", rot: "22deg", delay: 0.6 },
    { top: "40%", right: "6%", color: "bg-white/70", rot: "-8deg", delay: 1 },
  ];
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className={cn("game-confetti-piece absolute h-4 w-2 rounded-sm opacity-80 sm:h-5 sm:w-2.5", p.color)}
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            animationDelay: `${p.delay}s`,
            rotate: p.rot,
          }}
        />
      ))}
    </div>
  );
}
