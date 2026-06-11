import type { Metadata } from "next";
import { ExamLandingPage } from "@/components/ExamLandingPage";
import { EXAM_LANDING } from "@/lib/exam-landing";
import { pageMetadata } from "@/lib/seo";

const config = EXAM_LANDING.JAMB;

export const metadata: Metadata = {
  ...pageMetadata({
    title: config.title,
    description: config.metaDescription,
    path: config.path,
  }),
  keywords: config.keywords,
};

export default function JambLandingPage() {
  return <ExamLandingPage config={config} />;
}
