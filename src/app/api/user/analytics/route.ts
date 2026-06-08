import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { PracticeResult } from "@/lib/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ results: [], authenticated: false });
  }

  const { data, error } = await supabase
    .from("practice_results")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: PracticeResult[] = (data ?? []).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    exam: row.exam,
    subject: row.subject,
    university: row.university ?? undefined,
    year: row.year,
    score: row.score,
    total: row.total,
    percentage: row.percentage,
    durationMinutes: row.duration_minutes,
    topicStats: row.topic_stats ?? [],
    completedAt: new Date(row.completed_at).getTime(),
  }));

  return NextResponse.json({ results, authenticated: true });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: true, synced: false });
  }

  const body = (await request.json()) as PracticeResult;

  const { error } = await supabase.from("practice_results").upsert({
    id: body.id,
    user_id: user.id,
    session_id: body.sessionId,
    exam: body.exam,
    subject: body.subject,
    university: body.university ?? null,
    year: body.year,
    score: body.score,
    total: body.total,
    percentage: body.percentage,
    duration_minutes: body.durationMinutes,
    topic_stats: body.topicStats,
    completed_at: new Date(body.completedAt).toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, synced: true });
}
