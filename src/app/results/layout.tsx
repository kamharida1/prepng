import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Exam results",
  description: "Review your CBT practice exam score and explanations.",
  path: "/results",
  noindex: true,
});

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
