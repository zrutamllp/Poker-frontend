import { lazy, Suspense, useEffect, useState } from "react";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { GeoGuessTier } from "@/lib/geo-guesser";
import { GEO_GUESS_FEEDBACK } from "@/lib/geo-guesser";
import { cn } from "@/lib/utils";

setWasmUrl("/lottie/dotlottie-player.wasm");

interface GeoGuessFeedbackProps {
  tier: GeoGuessTier;
  /** Changes each round so animations replay */
  pulseKey: number;
  className?: string;
}

function GeoGuessFeedbackInner({ tier, pulseKey, className }: GeoGuessFeedbackProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const copy = GEO_GUESS_FEEDBACK[tier];

  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), tier === "spot_on" ? 2800 : 2200);
    return () => window.clearTimeout(timer);
  }, [tier, pulseKey]);

  if (!visible || prefersReducedMotion) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-40 overflow-hidden rounded-xl",
        className,
      )}
      aria-hidden
    >
      {tier === "spot_on" && (
        <>
          <div className="absolute inset-0 animate-[mg-win-burst_0.6s_ease-out] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.22)_0%,transparent_70%)]" />
          <DotLottieReact
            key={`confetti-${pulseKey}`}
            src="/lottie/confetti-celebration.json"
            autoplay
            loop={false}
            layout={{ fit: "cover", align: [0.5, 0.5] }}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </>
      )}

      {tier === "close" && (
        <>
          <div className="absolute inset-0 animate-[mg-geo-close-pulse_1.4s_ease-out] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.18)_0%,transparent_65%)]" />
          <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2">
            <DotLottieReact
              key={`sparkle-${pulseKey}`}
              src="/lottie/accent-sparkle.json"
              autoplay
              loop={false}
              layout={{ fit: "contain", align: [0.5, 0.5] }}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </>
      )}

      {tier === "miss" && (
        <>
          <div className="absolute inset-0 animate-[loss-flash_0.85s_ease-out] bg-[#ef4444]/12" />
          <div className="absolute inset-0 animate-[mg-wrong-jolt_0.55s_ease-in-out] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.16)_0%,transparent_60%)]" />
        </>
      )}

      <div
        className={cn(
          "mg-animate mg-win-burst absolute left-1/2 top-4 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border px-4 py-2 text-center shadow-lg",
          tier === "spot_on" && "border-[#22c55e]/50 bg-black/85 text-[#22c55e]",
          tier === "close" && "border-[#06b6d4]/50 bg-black/85 text-[#06b6d4]",
          tier === "miss" && "border-[#f59e0b]/50 bg-black/85 text-[#f59e0b]",
        )}
      >
        <p className="font-mono text-sm font-extrabold uppercase tracking-wider">{copy.title}</p>
        <p className="mt-0.5 text-[11px] font-medium text-white/75">{copy.subtitle}</p>
      </div>
    </div>
  );
}

const LazyGeoGuessFeedback = lazy(async () => ({
  default: GeoGuessFeedbackInner,
}));

export function GeoGuessFeedback(props: GeoGuessFeedbackProps) {
  return (
    <Suspense fallback={null}>
      <LazyGeoGuessFeedback {...props} />
    </Suspense>
  );
}
