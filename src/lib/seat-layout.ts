import type { CSSProperties } from "react";

interface EllipticalSeatOptions {
  /** Horizontal radius as % from center (default 42) */
  radiusX?: number;
  /** Vertical radius as % from center (default 36) */
  radiusY?: number;
  /** Radians offset before first seat (default -π/2 = top) */
  startAngle?: number;
}

/**
 * Evenly distributes seats around an elliptical poker table.
 * Uses layout relationships — not Figma coordinates.
 */
export function getEllipticalSeatStyle(
  index: number,
  total: number,
  options: EllipticalSeatOptions = {},
): CSSProperties {
  const { radiusX = 42, radiusY = 36, startAngle = -Math.PI / 2 } = options;
  const angle = startAngle + (index / total) * 2 * Math.PI;
  const left = 50 + radiusX * Math.cos(angle);
  const top = 50 + radiusY * Math.sin(angle);

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: "translate(-50%, -50%)",
  };
}
