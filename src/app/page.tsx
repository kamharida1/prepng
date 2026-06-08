import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { QuestionBankOverview } from "@/components/QuestionBankOverview";
import {
  APP_NAME,
  APP_TAGLINE,
  EXAM_META,
  EXAM_TYPES,
} from "@/lib/constants";
import { getQuestionCounts } from "@/lib/question-stats";

export default function Home() {
  const counts = getQuestionCounts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <AuthHeader />

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="mb-3 inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-800">
            Built for Nigerian students
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {APP_NAME}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{APP_TAGLINE}</p>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">
            Real JAMB, WAEC & POST-UTME past questions · CBT practice · detailed explanations.
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
              <div
                key={exam}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                style={{ borderTopColor: EXAM_META[exam].color, borderTopWidth: 3 }}
              >
                <h2 className="text-lg font-bold text-gray-900">{exam}</h2>
                <p className="mt-1 text-sm text-gray-600">{EXAM_META[exam].description}</p>
                <p className="mt-3 text-sm font-semibold text-green-700">
                  {counts[exam] ?? 0} sample questions
                </p>
              </div>
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
