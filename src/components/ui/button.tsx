import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "game-btn bg-gold text-text-dark border border-white rounded-pill shadow-[0_8px_12px_rgba(212,175,55,0.25)] hover:bg-gold-light active:scale-[0.98]",
        outline: "border border-border-gold bg-transparent text-gold hover:bg-gold/10 rounded-md",
        ghost: "text-text-muted hover:text-white hover:bg-white/5 rounded-md",
        dark: "bg-bg-elevated border border-border text-white hover:bg-bg-card rounded-md",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-[52px] px-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "gold",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { buttonVariants };
