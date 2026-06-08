import type { PlanId } from "./types";
import { PRICING_PLANS } from "./constants";

export function getPlanAmount(plan: PlanId): number {
  const found = PRICING_PLANS.find((p) => p.id === plan);
  return found?.price ?? 0;
}

export async function initializePayment(
  email: string,
  plan: PlanId,
): Promise<{ authorization_url: string; reference: string } | { error: string }> {
  const res = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, plan }),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Payment failed to start" };
  return data;
}

export async function verifyPayment(
  reference: string,
): Promise<{
  success: boolean;
  plan?: PlanId;
  amount?: number;
  paidAt?: string;
  error?: string;
}> {
  const res = await fetch("/api/paystack/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference }),
  });

  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error ?? "Verification failed" };
  return data;
}
