"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";

export function AuthHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setReady(true);
      return;
    }

    const supabase = createClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const user = data.session?.user;
      setEmail(user?.email ?? user?.phone ?? null);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "TOKEN_REFRESHED") return;
      setEmail(session?.user?.email ?? session?.user?.phone ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-700 text-sm font-bold text-white">
            NG
          </span>
          <div>
            <p className="text-sm font-bold text-green-900">{APP_NAME}</p>
            <p className="text-xs text-green-600">Exam prep for Nigeria</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/practice"
            className="hidden rounded-lg px-3 py-2 font-medium text-green-800 hover:bg-green-50 sm:inline"
          >
            Practice
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg px-3 py-2 font-medium text-green-800 hover:bg-green-50"
          >
            Pricing
          </Link>
          {ready && (
            email ? (
              <>
                <Link
                  href="/account"
                  className="hidden max-w-[140px] truncate rounded-lg px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 sm:inline"
                >
                  {email}
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-green-700 px-3 py-2 font-medium text-white hover:bg-green-800"
              >
                Sign in
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
