import { NextRequest, NextResponse } from "next/server";
import { filterQuestions } from "@/lib/questions";
import type { ExamType } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const exam = searchParams.get("exam") as ExamType | null;
  const subject = searchParams.get("subject");
  const yearParam = searchParams.get("year");

  if (!exam || !subject) {
    return NextResponse.json(
      { error: "exam and subject are required" },
      { status: 400 },
    );
  }

  const questions = filterQuestions({
    exam,
    subject,
    year: yearParam ? Number(yearParam) : undefined,
  });

  return NextResponse.json(
    { questions, count: questions.length },
    { headers: { "Cache-Control": "no-store" } },
  );
}
