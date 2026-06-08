import manifest from "@/data/questions/manifest.json";
import type { ExamType } from "./types";

export function getQuestionManifest() {
  return manifest;
}

export function getPackSummaries() {
  return manifest.packs;
}

export function getQuestionCounts(): Record<ExamType, number> {
  return manifest.packs.reduce(
    (acc, pack) => {
      const exam = pack.exam as ExamType;
      acc[exam] = (acc[exam] || 0) + pack.count;
      return acc;
    },
    {} as Record<ExamType, number>,
  );
}

export function getSubjectQuestionCount(exam: ExamType, subject: string): number {
  const pack = manifest.packs.find(
    (p) => p.exam === exam && p.subject === subject,
  );
  return pack?.count ?? 0;
}
