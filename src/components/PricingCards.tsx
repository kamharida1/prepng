"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRICING_PLANS } from "@/lib/constants";
import { initializePayment, verifyPayment } from "@/lib/paystack";
import { formatNaira } from "@/lib/subscription";
import {
  activateSubscription,
  fetchUsageState,
  getEffectiveSubscription,
  isUsagePremium,
  type UsageState,
} from "@/lib/user-subscription";
import type { PlanId } from "@/lib/types";

const PENDING_REF_KEY = "prepng-pending-ref";

interface PaymentSuccess {
  plan: PlanId;
  reference: string;
  amount?: number;
  expiresAt?: string;
}

export function PricingCards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<PlanId | "verify" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageState | null>(null);
  const [success, setSuccess] = useState<PaymentSuccess | null>(null);
  const verifiedRef = useRef<string | null>(null);

  const refreshUsage = useCallback(async () => {
    const state = await fetchUsageState();
    setUsage(state);
    if (state.profile?.email) setEmail(state.profile.email);
    return state;
  }, []);

  const completePayment = useCallback(
    async (reference: string) => {
      setLoading("verify");
      setError("");
      setMessage("Verifying your payment with Paystack...");

      const verified = await verifyPayment(reference);
      if (!verified.success || !verified.plan) {
        setLoading(null);
        setError(verified.error ?? "Payment could not be verified. Try again in a minute.");
        setMessage("");
        return;
      }

      if (!usage?.authenticated) {
        sessionStorage.setItem(PENDING_REF_KEY, reference);
        setLoading(null);
        setError("");
        setMessage("");
        setError(
          "Payment successful! Sign in with the same email you used on Paystack to activate your plan.",
        );
        router.push(`/login?next=${encodeURIComponent(`/pricing?ref=${reference}`)}`);
        return;
      }

      const activated = await activateSubscription(verified.plan, email, reference);
      const state = await refreshUsage();
      setLoading(null);
      sessionStorage.removeItem(PENDING_REF_KEY);

      if (!activated.ok) {
        setError(activated.error ?? "Could not activate your plan.");
        setMessage("");
        return;
      }

      const sub = getEffectiveSubscription(state);
      setSuccess({
        plan: verified.plan,
        reference,
        amount: verified.amount,
        expiresAt: state.profile?.plan_expires_at ?? undefined,
      });
      setMessage("");
      setError("");
      window.history.replaceState({}, "", "/pricing");
    },
    [email, refreshUsage, router, usage?.authenticated],
  );

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref || verifiedRef.current === ref || usage === null) return;
    verifiedRef.current = ref;
    completePayment(ref);
  }, [searchParams, usage, completePayment]);

  const current = usage
    ? getEffectiveSubscription(usage)
    : { plan: "free" as PlanId, expiresAt: 0 };
  const premium = usage ? isUsagePremium(usage) : false;
  const planMeta = (id: PlanId) => PRICING_PLANS.find((p) => p.id === id);

  const handlePay = async (plan: PlanId) => {
    if (plan === "free") return;

    if (!usage?.authenticated) {
      setError("Sign in first so your payment is linked to your account.");
      router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      return;
    }

    const payEmail = usage.profile?.email ?? email;
    if (!payEmail?.includes("@")) {
      setError("Your account needs a valid email for Paystack receipts.");
      return;
    }

    setLoading(plan);
    setError("");
    setMessage("");
    setSuccess(null);

    const result = await initializePayment(payEmail, plan);

    if ("error" in result) {
      setError(result.error);
      setLoading(null);
      return;
    }

    sessionStorage.setItem(PENDING_REF_KEY, result.reference);
    window.location.href = result.authorization_url;
  };

  return (
    <div>
      {success && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-lg font-bold text-green-900">Payment successful</p>
          <p className="mt-2 text-sm text-green-800">
            <strong>{planMeta(success.plan)?.name}</strong> is now active on your account.
            {success.amount ? <> You paid {formatNaira(success.amount)}.</> : null}
          </p>
          {success.expiresAt && (
            <p className="mt-1 text-sm text-green-700">
              Valid until{" "}
              {new Date(success.expiresAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <p className="mt-2 font-mono text-xs text-green-600">Ref: {success.reference}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/practice"
              className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start practicing
            </Link>
            <Link
              href="/account"
              className="rounded-xl border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-700"
            >
              View account & payments
            </Link>
          </div>
        </div>
      )}

      {!usage?.authenticated && !success && (
        <p className="mb-6 rounded-lg bg-blue-50 px-4 py-3 text-center text-sm text-blue-800">
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>{" "}
          before paying so your subscription links to your account automatically.
        </p>
      )}

      {usage?.authenticated && (
        <p className="mb-6 rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-700">
          Paying as <strong>{usage.profile?.email}</strong>
        </p>
      )}

      {premium && current.expiresAt > Date.now() && !success && (
        <p className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-center text-sm text-green-800">
          Active plan: <strong>{planMeta(current.plan)?.name ?? current.plan}</strong> until{" "}
          {new Date(current.expiresAt).toLocaleDateString("en-NG")}
          {" · "}
          <Link href="/account" className="font-semibold underline">
            View payments
          </Link>
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
              plan.popular ? "border-green-500 ring-2 ring-green-100" : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold text-green-800">
              {plan.price === 0 ? "Free" : formatNaira(plan.price)}
            </p>
            <p className="text-sm text-gray-500">{plan.period}</p>

            <ul className="mt-6 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id !== "free" ? (
              <button
                type="button"
                disabled={loading === plan.id || loading === "verify"}
                onClick={() => handlePay(plan.id)}
                className="mt-6 w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading === plan.id ? "Redirecting to Paystack..." : "Pay with Paystack"}
              </button>
            ) : (
              <p className="mt-6 text-center text-sm text-gray-500">Current free tier</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        {loading === "verify" && (
          <p className="text-sm text-gray-600">Verifying payment with Paystack...</p>
        )}
        {message && <p className="text-sm text-gray-600">{message}</p>}
        {error && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-red-700">{error}</p>
            {error.includes("Sign in") && (
              <Link
                href={`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                className="inline-block rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Sign in to activate
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
