import type { SupabaseClient } from "@supabase/supabase-js";
import { verifyPaystackReference } from "@/lib/paystack-server";
import type { PlanId } from "@/lib/types";

export interface ActivationResult {
  ok: boolean;
  error?: string;
  alreadyActivated?: boolean;
  profile?: Record<string, unknown>;
}

export async function activateSubscriptionForUser(
  admin: SupabaseClient,
  userId: string,
  reference: string,
  expectedPlan?: PlanId,
): Promise<ActivationResult> {
  const { data: existingPayment } = await admin
    .from("payments")
    .select("id, user_id, plan")
    .eq("reference", reference)
    .maybeSingle();

  if (existingPayment && existingPayment.user_id !== userId) {
    return { ok: false, error: "Payment reference belongs to another account" };
  }

  if (existingPayment) {
    const { data: profile } = await admin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { ok: true, alreadyActivated: true, profile: profile ?? undefined };
  }

  const verified = await verifyPaystackReference(reference);
  if (!verified.success) {
    return { ok: false, error: verified.error };
  }

  const plan = verified.payment.plan;
  if (expectedPlan && plan !== expectedPlan) {
    return { ok: false, error: "Plan does not match verified payment" };
  }

  const days = plan === "monthly" ? 30 : 120;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .update({
      plan,
      plan_expires_at: expires.toISOString(),
      paystack_reference: reference,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  const { error: paymentError } = await admin.from("payments").insert({
    user_id: userId,
    reference,
    plan,
    amount: verified.payment.amount,
    currency: "NGN",
    status: "success",
    paid_at: verified.payment.paidAt,
  });

  if (paymentError && paymentError.code !== "23505") {
    return { ok: false, error: paymentError.message };
  }

  return { ok: true, profile: profile ?? undefined };
}

export async function resolveUserIdForPayment(
  admin: SupabaseClient,
  metadata: Record<string, unknown> | undefined,
  customerEmail: string | undefined,
): Promise<string | null> {
  const metaUserId = metadata?.user_id;
  if (typeof metaUserId === "string" && metaUserId.length > 0) {
    return metaUserId;
  }

  if (!customerEmail) return null;

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", customerEmail)
    .maybeSingle();

  return profile?.id ?? null;
}
