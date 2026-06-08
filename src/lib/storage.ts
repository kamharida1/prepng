import type { ExamSession } from "./types";

const SESSION_KEY = "prepng-session";
const SESSIONS_KEY = "prepng-sessions";

export function saveActiveSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getActiveSession(): ExamSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamSession;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function archiveSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  const existing = getArchivedSessions();
  const updated = [session, ...existing.filter((s) => s.id !== session.id)].slice(
    0,
    20,
  );
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export function getArchivedSessions(): ExamSession[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ExamSession[];
  } catch {
    return [];
  }
}

export function getSessionById(id: string): ExamSession | null {
  const active = getActiveSession();
  if (active?.id === id) return active;
  return getArchivedSessions().find((s) => s.id === id) ?? null;
}

export function cacheOfflinePack(key: string, data: unknown): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(data);
  localStorage.setItem(key, serialized);
}

export function getOfflinePack<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function listOfflinePacks(): string[] {
  if (typeof window === "undefined") return [];
  const packs: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("prepng-offline-")) packs.push(key);
  }
  return packs;
}
