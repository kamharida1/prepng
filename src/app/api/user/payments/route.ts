import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { PaymentRecord, PlanId } from "@/lib/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .order("paid_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payments: PaymentRecord[] = (data ?? []).map((row) => ({
    id: row.id,
    reference: row.reference,
    plan: row.plan as PlanId,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    paid_at: row.paid_at,
  }));

  return NextResponse.json({ payments });
}
