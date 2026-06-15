import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next =
    searchParams.get("next") ?? (type === "recovery" ? "/reset-password" : "/account");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const errorTarget = type === "recovery" ? "/forgot-password?error=auth" : "/login?error=auth";
  return NextResponse.redirect(`${origin}${errorTarget}`);
}
