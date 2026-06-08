import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { activateSubscriptionForUser } from "@/lib/activate-subscription";
import { NextResponse } from "next/server";
import type { PlanId } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan as PlanId;
  const reference = body.reference as string | undefined;

  if (!plan || plan === "free") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!reference) {
    return NextResponse.json(
      { error: "A verified Paystack payment reference is required" },
      { status: 400 },
    );
  }

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const result = await activateSubscriptionForUser(admin, user.id, reference, plan);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.alreadyActivated) {
    return NextResponse.json({
      profile: result.profile,
      alreadyActivated: true,
      message: "Payment already activated on your account.",
    });
  }

  return NextResponse.json({
    profile: result.profile,
    message: "Payment confirmed. Your plan is now active.",
  });
}
