import { createHmac } from "crypto";
import { PAYSTACK_APP_ID } from "./constants";
import type { PlanId } from "./types";
import { getPlanAmount } from "./paystack";

export interface VerifiedPayment {
  plan: PlanId;
  amount: number;
  paidAt: string;
  email: string;
}

export function isPaystackLive(): boolean {
  return process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_live_") ?? false;
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

/** True when this charge belongs to PrepNG (shared Paystack account may serve other apps). */
export function isPrepNgCharge(data: {
  reference?: string;
  metadata?: Record<string, unknown> | null;
}): boolean {
  const metadata = data.metadata ?? {};
  const app = metadata.app ?? metadata.product;
  if (app === PAYSTACK_APP_ID || app === "PrepNG") return true;
  return Boolean(data.reference?.startsWith(`${PAYSTACK_APP_ID}-`));
}

export async function verifyPaystackReference(
  reference: string,
): Promise<{ success: true; payment: VerifiedPayment } | { success: false; error: string }> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { success: false, error: "Paystack is not configured" };
  }

  if (reference.startsWith("demo-")) {
    return { success: false, error: "Invalid payment reference" };
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store",
    },
  );

  const data = await res.json();

  if (!data.status || data.data?.status !== "success") {
    return {
      success: false,
      error: data.message ?? "Payment not verified",
    };
  }

  const tx = data.data;
  if (!isPrepNgCharge(tx)) {
    return { success: false, error: "Transaction is not for PrepNG" };
  }

  const plan = tx.metadata?.plan as PlanId;
  const amountKobo = tx.amount as number;
  const expectedKobo = getPlanAmount(plan) * 100;

  if (!plan || plan === "free") {
    return { success: false, error: "Invalid plan in payment metadata" };
  }

  if (amountKobo !== expectedKobo) {
    return { success: false, error: "Payment amount does not match plan price" };
  }

  return {
    success: true,
    payment: {
      plan,
      amount: amountKobo / 100,
      paidAt: tx.paid_at ?? tx.paidAt ?? new Date().toISOString(),
      email: tx.customer?.email ?? tx.authorization?.email ?? "",
    },
  };
}
