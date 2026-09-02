import { projectLatLon } from "@/lib/geo-guesser";
import { cn } from "@/lib/utils";

const WORLD_MAP_SRC = "/assets/minigames/world-map.jpg";

export interface GeoPin {
  lat: number;
  lon: number;
}

interface GeoWorldMapProps {
  onMapClick?: (pin: GeoPin) => void;
  guessPin?: GeoPin | null;
  target?: GeoPin | null;
  targetName?: string;
  showTarget?: boolean;
  interactive?: boolean;
  className?: string;
}

export function GeoWorldMap({
  onMapClick,
  guessPin,
  target,
  targetName,
  showTarget = false,
  interactive = true,
  className,
}: GeoWorldMapProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const lon = (x / 100) * 360 - 180;
    const lat = 90 - (y / 100) * 180;
    onMapClick({ lat, lon });
  };

  const targetPos = target ? projectLatLon(target.lat, target.lon) : null;
  const guessPos = guessPin ? projectLatLon(guessPin.lat, guessPin.lon) : null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border-2 border-[#8b5cf6] shadow-[0_8px_16px_rgba(0,0,0,0.63)] aspect-[2/1]",
        interactive && "cursor-crosshair",
        className,
      )}
      onClick={handleClick}
      role="presentation"
    >
      <img
        src={WORLD_MAP_SRC}
        alt="World map"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.72] contrast-[1.08] saturate-[0.85]"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,6,24,0.55)_100%)]" />
      <div className="mg-scanline pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      {showTarget && targetPos && (
        <>
          <span
            className="pointer-events-none absolute z-10 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#06b6d4]/60 bg-[#06b6d4]/10 shadow-[0_0_24px_rgba(6,182,212,0.45)]"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
            aria-hidden
          />
          <span
            className="mg-animate mg-tile-correct pointer-events-none absolute z-20 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#06b6d4] bg-[#06b6d4]/50 shadow-[0_0_18px_#06b6d4]"
            style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
            aria-hidden
          />
          {targetName && (
            <span
              className="pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-[#06b6d4]/50 bg-black/85 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wide text-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.35)]"
              style={{
                left: `${targetPos.x}%`,
                top: `calc(${targetPos.y}% - 2rem)`,
              }}
            >
              {targetName}
            </span>
          )}
        </>
      )}

      {guessPos && (
        <span
          className={cn(
            "mg-pin-pulse pointer-events-none absolute z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f59e0b] bg-[#f59e0b]/40 shadow-[0_0_12px_#f59e0b]",
            showTarget && "opacity-90",
          )}
          style={{ left: `${guessPos.x}%`, top: `${guessPos.y}%` }}
          aria-hidden
        >
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f59e0b]" />
        </span>
      )}

      {showTarget && guessPos && targetPos && (
        <svg
          className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line
            x1={guessPos.x}
            y1={guessPos.y}
            x2={targetPos.x}
            y2={targetPos.y}
            stroke="#f59e0b"
            strokeWidth="0.4"
            strokeDasharray="2 1.5"
            opacity="0.65"
          />
        </svg>
      )}
    </div>
  );
}
