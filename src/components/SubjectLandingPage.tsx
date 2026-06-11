import Link from "next/link";
import { AuthHeader } from "@/components/AuthHeader";
import { JsonLd } from "@/components/JsonLd";
import { APP_NAME, EXAM_META } from "@/lib/constants";
import { examLandingPath, getExamSubjects } from "@/lib/exam-landing";
import { practiceUrl } from "@/lib/practice-url";
import {
  type SubjectLandingConfig,
  subjectLandingJsonLd,
  subjectLandingPath,
} from "@/lib/subject-landing";

interface SubjectLandingPageProps {
  config: SubjectLandingConfig;
}

export function SubjectLandingPage({ config }: SubjectLandingPageProps) {
  const color = EXAM_META[config.exam].color;
  const otherSubjects = getExamSubjects(config.exam).filter(
    ({ subject }) => subject !== config.subject,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={subjectLandingJsonLd(config)} />
      <AuthHeader />

      <main>
        <section
          className="border-b bg-white px-4 py-14"
          style={{ borderTopColor: color, borderTopWidth: 4 }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {APP_NAME} · {config.exam} · {config.subject}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {config.h1}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">{config.intro}</p>
            <p className="mt-4 text-sm font-medium text-green-700">
              {config.questionCount} questions · {EXAM_META[config.exam].defaultMinutes}-min timed
              sessions
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={practiceUrl(config.exam, config.subject)}
                className="rounded-xl bg-green-700 px-8 py-3.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Start {config.subject} practice
              </Link>
              <Link
                href={examLandingPath(config.exam)}
                className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                All {config.exam} subjects
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            What you get on {APP_NAME}
          </h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <span className="font-bold text-green-700">✓</span>
              Timed CBT sessions with question palette and mark-for-review
            </li>
            <li className="flex gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <span className="font-bold text-green-700">✓</span>
              Detailed explanations after every {config.subject} session
            </li>
            <li className="flex gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <span className="font-bold text-green-700">✓</span>
              Download {config.subject} packs for offline practice
            </li>
          </ul>
        </section>

        {otherSubjects.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 py-12">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
              Other {config.exam} subjects
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {otherSubjects.map(({ subject, count }) => (
                <Link
                  key={subject}
                  href={subjectLandingPath(config.exam, subject)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-green-300 hover:bg-green-50"
                >
                  <p className="font-semibold text-gray-900">{subject}</p>
                  <p className="mt-1 text-xs text-gray-500">{count} questions</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">FAQ</h2>
          <div className="space-y-4">
            {config.faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
          <div className="rounded-2xl bg-green-800 px-6 py-10 text-white">
            <h2 className="text-2xl font-bold">Ready to practice {config.subject}?</h2>
            <p className="mx-auto mt-2 max-w-md text-green-100">
              20 free questions daily. Start a timed {config.exam} session now.
            </p>
            <Link
              href={practiceUrl(config.exam, config.subject)}
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-green-800"
            >
              Start free practice
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            <Link href={examLandingPath(config.exam)} className="text-green-700 hover:underline">
              ← All {config.exam} subjects
            </Link>
            {" · "}
            <Link href="/" className="text-green-700 hover:underline">
              Home
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
