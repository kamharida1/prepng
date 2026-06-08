import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "src/data/universities");

const UNIVERSITIES = [
  { slug: "unilag", name: "University of Lagos", shortName: "UNILAG", state: "Lagos", founded: 1962, location: "Akoka, Lagos" },
  { slug: "unn", name: "University of Nigeria, Nsukka", shortName: "UNN", state: "Enugu", founded: 1960, location: "Nsukka, Enugu" },
  { slug: "oau", name: "Obafemi Awolowo University", shortName: "OAU", state: "Osun", founded: 1962, location: "Ile-Ife, Osun" },
  { slug: "ui", name: "University of Ibadan", shortName: "UI", state: "Oyo", founded: 1948, location: "Ibadan, Oyo" },
  { slug: "abu", name: "Ahmadu Bello University", shortName: "ABU", state: "Kaduna", founded: 1962, location: "Zaria, Kaduna" },
  { slug: "lasu", name: "Lagos State University", shortName: "LASU", state: "Lagos", founded: 1983, location: "Ojo, Lagos" },
  { slug: "uniport", name: "University of Port Harcourt", shortName: "UNIPORT", state: "Rivers", founded: 1975, location: "Port Harcourt, Rivers" },
  { slug: "uniben", name: "University of Benin", shortName: "UNIBEN", state: "Edo", founded: 1970, location: "Benin City, Edo" },
  { slug: "futa", name: "Federal University of Technology, Akure", shortName: "FUTA", state: "Ondo", founded: 1981, location: "Akure, Ondo" },
  { slug: "unilorin", name: "University of Ilorin", shortName: "UNILORIN", state: "Kwara", founded: 1975, location: "Ilorin, Kwara" },
];

const SUBJECTS = ["Mathematics", "English", "General Paper", "Use of English", "Current Affairs"];
const QUESTIONS_PER_UNI = 25;

function makeOptions(correctIdx, labels) {
  const keys = ["A", "B", "C", "D"];
  return {
    options: labels.map((text, i) => ({ key: keys[i], text })),
    correctAnswer: keys[correctIdx],
  };
}

function generateQuestions(uni, subject, count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const id = `uni-${uni.slug}-${subject.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`;
    let q;

    if (subject === "Mathematics") {
      const a = (i % 7) + 3;
      const b = (i % 5) + 2;
      q = {
        topic: "Arithmetic",
        text: `A ${uni.shortName} screening candidate buys ${a} pens at ₦${b * 50} each. How much does she pay in total?`,
        ...makeOptions(2, [`₦${a + b}`, `₦${a * b}`, `₦${a * b * 50}`, `₦${(a + b) * 50}`]),
        explanation: `Total = ${a} × ₦${b * 50} = ₦${a * b * 50}.`,
      };
    } else if (subject === "English" || subject === "Use of English") {
      const words = ["benevolent", "meticulous", "pragmatic", "resilient", "tenacious"];
      const word = words[i % words.length];
      q = {
        topic: "Vocabulary",
        text: `Choose the word closest in meaning to "${word}".`,
        ...makeOptions(i % 4, ["Careless", "Kind and generous", "Lazy", "Hostile"]),
        explanation: `"${word}" means showing kindness or goodwill — closest to "Kind and generous".`,
      };
    } else if (subject === "Current Affairs" || subject === "General Paper") {
      const templates = [
        {
          topic: "University history",
          text: `${uni.shortName} was established in which year?`,
          ...makeOptions(1, ["1945", String(uni.founded), String(uni.founded + 10), String(uni.founded - 5)]),
          explanation: `${uni.name} was founded in ${uni.founded}.`,
        },
        {
          topic: "Location",
          text: `Where is ${uni.shortName} located?`,
          ...makeOptions(0, [uni.location, "Abuja, FCT", "Kano, Kano", "Calabar, Cross River"]),
          explanation: `${uni.shortName} is in ${uni.location}, ${uni.state} State.`,
        },
        {
          topic: "Nigeria",
          text: `How many states are in the Federal Republic of Nigeria?`,
          ...makeOptions(2, ["30", "34", "36", "37"]),
          explanation: "Nigeria has 36 states plus the Federal Capital Territory (FCT).",
        },
        {
          topic: "Education",
          text: `JAMB is the body responsible for admission into Nigerian ___.`,
          ...makeOptions(0, ["tertiary institutions", "primary schools", "polytechnics only", "foreign universities"]),
          explanation: "JAMB (Joint Admissions and Matriculation Board) coordinates UTME for tertiary admission.",
        },
        {
          topic: `${uni.shortName} screening`,
          text: `POST-UTME screening at ${uni.shortName} typically tests candidates on:`,
          ...makeOptions(1, [
            "Only practical skills",
            "Use of English, relevant subjects & general knowledge",
            "Only mathematics",
            "Only current affairs",
          ]),
          explanation: "Most Nigerian universities test English, subject knowledge, and general awareness in POST-UTME.",
        },
      ];
      q = templates[i % templates.length];
    } else {
      q = {
        topic: "General",
        text: `Which Nigerian state is home to ${uni.shortName}?`,
        ...makeOptions(0, [uni.state, "Lagos", "Kano", "Rivers"]),
        explanation: `${uni.shortName} is located in ${uni.state} State.`,
      };
    }

    questions.push({
      id,
      exam: "POST-UTME",
      subject,
      year: 2024,
      university: uni.slug,
      topic: q.topic,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  }
  return questions;
}

mkdirSync(OUT_DIR, { recursive: true });

let total = 0;
for (const uni of UNIVERSITIES) {
  const allQuestions = [];
  for (const subject of SUBJECTS) {
    const perSubject = Math.ceil(QUESTIONS_PER_UNI / SUBJECTS.length);
    allQuestions.push(...generateQuestions(uni, subject, perSubject));
  }
  const pack = {
    university: uni.slug,
    name: uni.name,
    shortName: uni.shortName,
    questionCount: allQuestions.length,
    questions: allQuestions,
  };
  writeFileSync(join(OUT_DIR, `${uni.slug}.json`), JSON.stringify(pack, null, 2));
  total += allQuestions.length;
  console.log(`  ${uni.shortName}: ${allQuestions.length} questions`);
}

console.log(`\nGenerated ${UNIVERSITIES.length} university packs (${total} questions total)`);
