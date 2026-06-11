import { NextResponse } from "next/server";
import {
  buildOtpSmsMessage,
  generateOtpCode,
  isValidNigerianPhone,
  storePhoneOtp,
} from "@/lib/phone-auth";
import { normalizeNigerianPhone } from "@/lib/profile";
import { isTermiiConfigured, sendTermiiSms, termiiPhoneFromE164 } from "@/lib/termii";

export async function POST(request: Request) {
  if (!isTermiiConfigured()) {
    return NextResponse.json(
      { error: "SMS is not configured. Add TERMII_API_KEY and TERMII_SENDER_ID." },
      { status: 503 },
    );
  }

  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const rawPhone = body.phone?.trim();
  if (!rawPhone) {
    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
  }

  if (!isValidNigerianPhone(rawPhone)) {
    return NextResponse.json(
      { error: "Enter a valid Nigerian phone number (e.g. 08012345678)" },
      { status: 400 },
    );
  }

  const phone = normalizeNigerianPhone(rawPhone);
  const code = generateOtpCode();

  try {
    await storePhoneOtp(phone, code);
    await sendTermiiSms(termiiPhoneFromE164(phone), buildOtpSmsMessage(code));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    const status = message.includes("Too many") ? 429 : 500;
    console.error("Phone OTP send failed", err);
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true, phone });
}
