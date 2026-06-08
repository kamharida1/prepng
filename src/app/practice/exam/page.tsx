"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CBTExam } from "@/components/CBTExam";
import { getActiveSession } from "@/lib/storage";
import type { ExamSession } from "@/lib/types";

export default function ExamPage() {
  const router = useRouter();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const active = getActiveSession();
    if (!active) {
      router.replace("/practice");
      return;
    }
    setSession(active);
    setReady(true);
  }, []);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        Loading exam...
      </div>
    );
  }

  return <CBTExam initialSession={session} />;
}
