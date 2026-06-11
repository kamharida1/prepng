import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthHeader } from "@/components/AuthHeader";
import { PracticeSetup } from "@/components/PracticeSetup";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "CBT Practice",
  description:
    "Start a timed JAMB, WAEC, NECO or POST-UTME CBT practice session. Choose your exam, subject, and year — with explanations and offline download support.",
  path: "/practice",
});

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading practice...</div>}>
        <PracticeSetup />
      </Suspense>
    </div>
  );
}
