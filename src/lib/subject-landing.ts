import { APP_NAME, EXAM_META, SUBJECTS_BY_EXAM } from "./constants";
import { EXAM_SLUGS, examLandingPath, type ExamLandingFaq } from "./exam-landing";
import { getSubjectQuestionCount } from "./question-stats";
import { SITE_URL } from "./seo";
import type { ExamType } from "./types";

export interface SubjectLandingConfig {
  exam: ExamType;
  subject: string;
  examSlug: string;
  subjectSlug: string;
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: ExamLandingFaq[];
  questionCount: number;
}

export function subjectToSlug(subject: string): string {
  return subject.toLowerCase().replace(/\s+/g, "-");
}

export function subjectLandingPath(exam: ExamType, subject: string): string {
  return `${examLandingPath(exam)}/${subjectToSlug(subject)}`;
}

export function getExamBySlug(examSlug: string): ExamType | null {
  const entry = Object.entries(EXAM_SLUGS).find(([, slug]) => slug === examSlug);
  return entry ? (entry[0] as ExamType) : null;
}

export function getSubjectBySlug(exam: ExamType, subjectSlug: string): string | null {
  return (
    SUBJECTS_BY_EXAM[exam].find((subject) => subjectToSlug(subject) === subjectSlug) ?? null
  );
}

export function getAllSubjectLandingParams(): { examSlug: string; subjectSlug: string }[] {
  return (Object.entries(EXAM_SLUGS) as [ExamType, string][]).flatMap(([exam, examSlug]) =>
    SUBJECTS_BY_EXAM[exam].map((subject) => ({
      examSlug,
      subjectSlug: subjectToSlug(subject),
    })),
  );
}

const EXAM_COPY: Record<
  ExamType,
  { label: string; session: string; practiceLabel: string }
> = {
  JAMB: {
    label: "JAMB",
    session: "UTME CBT",
    practiceLabel: "JAMB (UTME)",
  },
  WAEC: {
    label: "WAEC",
    session: "WASSCE",
    practiceLabel: "WAEC (WASSCE)",
  },
  NECO: {
    label: "NECO",
    session: "SSCE",
    practiceLabel: "NECO (SSCE)",
  },
  "POST-UTME": {
    label: "POST-UTME",
    session: "university screening",
    practiceLabel: "POST-UTME screening",
  },
};

function buildFaqs(exam: ExamType, subject: string): ExamLandingFaq[] {
  const copy = EXAM_COPY[exam];
  const minutes = EXAM_META[exam].defaultMinutes;

  return [
    {
      question: `How many ${copy.label} ${subject} questions are on PrepNG?`,
      answer: `PrepNG has ${getSubjectQuestionCount(exam, subject)} past-style ${subject} questions for ${copy.practiceLabel}, covering recent exam years with detailed explanations.`,
    },
    {
      question: `Can I practice ${copy.label} ${subject} for free?`,
      answer:
        "Yes. The free plan includes 20 questions per day across all subjects. Upgrade for unlimited access and offline downloads.",
    },
    {
      question: `How long is a ${copy.label} ${subject} practice session?`,
      answer: `Default timed sessions run for ${minutes} minutes — similar to real ${copy.session} exam conditions. You can adjust the number of questions before you start.`,
    },
  ];
}

export function getSubjectLandingConfig(
  exam: ExamType,
  subject: string,
): SubjectLandingConfig {
  const examSlug = EXAM_SLUGS[exam];
  const subjectSlug = subjectToSlug(subject);
  const copy = EXAM_COPY[exam];
  const questionCount = getSubjectQuestionCount(exam, subject);
  const path = subjectLandingPath(exam, subject);

  return {
    exam,
    subject,
    examSlug,
    subjectSlug,
    path,
    title: `${copy.label} ${subject} Past Questions & ${copy.session} Practice`,
    metaDescription: `Practice ${copy.label} ${subject} past questions online with timed ${copy.session} sessions, instant feedback, and detailed explanations. ${questionCount}+ questions on ${APP_NAME}.`,
    h1: `${copy.label} ${subject} Past Questions`,
    intro: `Prepare for ${copy.practiceLabel} with ${subject} past-style questions on ${APP_NAME}. Run timed CBT sessions, review step-by-step explanations after each attempt, and download packs to practice offline without mobile data.`,
    keywords: [
      `${copy.label} ${subject} past questions`,
      `${copy.label} ${subject} practice`,
      `${copy.label} ${subject} CBT`,
      `${subject} ${copy.session}`,
      `${copy.label} ${subject} answers`,
    ],
    faqs: buildFaqs(exam, subject),
    questionCount,
  };
}

export function getSubjectLandingBySlugs(
  examSlug: string,
  subjectSlug: string,
): SubjectLandingConfig | null {
  const exam = getExamBySlug(examSlug);
  if (!exam) return null;
  const subject = getSubjectBySlug(exam, subjectSlug);
  if (!subject) return null;
  return getSubjectLandingConfig(exam, subject);
}

export function subjectLandingJsonLd(config: SubjectLandingConfig) {
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
      provider: { "@type": "Organization", name: APP_NAME, url: SITE_URL },
      timeRequired: `PT${meta.defaultMinutes}M`,
      educationalLevel: "Secondary education",
      inLanguage: "en-NG",
      teaches: config.subject,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "NGN",
        description: `${config.questionCount} ${config.subject} questions available`,
      },
    },
  };
}
