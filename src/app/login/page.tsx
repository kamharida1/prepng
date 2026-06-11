import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { AuthForm } from "@/components/AuthForm";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to PrepNG with email or Nigerian phone number.",
  path: "/login",
  noindex: true,
});

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mb-8 text-gray-600">Sign in with email or Nigerian phone number.</p>
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <AuthForm mode="login" />
        </Suspense>
        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-green-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
