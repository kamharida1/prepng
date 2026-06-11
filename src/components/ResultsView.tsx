"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getSessionQuestions } from "@/lib/session-questions";
import { getSessionById } from "@/lib/storage";
import { EXAM_META } from "@/lib/constants";
import { getResultExplanation } from "@/lib/explanations";
import { QuestionContent } from "./QuestionContent";

interface ResultsViewProps {
  sessionId: string;
}

export function ResultsView({ sessionId }: ResultsViewProps) {
  const session = getSessionById(sessionId);

  const results = useMemo(() => {
    if (!session) return null;
    const questions = getSessionQuestions(session);
    const details = questions.map((q) => {
      const userAnswer = session.answers[q.id];
      const correct = userAnswer === q.correctAnswer;
      return { question: q, userAnswer, correct };
    });

    const score = details.filter((d) => d.correct).length;
    const total = details.length;
    const percentage = total ? Math.round((score / total) * 100) : 0;

    const sortedDetails = [
      ...details.filter((d) => !d.correct),
      ...details.filter((d) => d.correct),
    ];

    return { details: sortedDetails, score, total, percentage };
  }, [session]);

  if (!session || !results) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-600">Results not found.</p>
        <Link href="/practice" className="mt-4 inline-block text-green-700 font-medium">
          Start new practice
        </Link>
      </div>
    );
  }

  const examColor = EXAM_META[session.exam].color;
  const duration = session.submittedAt
    ? Math.round((session.submittedAt - session.startedAt) / 60000)
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div
        className="mb-8 rounded-2xl border bg-white p-6 shadow-sm"
        style={{ borderTopColor: examColor, borderTopWidth: 4 }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {session.exam} · {session.subject} · {session.year}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Your Results</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-green-700">Score</p>
            <p className="text-2xl font-bold text-green-900">
              {results.score}/{results.total}
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-blue-700">Percentage</p>
            <p className="text-2xl font-bold text-blue-900">{results.percentage}%</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Time used</p>
            <p className="text-2xl font-bold text-gray-900">{duration} min</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          {results.percentage >= 70
            ? "Strong performance. Keep practicing to stay consistent."
            : results.percentage >= 50
              ? "Decent attempt. Review the explanations below and retry."
              : "Needs more work. Focus on the topics you missed and practice again."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/practice"
            className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Practice again
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
          >
            Unlock unlimited
          </Link>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-gray-900">
        {results.details.some((d) => !d.correct)
          ? "Review questions you missed"
          : "Review with explanations"}
      </h2>
      <div className="space-y-4">
        {results.details.map(({ question, userAnswer, correct }, index) => (
          <article
            key={question.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              correct ? "border-green-200" : "border-red-200"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Q{index + 1}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {question.topic}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  correct ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {correct ? "Correct" : "Wrong"}
              </span>
            </div>

            <QuestionContent
              text={question.text}
              imageUrl={question.imageUrl}
              className="mb-4"
            />

            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {question.options.map((opt) => {
                const isCorrect = opt.key === question.correctAnswer;
                const isUser = opt.key === userAnswer;
                return (
                  <div
                    key={opt.key}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      isCorrect
                        ? "border-green-500 bg-green-50"
                        : isUser
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200"
                    }`}
                  >
                    <span className="font-semibold">{opt.key}.</span> {opt.text}
                  </div>
                );
              })}
            </div>

            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                correct ? "bg-blue-50 text-blue-900" : "bg-amber-50 text-amber-950"
              }`}
            >
              <p className="font-semibold">
                {correct ? "Explanation" : "Why you got this wrong"}
              </p>
              <p className="mt-1">{getResultExplanation(question, userAnswer)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
