import { MapPin, Target } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";

export default function GeoGuesserPage() {
  return (
    <AetherArcadeShell gameLabel="WORLD SCOUT">
      <div className="flex min-h-full flex-col">
        <div className="relative flex h-[min(520px,55vh)] flex-col justify-between bg-gradient-to-br from-[#1e3a5f] via-[#2d5016] to-[#4a6741] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(0,0,0,0.2)_0%,transparent_60%)]" />

          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-lg border border-white/15 bg-black/70 px-4 py-2 font-mono text-sm font-extrabold text-white">
                ROUND 3 / 5
              </span>
              <span className="rounded-lg border border-white/15 bg-black/70 px-4 py-2 font-mono text-sm font-extrabold text-[#f59e0b]">
                SCORE: 9,840
              </span>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/70 font-mono text-sm font-extrabold text-[#06b6d4]">
              N
            </span>
          </div>

          <div className="relative flex justify-end">
            <div className="relative h-[180px] w-[260px] overflow-hidden rounded-xl border-2 border-[#8b5cf6] shadow-[0_8px_16px_rgba(0,0,0,0.63)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c1445] to-[#1a3a6b]" />
              <div className="absolute inset-0 opacity-30">
                <div className="grid h-full w-full grid-cols-6 grid-rows-4 gap-px">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-[#06b6d4]/20" />
                  ))}
                </div>
              </div>
              <span className="absolute left-[108px] top-[58px] flex size-[18px] items-center justify-center rounded-full border-2 border-[#06b6d4] bg-[#06b6d4]/30 shadow-[0_0_12px_#06b6d4]">
                <span className="size-2 rounded-full bg-[#06b6d4]" />
              </span>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-6 border-t border-[#28254a] bg-[#121124] p-6 sm:gap-8">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] uppercase text-[#64618a]">Selected Location</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-bold text-white">
              <MapPin className="size-[18px] text-[#06b6d4]" />
              Near Reykjavik, Iceland
            </p>
          </div>

          <div className="w-full sm:w-[340px]">
            <div className="mb-2 flex justify-between text-[13px]">
              <span className="text-[#9e9bbf]">PROXIMITY RADAR</span>
              <span className="font-mono font-bold text-[#06b6d4]">14.2 km accuracy</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-[#2a254a]">
              <div className="h-full w-[88%] rounded bg-[#06b6d4]" />
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white sm:w-[240px]"
          >
            <Target className="size-4" />
            CONFIRM GUESS
          </button>
        </footer>
      </div>
    </AetherArcadeShell>
  );
}
