import { Spade, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandHeaderProps {
  subtitle?: string;
  edition?: string;
  size?: "sm" | "lg";
  className?: string;
}

export function BrandHeader({
  subtitle,
  edition = "CASINO-NOIR EDITION",
  size = "lg",
  className,
}: BrandHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 sm:gap-3 md:gap-4", className)}>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Spade className={cn("text-gold", size === "lg" ? "size-6 sm:size-8" : "size-5")} />
        <h1
          className={cn(
            "font-serif font-black text-gold-light tracking-tight",
            size === "lg"
              ? "text-3xl sm:text-4xl lg:text-5xl"
              : "text-xl sm:text-2xl md:text-3xl",
          )}
        >
          THE CULTURE TABLE
        </h1>
        <Diamond className={cn("text-gold", size === "lg" ? "size-6 sm:size-8" : "size-5")} />
      </div>
      {edition && (
        <span className="rounded-pill border border-gold-muted bg-bg-panel px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gold">
          {edition}
        </span>
      )}
      {subtitle && (
        <p className="text-sm text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
