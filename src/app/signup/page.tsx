import Link from "next/link";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mb-8 text-gray-600">
          Save progress, sync subscriptions, and practice across devices.
        </p>
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <AuthForm mode="signup" />
        </Suspense>
        <p className="mt-6 text-center text-sm text-gray-600">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="font-semibold text-green-700">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-green-700">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-green-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
