import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Cap stagger so large grids don't delay too long */
export function staggerDelay(index: number, stepMs = 32, maxMs = 320) {
  return Math.min(index * stepMs, maxMs);
}

/** Lightweight ambient layer — pure CSS, no JS loops */
export function MinigameAmbientFx() {
  return (
    <div className="mg-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="mg-orb mg-orb-a" />
      <div className="mg-orb mg-orb-b" />
      <div className="mg-orb mg-orb-c" />
      <div className="mg-scanline" />
    </div>
  );
}

interface MotionPanelProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: ReactNode;
}

export function MotionPanel({ delay = 0, className, children, style, ...props }: MotionPanelProps) {
  return (
    <div
      className={cn("mg-panel-enter mg-animate", className)}
      style={{ ...style, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function MotionBoard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mg-board mg-animate relative", className)} {...props}>
      {children}
    </div>
  );
}

type TileState = "idle" | "correct" | "wrong" | "revealed";

interface MotionTileProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  state?: TileState;
  children?: ReactNode;
}

export function MotionTile({
  delay = 0,
  state = "idle",
  className,
  children,
  style,
  ...props
}: MotionTileProps) {
  return (
    <div
      className={cn(
        "mg-tile mg-animate",
        state === "correct" && "mg-tile-correct",
        state === "wrong" && "mg-tile-wrong",
        state === "revealed" && "mg-tile-revealed",
        className,
      )}
      style={{ ...style, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

export function MotionKey({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("mg-key mg-btn-glow mg-animate", className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface MotionRungProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  children: ReactNode;
}

export function MotionRung({ delay = 0, className, children, style, ...props }: MotionRungProps) {
  return (
    <div
      className={cn("mg-ladder-rung mg-animate", className)}
      style={{ ...style, animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}
