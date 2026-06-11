import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SubjectLandingPage } from "@/components/SubjectLandingPage";
import { pageMetadata } from "@/lib/seo";
import {
  getAllSubjectLandingParams,
  getSubjectLandingBySlugs,
} from "@/lib/subject-landing";

export function generateStaticParams() {
  return getAllSubjectLandingParams();
}

type PageProps = {
  params: Promise<{ examSlug: string; subjectSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { examSlug, subjectSlug } = await params;
  const config = getSubjectLandingBySlugs(examSlug, subjectSlug);
  if (!config) return {};

  return {
    ...pageMetadata({
      title: config.title,
      description: config.metaDescription,
      path: config.path,
    }),
    keywords: config.keywords,
  };
}

export default async function SubjectLandingRoute({ params }: PageProps) {
  const { examSlug, subjectSlug } = await params;
  const config = getSubjectLandingBySlugs(examSlug, subjectSlug);
  if (!config) notFound();

  return <SubjectLandingPage config={config} />;
}
