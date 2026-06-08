"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthHeader } from "@/components/AuthHeader";
import { ResultsView } from "@/components/ResultsView";

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") ?? "";

  return <ResultsView sessionId={sessionId} />;
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading results...</div>}>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
