import { EXAM_META, SUBJECTS_BY_EXAM } from "./constants";
import { getQuestionCounts, getSubjectQuestionCount } from "./question-stats";
import type { ExamType } from "./types";

export interface ExamLandingFaq {
  question: string;
  answer: string;
}

export interface ExamLandingConfig {
  exam: ExamType;
  slug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  intro: string;
  keywords: string[];
  features: string[];
  faqs: ExamLandingFaq[];
}

export const EXAM_SLUGS: Record<ExamType, string> = {
  JAMB: "jamb",
  WAEC: "waec",
  NECO: "neco",
  "POST-UTME": "post-utme",
};

export function examLandingPath(exam: ExamType): string {
  return `/${EXAM_SLUGS[exam]}`;
}

const counts = getQuestionCounts();

export const EXAM_LANDING: Record<ExamType, ExamLandingConfig> = {
  JAMB: {
    exam: "JAMB",
    slug: "jamb",
    path: "/jamb",
    title: "JAMB Past Questions & UTME CBT Practice",
    metaDescription:
      "Practice JAMB UTME past questions online with real CBT timing, explanations, and offline packs. Mathematics, English, Physics, Chemistry, Biology and more on PrepNG.",
    h1: "JAMB Past Questions & UTME CBT Practice",
    subtitle: "Prepare for UTME with timed CBT sessions and detailed explanations",
    intro:
      "PrepNG helps Nigerian students practice JAMB (UTME) past questions in a real computer-based test environment. Choose your subject, set the number of questions, and get instant feedback with step-by-step explanations after every session.",
    keywords: [
      "JAMB past questions",
      "UTME practice",
      "JAMB CBT",
      "JAMB 2024 questions",
      "JAMB mathematics",
      "JAMB physics",
    ],
    features: [
      "Timed CBT sessions matching real UTME exam pressure",
      "Past-style questions across Mathematics, Sciences, Arts & Social Sciences",
      "Question palette, mark-for-review, and countdown timer",
      "Detailed explanations after you submit",
      "Download packs for offline practice without data",
    ],
    faqs: [
      {
        question: "Is PrepNG affiliated with JAMB?",
        answer:
          "No. PrepNG is an independent exam prep platform. We are not affiliated with JAMB or any examination body.",
      },
      {
        question: "How many JAMB questions can I practice for free?",
        answer: "The free plan includes 20 questions per day across all subjects.",
      },
      {
        question: "Which JAMB subjects are available?",
        answer:
          "Mathematics, English, Physics, Chemistry, Biology, Economics, Government, and Literature.",
      },
    ],
  },
  WAEC: {
    exam: "WAEC",
    slug: "waec",
    path: "/waec",
    title: "WAEC Past Questions & WASSCE Practice",
    metaDescription:
      "WAEC WASSCE past questions and answers with CBT-style practice, explanations, and offline download. Mathematics, English, Sciences and more on PrepNG.",
    h1: "WAEC Past Questions & WASSCE Practice",
    subtitle: "WASSCE-style practice with explanations for every question",
    intro:
      "Get ready for WAEC (WASSCE) with past-style questions organised by subject and year. PrepNG lets you practice in timed sessions, review explanations, and download question packs to study offline.",
    keywords: [
      "WAEC past questions",
      "WASSCE practice",
      "WAEC CBT",
      "WAEC mathematics",
      "WAEC 2024 questions",
    ],
    features: [
      "WASSCE past-style questions from 2021–2024",
      "Commerce, Government, Economics, Sciences and core subjects",
      "Learn from explanations, not just correct answers",
      "Practice by subject or mix questions across years",
      "Works on phone — practice anywhere",
    ],
    faqs: [
      {
        question: "Does PrepNG have real WAEC past questions?",
        answer:
          "PrepNG provides past-style practice questions for WAEC subjects. Content is expanded regularly through our question bank and API sources.",
      },
      {
        question: "Can I practice WAEC offline?",
        answer: "Yes. Download a subject pack while online and practice without mobile data.",
      },
      {
        question: "Which WAEC subjects can I practice?",
        answer:
          "Mathematics, English, Physics, Chemistry, Biology, Economics, Government, and Commerce.",
      },
    ],
  },
  NECO: {
    exam: "NECO",
    slug: "neco",
    path: "/neco",
    title: "NECO Past Questions & SSCE Practice",
    metaDescription:
      "NECO SSCE past questions practice online. Timed CBT sessions, explanations, and offline packs for Mathematics, English, Sciences, Agricultural Science and more.",
    h1: "NECO Past Questions & SSCE Practice",
    subtitle: "NECO SSCE preparation with CBT practice and explanations",
    intro:
      "PrepNG supports NECO candidates with subject-based past questions, timed practice sessions, and clear explanations. Build confidence across core and science subjects before your SSCE.",
    keywords: [
      "NECO past questions",
      "NECO SSCE practice",
      "NECO CBT",
      "NECO 2024 questions",
      "NECO biology",
    ],
    features: [
      "NECO past-style questions across 8 subjects",
      "Includes Agricultural Science and core SSCE subjects",
      "Timed practice to improve speed and accuracy",
      "Track weak topics with performance analytics (Pro plan)",
      "Free daily practice — upgrade anytime",
    ],
    faqs: [
      {
        question: "Is NECO practice free on PrepNG?",
        answer: "Yes. You get 20 free questions per day. Upgrade for unlimited access.",
      },
      {
        question: "Which NECO subjects are covered?",
        answer:
          "Mathematics, English, Physics, Chemistry, Biology, Economics, Government, and Agricultural Science.",
      },
      {
        question: "How is NECO practice different from JAMB?",
        answer:
          "NECO sessions use SSCE-style subject packs and a 90-minute default timer. JAMB uses UTME CBT settings with a 60-minute default.",
      },
    ],
  },
  "POST-UTME": {
    exam: "POST-UTME",
    slug: "post-utme",
    path: "/post-utme",
    title: "POST-UTME Past Questions & University Screening Practice",
    metaDescription:
      "POST-UTME screening test practice for Nigerian universities. Past questions, CBT sessions, university packs, and explanations on PrepNG.",
    h1: "POST-UTME Past Questions & Screening Practice",
    subtitle: "University screening test prep with subject packs and explanations",
    intro:
      "After JAMB, POST-UTME screening tests decide your admission. PrepNG helps you practice General Paper, English, Mathematics, Current Affairs and university-specific packs in a timed CBT format.",
    keywords: [
      "POST-UTME past questions",
      "university screening test",
      "POST UTME practice",
      "UNILAG POST-UTME",
      "UI POST-UTME",
    ],
    features: [
      "General POST-UTME questions for all universities",
      "University-specific packs on Exam Season plan (UNILAG, UI, OAU, and more)",
      "45-minute timed sessions matching typical screening tests",
      "Current Affairs and Use of English practice",
      "Explanations to understand tricky screening questions",
    ],
    faqs: [
      {
        question: "What is POST-UTME on PrepNG?",
        answer:
          "POST-UTME practice covers screening-style questions for Nigerian universities — General Paper, English, Mathematics, and Current Affairs.",
      },
      {
        question: "Are university-specific packs available?",
        answer:
          "Yes. Exam Season subscribers get packs for universities like UNILAG, UI, OAU, UNN, and more.",
      },
      {
        question: "Do I need JAMB practice too?",
        answer:
          "Most students practice both. Start with JAMB for UTME, then move to POST-UTME before your university screening.",
      },
    ],
  },
};

export function getExamLandingBySlug(slug: string): ExamLandingConfig | null {
  return Object.values(EXAM_LANDING).find((c) => c.slug === slug) ?? null;
}

export function examLandingJsonLd(config: ExamLandingConfig) {
  const meta = EXAM_META[config.exam];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
    about: {
      "@type": "Course",
      name: config.h1,
      description: config.intro,
      provider: { "@type": "Organization", name: "PrepNG", url: "https://prepng.com" },
      timeRequired: `PT${meta.defaultMinutes}M`,
      educationalLevel: "Secondary education",
      inLanguage: "en-NG",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NGN",
        description: `${counts[config.exam]} sample questions available`,
      },
    },
  };
}

export function getExamSubjects(exam: ExamType) {
  return SUBJECTS_BY_EXAM[exam].map((subject) => ({
    subject,
    count: getSubjectQuestionCount(exam, subject),
  }));
}
