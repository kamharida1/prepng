"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionPalette } from "./QuestionPalette";
import { QuestionContent } from "./QuestionContent";
import { Timer } from "./Timer";
import { EXAM_META } from "@/lib/constants";
import { getSessionQuestions } from "@/lib/session-questions";
import {
  archiveSession,
  clearActiveSession,
  saveActiveSession,
} from "@/lib/storage";
import { recordPracticeResult } from "@/lib/analytics";
import { fetchUsageState, recordUsage } from "@/lib/user-subscription";
import type { ExamSession } from "@/lib/types";

interface CBTExamProps {
  initialSession: ExamSession;
}

export function CBTExam({ initialSession }: CBTExamProps) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const questions = useMemo(
    () => getSessionQuestions(session),
    [session],
  );

  const currentQuestion = questions[currentIndex];
  const examColor = EXAM_META[session.exam].color;

  const updateSession = useCallback((updates: Partial<ExamSession>) => {
    setSession((prev) => {
      const next = { ...prev, ...updates };
      saveActiveSession(next);
      return next;
    });
  }, []);

  const selectAnswer = (answer: string) => {
    if (!currentQuestion) return;
    updateSession({
      answers: { ...session.answers, [currentQuestion.id]: answer },
    });
  };

  const toggleMark = () => {
    if (!currentQuestion) return;
    const marked = new Set(session.markedForReview);
    if (marked.has(currentQuestion.id)) {
      marked.delete(currentQuestion.id);
    } else {
      marked.add(currentQuestion.id);
    }
    updateSession({ markedForReview: [...marked] });
  };

  const submitExam = useCallback(() => {
    const submitted: ExamSession = {
      ...session,
      submittedAt: Date.now(),
    };
    archiveSession(submitted);
    clearActiveSession();
    recordPracticeResult(submitted, questions);
    fetchUsageState().then((usage) =>
      recordUsage(session.questionIds.length, usage),
    );
    router.push(`/results?session=${session.id}`);
  }, [session, router, questions]);

  const handleExpire = useCallback(() => {
    submitExam();
  }, [submitExam]);

  if (!currentQuestion) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-600">No questions found for this session.</p>
      </div>
    );
  }

  const answeredCount = Object.keys(session.answers).length;
  const unanswered = session.questionIds.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="border-b bg-white px-4 py-3"
        style={{ borderTopColor: examColor, borderTopWidth: 4 }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {session.exam} CBT Practice
            </p>
            <h1 className="text-lg font-bold text-gray-900">
              {session.subject} · {session.year}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Q{currentIndex + 1} of {questions.length}
            </span>
            <Timer
              startedAt={session.startedAt}
              timeLimitMinutes={session.timeLimitMinutes}
              onExpire={handleExpire}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {currentQuestion.topic}
            </span>
            <button
              type="button"
              onClick={toggleMark}
              className={`text-sm font-medium ${
                session.markedForReview.includes(currentQuestion.id)
                  ? "text-amber-600"
                  : "text-gray-500 hover:text-amber-600"
              }`}
            >
              {session.markedForReview.includes(currentQuestion.id)
                ? "★ Marked"
                : "☆ Mark for review"}
            </button>
          </div>

          <QuestionContent
            text={currentQuestion.text}
            imageUrl={currentQuestion.imageUrl}
            className="mb-6 text-base"
          />

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const selected = session.answers[currentQuestion.id] === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => selectAnswer(option.key)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      selected
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {option.key}
                  </span>
                  <span className="pt-1 text-gray-800">{option.text}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-40"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="ml-auto rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Submit Exam
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-gray-900">Question palette</h2>
            <QuestionPalette
              total={questions.length}
              currentIndex={currentIndex}
              answers={session.answers}
              questionIds={session.questionIds}
              markedForReview={session.markedForReview}
              onSelect={setCurrentIndex}
            />
            <div className="mt-4 space-y-1 text-xs text-gray-500">
              <p>
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Answered
              </p>
              <p>
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Marked
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            <p>Answered: {answeredCount}</p>
            <p>Unanswered: {unanswered}</p>
            <p>Marked: {session.markedForReview.length}</p>
          </div>
        </aside>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Submit exam?</h3>
            <p className="mt-2 text-sm text-gray-600">
              You have answered {answeredCount} of {questions.length} questions.
              {unanswered > 0 && ` ${unanswered} question(s) are still unanswered.`}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={submitExam}
                className="flex-1 rounded-lg bg-green-700 py-2.5 text-sm font-medium text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
