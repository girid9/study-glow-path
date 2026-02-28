export type Attempt = {
  id: string;
  subjectId: string;
  topicId: string;
  questionId: string;
  correct: boolean;
  timestamp: number;
  timeMs?: number;
};

export type ProgressState = {
  attempts: Attempt[];
  mistakes: Record<string, boolean>; // questionId -> true
  bookmarks: Record<string, boolean>; // questionId -> true
  dailyGoal: { questions: number };
};

const KEY = "studyglow.progress.v1";

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return { attempts: [], mistakes: {}, bookmarks: {}, dailyGoal: { questions: 20 } };
    }
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      mistakes: parsed.mistakes ?? {},
      bookmarks: parsed.bookmarks ?? {},
      dailyGoal: parsed.dailyGoal ?? { questions: 20 },
    };
  } catch {
    return { attempts: [], mistakes: {}, bookmarks: {}, dailyGoal: { questions: 20 } };
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function recordAttempt(input: Omit<Attempt, "id" | "timestamp"> & { timeMs?: number }) {
  const state = loadProgress();
  const attempt: Attempt = {
    id: crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2),
    timestamp: Date.now(),
    ...input,
  };
  state.attempts = [attempt, ...state.attempts].slice(0, 2000);
  if (!attempt.correct) state.mistakes[attempt.questionId] = true;
  saveProgress(state);
  return attempt;
}

export function toggleBookmark(questionId: string) {
  const state = loadProgress();
  state.bookmarks[questionId] = !state.bookmarks[questionId];
  if (!state.bookmarks[questionId]) delete state.bookmarks[questionId];
  saveProgress(state);
  return state.bookmarks[questionId] ?? false;
}

export function setDailyGoal(questions: number) {
  const state = loadProgress();
  state.dailyGoal = { questions: Math.max(5, Math.min(100, Math.round(questions))) };
  saveProgress(state);
  return state.dailyGoal;
}

export function clearMistakes() {
  const state = loadProgress();
  state.mistakes = {};
  saveProgress(state);
}
