import { getQuestionsByIds } from "./questions";
import type { ExamSession, Question } from "./types";

export function getSessionQuestions(session: ExamSession): Question[] {
  if (session.questions?.length) {
    return session.questions;
  }
  return getQuestionsByIds(session.questionIds);
}
