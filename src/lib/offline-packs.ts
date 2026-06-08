import type { ExamType, Question } from "./types";
import { getOfflinePackKey } from "./questions";
import {
  cacheOfflinePack,
  getOfflinePack,
  listOfflinePacks,
} from "./storage";

export interface OfflinePackMeta {
  exam: ExamType;
  subject: string;
  year: number | "all";
  questions: Question[];
  downloadedAt: number;
  count: number;
}

function packStorageKey(exam: ExamType, subject: string, year?: number | "all") {
  return getOfflinePackKey(exam, subject, year === "all" ? undefined : year);
}

export function getOfflinePackMeta(
  exam: ExamType,
  subject: string,
  year: number | "all" = "all",
): OfflinePackMeta | null {
  const key = packStorageKey(exam, subject, year);
  const direct = getOfflinePack<OfflinePackMeta | Question[]>(key);

  if (direct) {
    if (Array.isArray(direct)) {
      return {
        exam,
        subject,
        year,
        questions: direct,
        downloadedAt: 0,
        count: direct.length,
      };
    }
    return direct;
  }

  if (year !== "all") {
    const allKey = packStorageKey(exam, subject, "all");
    const fallback = getOfflinePack<OfflinePackMeta | Question[]>(allKey);
    if (fallback) {
      if (Array.isArray(fallback)) {
        const filtered = fallback.filter((q) => q.year === year);
        if (filtered.length) {
          return {
            exam,
            subject,
            year,
            questions: filtered,
            downloadedAt: 0,
            count: filtered.length,
          };
        }
      } else if (fallback.questions.length) {
        const filtered = fallback.questions.filter((q) => q.year === year);
        if (filtered.length) {
          return { ...fallback, year, questions: filtered, count: filtered.length };
        }
      }
    }
  }

  return null;
}

export function saveOfflinePack(
  exam: ExamType,
  subject: string,
  year: number | "all",
  newQuestions: Question[],
  merge = true,
): { ok: boolean; count: number; error?: string } {
  const key = packStorageKey(exam, subject, year);
  const existing = getOfflinePackMeta(exam, subject, year);
  let combined = newQuestions;

  if (merge && existing?.questions.length) {
    const seen = new Set(existing.questions.map((q) => q.id));
    combined = [
      ...existing.questions,
      ...newQuestions.filter((q) => !seen.has(q.id)),
    ];
  }

  const meta: OfflinePackMeta = {
    exam,
    subject,
    year,
    questions: combined,
    downloadedAt: Date.now(),
    count: combined.length,
  };

  try {
    cacheOfflinePack(key, meta);
    return { ok: true, count: combined.length };
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "QuotaExceededError"
        ? "Storage full. Delete old packs or download fewer questions."
        : "Could not save to device storage.";
    return { ok: false, count: 0, error: message };
  }
}

export function getOfflineQuestions(
  exam: ExamType,
  subject: string,
  year: number | "all" = "all",
): Question[] {
  return getOfflinePackMeta(exam, subject, year)?.questions ?? [];
}

export function listSavedOfflinePacks(): OfflinePackMeta[] {
  return listOfflinePacks()
    .map((key) => {
      const raw = getOfflinePack<OfflinePackMeta | Question[]>(key);
      if (!raw) return null;
      if (Array.isArray(raw)) return null;
      return raw;
    })
    .filter(Boolean) as OfflinePackMeta[];
}
