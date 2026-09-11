/** Geo Guesser scoring and map projection helpers */

export function projectLatLon(lat: number, lon: number): { x: number; y: number } {
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  };
}

export function mapPercentToLatLon(x: number, y: number): { lat: number; lon: number } {
  return {
    lon: (x / 100) * 360 - 180,
    lat: 90 - (y / 100) * 180,
  };
}

export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Score 0–1000; perfect pin = 1000 */
export function scoreFromDistance(km: number): number {
  return Math.max(0, Math.round(1000 - km * 1.5));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}

export function radarWidthPercent(km: number): number {
  return Math.max(12, Math.min(100, 100 - km / 200));
}

export type GeoGuessTier = "spot_on" | "close" | "miss";

/** Classify how accurate a pin was relative to the target country. */
export function classifyGuessAccuracy(km: number): GeoGuessTier {
  if (km <= 250) return "spot_on";
  if (km <= 1200) return "close";
  return "miss";
}

export const GEO_GUESS_FEEDBACK: Record<
  GeoGuessTier,
  { title: string; subtitle: string; radarClass: string }
> = {
  spot_on: {
    title: "Spot on!",
    subtitle: "Perfect intel drop.",
    radarClass: "bg-[#22c55e]",
  },
  close: {
    title: "Close!",
    subtitle: "Right region — sharpen your aim.",
    radarClass: "bg-[#06b6d4]",
  },
  miss: {
    title: "Way off!",
    subtitle: "Study the highlighted location.",
    radarClass: "bg-[#f59e0b]",
  },
};
