import type { CSSProperties, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { LottieAccent } from "@/components/layout/lottie-accent";
import { GameAmbientFx } from "@/components/layout/game-ui";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { PageAnimationConfig } from "@/lib/page-animations";
import { cn } from "@/lib/utils";

interface PageEnterProps {
  config: PageAnimationConfig;
  children: ReactNode;
}

export function PageEnter({ config, children }: PageEnterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { pathname } = useLocation();
  const isMinigame = pathname.startsWith("/minigame");
  const duration = (config.durationMs ?? 420) / 1000;

  return (
    <div
      className={cn(
        "relative min-h-dvh w-full",
        !prefersReducedMotion && `page-enter-${config.css}`,
      )}
      style={
        prefersReducedMotion
          ? undefined
          : ({ "--page-enter-duration": `${duration}s` } as CSSProperties)
      }
    >
      {!isMinigame && !prefersReducedMotion && config.ambient !== false && <GameAmbientFx />}
      {config.lottie && (
        <LottieAccent
          src={config.lottie}
          size={config.lottieSize ?? 56}
          position={config.lottiePosition ?? "top-right"}
        />
      )}
      {children}
    </div>
  );
}
