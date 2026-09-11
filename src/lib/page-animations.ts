export type PageCssVariant =
  | "chip-bounce"
  | "bubble-pop"
  | "card-fan"
  | "felt-deal"
  | "slide-bet"
  | "wobble-pick"
  | "flip-deal"
  | "curtain-wipe"
  | "trophy-bounce"
  | "slide-inbox"
  | "arcade-glitch"
  | "spotlight"
  | "fade-up";

export type LottieAccentPosition = "top-right" | "top-left" | "bottom-right";

export interface PageAnimationConfig {
  css: PageCssVariant;
  durationMs?: number;
  lottie?: string;
  lottiePosition?: LottieAccentPosition;
  lottieSize?: number;
  /** Show felt-table ambient orbs — off on dense gameplay screens */
  ambient?: boolean;
}

const DEFAULT: PageAnimationConfig = { css: "fade-up", durationMs: 420 };

const ROUTE_ANIMATIONS: Record<string, PageAnimationConfig> = {
  "/join": {
    css: "chip-bounce",
    durationMs: 520,
    lottie: "/lottie/accent-chip.json",
    lottiePosition: "top-right",
    lottieSize: 56,
  },
  "/team-setup": { css: "chip-bounce", durationMs: 480 },
  "/lobby": { css: "bubble-pop", durationMs: 460 },
  "/instructions": { css: "card-fan", durationMs: 500 },
  "/dashboard": {
    css: "felt-deal",
    durationMs: 480,
    lottie: "/lottie/accent-sparkle.json",
    lottiePosition: "top-right",
    lottieSize: 48,
    ambient: false,
  },
  "/prediction": {
    css: "slide-bet",
    durationMs: 440,
    lottie: "/lottie/accent-chip.json",
    lottiePosition: "top-right",
    lottieSize: 48,
    ambient: false,
  },
  "/betting": {
    css: "slide-bet",
    durationMs: 440,
    lottie: "/lottie/accent-chip.json",
    lottiePosition: "top-right",
    lottieSize: 48,
    ambient: false,
  },
  "/round": { css: "wobble-pick", durationMs: 460, ambient: false },
  "/clue": { css: "flip-deal", durationMs: 500, ambient: false },
  "/reveal": { css: "curtain-wipe", durationMs: 480, ambient: false },
  "/round-complete": {
    css: "trophy-bounce",
    durationMs: 500,
    lottie: "/lottie/accent-star-burst.json",
    lottiePosition: "top-right",
    lottieSize: 52,
  },
  "/scores": { css: "trophy-bounce", durationMs: 480 },
  "/inbox": { css: "slide-inbox", durationMs: 400 },
  "/chat": { css: "slide-inbox", durationMs: 400 },
  "/funds": {
    css: "slide-inbox",
    durationMs: 400,
    lottie: "/lottie/accent-sparkle.json",
    lottiePosition: "top-right",
    lottieSize: 44,
  },
  "/game-end": {
    css: "spotlight",
    durationMs: 560,
    lottie: "/lottie/accent-trophy.json",
    lottiePosition: "top-right",
    lottieSize: 64,
  },
};

export function getPageAnimation(pathname: string): PageAnimationConfig {
  if (ROUTE_ANIMATIONS[pathname]) return ROUTE_ANIMATIONS[pathname];
  if (pathname.startsWith("/minigame")) {
    return { css: "arcade-glitch", durationMs: 420, ambient: false };
  }
  return DEFAULT;
}
