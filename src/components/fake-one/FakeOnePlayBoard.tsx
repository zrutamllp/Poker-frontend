import { minigameTheme as theme } from "@/components/minigames/minigame-theme";
import {
  MinigameViewport,
  MinigameViewportFooter,
  MinigameViewportMain,
} from "@/components/minigames/minigame-viewport";
import type { FakeOneQuestion, FakeOneRoundResult, FakeOneState } from "@/types/fake-one";
import { cn } from "@/lib/utils";

function formatCategory(category: string): string {
  return category.replace(/\b\w/g, (c) => c.toUpperCase());
}

interface FakeOnePlayBoardProps {
  state: FakeOneState;
  question: FakeOneQuestion;
  lastResult: FakeOneRoundResult | null;
  onSelect: (index: number) => void;
  onLock: () => void;
  onDouble: () => void;
}

export function FakeOnePlayBoard({
  state,
  question,
  lastResult,
  onSelect,
  onLock,
  onDouble,
}: FakeOnePlayBoardProps) {
  const canRisk = state.phase === "risk" && state.selectedIndex !== null;
  const showingReveal = state.phase === "reveal" && lastResult;

  return (
    <MinigameViewport className="px-[clamp(10px,2.5vw,20px)] pb-[clamp(6px,1.2vh,10px)]">
      <MinigameViewportMain className="gap-[clamp(6px,1.2vh,10px)]">
        <div className="shrink-0">
          <p
            className={cn("font-bold uppercase tracking-widest", theme.label)}
            style={{ fontSize: "clamp(9px, 1.6vh, 10px)" }}
          >
            {formatCategory(question.category)}
          </p>
          <h2
            className={cn("font-serif font-black leading-tight", theme.heading)}
            style={{ fontSize: "clamp(14px, 2.8vh, 20px)" }}
          >
            Which statement is fake?
          </h2>
        </div>

        <ul
          className={cn(
            "grid min-h-0 flex-1 gap-[clamp(6px,1.2vh,10px)]",
            "grid-cols-1 min-[520px]:grid-cols-2",
          )}
          style={{ gridAutoRows: "1fr" }}
        >
          {question.statements.map((text, i) => {
            const num = i + 1;
            const selected = state.selectedIndex === i;
            const isFake =
              state.phase === "reveal" && i === question.fakeIndex;
            const isWrongPick =
              state.phase === "reveal" &&
              state.selectedIndex === i &&
              i !== question.fakeIndex;

            return (
              <li key={i} className="min-h-0">
                <button
                  type="button"
                  disabled={state.phase !== "playing"}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "flex h-full min-h-0 w-full flex-col rounded-lg border text-left transition-colors",
                    "p-[clamp(8px,1.5vh,12px)]",
                    state.phase === "playing" &&
                      !selected &&
                      "border-gold-muted/40 bg-[#05130a]/80 hover:border-gold/40 hover:bg-gold/5",
                    selected &&
                      (state.phase === "risk" || state.phase === "playing") &&
                      "border-gold/60 bg-gold/10 ring-1 ring-gold/30",
                    isFake && "border-green/60 bg-green/10",
                    isWrongPick && "border-gold/40 bg-gold/5 opacity-80",
                  )}
                >
                  <span
                    className={cn("font-mono font-bold", theme.label)}
                    style={{ fontSize: "clamp(10px, 1.8vh, 11px)" }}
                  >
                    {String(num).padStart(2, "0")}
                  </span>
                  <p
                    className={cn("mt-0.5 flex-1 leading-snug", theme.emphasis)}
                    style={{ fontSize: "clamp(11px, 2.1vh, 14px)" }}
                  >
                    {text}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </MinigameViewportMain>

      <MinigameViewportFooter>
        {showingReveal && lastResult ? (
          <div
            className={cn(
              "rounded-lg border px-[clamp(10px,2vw,14px)] py-[clamp(6px,1.2vh,10px)]",
              lastResult.correct
                ? "border-green/40 bg-green/10"
                : "border-gold-muted/50 bg-[#05130a]/90",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p
                className={cn(
                  "font-serif font-black uppercase",
                  lastResult.correct ? "text-green" : theme.heading,
                )}
                style={{ fontSize: "clamp(12px, 2.2vh, 15px)" }}
              >
                {lastResult.timedOut
                  ? "Time's up"
                  : lastResult.correct
                    ? "Correct"
                    : "Not this time"}
              </p>
              {lastResult.pointsEarned > 0 && (
                <p
                  className="font-mono font-bold text-green"
                  style={{ fontSize: "clamp(14px, 2.6vh, 18px)" }}
                >
                  +{lastResult.pointsEarned}
                  {lastResult.streakAfter >= 3 && (
                    <span className="ml-1.5 font-sans text-gold-light" style={{ fontSize: "clamp(10px, 1.8vh, 11px)" }}>
                      Streak ×{lastResult.streakAfter}
                    </span>
                  )}
                </p>
              )}
            </div>
            <p
              className={cn("mt-1 line-clamp-2 leading-snug", theme.body)}
              style={{ fontSize: "clamp(10px, 1.8vh, 12px)" }}
            >
              #{lastResult.fakeIndex + 1} was fake — {question.explanation}
            </p>
          </div>
        ) : (
          <>
            <p
              className={cn(
                "mb-[clamp(4px,0.8vh,8px)] text-center font-bold uppercase tracking-wide",
                theme.heading,
              )}
              style={{ fontSize: "clamp(9px, 1.6vh, 10px)" }}
            >
              {canRisk ? "Confident?" : "Select the fake statement"}
            </p>
            <div className="grid grid-cols-2 gap-[clamp(6px,1.2vh,10px)]">
              <button
                type="button"
                disabled={!canRisk}
                onClick={onLock}
                className={cn(
                  "mg-btn-glow font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40",
                  theme.btnGhost,
                )}
                style={{
                  fontSize: "clamp(10px, 1.9vh, 12px)",
                  padding: "clamp(8px, 1.6vh, 12px) clamp(10px, 2vw, 16px)",
                }}
              >
                Lock (+100)
              </button>
              <button
                type="button"
                disabled={!canRisk}
                onClick={onDouble}
                className={cn(
                  "mg-btn-glow font-bold uppercase disabled:cursor-not-allowed disabled:opacity-40",
                  theme.btnPrimary,
                )}
                style={{
                  fontSize: "clamp(10px, 1.9vh, 12px)",
                  padding: "clamp(8px, 1.6vh, 12px) clamp(10px, 2vw, 16px)",
                }}
              >
                Double down (+200)
              </button>
            </div>
          </>
        )}
      </MinigameViewportFooter>
    </MinigameViewport>
  );
}
