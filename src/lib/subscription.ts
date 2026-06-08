import { FREE_DAILY_LIMIT } from "./constants";
import type { PlanId, Subscription } from "./types";

const SUBSCRIPTION_KEY = "prepng-subscription";
const DAILY_USAGE_KEY = "prepng-daily-usage";

interface DailyUsage {
  date: string;
  count: number;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getSubscription(): Subscription {
  if (typeof window === "undefined") {
    return { plan: "free", expiresAt: 0 };
  }

  const raw = localStorage.getItem(SUBSCRIPTION_KEY);
  if (!raw) return { plan: "free", expiresAt: 0 };

  try {
    const sub = JSON.parse(raw) as Subscription;
    if (sub.expiresAt > Date.now()) return sub;
    return { plan: "free", expiresAt: 0 };
  } catch {
    return { plan: "free", expiresAt: 0 };
  }
}

export function setSubscription(sub: Subscription): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(sub));
}

export function activatePlan(plan: PlanId, email?: string, reference?: string): void {
  const now = Date.now();
  const duration =
    plan === "monthly"
      ? 30 * 24 * 60 * 60 * 1000
      : plan === "season"
        ? 120 * 24 * 60 * 60 * 1000
        : 0;

  setSubscription({
    plan,
    expiresAt: now + duration,
    email,
    reference,
  });
}

export function isPremium(): boolean {
  const sub = getSubscription();
  return sub.plan !== "free" && sub.expiresAt > Date.now();
}

function getDailyUsage(): DailyUsage {
  if (typeof window === "undefined") return { date: todayString(), count: 0 };

  const raw = localStorage.getItem(DAILY_USAGE_KEY);
  if (!raw) return { date: todayString(), count: 0 };

  try {
    const usage = JSON.parse(raw) as DailyUsage;
    if (usage.date !== todayString()) return { date: todayString(), count: 0 };
    return usage;
  } catch {
    return { date: todayString(), count: 0 };
  }
}

function setDailyUsage(count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    DAILY_USAGE_KEY,
    JSON.stringify({ date: todayString(), count }),
  );
}

export function getRemainingFreeQuestions(): number {
  if (isPremium()) return Infinity;
  const usage = getDailyUsage();
  return Math.max(0, FREE_DAILY_LIMIT - usage.count);
}

export function canStartPractice(questionCount: number): {
  allowed: boolean;
  reason?: string;
} {
  if (isPremium()) return { allowed: true };

  const remaining = getRemainingFreeQuestions();
  if (remaining <= 0) {
    return {
      allowed: false,
      reason: `You've used your ${FREE_DAILY_LIMIT} free questions today. Upgrade to keep practicing.`,
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

export function recordQuestionUsage(count: number): void {
  if (isPremium()) return;
  const usage = getDailyUsage();
  setDailyUsage(usage.count + count);
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}
