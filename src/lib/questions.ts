import { questionPacks } from "@/data/questions";
import manifest from "@/data/questions/manifest.json";
import type { ExamType, Question, QuestionFilter } from "./types";

const allQuestions = questionPacks.flat() as Question[];

export function getAllQuestions(): Question[] {
  return allQuestions;
}

export function getQuestionManifest() {
  return manifest;
}

export function getPackSummaries() {
  return manifest.packs;
}

export function getAvailableYears(exam: ExamType, subject: string): number[] {
  const years = allQuestions
    .filter((q) => q.exam === exam && q.subject === subject)
    .map((q) => q.year);

  return [...new Set(years)].sort((a, b) => b - a);
}

export function filterQuestions(filter: QuestionFilter): Question[] {
  return allQuestions.filter((q) => {
    if (q.exam !== filter.exam) return false;
    if (q.subject !== filter.subject) return false;
    if (filter.year && q.year !== filter.year) return false;
    return true;
  });
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = new Map(allQuestions.map((q) => [q.id, q]));
  return ids.map((id) => map.get(id)).filter(Boolean) as Question[];
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getOfflinePackKey(
  exam: ExamType,
  subject: string,
  year?: number,
): string {
  return `prepng-offline-${exam}-${subject}-${year ?? "all"}`;
}
