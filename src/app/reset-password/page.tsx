import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Set new password",
  description: "Choose a new password for your PrepNG account.",
  path: "/reset-password",
  noindex: true,
});

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Choose a new password</h1>
        <p className="mb-8 text-gray-600">Enter and confirm your new password below.</p>
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
