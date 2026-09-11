import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import type { LottieAccentPosition } from "@/lib/page-animations";

setWasmUrl("/lottie/dotlottie-player.wasm");

const POSITION_CLASS: Record<LottieAccentPosition, string> = {
  "top-right": "right-4 top-4 sm:right-6 sm:top-6",
  "top-left": "left-4 top-4 sm:left-6 sm:top-6",
  "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
};

export interface LottieAccentProps {
  src: string;
  size?: number;
  className?: string;
  position?: LottieAccentPosition;
}

export default function LottieAccentInner({
  src,
  size = 56,
  className,
  position = "top-right",
}: LottieAccentProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[100] opacity-90",
        POSITION_CLASS[position],
        className,
      )}
      aria-hidden
      style={{ width: size, height: size }}
    >
      <DotLottieReact
        src={src}
        autoplay
        loop={false}
        layout={{ fit: "contain", align: [0.5, 0.5] }}
        style={{ width: size, height: size, display: "block" }}
      />
    </div>
  );
}
