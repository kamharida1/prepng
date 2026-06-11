import type { Metadata } from "next";
import { APP_NAME, SUPPORT_EMAIL } from "./constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://prepng.com";

export const DEFAULT_DESCRIPTION =
  "Practice JAMB, WAEC, NECO and POST-UTME past questions online. CBT-style timed exams, detailed explanations, offline packs, and performance analytics for Nigerian students.";

export const HOME_H1 =
  "JAMB, WAEC, NECO & POST-UTME Past Questions";

export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
  title: {
    default: `${APP_NAME} — JAMB, WAEC, NECO & POST-UTME Past Questions`,
    template: `%s — ${APP_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "JAMB past questions",
    "WAEC practice",
    "NECO past questions",
    "POST-UTME practice",
    "CBT practice Nigeria",
    "UTME prep",
    "exam prep Nigeria",
    "PrepNG",
  ],
  authors: [{ name: APP_NAME, url: SITE_URL }],
  creator: APP_NAME,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — JAMB, WAEC, NECO & POST-UTME Practice`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Nigerian Exam Prep`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_NG",
      siteName: APP_NAME,
      title: `${title} — ${APP_NAME}`,
      description,
      url: absoluteUrl(path),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${APP_NAME}`,
      description,
    },
    ...(noindex
      ? { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
      : {}),
  };
}

export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: APP_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en-NG",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: APP_NAME,
      url: SITE_URL,
      email: SUPPORT_EMAIL,
      description: DEFAULT_DESCRIPTION,
      areaServed: {
        "@type": "Country",
        name: "Nigeria",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which exams does PrepNG cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PrepNG covers JAMB (UTME), WAEC, NECO, and POST-UTME screening tests with past-style questions and CBT practice.",
          },
        },
        {
          "@type": "Question",
          name: "Can I practice for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The free plan includes 20 questions per day with CBT practice mode and explanations after each exam.",
          },
        },
        {
          "@type": "Question",
          name: "Does PrepNG work offline?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can download question packs while online and practice without mobile data.",
          },
        },
      ],
    },
  ];
}
