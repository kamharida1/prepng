import { NextRequest, NextResponse } from "next/server";
import { fetchAlocQuestionSet, isAlocConfigured } from "@/lib/aloc";
import { createClient } from "@/lib/supabase/server";
import { isProfileSeason } from "@/lib/profile";
import type { ExamType } from "@/lib/types";

export async function GET(request: NextRequest) {
  if (!isAlocConfigured()) {
    return NextResponse.json(
      { error: "ALOC_ACCESS_TOKEN is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = request.nextUrl;
  const exam = searchParams.get("exam") as ExamType | null;
  const subject = searchParams.get("subject");
  const count = Math.min(Number(searchParams.get("count")) || 10, 40);
  const yearParam = searchParams.get("year");

  if (!exam || !subject) {
    return NextResponse.json(
      { error: "exam and subject are required" },
      { status: 400 },
    );
  }

  const token = process.env.ALOC_ACCESS_TOKEN!;
  const year = yearParam && yearParam !== "all" ? Number(yearParam) : undefined;

  let priorityMode = false;
  if (searchParams.get("priority") === "true" && !year) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      priorityMode = isProfileSeason(profile);
    }
  }

  const { questions, error } = await fetchAlocQuestionSet(
    token,
    exam,
    subject,
    count,
    year,
    priorityMode,
  );

  if (error && questions.length === 0) {
    return NextResponse.json({ error }, { status: 502 });
  }

  return NextResponse.json({
    questions,
    count: questions.length,
    source: "aloc",
  });
}
