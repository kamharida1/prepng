import type { Question, QuestionOption } from "./types";

const WEAK_EXPLANATION_PATTERNS = [
  /^refer to the correct option/i,
  /^see (the )?solution/i,
  /^option\s*[a-d]\.?$/i,
  /^[a-d]\.?$/,
  /^the (correct )?answer is\s*[a-d]\.?$/i,
  /^correct answer:\s*[a-d]\.?$/i,
  /^answer:\s*[a-d]\.?$/i,
];

export function getOptionText(
  options: QuestionOption[],
  key: string | undefined,
): string | undefined {
  if (!key) return undefined;
  return options.find((opt) => opt.key === key)?.text;
}

export function isWeakExplanation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.length < 12) return true;
  return WEAK_EXPLANATION_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function buildFallbackExplanation(
  correctAnswer: string,
  options: QuestionOption[],
): string {
  const correctText = getOptionText(options, correctAnswer);
  if (correctText) {
    return `The correct answer is ${correctAnswer}: "${correctText}".`;
  }
  return `The correct answer is ${correctAnswer}.`;
}

export function resolveQuestionExplanation(
  explanation: string,
  correctAnswer: string,
  options: QuestionOption[],
): string {
  const trimmed = explanation.trim();
  if (!isWeakExplanation(trimmed)) return trimmed;
  return buildFallbackExplanation(correctAnswer, options);
}

export function getResultExplanation(
  question: Question,
  userAnswer: string | undefined,
): string {
  const base = resolveQuestionExplanation(
    question.explanation,
    question.correctAnswer,
    question.options,
  );

  if (userAnswer === question.correctAnswer) return base;

  const correctText = getOptionText(question.options, question.correctAnswer);
  const userText = getOptionText(question.options, userAnswer);
  const hasDetailedExplanation = !isWeakExplanation(question.explanation.trim());

  if (!userAnswer) {
    if (hasDetailedExplanation) {
      return `You did not answer this question. ${base}`;
    }
    return correctText
      ? `You did not answer this question. The correct answer is ${question.correctAnswer}: "${correctText}".`
      : `You did not answer this question. ${base}`;
  }

  if (!hasDetailedExplanation) {
    const wrongPart = userText
      ? `You chose ${userAnswer}: "${userText}".`
      : `You chose ${userAnswer}.`;
    const correctPart = correctText
      ? `The correct answer is ${question.correctAnswer}: "${correctText}".`
      : buildFallbackExplanation(question.correctAnswer, question.options);
    return `${wrongPart} ${correctPart}`;
  }

  const wrongPart = userText
    ? `You chose ${userAnswer}: "${userText}". `
    : `You chose ${userAnswer}. `;
  return `${wrongPart}${base}`;
}
