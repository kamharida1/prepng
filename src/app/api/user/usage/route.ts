import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { FREE_DAILY_LIMIT } from "@/lib/constants";
import { isProfilePremium } from "@/lib/profile";
import { NextResponse } from "next/server";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      remaining: FREE_DAILY_LIMIT,
      premium: false,
    });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 500 });
  }

  const premium = isProfilePremium(profile);
  const today = todayString();
  const count =
    profile.daily_usage_date === today ? profile.daily_usage_count : 0;

  return NextResponse.json({
    authenticated: true,
    premium,
    remaining: premium ? Infinity : Math.max(0, FREE_DAILY_LIMIT - count),
    profile,
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const count = Number(body.count) || 0;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 500 });
  }

  if (isProfilePremium(profile)) {
    return NextResponse.json({ ok: true, premium: true });
  }

  const today = todayString();
  const current =
    profile.daily_usage_date === today ? profile.daily_usage_count : 0;

  let admin;
  try {
    admin = createServiceClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { error } = await admin
    .from("profiles")
    .update({
      daily_usage_date: today,
      daily_usage_count: current + count,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
