import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackReference } from "@/lib/paystack-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const reference = body.reference as string;

  if (!reference) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 });
  }

  const result = await verifyPaystackReference(reference);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    plan: result.payment.plan,
    amount: result.payment.amount,
    paidAt: result.payment.paidAt,
  });
}
