import type { ExamType, Question } from "./types";

const ALOC_BASE = "https://questions.aloc.com.ng/api/v2/q";

export interface AlocQuestionData {
  id: number;
  question: string;
  option: { a: string; b: string; c: string; d: string; e: string | null };
  answer: string;
  solution: string;
  examtype: string;
  examyear: string;
  section?: string;
  category?: string;
}

export interface AlocResponse {
  status: number;
  subject: string;
  data: AlocQuestionData;
  message?: string;
}

/** Map PrepNG exam labels to ALOC API exam types */
export const EXAM_TO_ALOC: Partial<Record<ExamType, string>> = {
  JAMB: "utme",
  WAEC: "wassce",
  NECO: "wassce",
  "POST-UTME": "post-utme",
};

/** Map PrepNG subject names to ALOC subject slugs */
export const SUBJECT_TO_ALOC: Record<string, string> = {
  Mathematics: "mathematics",
  English: "english",
  Physics: "physics",
  Chemistry: "chemistry",
  Biology: "biology",
  Economics: "economics",
  Government: "government",
  Literature: "englishlit",
  Commerce: "commerce",
  "Agricultural Science": "biology",
  "General Paper": "currentaffairs",
  "Use of English": "english",
  "Current Affairs": "currentaffairs",
};

export function isAlocConfigured(): boolean {
  return Boolean(process.env.ALOC_ACCESS_TOKEN);
}

export function getAlocSubject(subject: string): string | null {
  return SUBJECT_TO_ALOC[subject] ?? null;
}

export function formatAlocText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<sup>(.*?)<\/sup>/gi, "^$1")
    .replace(/<sub>(.*?)<\/sub>/gi, "_$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2212;/g, "−")
    .replace(/&quot;/g, '"')
    .trim();
}

export function alocToQuestion(
  data: AlocQuestionData,
  exam: ExamType,
  subject: string,
): Question {
  const options = (["a", "b", "c", "d"] as const)
    .map((key, i) => {
      const text = data.option[key];
      if (!text) return null;
      return {
        key: String.fromCharCode(65 + i),
        text: formatAlocText(text),
      };
    })
    .filter(Boolean) as Question["options"];

  const answerKey = data.answer?.toLowerCase();
  const answerIndex = ["a", "b", "c", "d"].indexOf(answerKey);
  const correctAnswer =
    answerIndex >= 0 ? String.fromCharCode(65 + answerIndex) : "A";

  return {
    id: `aloc-${data.id}`,
    exam,
    subject,
    year: Number(data.examyear) || new Date().getFullYear(),
    topic: (() => {
      const section = data.section ? formatAlocText(data.section) : "";
      if (section.length > 10 && section.length < 120 && !section.includes("SOLUTION")) {
        return section.slice(0, 80);
      }
      return data.category ?? "Past question";
    })(),
    text: formatAlocText(data.question),
    options,
    correctAnswer,
    explanation: formatAlocText(data.solution) || "Refer to the correct option above.",
  };
}

export const ALOC_PRACTICE_YEARS = Array.from({ length: 24 }, (_, i) => 2024 - i);
export const PRIORITY_YEARS = [2024, 2023, 2022];

export async function fetchAlocQuestion(
  token: string,
  subject: string,
  examType: string,
  exam: ExamType,
  displaySubject: string,
  year?: number,
): Promise<Question | null> {
  const params = new URLSearchParams({ subject, type: examType });
  if (year) params.set("year", String(year));

  const res = await fetch(`${ALOC_BASE}?${params}`, {
    headers: {
      Accept: "application/json",
      AccessToken: token,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as AlocResponse;
  if (!json.data?.id) return null;

  return alocToQuestion(json.data, exam, displaySubject);
}

function pickYearForFetch(year?: number, priorityMode?: boolean): number | undefined {
  if (year) return year;
  if (!priorityMode) return undefined;
  if (Math.random() < 0.8) {
    return PRIORITY_YEARS[Math.floor(Math.random() * PRIORITY_YEARS.length)];
  }
  return 2010 + Math.floor(Math.random() * 10);
}

export async function fetchAlocQuestionSet(
  token: string,
  exam: ExamType,
  subject: string,
  count: number,
  year?: number,
  priorityMode?: boolean,
): Promise<{ questions: Question[]; error?: string }> {
  const alocSubject = getAlocSubject(subject);
  const alocExam = EXAM_TO_ALOC[exam];

  if (!alocSubject || !alocExam) {
    return { questions: [], error: `${subject} is not available via the question API.` };
  }

  const seen = new Set<number>();
  const questions: Question[] = [];
  const maxAttempts = count * 4;
  let attempts = 0;
  const batchSize = 5;

  while (questions.length < count && attempts < maxAttempts) {
    const batch = Array.from(
      { length: Math.min(batchSize, count - questions.length) },
      () =>
        fetchAlocQuestion(
          token,
          alocSubject,
          alocExam,
          exam,
          subject,
          pickYearForFetch(year, priorityMode),
        ),
    );
    const results = await Promise.all(batch);
    attempts += batchSize;

    for (const q of results) {
      if (!q || questions.length >= count) continue;
      const alocId = Number(q.id.replace("aloc-", ""));
      if (seen.has(alocId)) continue;
      seen.add(alocId);
      questions.push({ ...q, exam, subject });
    }
  }

  if (questions.length === 0) {
    return { questions: [], error: "Could not fetch questions. Check your API token or try another subject." };
  }

  return { questions };
}
