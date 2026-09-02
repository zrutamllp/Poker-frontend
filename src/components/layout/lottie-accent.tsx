import { lazy, Suspense } from "react";
import type { LottieAccentProps } from "@/components/layout/lottie-accent-inner";

const LazyLottieAccent = lazy(() => import("@/components/layout/lottie-accent-inner"));

/** Small corner Lottie — lazy-loaded, plays once */
export function LottieAccent(props: LottieAccentProps) {
  return (
    <Suspense fallback={null}>
      <LazyLottieAccent {...props} />
    </Suspense>
  );
}
