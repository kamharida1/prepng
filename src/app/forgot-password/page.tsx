import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Forgot password",
  description: "Reset your PrepNG account password.",
  path: "/forgot-password",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mb-8 text-gray-600">
          Enter your email and we&apos;ll send you a link to choose a new password.
        </p>
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
