import { NextResponse } from "next/server";
import {
  createPhoneAuthUser,
  createPhoneSessionToken,
  verifyPhoneOtpCode,
} from "@/lib/phone-auth";
import { normalizeNigerianPhone } from "@/lib/profile";

export async function POST(request: Request) {
  let body: { phone?: string; otp?: string; fullName?: string; mode?: "login" | "signup" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rawPhone = body.phone?.trim();
  const otp = body.otp?.trim();
  const mode = body.mode === "signup" ? "signup" : "login";

  if (!rawPhone || !otp) {
    return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
  }

  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter the 6-digit code from your SMS" }, { status: 400 });
  }

  const phone = normalizeNigerianPhone(rawPhone);

  try {
    const valid = await verifyPhoneOtpCode(phone, otp);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect or expired code" }, { status: 401 });
    }

    if (mode === "signup") {
      await createPhoneAuthUser(phone, body.fullName);
    }

    const tokenHash = await createPhoneSessionToken(phone);

    return NextResponse.json({ token_hash: tokenHash });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    const status =
      message.includes("already exists") || message.includes("No account")
        ? 404
        : message.includes("Too many")
          ? 429
          : 500;
    console.error("Phone OTP verify failed", err);
    return NextResponse.json({ error: message }, { status });
  }
}
