import type { AnalyticsSummary, ExamSession, PracticeResult, Question, TopicStat } from "./types";

const ANALYTICS_KEY = "prepng-analytics";

export function buildPracticeResult(
  session: ExamSession,
  questions: Question[],
): PracticeResult {
  const topicMap = new Map<string, { correct: number; total: number }>();

  let score = 0;
  for (const q of questions) {
    const correct = session.answers[q.id] === q.correctAnswer;
    if (correct) score++;

    const entry = topicMap.get(q.topic) ?? { correct: 0, total: 0 };
    entry.total++;
    if (correct) entry.correct++;
    topicMap.set(q.topic, entry);
  }

  const topicStats: TopicStat[] = [...topicMap.entries()].map(([topic, s]) => ({
    topic,
    correct: s.correct,
    total: s.total,
  }));

  const total = questions.length;
  const durationMinutes = session.submittedAt
    ? Math.max(1, Math.round((session.submittedAt - session.startedAt) / 60000))
    : 0;

  return {
    id: `result-${session.id}`,
    sessionId: session.id,
    exam: session.exam,
    subject: session.subject,
    university: session.university,
    year: session.year,
    score,
    total,
    percentage: total ? Math.round((score / total) * 100) : 0,
    durationMinutes,
    topicStats,
    completedAt: session.submittedAt ?? Date.now(),
  };
}

export function getPracticeResults(): PracticeResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ANALYTICS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PracticeResult[];
  } catch {
    return [];
  }
}

function savePracticeResults(results: PracticeResult[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(results.slice(0, 100)));
}

export function recordPracticeResult(
  session: ExamSession,
  questions: Question[],
): PracticeResult {
  const result = buildPracticeResult(session, questions);
  const existing = getPracticeResults().filter((r) => r.sessionId !== session.id);
  savePracticeResults([result, ...existing]);

  fetch("/api/user/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  }).catch(() => {
    // Best-effort sync for logged-in users
  });

  return result;
}

export function computeAnalyticsSummary(
  results: PracticeResult[],
): AnalyticsSummary {
  if (!results.length) {
    return {
      totalExams: 0,
      totalQuestions: 0,
      averageScore: 0,
      bestScore: 0,
      bySubject: {},
      byExam: {},
      weakTopics: [],
      recentResults: [],
    };
  }

  const totalQuestions = results.reduce((s, r) => s + r.total, 0);
  const averageScore = Math.round(
    results.reduce((s, r) => s + r.percentage, 0) / results.length,
  );
  const bestScore = Math.max(...results.map((r) => r.percentage));

  const bySubject: AnalyticsSummary["bySubject"] = {};
  const byExam: AnalyticsSummary["byExam"] = {};
  const topicAgg = new Map<string, { correct: number; total: number }>();

  for (const r of results) {
    const subKey = r.university ? `${r.subject} (${r.university})` : r.subject;
    if (!bySubject[subKey]) bySubject[subKey] = { exams: 0, avgScore: 0 };
    bySubject[subKey].exams++;
    bySubject[subKey].avgScore += r.percentage;

    if (!byExam[r.exam]) byExam[r.exam] = { exams: 0, avgScore: 0 };
    byExam[r.exam].exams++;
    byExam[r.exam].avgScore += r.percentage;

    for (const t of r.topicStats) {
      const e = topicAgg.get(t.topic) ?? { correct: 0, total: 0 };
      e.correct += t.correct;
      e.total += t.total;
      topicAgg.set(t.topic, e);
    }
  }

  for (const key of Object.keys(bySubject)) {
    bySubject[key].avgScore = Math.round(bySubject[key].avgScore / bySubject[key].exams);
  }
  for (const key of Object.keys(byExam)) {
    byExam[key].avgScore = Math.round(byExam[key].avgScore / byExam[key].exams);
  }

  const weakTopics = [...topicAgg.entries()]
    .map(([topic, s]) => ({
      topic,
      correct: s.correct,
      total: s.total,
      accuracy: s.total ? s.correct / s.total : 0,
    }))
    .filter((t) => t.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)
    .map(({ topic, correct, total }) => ({ topic, correct, total }));

  return {
    totalExams: results.length,
    totalQuestions,
    averageScore,
    bestScore,
    bySubject,
    byExam,
    weakTopics,
    recentResults: results.slice(0, 10),
  };
}
