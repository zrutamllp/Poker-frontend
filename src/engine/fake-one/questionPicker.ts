import type { FakeOneQuestion, FakeOneSession } from "@/types/fake-one";
import type { MinigameDifficulty } from "@/lib/minigame-difficulty";
import { FAKE_ONE_QUESTIONS } from "@/data/fake-one/questions";

export function validateQuestion(q: FakeOneQuestion): boolean {
  if (q.statements.length !== 4) return false;
  if (q.fakeIndex < 0 || q.fakeIndex > 3) return false;
  if (q.statements.some((s) => !s.trim())) return false;
  return true;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Progress difficulty: rounds 1–3 → L1, 4–6 → L2, 7–9 → L3, 10+ → L4 */
function targetDifficulty(roundIndex: number): 1 | 2 | 3 | 4 {
  if (roundIndex < 3) return 1;
  if (roundIndex < 6) return 2;
  if (roundIndex < 9) return 3;
  return 4;
}

function pickQuestionForRound(
  pool: FakeOneQuestion[],
  roundIndex: number,
  usedIds: Set<string>,
  lastCategory: string | null,
): FakeOneQuestion | null {
  const target = targetDifficulty(roundIndex);
  const candidates = pool.filter(
    (q) =>
      !usedIds.has(q.id) &&
      q.difficulty === target &&
      q.category !== lastCategory,
  );
  const fallback = pool.filter(
    (q) => !usedIds.has(q.id) && q.difficulty === target,
  );
  const wider = pool.filter((q) => !usedIds.has(q.id));
  const pick = candidates.length
    ? candidates
    : fallback.length
      ? fallback
      : wider;
  if (!pick.length) return null;
  return pick[Math.floor(Math.random() * pick.length)];
}

export function pickFakeOneSession(
  difficulty: MinigameDifficulty,
  totalRounds: number,
): FakeOneSession {
  const tier = difficulty;
  const pool = FAKE_ONE_QUESTIONS.filter((q) => {
    if (!validateQuestion(q)) return false;
    if (tier === "high_stakes") return true;
    return q.tier === "standard";
  });
  const shuffledPool = shuffle(pool);
  const questions: FakeOneQuestion[] = [];
  const usedIds = new Set<string>();
  let lastCategory: string | null = null;

  for (let i = 0; i < totalRounds; i++) {
    let q: FakeOneQuestion | null = pickQuestionForRound(
      shuffledPool,
      i,
      usedIds,
      lastCategory,
    );
    if (!q) {
      q = shuffledPool.find((item) => !usedIds.has(item.id)) ?? null;
    }
    if (!q) break;
    usedIds.add(q.id);
    lastCategory = q.category;
    questions.push(q);
  }

  return {
    questions,
    totalRounds: questions.length,
    seed: Date.now(),
    tier: difficulty,
  };
}
