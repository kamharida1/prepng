import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUniversityBySlug } from "@/lib/universities";
import { createClient } from "@/lib/supabase/server";
import { isProfileSeason } from "@/lib/profile";
import type { Question } from "@/lib/types";

interface UniversityPackFile {
  university: string;
  name: string;
  shortName: string;
  questionCount: number;
  questions: Question[];
}

function loadUniversityPack(slug: string): UniversityPackFile | null {
  const filePath = join(process.cwd(), "src/data/universities", `${slug}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf-8")) as UniversityPackFile;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const university = searchParams.get("university");
  const subject = searchParams.get("subject");
  const count = Math.min(Number(searchParams.get("count")) || 10, 40);

  if (!university) {
    return NextResponse.json({ error: "university is required" }, { status: 400 });
  }

  const uni = getUniversityBySlug(university);
  if (!uni) {
    return NextResponse.json({ error: "Unknown university" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let season = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    season = isProfileSeason(profile);
  }

  if (!season) {
    return NextResponse.json(
      { error: "University packs require an Exam Season plan." },
      { status: 403 },
    );
  }

  const pack = loadUniversityPack(university);
  if (!pack) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  let pool = pack.questions;
  if (subject) {
    pool = pool.filter((q) => q.subject === subject);
  }

  const questions = shuffle(pool).slice(0, Math.min(count, pool.length));

  if (!questions.length) {
    return NextResponse.json(
      { error: "No questions for this subject in this university pack." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    questions,
    count: questions.length,
    source: "university",
    university: uni.slug,
    universityName: uni.name,
  });
}
