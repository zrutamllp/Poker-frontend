import { Spade, Diamond } from "lucide-react";
import { GameAmbientFx } from "@/components/layout/game-ui";
import { cn } from "@/lib/utils";

interface AuthSceneProps {
  children: React.ReactNode;
  className?: string;
}

/** Decorative casino-noir backdrop for join / team-setup flows */
export function AuthScene({ children, className }: AuthSceneProps) {
  return (
    <div className={cn("relative flex h-dvh flex-col overflow-hidden bg-bg-primary", className)}>
      <GameAmbientFx />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(21,66,40,0.18)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
      <Spade className="pointer-events-none absolute left-4 top-4 size-16 text-white/[0.03] sm:left-[60px] sm:top-[60px] sm:size-28 lg:size-32" />
      <Diamond className="pointer-events-none absolute bottom-4 right-4 size-16 text-white/[0.03] sm:bottom-[60px] sm:right-[60px] sm:size-28 lg:size-32" />

      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
        {children}
      </main>
    </div>
  );
}
