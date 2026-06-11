import type { Metadata } from "next";
import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { JsonLd } from "@/components/JsonLd";
import { QuestionBankOverview } from "@/components/QuestionBankOverview";
import {
  APP_NAME,
  APP_TAGLINE,
  EXAM_META,
  EXAM_TYPES,
} from "@/lib/constants";
import { examLandingPath } from "@/lib/exam-landing";
import { practiceUrl } from "@/lib/practice-url";
import { getQuestionCounts } from "@/lib/question-stats";
import {
  DEFAULT_DESCRIPTION,
  HOME_H1,
  homeJsonLd,
  pageMetadata,
} from "@/lib/seo";
import type { ExamType } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "JAMB, WAEC, NECO & POST-UTME Past Questions",
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  const counts = getQuestionCounts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <JsonLd data={homeJsonLd()} />
      <AuthHeader />

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="mb-3 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-800">
            Built for Nigerian students
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {HOME_H1}
          </h1>
          <p className="mx-auto mt-3 text-xl font-semibold text-green-800">{APP_NAME}</p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{APP_TAGLINE}</p>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Real JAMB, WAEC, NECO & POST-UTME past questions · CBT practice · detailed explanations.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/practice"
              className="rounded-xl bg-green-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-700/20 hover:bg-green-800"
            >
              Start free practice
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              View pricing
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXAM_TYPES.map((exam) => (
              <Link
                key={exam}
                href={examLandingPath(exam as ExamType)}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-300 hover:shadow-md"
                style={{ borderTopColor: EXAM_META[exam].color, borderTopWidth: 3 }}
              >
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-green-800">
                  {exam}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{EXAM_META[exam].description}</p>
                <p className="mt-3 text-sm font-semibold text-green-700">
                  {counts[exam] ?? 0} sample questions
                </p>
                <p className="mt-2 text-xs font-medium text-green-600 opacity-0 transition group-hover:opacity-100">
                  Start practice →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <QuestionBankOverview />

        <section className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Why students use PrepNG
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Real CBT experience",
                body: "Timer, question palette, mark-for-review — just like exam day.",
              },
              {
                title: "Learn from explanations",
                body: "Every question includes a clear explanation so you understand the why.",
              },
              {
                title: "Works offline",
                body: "Download question packs on Wi‑Fi and practice without data.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="rounded-2xl bg-green-800 px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="mx-auto mt-2 max-w-lg text-green-100">
              20 free questions daily. Upgrade anytime for unlimited access across all subjects.
            </p>
            <Link
              href="/practice"
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-green-800"
            >
              Practice now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
