import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { APP_NAME, COMPANY_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="8 June 2026">
      <section>
        <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
        <p className="mt-2 leading-relaxed">
          {COMPANY_NAME} (&quot;{APP_NAME}&quot;, &quot;we&quot;, &quot;us&quot;) operates an online
          exam preparation platform for Nigerian students. This Privacy Policy explains how we
          collect, use, and protect your personal data in line with the Nigeria Data Protection
          Regulation (NDPR) and applicable laws.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">2. Data we collect</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong>Account information:</strong> name, email address, phone number (if provided)
            when you register.
          </li>
          <li>
            <strong>Usage data:</strong> questions attempted, scores, practice history, daily usage
            limits, and subscription status.
          </li>
          <li>
            <strong>Payment data:</strong> payments are processed by Paystack. We do not store your
            full card or bank details. We may receive transaction references and payment status.
          </li>
          <li>
            <strong>Device data:</strong> browser type, IP address, and cookies needed to keep you
            logged in and improve the service.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">3. How we use your data</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>Provide CBT practice, explanations, and account features</li>
          <li>Manage free and paid subscriptions</li>
          <li>Send payment receipts and important service notices</li>
          <li>Prevent fraud and enforce our Terms of Service</li>
          <li>Improve the platform based on aggregated usage patterns</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">4. Third-party services</h2>
        <p className="mt-2 leading-relaxed">We use trusted providers to run {APP_NAME}:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <strong>Supabase</strong> — authentication and user profiles
          </li>
          <li>
            <strong>Paystack</strong> — payment processing
          </li>
          <li>
            <strong>Question content providers</strong> — licensed APIs for past exam questions
          </li>
          <li>
            <strong>Vercel</strong> — website hosting
          </li>
        </ul>
        <p className="mt-2 leading-relaxed">
          These providers process data under their own privacy policies and only as needed to deliver
          the service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">5. Data storage and security</h2>
        <p className="mt-2 leading-relaxed">
          We use industry-standard security measures including encrypted connections (HTTPS),
          access controls, and secure authentication. Some practice data may be stored locally on
          your device (e.g. offline question packs) using your browser storage.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">6. Your rights</h2>
        <p className="mt-2 leading-relaxed">Under the NDPR, you may:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC)</li>
        </ul>
        <p className="mt-2 leading-relaxed">
          To exercise these rights, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-green-700 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">7. Children and students</h2>
        <p className="mt-2 leading-relaxed">
          {APP_NAME} is designed for secondary school students and exam candidates. Users under 18
          should use the service with a parent or guardian&apos;s knowledge. We do not knowingly
          collect more data than necessary to provide the educational service.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">8. Changes to this policy</h2>
        <p className="mt-2 leading-relaxed">
          We may update this Privacy Policy from time to time. We will post the revised version on
          this page with an updated date. Continued use of {APP_NAME} after changes means you accept
          the updated policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900">9. Contact</h2>
        <p className="mt-2 leading-relaxed">
          Questions about this Privacy Policy? Contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-green-700 hover:underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          or visit our <a href="/contact" className="text-green-700 hover:underline">Contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
