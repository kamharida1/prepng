import { NextRequest, NextResponse } from "next/server";
import { PAYSTACK_APP_ID } from "@/lib/constants";
import { getPlanAmount } from "@/lib/paystack";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Sign in before paying so your subscription links to your account." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const email = (body.email as string) || user.email;
  const plan = body.plan as PlanId;

  if (!email || !plan || plan === "free") {
    return NextResponse.json({ error: "Invalid payment request" }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const amount = getPlanAmount(plan);

  const siteUrl = getSiteUrl(request);

  if (!secretKey) {
    const reference = `demo-${plan}-${Date.now()}`;
    return NextResponse.json({
      authorization_url: `${siteUrl}/pricing?demo=1&ref=${reference}`,
      reference,
      demo: true,
      message: "Add PAYSTACK_SECRET_KEY to enable live payments.",
    });
  }

  const reference = `${PAYSTACK_APP_ID}-${plan}-${Date.now()}`;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,
      reference,
      metadata: {
        app: PAYSTACK_APP_ID,
        product: "PrepNG",
        plan,
        user_id: user.id,
      },
      callback_url: `${siteUrl}/pricing?ref=${reference}`,
    }),
  });

  const data = await res.json();

  if (!data.status) {
    return NextResponse.json(
      { error: data.message ?? "Paystack initialization failed" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  });
}
