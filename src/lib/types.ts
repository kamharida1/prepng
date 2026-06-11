export type ExamType = "JAMB" | "WAEC" | "NECO" | "POST-UTME";

export type PlanId = "free" | "monthly" | "season";

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  exam: ExamType;
  subject: string;
  year: number;
  university?: string;
  text: string;
  /** Diagram or figure URL from ALOC (Cloudinary) */
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  topic: string;
}

export interface QuestionFilter {
  exam: ExamType;
  subject: string;
  year?: number;
}

export interface ExamSession {
  id: string;
  exam: ExamType;
  subject: string;
  year: number;
  university?: string;
  questionIds: string[];
  /** Full question objects when sourced from ALOC API */
  questions?: Question[];
  source?: "local" | "aloc" | "offline" | "university";
  answers: Record<string, string>;
  markedForReview: string[];
  startedAt: number;
  submittedAt?: number;
  timeLimitMinutes: number;
}

export interface TopicStat {
  topic: string;
  correct: number;
  total: number;
}

export interface PracticeResult {
  id: string;
  sessionId: string;
  exam: ExamType;
  subject: string;
  university?: string;
  year: number;
  score: number;
  total: number;
  percentage: number;
  durationMinutes: number;
  topicStats: TopicStat[];
  completedAt: number;
}

export interface AnalyticsSummary {
  totalExams: number;
  totalQuestions: number;
  averageScore: number;
  bestScore: number;
  bySubject: Record<string, { exams: number; avgScore: number }>;
  byExam: Record<string, { exams: number; avgScore: number }>;
  weakTopics: TopicStat[];
  recentResults: PracticeResult[];
}

export interface Subscription {
  plan: PlanId;
  expiresAt: number;
  email?: string;
  reference?: string;
}

export interface PaymentRecord {
  id: string;
  reference: string;
  plan: PlanId;
  amount: number;
  currency: string;
  status: string;
  paid_at: string;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}
