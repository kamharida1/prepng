import { createHash, randomInt, timingSafeEqual } from "crypto";
import { APP_NAME } from "./constants";
import { normalizeNigerianPhone } from "./profile";
import { createServiceClient } from "./supabase/service";
import { termiiPhoneFromE164 } from "./termii";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

export function phoneToAuthEmail(phone: string): string {
  const digits = termiiPhoneFromE164(normalizeNigerianPhone(phone));
  return `phone_${digits}@auth.prepng.com`;
}

export function isValidNigerianPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits.length === 13;
  if (digits.startsWith("0")) return digits.length === 11;
  return digits.length === 10;
}

function getOtpSecret(): string {
  const secret = process.env.PHONE_OTP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("PHONE_OTP_SECRET is not configured");
  return secret;
}

export function generateOtpCode(): string {
  return String(randomInt(100000, 1000000));
}

export function hashOtpCode(phone: string, code: string): string {
  return createHash("sha256")
    .update(`${normalizeNigerianPhone(phone)}:${code}:${getOtpSecret()}`)
    .digest("hex");
}

function codesMatch(expected: string, actual: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function storePhoneOtp(phone: string, code: string): Promise<void> {
  const admin = createServiceClient();
  const normalized = normalizeNigerianPhone(phone);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error: countError } = await admin
    .from("phone_otps")
    .select("id", { count: "exact", head: true })
    .eq("phone", normalized)
    .gte("created_at", oneHourAgo);

  if (countError) throw new Error(countError.message);
  if ((count ?? 0) >= MAX_SENDS_PER_HOUR) {
    throw new Error("Too many OTP requests. Try again in an hour.");
  }

  await admin.from("phone_otps").delete().eq("phone", normalized);

  const { error } = await admin.from("phone_otps").insert({
    phone: normalized,
    code_hash: hashOtpCode(normalized, code),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function verifyPhoneOtpCode(phone: string, code: string): Promise<boolean> {
  const admin = createServiceClient();
  const normalized = normalizeNigerianPhone(phone);

  const { data, error } = await admin
    .from("phone_otps")
    .select("id, code_hash, expires_at, attempts")
    .eq("phone", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return false;

  if (new Date(data.expires_at).getTime() < Date.now()) {
    await admin.from("phone_otps").delete().eq("id", data.id);
    return false;
  }

  if (data.attempts >= MAX_VERIFY_ATTEMPTS) {
    throw new Error("Too many incorrect attempts. Request a new code.");
  }

  const expected = hashOtpCode(normalized, code);
  const valid = codesMatch(data.code_hash, expected);

  if (!valid) {
    await admin
      .from("phone_otps")
      .update({ attempts: data.attempts + 1 })
      .eq("id", data.id);
    return false;
  }

  await admin.from("phone_otps").delete().eq("id", data.id);
  return true;
}

export async function createPhoneAuthUser(phone: string, fullName?: string): Promise<void> {
  const admin = createServiceClient();
  const normalized = normalizeNigerianPhone(phone);
  const email = phoneToAuthEmail(normalized);

  const { error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    phone: normalized,
    phone_confirm: true,
    user_metadata: { full_name: fullName?.trim() || null },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already") || msg.includes("registered")) {
      throw new Error("An account with this phone number already exists. Sign in instead.");
    }
    throw new Error(error.message);
  }
}

export async function createPhoneSessionToken(phone: string): Promise<string> {
  const admin = createServiceClient();
  const email = phoneToAuthEmail(normalizeNigerianPhone(phone));

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data.properties?.hashed_token) {
    const msg = error?.message.toLowerCase() ?? "";
    if (msg.includes("not found") || msg.includes("no user")) {
      throw new Error("No account found for this phone number. Please sign up first.");
    }
    throw new Error("Could not start your session. Try again.");
  }

  return data.properties.hashed_token;
}

export function buildOtpSmsMessage(code: string): string {
  return `Your ${APP_NAME} verification code is ${code}. Valid for 10 minutes. Do not share this code.`;
}
