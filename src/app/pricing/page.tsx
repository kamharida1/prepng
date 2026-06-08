import Link from "next/link";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { PricingCards } from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Simple pricing in Naira</h1>
          <p className="mt-2 text-gray-600">
            Start free. Upgrade when you need unlimited practice and offline packs.
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-gray-500">Loading pricing...</p>}>
          <PricingCards />
        </Suspense>
        <p className="mt-10 text-center text-sm text-gray-500">
          Payments are processed securely by Paystack. See our{" "}
          <Link href="/refunds" className="text-green-700 hover:underline">
            Refund Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-green-700 hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
