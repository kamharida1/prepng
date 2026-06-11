import Link from "next/link";
import { getPackSummaries, getQuestionManifest } from "@/lib/question-stats";
import { EXAM_META } from "@/lib/constants";
import { examLandingPath } from "@/lib/exam-landing";
import { subjectLandingPath } from "@/lib/subject-landing";
import type { ExamType } from "@/lib/types";

export function QuestionBankOverview() {
  const manifest = getQuestionManifest();
  const packs = getPackSummaries();

  const byExam = packs.reduce(
    (acc, pack) => {
      if (!acc[pack.exam as ExamType]) acc[pack.exam as ExamType] = [];
      acc[pack.exam as ExamType].push(pack);
      return acc;
    },
    {} as Record<ExamType, typeof packs>,
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Question bank</h2>
        <p className="mt-2 text-gray-600">
          {manifest.totalQuestions} questions across {manifest.packs.length} subject packs
          (2021–2024)
        </p>
      </div>

      <div className="space-y-6">
        {(Object.keys(byExam) as ExamType[]).map((exam) => (
          <div
            key={exam}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderTopColor: EXAM_META[exam].color, borderTopWidth: 3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <Link
                href={examLandingPath(exam)}
                className="text-lg font-bold text-gray-900 hover:text-green-800"
              >
                {exam}
              </Link>
              <span className="text-sm font-medium text-green-700">
                {byExam[exam].reduce((sum, p) => sum + p.count, 0)} questions
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {byExam[exam].map((pack) => (
                <Link
                  key={pack.slug}
                  href={subjectLandingPath(exam, pack.subject)}
                  className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm transition hover:border-green-300 hover:bg-green-50"
                >
                  <p className="font-medium text-gray-900">{pack.subject}</p>
                  <p className="text-xs text-gray-500">
                    {pack.count} Qs · {pack.years.join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
