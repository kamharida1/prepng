import type { PlanId } from "./types";

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  plan: PlanId;
  plan_expires_at: string | null;
  daily_usage_date: string | null;
  daily_usage_count: number;
}

export function profileToSubscription(profile: UserProfile) {
  return {
    plan: profile.plan,
    expiresAt: profile.plan_expires_at
      ? new Date(profile.plan_expires_at).getTime()
      : 0,
    email: profile.email ?? undefined,
  };
}

export function isProfilePremium(profile: UserProfile | null | undefined): boolean {
  if (!profile || profile.plan === "free") return false;
  if (!profile.plan_expires_at) return false;
  return new Date(profile.plan_expires_at).getTime() > Date.now();
}

export function isProfileSeason(profile: UserProfile | null | undefined): boolean {
  return isProfilePremium(profile) && profile!.plan === "season";
}

export function normalizeNigerianPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  return input.startsWith("+") ? input : `+${digits}`;
}
