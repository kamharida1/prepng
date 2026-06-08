"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { normalizeNigerianPhone } from "@/lib/profile";

type AuthMode = "login" | "signup";
type AuthMethod = "email" | "phone";

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/account";
  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const configured = isSupabaseConfigured();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone ? normalizeNigerianPhone(phone) : null },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      setMessage("Check your email to confirm your account, or sign in if confirmation is disabled.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  const sendPhoneOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const normalized = normalizeNigerianPhone(phone);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: mode === "signup" ? { data: { full_name: fullName } } : undefined,
    });

    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setOtpSent(true);
    setMessage(`OTP sent to ${normalized}. Enter the 6-digit code.`);
  };

  const verifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const normalized = normalizeNigerianPhone(phone);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalized,
      token: otp,
      type: "sms",
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code> to
          enable login. See README for setup steps.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => { setMethod("email"); setOtpSent(false); setError(""); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
            method === "email" ? "bg-white text-green-800 shadow-sm" : "text-gray-600"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => { setMethod("phone"); setOtpSent(false); setError(""); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
            method === "phone" ? "bg-white text-green-800 shadow-sm" : "text-gray-600"
          }`}
        >
          Phone OTP
        </button>
      </div>

      {method === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneOptional" className="mb-1 block text-sm font-medium text-gray-700">
                  Phone (optional)
                </label>
                <input
                  id="phoneOptional"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>
      ) : (
        <div>
          {!otpSent ? (
            <div className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label htmlFor="fullNamePhone" className="mb-1 block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <input
                    id="fullNamePhone"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  />
                </div>
              )}
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Nigerian phone number
                </label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678 or +2348012345678"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>
              <button
                type="button"
                onClick={sendPhoneOtp}
                disabled={loading}
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <p className="text-xs text-gray-500">
                Requires SMS provider in Supabase (Termii, Twilio, etc.).
              </p>
            </div>
          ) : (
            <form onSubmit={verifyPhoneOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="mb-1 block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 tracking-widest"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-700 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & sign in"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-gray-500"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
    </div>
  );
}
