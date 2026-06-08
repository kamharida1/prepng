"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/subscription";
import type { UserProfile } from "@/lib/profile";
import { PaymentHistory } from "@/components/PaymentHistory";
import { PerformanceAnalytics } from "@/components/PerformanceAnalytics";
import { PRICING_PLANS } from "@/lib/constants";
import { isProfilePremium } from "@/lib/profile";

export function AccountDashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProfile = () => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.profile ?? null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: profile.full_name,
        phone: profile.phone,
      }),
    });
    const data = await res.json();
    if (data.profile) {
      setProfile(data.profile);
      setMessage("Profile updated.");
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-gray-600">
        Configure Supabase in <code>.env.local</code> to use accounts.
      </p>
    );
  }

  if (loading) {
    return <p className="text-gray-600">Loading account...</p>;
  }

  if (!profile) {
    return (
      <div className="text-center">
        <p className="text-gray-600">You are not signed in.</p>
        <Link href="/login" className="mt-4 inline-block text-green-700 font-semibold">
          Sign in
        </Link>
      </div>
    );
  }

  const premium = isProfilePremium(profile);
  const plan = PRICING_PLANS.find((p) => p.id === profile.plan);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
            <input
              value={profile.full_name ?? ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={profile.email ?? ""}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
            <input
              value={profile.phone ?? ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="08012345678"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>
          <button
            type="button"
            onClick={saveProfile}
            className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Save changes
          </button>
          {message && <p className="text-sm text-green-700">{message}</p>}
        </div>
      </div>

      <PerformanceAnalytics premium={premium} compact />

      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          premium
            ? "border-green-200 bg-green-50"
            : "border-gray-200 bg-white"
        }`}
      >
        <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
        {premium ? (
          <>
            <p className="mt-2 text-green-900">
              <span className="inline-block rounded-full bg-green-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                Active
              </span>
              <span className="ml-2 font-semibold">{plan?.name ?? profile.plan}</span>
            </p>
            {profile.plan_expires_at && (
              <p className="mt-2 text-sm text-green-800">
                Unlimited practice until{" "}
                {new Date(profile.plan_expires_at).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mt-2 text-gray-600">
              Plan: <strong>Free</strong>
            </p>
            <p className="mt-1 text-sm text-gray-500">
              20 questions per day. Upgrade for unlimited access.
            </p>
          </>
        )}
        <Link
          href="/pricing"
          className="mt-4 inline-block rounded-xl border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-700"
        >
          {premium ? "Extend or change plan" : `Upgrade from ${formatNaira(1500)}/mo`}
        </Link>
      </div>

      <PaymentHistory />

      <button
        type="button"
        onClick={signOut}
        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700"
      >
        Sign out
      </button>
    </div>
  );
}
