import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { GameTopBar } from "@/components/layout/game-top-bar";
import { GameShell } from "@/components/layout/game-shell";
import { AnimatedValue, FloatingReward, StaggerIn } from "@/components/layout/game-ui";
import { Button } from "@/components/ui/button";
import { teams, TOTAL_ROUNDS } from "@/data/game-data";
import { cn } from "@/lib/utils";

const results = [
  { option: "C", text: "Radical Transparency", isCorrect: true, yourBet: 30, payout: 60 },
  { option: "A", text: "Innovation First", isCorrect: false, yourBet: 15, payout: 0 },
  { option: "B", text: "Customer Obsession", isCorrect: false, yourBet: 0, payout: 0 },
  { option: "D", text: "Sustainable Growth", isCorrect: false, yourBet: 0, payout: 0 },
];

function ResultCard({ result }: { result: (typeof results)[number] }) {
  const [showPayout, setShowPayout] = useState(false);

  useEffect(() => {
    if (result.payout > 0) {
      const id = window.setTimeout(() => setShowPayout(true), 300);
      return () => window.clearTimeout(id);
    }
  }, [result.payout]);

  return (
    <div
      className={cn(
        "relative rounded-xl border p-5",
        result.isCorrect
          ? "game-success-pop game-animate border-green bg-green/10 shadow-[0_0_20px_rgba(33,150,83,0.15)]"
          : "border-border bg-bg-card",
        !result.isCorrect && result.yourBet > 0 && "game-shake-once game-animate",
      )}
    >
      {result.payout > 0 && (
        <FloatingReward
          show={showPayout}
          label={`+${result.payout}`}
          className="-top-4 text-green"
          onDone={() => setShowPayout(false)}
        />
      )}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full font-serif font-black",
            result.isCorrect ? "bg-green text-white" : "bg-bg-elevated text-text-muted-alt",
          )}
        >
          {result.option}
        </span>
        {result.isCorrect && <Trophy className="size-5 text-green" />}
      </div>
      <p className="mt-3 font-semibold text-white">{result.text}</p>
      {result.yourBet > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          {result.payout > 0 ? (
            <>
              <TrendingUp className="size-4 text-green" />
              <AnimatedValue value={result.payout} className="text-green">
                {(v) => <>+{v} coins</>}
              </AnimatedValue>
            </>
          ) : (
            <>
              <TrendingDown className="size-4 text-red-400" />
              <span className="text-red-400">-{result.yourBet} coins</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnswerRevealPage() {
  const navigate = useNavigate();
  const correct = results.find((r) => r.isCorrect)!;

  return (
    <GameShell
      topBar={
        <GameTopBar
          round={3}
          totalRounds={TOTAL_ROUNDS}
          teamName="The Aces"
          cultureCoins={75}
          timerLabel="REVEAL"
          timer="—"
        />
      }
    >
      <div className="flex flex-col items-center gap-5 p-4 sm:gap-6 sm:p-6 md:gap-8 md:p-10">
        <div className="game-success-pop game-animate text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gold-muted">
            Answer Revealed
          </p>
          <h1 className="mt-2 font-serif text-3xl font-black text-gold-bright md:text-4xl">
            {correct.text}
          </h1>
          <p className="mt-2 text-sm text-text-muted-alt">
            Option {correct.option} was the correct answer
          </p>
        </div>

        <StaggerIn className="grid w-full max-w-3xl gap-3 sm:grid-cols-2" stepMs={70} baseDelayMs={100}>
          {results.map((result) => (
            <ResultCard key={result.option} result={result} />
          ))}
        </StaggerIn>

        <section className="game-stagger-in game-animate w-full max-w-3xl" style={{ animationDelay: "320ms" }}>
          <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-wider text-gold">
            Updated Standings
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-card text-left text-xs uppercase text-text-muted-alt">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3 text-right">Points</th>
                  <th className="hidden px-4 py-3 text-right sm:table-cell">Coins</th>
                </tr>
              </thead>
              <tbody>
                {teams.slice(0, 5).map((team) => (
                  <tr key={team.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 font-bold text-gold-bright">{team.rank}</td>
                    <td className="px-4 py-3 font-semibold text-white">{team.name}</td>
                    <td className="px-4 py-3 text-right text-white">{team.points}</td>
                    <td className="hidden px-4 py-3 text-right text-gold sm:table-cell">
                      {team.cultureCoins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Button
          onClick={() => navigate("/round-complete")}
          size="xl"
          className="font-serif font-black"
        >
          CONTINUE
        </Button>
      </div>
    </GameShell>
  );
}
