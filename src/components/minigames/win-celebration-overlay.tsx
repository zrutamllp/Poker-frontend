import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

setWasmUrl("/lottie/dotlottie-player.wasm");

interface WinCelebrationOverlayProps {
  variant: "win" | "loss";
}

/** Lightweight celebration overlay — confetti on win, flash on loss */
export default function WinCelebrationOverlay({ variant }: WinCelebrationOverlayProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || prefersReducedMotion) return null;

  const overlay = (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 top-[72px] z-[9999] overflow-hidden"
      aria-hidden
    >
      {variant === "win" ? (
        <>
          <div className="absolute inset-0 animate-[mg-win-burst_0.6s_ease-out] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_70%)]" />
          <DotLottieReact
          src="/lottie/confetti-celebration.json"
          autoplay
          loop={false}
          layout={{ fit: "cover", align: [0.5, 0.5] }}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        </>
      ) : (
        <>
          <div className="absolute inset-0 animate-[loss-flash_0.9s_ease-out] bg-[#f59e0b]/15" />
          <div className="absolute inset-0 animate-[mg-wrong-jolt_0.5s_ease-in-out] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_65%)]" />
        </>
      )}
    </div>
  );

  return createPortal(overlay, document.body);
}
