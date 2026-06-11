import type { ExamType, PricingPlan } from "./types";

export const APP_NAME = "PrepNG";
export const APP_TAGLINE = "Ace JAMB, WAEC, NECO & POST-UTME";
export const SUPPORT_EMAIL = "support@prepng.com";
export const SUPPORT_WHATSAPP = "2348000000000"; // Replace with your WhatsApp number
export const COMPANY_NAME = "PrepNG";
/** Paystack metadata `app` value — identifies PrepNG charges on the shared webhook */
export const PAYSTACK_APP_ID = "prepng";
/** Set this URL in Paystack Dashboard → Settings → Webhooks */
export const PAYSTACK_WEBHOOK_URL = "https://prepng.com/api/paystack/webhook";

export const EXAM_TYPES: ExamType[] = ["JAMB", "WAEC", "NECO", "POST-UTME"];

export const EXAM_META: Record<
  ExamType,
  { color: string; description: string; defaultMinutes: number }
> = {
  JAMB: {
    color: "#008751",
    description: "UTME CBT practice with timed sessions",
    defaultMinutes: 60,
  },
  WAEC: {
    color: "#1e40af",
    description: "WASSCE past-style questions & explanations",
    defaultMinutes: 90,
  },
  NECO: {
    color: "#b45309",
    description: "NECO SSCE practice for all subjects",
    defaultMinutes: 90,
  },
  "POST-UTME": {
    color: "#7c3aed",
    description: "University screening test preparation",
    defaultMinutes: 45,
  },
};

export const FREE_DAILY_LIMIT = 20;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "20 questions per day",
      "Real past questions",
      "CBT practice mode",
      "Explanations after each exam",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Pro",
    price: 1500,
    period: "per month",
    features: [
      "Unlimited practice",
      "All subjects & years",
      "Offline download packs",
      "Detailed explanations",
      "Performance analytics",
    ],
    popular: true,
  },
  {
    id: "season",
    name: "Exam Season",
    price: 3500,
    period: "per season",
    features: [
      "Everything in Monthly Pro",
      "Valid until exam season ends",
      "Priority new questions",
      "POST-UTME university packs",
      "Best value for final-year students",
    ],
  },
];

export const SUBJECTS_BY_EXAM: Record<ExamType, string[]> = {
  JAMB: [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Government",
    "Literature",
  ],
  WAEC: [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Government",
    "Commerce",
  ],
  NECO: [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Government",
    "Agricultural Science",
  ],
  "POST-UTME": [
    "Mathematics",
    "English",
    "General Paper",
    "Use of English",
    "Current Affairs",
  ],
};
