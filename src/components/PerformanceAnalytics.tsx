"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  computeAnalyticsSummary,
  getPracticeResults,
} from "@/lib/analytics";
import type { AnalyticsSummary, PracticeResult } from "@/lib/types";

interface PerformanceAnalyticsProps {
  premium: boolean;
  compact?: boolean;
}

function ScoreBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 70 ? "bg-green-500" : percentage >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      />
    </div>
  );
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PerformanceAnalytics({ premium, compact }: PerformanceAnalyticsProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let results = getPracticeResults();

      try {
        const res = await fetch("/api/user/analytics");
        const data = await res.json();
        if (data.authenticated && data.results?.length) {
          const localIds = new Set(results.map((r) => r.id));
          const merged = [
            ...results,
            ...(data.results as PracticeResult[]).filter((r) => !localIds.has(r.id)),
          ].sort((a, b) => b.completedAt - a.completedAt);
          results = merged;
        }
      } catch {
        // Use local only
      }

      setSummary(computeAnalyticsSummary(results));
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading analytics...</p>;
  }

  if (!premium) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">Performance analytics</h2>
        <p className="mt-2 text-sm text-gray-600">
          Track your scores by subject, spot weak topics, and monitor improvement over time.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-block rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Upgrade to unlock analytics
        </Link>
      </div>
    );
  }

  if (!summary || summary.totalExams === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Performance analytics</h2>
        <p className="mt-2 text-sm text-gray-600">
          Complete a CBT exam to start tracking your performance.
        </p>
        <Link
          href="/practice"
          className="mt-4 inline-block rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Start practice
        </Link>
      </div>
    );
  }

  const statCards = [
    { label: "Exams taken", value: summary.totalExams },
    { label: "Questions answered", value: summary.totalQuestions },
    { label: "Average score", value: `${summary.averageScore}%` },
    { label: "Best score", value: `${summary.bestScore}%` },
  ];

  if (compact) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Performance</h2>
          <Link href="/analytics" className="text-sm font-semibold text-green-700">
            View all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl bg-gray-50 px-3 py-3 text-center">
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {summary.weakTopics.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">Topics to revise</h3>
          <p className="mt-1 text-sm text-gray-500">Lowest accuracy across your practice sessions</p>
          <ul className="mt-4 space-y-3">
            {summary.weakTopics.map((t) => {
              const pct = t.total ? Math.round((t.correct / t.total) * 100) : 0;
              return (
                <li key={t.topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-gray-800">{t.topic}</span>
                    <span className="text-gray-500">
                      {t.correct}/{t.total} ({pct}%)
                    </span>
                  </div>
                  <ScoreBar percentage={pct} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">By subject</h3>
          <ul className="mt-4 space-y-3">
            {Object.entries(summary.bySubject).map(([sub, data]) => (
              <li key={sub} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{sub}</span>
                <span className="font-semibold text-gray-900">
                  {data.avgScore}% <span className="font-normal text-gray-400">({data.exams} exams)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900">By exam type</h3>
          <ul className="mt-4 space-y-3">
            {Object.entries(summary.byExam).map(([ex, data]) => (
              <li key={ex} className="flex items-center justify-between text-sm">
                <span className="text-gray-800">{ex}</span>
                <span className="font-semibold text-gray-900">
                  {data.avgScore}% <span className="font-normal text-gray-400">({data.exams} exams)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-gray-900">Recent exams</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-2 pr-4 font-medium">Date</th>
                <th className="pb-2 pr-4 font-medium">Exam</th>
                <th className="pb-2 pr-4 font-medium">Subject</th>
                <th className="pb-2 pr-4 font-medium">Score</th>
                <th className="pb-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentResults.map((r) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-2 pr-4 text-gray-600">{formatDate(r.completedAt)}</td>
                  <td className="py-2 pr-4">{r.exam}</td>
                  <td className="py-2 pr-4">
                    {r.subject}
                    {r.university ? ` (${r.university.toUpperCase()})` : ""}
                  </td>
                  <td className="py-2 pr-4 font-semibold">
                    {r.score}/{r.total} ({r.percentage}%)
                  </td>
                  <td className="py-2 text-gray-500">{r.durationMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
