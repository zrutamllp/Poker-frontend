import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, RefreshCcw, Redo2, Shuffle, Sparkles } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { cn } from "@/lib/utils";

const GRID_SIZE = 4;
const swappedCells = new Set([0, 3, 6, 9, 10, 12, 15]);

export default function PicturePuzzlePage() {
  const navigate = useNavigate();
  const [moves] = useState(48);

  return (
    <AetherArcadeShell gameLabel="PICTURE SLIDER">
      <div className="flex flex-col gap-6 p-4 sm:flex-row sm:gap-6 sm:p-8">
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-6 sm:gap-8">
              <div>
                <p className="text-xs text-[#64618a]">TIMER</p>
                <div className="flex items-center gap-2">
                  <Clock className="size-[18px] text-[#06b6d4]" />
                  <span className="font-mono text-2xl font-bold text-[#06b6d4]">04:12</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#64618a]">MOVES</p>
                <div className="flex items-center gap-2">
                  <RefreshCcw className="size-[18px] text-[#f59e0b]" />
                  <span className="font-mono text-2xl font-bold text-[#f59e0b]">
                    {String(moves).padStart(3, "0")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#9e9bbf]">DIFFICULTY:</span>
              <span className="rounded-md border border-[#8b5cf6] bg-[#8b5cf6]/20 px-3 py-1.5 text-[13px] font-bold text-white">
                NORMAL 4x4
              </span>
            </div>
          </div>

          <div className="mx-auto aspect-square w-full max-w-[520px] rounded-2xl border-2 border-[#28254a] bg-[#121124] p-2">
            <div
              className="grid h-full gap-1.5"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                const isEmpty = i === 10;
                const isSwapped = swappedCells.has(i);
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative overflow-hidden rounded-lg border",
                      isSwapped ? "border-2 border-[#06b6d4]" : "border-[#28254a] bg-[#1a1935]",
                      isEmpty && "bg-[#080711]",
                    )}
                  >
                    {!isEmpty && (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#0e7490] to-[#f59e0b] opacity-90"
                        style={{
                          backgroundPosition: `${(i % GRID_SIZE) * 33}% ${Math.floor(i / GRID_SIZE) * 33}%`,
                        }}
                      />
                    )}
                    {isSwapped && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-[#06b6d4] px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-white">
                        SWAPPED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 sm:w-[340px]">
          <div className="rounded-2xl border border-[#28254a] bg-[#121124] p-4">
            <p className="mb-3 text-[13px] font-bold uppercase text-[#9e9bbf]">Reference View</p>
            <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-[#4c1d95] via-[#0e7490] to-[#f59e0b]" />
            <p className="mt-3 text-center text-xs text-[#64618a]">&quot;Neon Citadel Horizon&quot;</p>
          </div>

          <div className="rounded-2xl border border-[#28254a] bg-[#121124] p-5">
            <p className="mb-4 text-sm font-bold text-white">CONTROLS</p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white"
              >
                <Shuffle className="size-4" />
                SHUFFLE PUZZLE
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-5 py-3 text-sm font-semibold text-[#9e9bbf]"
              >
                <Sparkles className="size-4" />
                GET HINT (3 left)
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-[#28254a] bg-[#1a1935] px-5 py-3 text-sm font-semibold text-[#9e9bbf]"
              >
                <Redo2 className="size-4" />
                RESET BOARD
              </button>
            </div>
            <hr className="my-4 border-[#28254a]" />
            <p className="text-xs text-[#9e9bbf]">GAME RULES:</p>
            <p className="mt-2 text-xs leading-relaxed text-[#64618a]">
              Swap adjacent tiles to reconstruct the reference image before time runs out.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/instructions")}
            className="rounded-lg bg-[#06b6d4] px-5 py-3 text-sm font-bold text-white"
          >
            COMPLETE PUZZLE
          </button>
        </aside>
      </div>
    </AetherArcadeShell>
  );
}
