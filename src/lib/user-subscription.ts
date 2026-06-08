import { FREE_DAILY_LIMIT } from "./constants";
import { isProfilePremium, profileToSubscription, type UserProfile } from "./profile";
import type { PlanId } from "./types";
import {
  activatePlan as activateLocalPlan,
  getSubscription as getLocalSubscription,
  isPremium as isLocalPremium,
  getRemainingFreeQuestions as getLocalRemaining,
  canStartPractice as canStartLocalPractice,
  recordQuestionUsage as recordLocalUsage,
} from "./subscription";

export interface UsageState {
  authenticated: boolean;
  premium: boolean;
  remaining: number;
  profile: UserProfile | null;
}

export async function fetchUsageState(): Promise<UsageState> {
  try {
    const res = await fetch("/api/user/usage");
    const data = await res.json();

    if (data.authenticated) {
      return {
        authenticated: true,
        premium: data.premium,
        remaining: data.remaining,
        profile: data.profile,
      };
    }
  } catch {
    // Fall through to local storage
  }

  return {
    authenticated: false,
    premium: isLocalPremium(),
    remaining: getLocalRemaining(),
    profile: null,
  };
}

export function canStartWithUsage(
  questionCount: number,
  usage: UsageState,
): { allowed: boolean; reason?: string } {
  if (usage.premium) return { allowed: true };

  const remaining = usage.remaining;
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `You've used your ${FREE_DAILY_LIMIT} free questions today. Sign in and upgrade to keep practicing.`,
    };
  }

  if (questionCount > remaining) {
    return {
      allowed: false,
      reason: `Free plan allows ${remaining} more question(s) today. Reduce count or upgrade.`,
    };
  }

  return { allowed: true };
}

export async function recordUsage(count: number, usage: UsageState): Promise<void> {
  if (usage.premium) return;

  if (usage.authenticated) {
    await fetch("/api/user/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });
    return;
  }

  recordLocalUsage(count);
}

export interface ActivateResult {
  ok: boolean;
  error?: string;
  message?: string;
  alreadyActivated?: boolean;
}

export async function activateSubscription(
  plan: PlanId,
  email?: string,
  reference?: string,
): Promise<ActivateResult> {
  if (!reference) {
    return { ok: false, error: "Payment reference is required." };
  }

  try {
    const res = await fetch("/api/user/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, reference }),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        ok: true,
        message: data.message ?? "Your plan is now active.",
        alreadyActivated: data.alreadyActivated,
      };
    }

    if (res.status === 401) {
      return {
        ok: false,
        error: "Sign in to activate your subscription on this account.",
      };
    }

    return { ok: false, error: data.error ?? "Could not activate subscription." };
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}

export function getEffectiveSubscription(usage: UsageState) {
  if (usage.authenticated && usage.profile) {
    return profileToSubscription(usage.profile);
  }
  return getLocalSubscription();
}

export function isUsagePremium(usage: UsageState): boolean {
  if (usage.authenticated && usage.profile) {
    return isProfilePremium(usage.profile);
  }
  return usage.premium;
}
