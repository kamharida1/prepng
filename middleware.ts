import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only run auth cookie refresh on routes that need a logged-in session.
// Running on "/" caused constant token refresh → full page reload loops.
export const config = {
  matcher: ["/account/:path*", "/api/user/:path*", "/auth/callback"],
};
