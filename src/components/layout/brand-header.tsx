import { Spade, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandHeaderProps {
  subtitle?: string;
  edition?: string;
  size?: "xs" | "sm" | "lg";
  className?: string;
  align?: "center" | "start";
}

export function BrandHeader({
  subtitle,
  edition = "CASINO-NOIR EDITION",
  size = "lg",
  className,
  align = "center",
}: BrandHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-3 md:gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Spade
          className={cn(
            "shrink-0 text-gold",
            size === "lg" ? "size-6 sm:size-8" : "size-5",
          )}
        />
        <h1
          className={cn(
            "font-serif font-black text-gold-light tracking-tight",
            size === "lg"
              ? "text-3xl sm:text-4xl lg:text-5xl"
              : size === "sm"
                ? "text-xl sm:text-2xl md:text-3xl"
                : "text-base sm:text-lg",
          )}
        >
          THE CULTURE TABLE
        </h1>
        <Diamond
          className={cn(
            "shrink-0 text-gold",
            size === "lg" ? "size-6 sm:size-8" : "size-5",
          )}
        />
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
