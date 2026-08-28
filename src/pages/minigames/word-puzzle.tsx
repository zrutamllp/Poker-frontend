import { Plus } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { cn } from "@/lib/utils";

type LetterState = "correct" | "present" | "absent" | "empty";

const rows: { letters: string; states: LetterState[] }[] = [
  { letters: "REACT", states: ["correct", "present", "absent", "absent", "absent"] },
  { letters: "ROBOT", states: ["correct", "absent", "absent", "correct", "absent"] },
  { letters: "READY", states: ["correct", "correct", "correct", "absent", "absent"] },
  { letters: "REACH", states: ["correct", "correct", "correct", "correct", "correct"] },
];

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

const keyColors: Record<LetterState, string> = {
  correct: "bg-[#06b6d4] border-[#06b6d4] text-white",
  present: "bg-[#f59e0b] border-[#28254a] text-white",
  absent: "bg-[#2e2d4d] border-[#28254a] text-white",
  empty: "bg-[#1a1935] border-[#28254a] text-white",
};

const tileColors: Record<LetterState, string> = {
  correct: "bg-[#06b6d4] border-[#06b6d4]",
  present: "bg-[#f59e0b] border-[#f59e0b]",
  absent: "bg-[#2e2d4d] border-[#2e2d4d]",
  empty: "bg-[#1a1935] border-[#28254a]",
};

function getKeyState(letter: string): LetterState {
  if (["E", "R", "A", "C", "H"].includes(letter)) return "correct";
  if (["T", "Y", "O", "D", "B"].includes(letter)) return "present";
  return "absent";
}

export default function WordPuzzlePage() {
  return (
    <AetherArcadeShell gameLabel="LEXICODE">
      <div className="flex flex-col gap-6 p-4 sm:flex-row sm:p-8">
        <aside className="w-full shrink-0 sm:w-[280px]">
          <div className="rounded-2xl border border-[#28254a] bg-[#121124] p-5">
            <p className="mb-4 text-sm font-bold uppercase text-[#9e9bbf]">Player Status</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64618a]">Win Streak</span>
                <span className="font-mono font-extrabold text-[#06b6d4]">14 Games</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64618a]">Accuracy</span>
                <span className="font-mono font-extrabold text-white">94.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64618a]">Total Score</span>
                <span className="font-mono font-extrabold text-[#f59e0b]">12,480</span>
              </div>
            </div>
            <hr className="my-4 border-[#28254a]" />
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus className="size-4" />
              NEW GAME
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-6">
          <div className="flex flex-col gap-1.5">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-1.5">
                {Array.from({ length: 5 }, (_, ci) => {
                  const letter = row.letters[ci] ?? "";
                  const state = row.states[ci] ?? "empty";
                  return (
                    <div
                      key={ci}
                      className={cn(
                        "flex size-[52px] items-center justify-center rounded-lg border-2 font-display text-[22px] font-extrabold text-white",
                        letter ? tileColors[state] : tileColors.empty,
                      )}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
            {Array.from({ length: 2 }, (_, ri) => (
              <div key={`empty-${ri}`} className="flex gap-1.5">
                {Array.from({ length: 5 }, (_, ci) => (
                  <div
                    key={ci}
                    className="flex size-[52px] items-center justify-center rounded-lg border-2 border-[#28254a] bg-[#1a1935]"
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex w-full max-w-xl flex-col gap-1.5">
            {keyboardRows.map((row, ri) => (
              <div key={ri} className="flex justify-center gap-1.5">
                {row.map((key) => {
                  const isWide = key === "ENTER" || key === "DELETE";
                  const state = key.length === 1 ? getKeyState(key) : "absent";
                  return (
                    <button
                      key={key}
                      type="button"
                      className={cn(
                        "flex h-[46px] items-center justify-center rounded-md border font-bold text-white",
                        isWide ? "min-w-[70px] text-[11px]" : "w-[42px] text-[15px]",
                        key.length === 1 ? keyColors[state] : "border-[#28254a] bg-[#1a1935] text-[11px]",
                      )}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AetherArcadeShell>
  );
}
