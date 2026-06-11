import type { ExamType } from "./types";

export function practiceUrl(exam?: ExamType, subject?: string): string {
  const params = new URLSearchParams();
  if (exam) params.set("exam", exam);
  if (subject) params.set("subject", subject);
  const query = params.toString();
  return query ? `/practice?${query}` : "/practice";
}
