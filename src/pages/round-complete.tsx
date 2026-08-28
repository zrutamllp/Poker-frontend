import {
  teams,
  bettingOptions,
  TOTAL_ROUNDS,
  round3TeamDeltas,
  roundCompleteSummary,
} from "@/data/game-data";
import { PokerTableCanvas } from "@/components/game/poker-table-canvas";
import { NavIconBar } from "@/components/layout/nav-icon-bar";
import { ScrollPage, PageContainer } from "@/components/layout/page-layouts";
import { cn } from "@/lib/utils";

export default function RoundCompletePage() {
  const { round, nextRound, correctAnswer, countdown, mvp, biggestBet, sideBetWinners } =
    roundCompleteSummary;

  return (
    <ScrollPage className="relative bg-bg-tertiary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)]" />
      <NavIconBar className="absolute right-4 top-4 z-10 sm:right-6 sm:top-4" />

      <PageContainer maxWidth="max-w-6xl" className="relative space-y-8 py-8 sm:space-y-10 sm:py-10">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h1 className="font-serif text-4xl font-black uppercase text-gold-light sm:text-5xl lg:text-6xl">
            Round {round} Complete
          </h1>
          <p className="text-lg text-white sm:text-xl">
            Correct Answer:{" "}
            <span className="font-bold text-gold-bright">
              {correctAnswer.label} - {correctAnswer.text}
            </span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {bettingOptions.map((opt, i) => {
              const isCorrect = opt.id === correctAnswer.label;
              return (
                <span
                  key={opt.id}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
                    isCorrect
                      ? "border-gold bg-gold/10 text-gold-light"
                      : "border-border bg-bg-card text-text-muted-alt",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-[18px] items-center justify-center rounded-full text-[10px] font-bold",
                      isCorrect ? "bg-gold text-text-dark" : "bg-bg-elevated text-text-muted",
                    )}
                  >
                    {i + 1}
                  </span>
                  {opt.text}
                </span>
              );
            })}
          </div>
        </header>

        {/* Poker table with round deltas */}
        <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl min-h-[280px] sm:min-h-[400px] lg:min-h-[480px]">
          <PokerTableCanvas
            teams={teams}
            currentRound={round}
            totalRounds={TOTAL_ROUNDS}
            teamDeltas={round3TeamDeltas}
          />
        </div>

        {/* Countdown */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted-alt">
            Next Round Starts In
          </p>
          <div className="flex size-28 items-center justify-center rounded-full border-2 border-gold bg-bg-card shadow-[0_0_24px_rgba(212,175,55,0.2)] sm:size-[120px]">
            <span className="font-display text-3xl font-black text-gold sm:text-4xl">
              {countdown}
            </span>
          </div>
          <div>
            <p className="font-serif text-2xl font-black text-gold-light sm:text-3xl">
              Get Ready
            </p>
            <p className="mt-1 text-sm text-text-muted-alt">
              Round {nextRound} of {TOTAL_ROUNDS} — auto-starts when timer ends
            </p>
          </div>
        </section>

        {/* Quick stats footer */}
        <footer className="flex flex-wrap items-center justify-center gap-3 border-t border-border pt-6 sm:gap-4">
          <StatPill
            label="Round 3 MVP"
            value={`${mvp.team} (+${mvp.delta} coins)`}
          />
          <StatPill
            label="Biggest Bet"
            value={`${biggestBet.team} (${biggestBet.amount} on ${biggestBet.option})`}
          />
          <StatPill label="Side Bet Winners" value={`${sideBetWinners} teams`} />
        </footer>
      </PageContainer>
    </ScrollPage>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-card px-4 py-2 text-sm">
      <span className="text-text-muted-alt">{label}</span>{" "}
      <span className="font-semibold text-gold-light">{value}</span>
    </div>
  );
}
