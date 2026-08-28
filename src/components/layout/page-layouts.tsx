import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ViewportFitPageProps {
  children: ReactNode;
  className?: string;
  /** Allow inner main to scroll only when content exceeds viewport (short laptops) */
  scrollOnOverflow?: boolean;
}

/** Full-screen auth/onboarding layouts that should fit the viewport without page scroll */
export function ViewportFitPage({
  children,
  className,
  scrollOnOverflow = true,
}: ViewportFitPageProps) {
  return (
    <div
      className={cn(
        "flex h-dvh flex-col overflow-hidden bg-bg-primary",
        className,
      )}
    >
      <main
        className={cn(
          "flex flex-1 min-h-0 flex-col items-center justify-center px-4 py-[clamp(0.75rem,2vh,1.25rem)] sm:px-6 lg:px-8",
          scrollOnOverflow && "overflow-y-auto",
        )}
      >
        {children}
      </main>
    </div>
  );
}

interface AppShellPageProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

/** Application shells: fixed chrome + scrollable main content area */
export function AppShellPage({
  children,
  className,
  header,
  footer,
}: AppShellPageProps) {
  return (
    <div className={cn("flex h-dvh flex-col overflow-hidden bg-bg-primary", className)}>
      {header}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      {footer}
    </div>
  );
}

interface ScrollPageProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

/** Content-heavy pages that scroll naturally */
export function ScrollPage({ children, className, header }: ScrollPageProps) {
  return (
    <div className={cn("flex min-h-dvh flex-col bg-bg-primary", className)}>
      {header}
      <main className="flex-1">{children}</main>
    </div>
  );
}

/** Constrains content width and enables horizontal overflow protection */
export function PageContainer({
  children,
  className,
  maxWidth = "max-w-7xl",
}: {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div className={cn("mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8", maxWidth, className)}>
      {children}
    </div>
  );
}
