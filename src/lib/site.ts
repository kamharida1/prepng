import type { NextRequest } from "next/server";

const DEFAULT_SITE_URL = "https://prepng.com";

/** Canonical public site URL (set NEXT_PUBLIC_SITE_URL in production). */
export function getSiteUrl(request?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (request) return request.nextUrl.origin;
  return DEFAULT_SITE_URL;
}

export function getPaystackWebhookUrl(request?: NextRequest): string {
  return `${getSiteUrl(request)}/api/paystack/webhook`;
}
