import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Target } from "lucide-react";
import { AetherArcadeShell } from "@/components/minigames/aether-arcade-shell";
import { GeoGuessFeedback } from "@/components/minigames/geo-guess-feedback";
import { GeoWorldMap, type GeoPin } from "@/components/minigames/geo-world-map";
import { MotionBoard, MotionPanel } from "@/components/minigames/minigame-motion";
import { MinigameInstructionsPanel } from "@/components/minigames/minigame-instructions-panel";
import { MinigameResult, MinigameSidebar } from "@/components/minigames/minigame-sidebar";
import { MinigameViewTabs, type MinigameView } from "@/components/minigames/minigame-view-tabs";
import { pickGeoRound } from "@/data/minigame-puzzles";
import { useMinigameOutcomeSubmit, useMinigameSession } from "@/hooks/use-minigame-session";
import { getGameLimits, MINIGAME_COPY } from "@/lib/minigame-difficulty";
import type { GeoLocation } from "@/types/minigame-session";
import {
  classifyGuessAccuracy,
  formatDistance,
  GEO_GUESS_FEEDBACK,
  haversineKm,
  radarWidthPercent,
  scoreFromDistance,
} from "@/lib/geo-guesser";
import { cn } from "@/lib/utils";

const WinCelebrationOverlay = lazy(
  () => import("@/components/minigames/win-celebration-overlay"),
);

type Status = "playing" | "round_result" | "won" | "lost";

function initGeoState(
  difficulty: ReturnType<typeof useMinigameSession>["difficulty"],
  rounds: number,
) {
  return {
    locations: pickGeoRound(difficulty, rounds) as GeoLocation[],
    roundIndex: 0,
    totalScore: 0,
    pin: null as GeoPin | null,
    lastResult: null as { distance: number; score: number } | null,
  };
}

export default function GeoGuesserPage() {
  const navigate = useNavigate();
  const {
    session,
    sessionVersion,
    loading,
    canRetry,
    isOnlineMode,
    attemptsRemaining,
    startSession,
    submitResult,
    difficulty,
  } = useMinigameSession("geo");
  const limits = session?.limits ?? getGameLimits("geo", difficulty);

  const [geoState, setGeoState] = useState(() =>
    initGeoState(difficulty, limits.rounds),
  );
  const [status, setStatus] = useState<Status>("playing");
  const [showTarget, setShowTarget] = useState(false);
  const [view, setView] = useState<MinigameView>("play");

  useEffect(() => {
    if (!session?.puzzles) return;
    setGeoState({
      locations: session.puzzles,
      roundIndex: 0,
      totalScore: 0,
      pin: null,
      lastResult: null,
    });
    setStatus("playing");
    setShowTarget(false);
  }, [session, sessionVersion]);

  const { locations, roundIndex, totalScore, pin, lastResult } = geoState;
  const location = locations[roundIndex] ?? locations[0];
  const isLastRound = roundIndex >= limits.rounds - 1;

  useMinigameOutcomeSubmit(
    status === "won" || status === "lost" ? status : "playing",
    submitResult,
    { totalScore },
    totalScore,
    sessionVersion,
  );

  const startNewSession = useCallback(() => {
    void startSession();
  }, [startSession]);

  const handleMapClick = useCallback(
    (nextPin: GeoPin) => {
      if (status !== "playing") return;
      setGeoState((s) => ({ ...s, pin: nextPin }));
    },
    [status],
  );

  const confirmGuess = useCallback(() => {
    if (status !== "playing" || !pin) return;
    const dist = haversineKm(pin, { lat: location.lat, lon: location.lon });
    const score = scoreFromDistance(dist);
    setGeoState((s) => ({
      ...s,
      totalScore: s.totalScore + score,
      lastResult: { distance: dist, score },
    }));
    setShowTarget(true);
    setStatus("round_result");
  }, [status, pin, location]);

  const nextRound = useCallback(() => {
    setGeoState((s) => {
      if (s.roundIndex >= limits.rounds - 1) {
        setStatus(s.totalScore >= limits.winScore ? "won" : "lost");
        return s;
      }
      setShowTarget(false);
      setStatus("playing");
      return {
        ...s,
        roundIndex: s.roundIndex + 1,
        pin: null,
        lastResult: null,
      };
    });
  }, [limits.rounds, limits.winScore]);

  const radarWidth = lastResult ? radarWidthPercent(lastResult.distance) : 0;
  const guessTier = lastResult ? classifyGuessAccuracy(lastResult.distance) : null;
  const feedbackCopy = guessTier ? GEO_GUESS_FEEDBACK[guessTier] : null;

  if (loading && !session?.puzzles) {
    return (
      <AetherArcadeShell gameLabel={MINIGAME_COPY.geo.label}>
        <div className="flex min-h-[40vh] items-center justify-center p-8 text-[#9e9bbf]">
          Loading session…
        </div>
      </AetherArcadeShell>
    );
  }

  return (
    <AetherArcadeShell gameLabel={MINIGAME_COPY.geo.label} contentClassName="overflow-hidden">
      {(status === "won" || status === "lost") && (
        <Suspense fallback={null}>
          <WinCelebrationOverlay variant={status === "won" ? "win" : "loss"} />
        </Suspense>
      )}

      <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden p-3 lg:flex-row lg:gap-4 lg:p-4">
        <aside className="flex w-full shrink-0 flex-col gap-3 overflow-y-auto lg:w-[300px] lg:overflow-y-visible">
          <MinigameViewTabs view={view} onChange={setView} />

          {view === "play" && (
            <>
              <MinigameSidebar
                difficulty={difficulty}
                category={location.region}
                onNewSession={startNewSession}
                isOnlineMode={isOnlineMode}
                attemptsRemaining={attemptsRemaining}
                canRetry={canRetry}
              >
                <div className="flex justify-between">
                  <span className="text-[#64618a]">Round</span>
                  <span className="font-mono font-extrabold text-[#06b6d4]">
                    {roundIndex + 1} / {limits.rounds}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64618a]">Session Score</span>
                  <span className="font-mono font-extrabold text-gold-light">{totalScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64618a]">Target</span>
                  <span className="font-mono font-extrabold text-white">{limits.winScore}+</span>
                </div>
              </MinigameSidebar>

              <MotionPanel
                delay={80}
                className="rounded-2xl border border-[#28254a] bg-[#121124]/95 p-4 backdrop-blur-sm"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[#64618a]">
                    {showTarget ? "Your guess vs actual location" : "Selected pin"}
                  </p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-bold leading-snug text-white">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#06b6d4]" />
                    {showTarget && feedbackCopy
                      ? `${feedbackCopy.title} — ${location.name}`
                      : pin
                        ? "Pin placed — confirm your guess"
                        : "Tap the map to drop a pin"}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-[11px]">
                    <span className="text-[#9e9bbf]">PROXIMITY RADAR</span>
                    <span className="font-mono font-bold text-[#06b6d4]">
                      {lastResult
                        ? `${formatDistance(lastResult.distance)} · +${lastResult.score}`
                        : "Awaiting guess"}
                    </span>
                  </div>
                  <div className="mg-shimmer-track h-2 overflow-hidden rounded bg-[#2a254a]">
                    <div
                      className={cn(
                        "h-full rounded transition-all duration-500",
                        lastResult && feedbackCopy?.radarClass,
                        lastResult && "mg-radar-fill",
                        !lastResult && "bg-[#06b6d4]",
                      )}
                      style={{ width: `${lastResult ? radarWidth : 0}%` }}
                    />
                  </div>
                </div>

                {status === "playing" && (
                  <button
                    type="button"
                    onClick={confirmGuess}
                    disabled={!pin}
                    className="mg-btn-glow mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    <Target className="size-4" />
                    {MINIGAME_COPY.geo.confirm}
                  </button>
                )}
                {status === "round_result" && (
                  <button
                    type="button"
                    onClick={nextRound}
                    className="mg-btn-glow mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#06b6d4] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {isLastRound ? "VIEW RESULTS" : MINIGAME_COPY.geo.next}
                  </button>
                )}
              </MotionPanel>

              {(status === "won" || status === "lost") && (
                <MinigameResult
                  variant={status === "won" ? "won" : "lost"}
                  title={status === "won" ? MINIGAME_COPY.geo.win : MINIGAME_COPY.geo.lose}
                  subtitle={
                    status === "won"
                      ? MINIGAME_COPY.winReward
                      : `Score: ${totalScore} / ${limits.winScore} required`
                  }
                  onRetry={startNewSession}
                  onBack={() => navigate("/instructions")}
                  canRetry={canRetry}
                  isOnlineMode={isOnlineMode}
                  attemptsRemaining={attemptsRemaining}
                />
              )}
            </>
          )}
        </aside>

        {view === "instructions" ? (
          <MinigameInstructionsPanel
            gameId="geo"
            difficulty={difficulty}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto"
          />
        ) : (
          <MotionBoard className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border border-[#28254a] bg-[#121124]/95 p-3 backdrop-blur-sm lg:p-4">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
                <MotionPanel
                  delay={0}
                  className="rounded-lg border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-xs font-extrabold text-white sm:text-sm"
                >
                  INTEL DROP {roundIndex + 1}
                </MotionPanel>
                <MotionPanel
                  delay={60}
                  className="rounded-lg border border-white/15 bg-black/70 px-3 py-1.5 font-mono text-xs font-extrabold text-[#f59e0b] sm:text-sm"
                >
                  {totalScore.toLocaleString()} PTS
                </MotionPanel>
              </div>

              <div className="shrink-0 text-center">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#64618a] sm:text-xs">
                  {showTarget ? "Result" : "Locate this country"}
                </p>
                <p className="mt-0.5 font-mono text-lg font-extrabold uppercase tracking-wide text-white sm:text-xl">
                  {location.name}
                </p>
                {!showTarget && (
                  <p className="mt-1 text-xs text-[#9e9bbf] sm:text-sm">{MINIGAME_COPY.geo.prompt}</p>
                )}
              </div>

              <MotionPanel delay={120} className="relative min-h-0 flex-1">
                <GeoWorldMap
                  onMapClick={handleMapClick}
                  guessPin={pin}
                  target={{ lat: location.lat, lon: location.lon }}
                  targetName={location.name}
                  showTarget={showTarget}
                  interactive={status === "playing"}
                  className={cn(
                    "h-full min-h-[180px] w-full aspect-auto",
                    showTarget && guessTier === "miss" && "animate-[mg-geo-miss-shake_0.5s_ease-in-out]",
                  )}
                />
                {showTarget && guessTier && (
                  <GeoGuessFeedback tier={guessTier} pulseKey={roundIndex} />
                )}
              </MotionPanel>
            </div>
          </MotionBoard>
        )}
      </div>
    </AetherArcadeShell>
  );
}
