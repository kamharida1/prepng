"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/constants";
import { formatNaira } from "@/lib/subscription";
import type { PaymentRecord } from "@/lib/types";

export function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const planName = (id: string) =>
    PRICING_PLANS.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Payment history</h2>
      <p className="mt-1 text-sm text-gray-500">
        Payments made through your account appear here after checkout completes.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No payments yet.{" "}
          <Link href="/pricing" className="font-semibold text-green-700">
            View plans
          </Link>
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500">
                <th className="pb-2 pr-4 font-medium">Date</th>
                <th className="pb-2 pr-4 font-medium">Plan</th>
                <th className="pb-2 pr-4 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="py-2 pr-4 text-gray-600">
                    {new Date(p.paid_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 pr-4">{planName(p.plan)}</td>
                  <td className="py-2 pr-4 font-medium">{formatNaira(p.amount)}</td>
                  <td className="py-2 capitalize text-green-700">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
