import type { Metadata } from "next";
import { AuthHeader } from "@/components/AuthHeader";
import { AccountDashboard } from "@/components/AccountDashboard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "My account",
  description: "Manage your PrepNG profile, subscription, and payment history.",
  path: "/account",
  noindex: true,
});

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">My account</h1>
        <AccountDashboard />
      </div>
    </div>
  );
}
