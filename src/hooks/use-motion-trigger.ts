import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/** Fires a one-shot CSS class when dependency values change (skips initial mount). */
export function useMotionTrigger<T>(value: T, className: string): string {
  const prefersReducedMotion = usePrefersReducedMotion();
  const prevRef = useRef(value);
  const [active, setActive] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevRef.current = value;
      return;
    }
    if (prefersReducedMotion || Object.is(prevRef.current, value)) return;
    prevRef.current = value;
    setActive(true);
    const id = window.setTimeout(() => setActive(false), 400);
    return () => window.clearTimeout(id);
  }, [value, prefersReducedMotion]);

  if (prefersReducedMotion || !active) return "";
  return className;
}
