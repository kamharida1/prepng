import Link from "next/link";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";
import { EXAM_LANDING } from "@/lib/exam-landing";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-bold text-green-900">{APP_NAME}</p>
            <p className="mt-1 text-sm text-gray-600">Exam prep for Nigerian students.</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-2 inline-block text-sm text-green-700 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            {Object.values(EXAM_LANDING).map((exam) => (
              <Link key={exam.slug} href={exam.path} className="hover:text-green-800">
                {exam.exam}
              </Link>
            ))}
            <Link href="/practice" className="hover:text-green-800">
              Practice
            </Link>
            <Link href="/privacy" className="hover:text-green-800">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-800">
              Terms of Service
            </Link>
            <Link href="/refunds" className="hover:text-green-800">
              Refund Policy
            </Link>
            <Link href="/contact" className="hover:text-green-800">
              Contact
            </Link>
            <Link href="/pricing" className="hover:text-green-800">
              Pricing
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} {APP_NAME}. Not affiliated with JAMB, WAEC, NECO, or any
          examination body.
        </p>
      </div>
    </footer>
  );
}
