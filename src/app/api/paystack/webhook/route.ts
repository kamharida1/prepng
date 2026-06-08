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
import { PAYSTACK_APP_ID } from "@/lib/constants";

interface PaystackWebhookEvent {
  event: string;
  data?: {
    reference?: string;
    status?: string;
    metadata?: Record<string, unknown> | null;
    customer?: { email?: string };
  };
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
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = event.data;
  if (!data?.reference) {
    return NextResponse.json({ received: true, handled: false, reason: "no_reference" });
  }

  // Shared Paystack keys: ignore charges for other apps (still return 200).
  if (!isPrepNgCharge(data)) {
    return NextResponse.json({
      received: true,
      handled: false,
      reason: "not_prepng",
      app: PAYSTACK_APP_ID,
    });
  }

  if (event.event !== "charge.success" || data.status !== "success") {
    return NextResponse.json({
      received: true,
      handled: false,
      reason: "event_ignored",
      event: event.event,
    });
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const userId = await resolveUserIdForPayment(
    admin,
    data.metadata ?? undefined,
    data.customer?.email,
  );

  if (!userId) {
    return NextResponse.json({
      received: true,
      handled: false,
      reason: "user_not_found",
      reference: data.reference,
    });
  }

  const result = await activateSubscriptionForUser(admin, userId, data.reference);

  if (!result.ok) {
    return NextResponse.json(
      { received: true, handled: false, error: result.error },
      { status: 422 },
    );
  }

  return NextResponse.json({
    received: true,
    handled: true,
    alreadyActivated: result.alreadyActivated ?? false,
    reference: data.reference,
  });
}
