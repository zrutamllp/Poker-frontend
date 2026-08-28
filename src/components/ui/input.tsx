import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex w-full items-center gap-2.5 rounded-md border-[1.5px] border-border bg-bg-input p-3 focus-within:border-gold-muted sm:gap-3 sm:p-4">
          <span className="shrink-0 text-gold-muted">{icon}</span>
          <input
            ref={ref}
            className={cn(
              "flex-1 bg-transparent text-[15px] text-white placeholder:text-text-muted outline-none",
              className,
            )}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border-[1.5px] border-border bg-bg-input px-3 text-[15px] text-white placeholder:text-text-muted outline-none focus:border-gold-muted sm:h-12 sm:px-4",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
