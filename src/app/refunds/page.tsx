import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Refund Policy",
  description: `Refund and cancellation policy for ${APP_NAME} subscription plans paid via Paystack.`,
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" updated="8 June 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Overview</h2>
        <p className="mt-2 leading-relaxed">
          We want you to be satisfied with {APP_NAME}. This Refund Policy explains when refunds
          are available for paid subscriptions purchased through our website via Paystack.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Eligible refunds</h2>
        <p className="mt-2 leading-relaxed">You may request a full refund if:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            You contact us within <strong>7 days</strong> of payment, and
          </li>
          <li>
            You have used fewer than <strong>50 practice questions</strong> on the paid plan since
            payment, and
          </li>
          <li>The issue is not caused by your device, internet, or account misuse</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Non-refundable cases</h2>
        <p className="mt-2 leading-relaxed">Refunds are generally not available when:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>More than 7 days have passed since payment</li>
          <li>You have substantially used the paid plan (50+ questions or clear heavy usage)</li>
          <li>You violated our Terms of Service (sharing accounts, payment fraud, etc.)</li>
          <li>You simply changed your mind after extensive use of Pro features</li>
          <li>Issues are caused by third parties (network outages, device problems, exam body changes)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Technical problems</h2>
        <p className="mt-2 leading-relaxed">
          If you paid but did not receive access due to a technical fault on our side, contact us
          immediately. We will either activate your subscription or issue a full refund — whichever
          you prefer.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. How to request a refund</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 leading-relaxed">
          <li>
            Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-green-700 hover:underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            with the subject line &quot;Refund Request&quot;
          </li>
          <li>Include the email used for payment and your Paystack transaction reference</li>
          <li>Briefly explain the reason for your request</li>
          <li>We respond within 3–5 business days</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">6. Refund method</h2>
        <p className="mt-2 leading-relaxed">
          Approved refunds are processed back to your original payment method through Paystack.
          Depending on your bank, refunds may take 5–14 business days to appear in your account.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">7. Plan changes</h2>
        <p className="mt-2 leading-relaxed">
          We do not offer partial refunds for unused time on Monthly or Exam Season plans. If you
          have a genuine billing error (e.g. double charge), contact us and we will investigate.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">8. Contact</h2>
        <p className="mt-2 leading-relaxed">
          Refund questions? Reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-green-700 hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          or via our <a href="/contact" className="text-green-700 hover:underline">Contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
