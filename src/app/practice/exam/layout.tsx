import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "CBT Exam",
  description: "Active CBT practice exam session.",
  path: "/practice/exam",
  noindex: true,
});

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
