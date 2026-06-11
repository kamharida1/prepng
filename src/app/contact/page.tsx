import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact & support",
  description: `Contact ${APP_NAME} for help with JAMB, WAEC, NECO and POST-UTME practice, billing, or account issues.`,
  path: "/contact",
});

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
    `Hi ${APP_NAME}, I need help with...`,
  )}`;

  return (
    <LegalLayout title="Contact & Support" updated="8 June 2026">
      <section>
        <p className="leading-relaxed">
          Need help with your account, payments, or practice? Reach out — we typically respond
          within 1–2 business days.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Email</h2>
        <p className="mt-2 text-gray-600">Best for payment issues, account problems, and refunds.</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-3 inline-block text-lg font-semibold text-green-700 hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">WhatsApp</h2>
        <p className="mt-2 text-gray-600">Fastest for quick questions from students and parents.</p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
        >
          Chat on WhatsApp
        </a>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Common topics</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-gray-700">
          <li>Payment not reflecting after Paystack success</li>
          <li>Cannot log in or reset password</li>
          <li>Wrong answer or typo in a question</li>
          <li>Refund requests (see our Refund Policy)</li>
          <li>School or lesson centre partnership enquiries</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">Report a question error</h2>
        <p className="mt-2 leading-relaxed">
          Found a wrong answer or broken question? Email us with the subject, exam type, and a
          screenshot if possible. We review reports and update content regularly.
        </p>
      </section>
    </LegalLayout>
  );
}
