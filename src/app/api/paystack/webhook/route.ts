import { NextRequest, NextResponse } from "next/server";
import {
  isPrepNgCharge,
  verifyPaystackWebhookSignature,
} from "@/lib/paystack-server";
import {
  activateSubscriptionForUser,
  resolveUserIdForPayment,
} from "@/lib/activate-subscription";
import { createServiceClient } from "@/lib/supabase/service";

interface PaystackWebhookEvent {
  event: string;
  data?: {
    reference?: string;
    status?: string;
    metadata?: Record<string, unknown> | null;
    customer?: { email?: string };
  };
}

/** Paystack retries webhooks unless we return 200. Always acknowledge after signature check. */
function ack(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: PaystackWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return ack({ received: true, handled: false, reason: "invalid_json" });
  }

  const data = event.data;

  // Non-PrepNG charges (other apps on shared keys) — acknowledge only.
  if (!data?.reference || !isPrepNgCharge(data)) {
    return ack({
      received: true,
      handled: false,
      reason: data?.reference ? "not_prepng" : "no_reference",
      event: event.event,
    });
  }

  // Only process charge.success; other events are acknowledged but ignored.
  if (event.event !== "charge.success") {
    return ack({
      received: true,
      handled: false,
      reason: "event_ignored",
      event: event.event,
    });
  }

  if (data.status !== "success") {
    return ack({
      received: true,
      handled: false,
      reason: "charge_not_success",
      status: data.status,
    });
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    console.error("[paystack webhook] config error:", message);
    return ack({ received: true, handled: false, error: message });
  }

  const userId = await resolveUserIdForPayment(
    admin,
    data.metadata ?? undefined,
    data.customer?.email,
  );

  if (!userId) {
    return ack({
      received: true,
      handled: false,
      reason: "user_not_found",
      reference: data.reference,
    });
  }

  const result = await activateSubscriptionForUser(admin, userId, data.reference);

  if (!result.ok) {
    console.error("[paystack webhook] activation failed:", result.error, data.reference);
    return ack({
      received: true,
      handled: false,
      error: result.error,
      reference: data.reference,
    });
  }

  return ack({
    received: true,
    handled: true,
    alreadyActivated: result.alreadyActivated ?? false,
    reference: data.reference,
  });
}
