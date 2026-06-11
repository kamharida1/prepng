import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/login",
        "/signup",
        "/analytics",
        "/practice/exam",
        "/results",
        "/api/",
        "/auth/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
