"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EXAM_META,
  EXAM_TYPES,
  SUBJECTS_BY_EXAM,
} from "@/lib/constants";
import { ALOC_PRACTICE_YEARS } from "@/lib/aloc";
import { UNIVERSITY_PACKS } from "@/lib/universities";
import {
  getOfflinePackMeta,
  getOfflineQuestions,
  saveOfflinePack,
} from "@/lib/offline-packs";
import { filterQuestions, shuffleQuestions } from "@/lib/questions";
import { saveActiveSession } from "@/lib/storage";
import {
  canStartWithUsage,
  fetchUsageState,
  type UsageState,
} from "@/lib/user-subscription";
import type { ExamType, Question } from "@/lib/types";

const DOWNLOAD_COUNT = 30;

export function PracticeSetup() {
  const router = useRouter();
  const [exam, setExam] = useState<ExamType>("JAMB");
  const [subject, setSubject] = useState(SUBJECTS_BY_EXAM.JAMB[0]);
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState<number | "all">("all");
  const [count, setCount] = useState(10);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState("");
  const [starting, setStarting] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [usage, setUsage] = useState<UsageState>({
    authenticated: false,
    premium: false,
    remaining: 20,
    profile: null,
  });

  const refreshOfflineCount = () => {
    setOfflineCount(getOfflineQuestions(exam, subject, year).length);
  };

  useEffect(() => {
    fetchUsageState().then(setUsage);
  }, []);

  useEffect(() => {
    refreshOfflineCount();
  }, [exam, subject, year]);

  const years = ALOC_PRACTICE_YEARS;

  const handleExamChange = (next: ExamType) => {
    setExam(next);
    setSubject(SUBJECTS_BY_EXAM[next][0]);
    setUniversity("");
    setYear("all");
    setError("");
    setDownloadMsg("");
  };

  const isSeason = usage.premium && usage.profile?.plan === "season";

  const useUniversityPack = exam === "POST-UTME" && university && isSeason;

  const fetchOnlineQuestions = async (questionCount: number): Promise<Question[]> => {
    if (useUniversityPack) {
      const params = new URLSearchParams({
        university,
        subject,
        count: String(questionCount),
      });
      const uniRes = await fetch(`/api/questions/university?${params}`);
      const uniData = await uniRes.json();
      if (uniRes.ok && uniData.questions?.length) {
        return uniData.questions as Question[];
      }
      if (uniRes.status === 403) {
        throw new Error("University packs require an Exam Season plan.");
      }
    }

    const params = new URLSearchParams({
      exam,
      subject,
      count: String(questionCount),
    });
    if (year !== "all") params.set("year", String(year));
    if (isSeason && year === "all") params.set("priority", "true");

    const alocRes = await fetch(`/api/questions/aloc?${params}`);
    const alocData = await alocRes.json();
    if (alocRes.ok && alocData.questions?.length) {
      return alocData.questions as Question[];
    }

    const localRes = await fetch(`/api/questions?${params}`);
    const localData = await localRes.json();
    if (localRes.ok && localData.questions?.length) {
      return localData.questions as Question[];
    }

    return [];
  };

  const startPractice = async () => {
    setError("");
    setStarting(true);

    const check = canStartWithUsage(count, usage);
    if (!check.allowed) {
      setError(check.reason ?? "Cannot start practice");
      setStarting(false);
      return;
    }

    let selected: Question[] = [];
    let source: "aloc" | "local" | "offline" | "university" = "local";
    const offlinePool = getOfflineQuestions(exam, subject, year);
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

    if (isOffline) {
      if (offlinePool.length === 0) {
        setError("You're offline. Download this subject first while you have internet.");
        setStarting(false);
        return;
      }
      selected = shuffleQuestions(offlinePool).slice(0, Math.min(count, offlinePool.length));
      source = "offline";
    } else if (offlinePool.length >= count) {
      selected = shuffleQuestions(offlinePool).slice(0, count);
      source = "offline";
    } else {
      try {
        const online = await fetchOnlineQuestions(count);
        if (online.length) {
          selected = online;
          if (useUniversityPack) {
            source = "university";
          } else {
            source = online[0]?.id.startsWith("aloc-") ? "aloc" : "local";
          }
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes("Season plan")) {
          setError(err.message);
          setStarting(false);
          return;
        }
      }

      if (selected.length === 0 && offlinePool.length > 0) {
        selected = shuffleQuestions(offlinePool).slice(0, Math.min(count, offlinePool.length));
        source = "offline";
      }

      if (selected.length === 0) {
        const local = filterQuestions({
          exam,
          subject,
          year: year === "all" ? undefined : year,
        });
        if (local.length) {
          selected = shuffleQuestions(local).slice(0, Math.min(count, local.length));
          source = "local";
        }
      }
    }

    if (selected.length === 0) {
      setError("No questions available. Download a pack or check your connection.");
      setStarting(false);
      return;
    }

    const sessionId = `session-${Date.now()}`;

    saveActiveSession({
      id: sessionId,
      exam,
      subject,
      university: university || undefined,
      year: year === "all" ? (selected[0]?.year ?? 2024) : year,
      questionIds: selected.map((q) => q.id),
      questions: selected,
      source,
      answers: {},
      markedForReview: [],
      startedAt: Date.now(),
      timeLimitMinutes: EXAM_META[exam].defaultMinutes,
    });

    setStarting(false);
    router.push("/practice/exam");
  };

  const downloadForOffline = async () => {
    setDownloading(true);
    setDownloadMsg("");
    setError("");

    try {
      const questions = await fetchOnlineQuestions(DOWNLOAD_COUNT);

      if (!questions.length) {
        setDownloadMsg("Could not fetch questions. Check your internet and API token.");
        return;
      }

      const result = saveOfflinePack(exam, subject, year, questions, true);

      if (!result.ok) {
        setDownloadMsg(result.error ?? "Failed to save offline pack.");
        return;
      }

      refreshOfflineCount();
      const meta = getOfflinePackMeta(exam, subject, year);
      setDownloadMsg(
        `Saved ${result.count} questions for offline use${meta?.downloadedAt ? ` (updated ${new Date(meta.downloadedAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })})` : ""}. Practice works without internet.`,
      );
    } catch {
      setDownloadMsg("Download failed. Check your connection and try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Start CBT Practice</h1>
        <p className="mt-1 text-gray-600">
          Real JAMB, WAEC & POST-UTME past questions with CBT-style practice.
        </p>
        {offlineCount > 0 ? (
          <p className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
            {offlineCount} questions downloaded for {subject}
            {year !== "all" ? ` (${year})` : ""} — works offline
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">
            No offline pack yet. Download while online to practice without data.
          </p>
        )}
        {usage.premium ? (
          <p className="mt-3 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
            {usage.profile?.plan === "season" ? "Exam Season" : "Pro"} plan active — unlimited practice
            {isSeason && year === "all" && !useUniversityPack && " · priority questions (2022–2024)"}
            {useUniversityPack && ` · ${UNIVERSITY_PACKS.find((u) => u.slug === university)?.shortName} pack`}
            {usage.authenticated && <> · synced to your account</>}
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Free plan: {usage.remaining === Infinity ? "unlimited" : `${usage.remaining} questions left today`}
            {!usage.authenticated && (
              <>
                {" "}· <Link href="/signup" className="font-semibold underline">Sign in</Link> to sync across devices
              </>
            )}
          </p>
        )}
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Exam type</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EXAM_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleExamChange(type)}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                  exam === type
                    ? "border-green-600 bg-green-50 text-green-800"
                    : "border-gray-200 text-gray-700 hover:border-green-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {exam === "POST-UTME" && (
          <div>
            <label htmlFor="university" className="mb-2 block text-sm font-semibold text-gray-700">
              University pack {isSeason ? "" : "(Season)"}
            </label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
            >
              <option value="">General POST-UTME (all universities)</option>
              {UNIVERSITY_PACKS.map((u) => (
                <option key={u.slug} value={u.slug} disabled={!isSeason}>
                  {u.shortName} — {u.name}
                  {!isSeason ? " (Season)" : ""}
                </option>
              ))}
            </select>
            {!isSeason && (
              <p className="mt-2 text-xs text-gray-500">
                University-specific packs are available on the Exam Season plan.{" "}
                <Link href="/pricing" className="font-semibold text-green-700 underline">
                  Upgrade
                </Link>
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-gray-700">
            Subject
          </label>
          <select
            id="subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setYear("all");
              setDownloadMsg("");
            }}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
          >
            {SUBJECTS_BY_EXAM[exam].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="year" className="mb-2 block text-sm font-semibold text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => {
                setYear(e.target.value === "all" ? "all" : Number(e.target.value));
                setDownloadMsg("");
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="count" className="mb-2 block text-sm font-semibold text-gray-700">
              Number of questions
            </label>
            <select
              id="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
            >
              {[5, 10, 15, 20, 30, 40].map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startPractice}
            disabled={starting}
            className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
          >
            {starting ? "Loading questions..." : "Start CBT Exam"}
          </button>
          <button
            type="button"
            onClick={downloadForOffline}
            disabled={downloading}
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {downloading ? `Downloading ${DOWNLOAD_COUNT} questions...` : `Download ${DOWNLOAD_COUNT} for offline`}
          </button>
        </div>

        {downloadMsg && (
          <p
            className={`text-sm ${downloadMsg.startsWith("Saved") ? "text-green-700" : "text-red-700"}`}
          >
            {downloadMsg}
          </p>
        )}
      </div>
    </div>
  );
}
