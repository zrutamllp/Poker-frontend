import { useCallback, useEffect, useRef, useState } from "react";
import {
  FAKE_ONE_BASE_POINTS,
  FAKE_ONE_DOUBLE_POINTS,
  roundPoints,
  streakBonus,
  timerForDifficulty,
} from "@/engine/fake-one/scoringEngine";
import type {
  FakeOneQuestion,
  FakeOneRisk,
  FakeOneRoundResult,
  FakeOneSession,
  FakeOneState,
} from "@/types/fake-one";

const REVEAL_MS = 2400;

function initState(session: FakeOneSession, winScore: number): FakeOneState {
  const q = session.questions[0];
  return {
    phase: "playing",
    round: 1,
    totalRounds: session.totalRounds,
    score: 0,
    winScore,
    streak: 0,
    longestStreak: 0,
    correctCount: 0,
    doubleDownAttempts: 0,
    doubleDownWins: 0,
    results: [],
    selectedIndex: null,
    risk: null,
    timeLeft: q ? timerForDifficulty(q.difficulty, session.tier === "high_stakes") : 12,
    seed: session.seed,
  };
}

export function useFakeOne(session: FakeOneSession, winScore: number, active = true) {
  const [state, setState] = useState<FakeOneState>(() => initState(session, winScore));
  const revealTimer = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentQuestion: FakeOneQuestion | null =
    session.questions[state.round - 1] ?? null;

  useEffect(() => {
    setState(initState(session, winScore));
  }, [session.seed, session.totalRounds, winScore]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const advanceAfterReveal = useCallback(
    (nextResults: FakeOneRoundResult[], nextScore: number, nextStreak: number, nextLongest: number, nextCorrect: number, nextDDAttempts: number, nextDDWins: number) => {
      if (state.round >= state.totalRounds) {
        setState((s) => ({
          ...s,
          phase: "complete",
          results: nextResults,
          score: nextScore,
          streak: nextStreak,
          longestStreak: nextLongest,
          correctCount: nextCorrect,
          doubleDownAttempts: nextDDAttempts,
          doubleDownWins: nextDDWins,
        }));
        return;
      }

      const nextRound = state.round + 1;
      const nextQ = session.questions[nextRound - 1];
      setState((s) => ({
        ...s,
        phase: "playing",
        round: nextRound,
        results: nextResults,
        score: nextScore,
        streak: nextStreak,
        longestStreak: nextLongest,
        correctCount: nextCorrect,
        doubleDownAttempts: nextDDAttempts,
        doubleDownWins: nextDDWins,
        selectedIndex: null,
        risk: null,
        timeLeft: nextQ
          ? timerForDifficulty(nextQ.difficulty, session.tier === "high_stakes")
          : 12,
      }));
    },
    [session.questions, session.tier, state.round, state.totalRounds],
  );

  const resolveRound = useCallback(
    (
      selectedIndex: number | null,
      risk: FakeOneRisk | null,
      timedOut: boolean,
    ) => {
      if (!currentQuestion) return;

      const correct =
        !timedOut &&
        selectedIndex !== null &&
        selectedIndex === currentQuestion.fakeIndex;
      const base = roundPoints(correct, risk);
      const newStreak = correct ? state.streak + 1 : 0;
      const bonus = correct ? streakBonus(newStreak) : 0;
      const points = base + bonus;
      const nextScore = state.score + points;
      const nextLongest = Math.max(state.longestStreak, newStreak);
      const nextCorrect = state.correctCount + (correct ? 1 : 0);
      const nextDDAttempts =
        state.doubleDownAttempts + (risk === "double" && !timedOut ? 1 : 0);
      const nextDDWins =
        state.doubleDownWins + (risk === "double" && correct ? 1 : 0);

      const result: FakeOneRoundResult = {
        round: state.round,
        questionId: currentQuestion.id,
        selectedIndex,
        fakeIndex: currentQuestion.fakeIndex,
        correct,
        timedOut,
        risk,
        pointsEarned: points,
        streakAfter: newStreak,
      };

      const nextResults = [...state.results, result];

      setState((s) => ({
        ...s,
        phase: "reveal",
        results: nextResults,
        score: nextScore,
        streak: newStreak,
        longestStreak: nextLongest,
        correctCount: nextCorrect,
        doubleDownAttempts: nextDDAttempts,
        doubleDownWins: nextDDWins,
        selectedIndex,
        risk,
      }));

      if (revealTimer.current) window.clearTimeout(revealTimer.current);
      revealTimer.current = window.setTimeout(() => {
        advanceAfterReveal(
          nextResults,
          nextScore,
          newStreak,
          nextLongest,
          nextCorrect,
          nextDDAttempts,
          nextDDWins,
        );
      }, REVEAL_MS);
    },
    [
      advanceAfterReveal,
      currentQuestion,
      state.correctCount,
      state.doubleDownAttempts,
      state.doubleDownWins,
      state.longestStreak,
      state.results,
      state.round,
      state.score,
      state.streak,
    ],
  );

  const selectAnswer = useCallback(
    (index: number) => {
      if (state.phase !== "playing" || !currentQuestion) return;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setState((s) => ({ ...s, selectedIndex: index, phase: "risk" }));
    },
    [currentQuestion, state.phase],
  );

  const submitRisk = useCallback(
    (risk: FakeOneRisk) => {
      if (state.phase !== "risk" || state.selectedIndex === null) return;
      resolveRound(state.selectedIndex, risk, false);
    },
    [resolveRound, state.phase, state.selectedIndex],
  );

  const handleTimeout = useCallback(() => {
    if (state.phase !== "playing") return;
    resolveRound(null, null, true);
  }, [resolveRound, state.phase]);

  useEffect(() => {
    if (!active || state.phase !== "playing" || !currentQuestion) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setState((s) => {
        if (s.timeLeft <= 0) return s;
        return { ...s, timeLeft: s.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [active, state.phase, state.round, currentQuestion?.id]);

  useEffect(() => {
    if (state.phase === "playing" && state.timeLeft === 0) {
      handleTimeout();
    }
  }, [state.phase, state.timeLeft, handleTimeout]);

  const reset = useCallback(() => {
    if (revealTimer.current) window.clearTimeout(revealTimer.current);
    if (timerRef.current) window.clearInterval(timerRef.current);
    setState(initState(session, winScore));
  }, [session, winScore]);

  const won = state.phase === "complete" && state.score >= winScore;

  const lastResult = state.results[state.results.length - 1] ?? null;

  return {
    state,
    currentQuestion,
    lastResult,
    won,
    selectAnswer,
    submitRisk,
    reset,
    constants: { FAKE_ONE_BASE_POINTS, FAKE_ONE_DOUBLE_POINTS },
  };
}
