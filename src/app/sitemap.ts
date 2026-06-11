import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getAllSubjectLandingParams } from "@/lib/subject-landing";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/jamb", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/waec", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/neco", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/post-utme", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/practice", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/refunds", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const subjectPages = getAllSubjectLandingParams().map(({ examSlug, subjectSlug }) => ({
    path: `/${examSlug}/${subjectSlug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  return [...pages, ...subjectPages].map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
