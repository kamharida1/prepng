import Link from "next/link";
import { PerformanceAnalytics } from "@/components/PerformanceAnalytics";
import { createClient } from "@/lib/supabase/server";
import { isProfilePremium } from "@/lib/profile";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let premium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    premium = isProfilePremium(profile);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <Link href="/account" className="text-sm font-semibold text-green-700">
          ← Back to account
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Performance analytics</h1>
        <p className="mt-1 text-gray-600">
          Track scores, weak topics, and progress across all your practice sessions.
        </p>
      </div>
      <PerformanceAnalytics premium={premium} />
    </div>
  );
}
