import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { APP_NAME, COMPANY_NAME, SUPPORT_EMAIL } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: `Terms and conditions for using ${APP_NAME} exam practice platform.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="8 June 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Agreement</h2>
        <p className="mt-2 leading-relaxed">
          By accessing or using {APP_NAME} (&quot;the Service&quot;), operated by {COMPANY_NAME},
          you agree to these Terms of Service. If you do not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. What {APP_NAME} provides</h2>
        <p className="mt-2 leading-relaxed">
          {APP_NAME} offers online exam preparation tools including CBT-style practice, past
          questions, explanations, and subscription-based access to additional features. The
          Service is for educational practice only.
        </p>
        <p className="mt-2 leading-relaxed">
          <strong>Important:</strong> {APP_NAME} is not affiliated with, endorsed by, or
          connected to JAMB, WAEC, NECO, any university, or any examination body. Questions are
          provided for practice purposes and may not reflect exact live examination papers.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. Accounts</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>You must provide accurate information when creating an account.</li>
          <li>You are responsible for keeping your login credentials secure.</li>
          <li>You must not share your paid subscription in a way that violates these Terms.</li>
          <li>We may suspend accounts involved in fraud, abuse, or examination malpractice.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Subscriptions and payments</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>Paid plans are billed in Nigerian Naira (₦) through Paystack.</li>
          <li>Prices are shown on our Pricing page and may change with notice.</li>
          <li>Access to paid features begins after successful payment verification.</li>
          <li>Free accounts are limited to the features described at the time of signup.</li>
        </ul>
        <p className="mt-2 leading-relaxed">
          See our <a href="/refunds" className="text-green-700 hover:underline">Refund Policy</a>{" "}
          for cancellation and refund rules.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. Acceptable use</h2>
        <p className="mt-2 leading-relaxed">You agree not to:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>Use the Service to cheat in live examinations or promote examination malpractice</li>
          <li>Scrape, copy, or resell our question bank or content without permission</li>
          <li>Attempt to bypass payment, usage limits, or security controls</li>
          <li>Upload malware, spam, or harmful code</li>
          <li>Impersonate another person or misrepresent your affiliation</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">6. Intellectual property</h2>
        <p className="mt-2 leading-relaxed">
          The {APP_NAME} brand, website design, software, and original content are owned by{" "}
          {COMPANY_NAME} or our licensors. You receive a limited, personal, non-transferable
          licence to use the Service for your own exam preparation. You may not reproduce or
          distribute our content commercially without written consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">7. Disclaimer</h2>
        <p className="mt-2 leading-relaxed">
          The Service is provided &quot;as is&quot; for educational purposes. We do not guarantee
          any specific exam score, admission outcome, or that practice questions will appear in live
          exams. We strive for accuracy but errors may occur in questions or explanations — please
          report them via our Contact page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">8. Limitation of liability</h2>
        <p className="mt-2 leading-relaxed">
          To the fullest extent permitted by law, {COMPANY_NAME} shall not be liable for indirect,
          incidental, or consequential damages arising from your use of the Service. Our total
          liability for any claim shall not exceed the amount you paid us in the twelve (12) months
          before the claim.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">9. Termination</h2>
        <p className="mt-2 leading-relaxed">
          We may suspend or terminate your access if you breach these Terms or if required by law.
          You may stop using the Service at any time. Upon termination, your right to use paid
          features ends, subject to our Refund Policy where applicable.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">10. Governing law</h2>
        <p className="mt-2 leading-relaxed">
          These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall
          first be addressed through good-faith contact with our support team before other remedies.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">11. Contact</h2>
        <p className="mt-2 leading-relaxed">
          Questions about these Terms? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-green-700 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
