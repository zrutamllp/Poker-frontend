import type { FakeOneRisk } from "@/types/fake-one";

export const FAKE_ONE_BASE_POINTS = 100;
export const FAKE_ONE_DOUBLE_POINTS = 200;

export function streakBonus(streak: number): number {
  if (streak >= 8) return 200;
  if (streak >= 5) return 100;
  if (streak >= 3) return 50;
  return 0;
}

export function roundPoints(correct: boolean, risk: FakeOneRisk | null): number {
  if (!correct) return 0;
  return risk === "double" ? FAKE_ONE_DOUBLE_POINTS : FAKE_ONE_BASE_POINTS;
}

export function accuracyPercent(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function performanceLabel(accuracy: number): string {
  if (accuracy >= 90) return "Exceptional";
  if (accuracy >= 75) return "Sharp";
  if (accuracy >= 50) return "Solid";
  return "The facts got you this time.";
}

export function timerForDifficulty(_level: number, highStakes: boolean): number {
  return highStakes ? 25 : 30;
}
