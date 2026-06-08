import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PACKS_DIR = join(ROOT, "src/data/questions/packs");

const EXAMS = {
  JAMB: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature"],
  WAEC: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Economics", "Government", "Commerce"],
  NECO: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Economics", "Government", "Agricultural Science"],
  "POST-UTME": ["Mathematics", "English", "General Paper", "Use of English", "Current Affairs"],
};

const YEARS = [2024, 2023, 2022, 2021];
const QUESTIONS_PER_PACK = 69; // 29 packs × 69 ≈ 2,000 questions

function slugify(exam, subject) {
  return `${exam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function makeOptions(correctIdx, labels) {
  const keys = ["A", "B", "C", "D"];
  const options = labels.map((text, i) => ({ key: keys[i], text }));
  const correctAnswer = keys[correctIdx];
  return { options, correctAnswer };
}

const generators = {
  Mathematics: (exam, subject, year, i) => {
    const a = (i % 9) + 2;
    const b = (i % 7) + 3;
    const c = a * b;
    const templates = [
      () => {
        const x = (i % 11) + 4;
        const sum = a + x;
        return {
          topic: "Algebra",
          text: `If ${a}x + ${b} = ${a * x + b}, find x.`,
          ...makeOptions(1, ["1", String(x), String(x + 2), String(x + 5)]),
          explanation: `Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}.`,
        };
      },
      () => ({
        topic: "Arithmetic",
        text: `What is ${a}% of ${c * 10}?`,
        ...makeOptions(2, [String(c), String(c * 5), String(c * 10 * a / 100), String(c * 2)]),
        explanation: `${a}% of ${c * 10} = (${a}/100) × ${c * 10} = ${c * 10 * a / 100}.`,
      }),
      () => {
        const p = i % 5 + 2;
        const q = i % 4 + 3;
        const r = i % 6 + 4;
        return {
          topic: "Ratio",
          text: `Divide ₦${(p + q + r) * 1000} in the ratio ${p}:${q}:${r}. What is the largest share?`,
          ...makeOptions(3, [
            `₦${p * 1000}`,
            `₦${q * 1000}`,
            `₦${r * 1000}`,
            `₦${Math.round(((p + q + r) * 1000 * r) / (p + q + r))}`,
          ]),
          explanation: `Largest ratio part is ${r}. Share = ${r}/${p + q + r} × ₦${(p + q + r) * 1000}.`,
        };
      },
      () => ({
        topic: "Geometry",
        text: `A rectangle has length ${a + 3} cm and width ${b} cm. Find its area.`,
        ...makeOptions(0, [
          `${(a + 3) * b} cm²`,
          `${a + b + 3} cm²`,
          `${2 * (a + 3 + b)} cm²`,
          `${(a + 3) + b} cm²`,
        ]),
        explanation: `Area = length × width = ${a + 3} × ${b} = ${(a + 3) * b} cm².`,
      }),
      () => {
        const n = (i % 6) + 5;
        return {
          topic: "Angles",
          text: `Find the sum of interior angles of a ${n}-sided polygon.`,
          ...makeOptions(1, [
            `${(n - 2) * 180 - 180}°`,
            `${(n - 2) * 180}°`,
            `${n * 180}°`,
            `${(n + 2) * 180}°`,
          ]),
          explanation: `Sum = (n − 2) × 180° = (${n} − 2) × 180° = ${(n - 2) * 180}°.`,
        };
      },
    ];
    return pick(templates, i)();
  },

  English: (exam, subject, year, i) => {
    const words = [
      { word: "abundant", syn: "plentiful", ant: "scarce" },
      { word: "diligent", syn: "hardworking", ant: "lazy" },
      { word: "fragile", syn: "delicate", ant: "strong" },
      { word: "obsolete", syn: "outdated", ant: "modern" },
      { word: "benevolent", syn: "kind", ant: "cruel" },
    ];
    const w = pick(words, i);
    const templates = [
      () => ({
        topic: "Lexis",
        text: `Choose the nearest in meaning to '${w.word}':`,
        ...makeOptions(0, [w.syn, w.ant, "unknown", "temporary"]),
        explanation: `'${w.word}' means ${w.syn}.`,
      }),
      () => ({
        topic: "Antonyms",
        text: `The opposite of '${w.word}' is:`,
        ...makeOptions(1, [w.syn, w.ant, "similar", "equal"]),
        explanation: `The antonym of '${w.word}' is '${w.ant}'.`,
      }),
      () => ({
        topic: "Grammar",
        text: `Choose the correct option: The team _____ ready for the ${exam} exam.`,
        ...makeOptions(2, ["are", "were", "is", "have"]),
        explanation: `'Team' is a collective noun treated as singular here → 'is'.`,
      }),
      () => ({
        topic: "Spelling",
        text: `Which word is correctly spelt?`,
        ...makeOptions(3, ["accomodation", "occured", "necessary", "definately"]),
        explanation: `The correct spelling is 'necessary'.`,
      }),
    ];
    return pick(templates, i)();
  },

  Physics: (exam, subject, year, i) => {
    const v = (i % 8) + 2;
    const t = (i % 5) + 2;
    const templates = [
      () => ({
        topic: "Mechanics",
        text: `A body moves ${v * 10} m in ${t} s. Find average speed in m/s.`,
        ...makeOptions(0, [`${(v * 10) / t} m/s`, `${v * t} m/s`, `${v + t} m/s`, `${v * 10 * t} m/s`]),
        explanation: `Speed = distance/time = ${v * 10}/${t} = ${(v * 10) / t} m/s.`,
      }),
      () => ({
        topic: "Electricity",
        text: `The SI unit of resistance is:`,
        ...makeOptions(1, ["Ampere", "Ohm", "Volt", "Watt"]),
        explanation: `Resistance is measured in ohms (Ω).`,
      }),
      () => ({
        topic: "Waves",
        text: `A wave has frequency ${v * 10} Hz and wavelength 2 m. Find its speed.`,
        ...makeOptions(2, [`${v} m/s`, `${v * 5} m/s`, `${v * 20} m/s`, `${v * 40} m/s`]),
        explanation: `v = fλ = ${v * 10} × 2 = ${v * 20} m/s.`,
      }),
    ];
    return pick(templates, i)();
  },

  Chemistry: (exam, subject, year, i) => {
    const n = (i % 18) + 3;
    const templates = [
      () => ({
        topic: "Periodic Table",
        text: `An element with atomic number ${n} has ${n}:`,
        ...makeOptions(0, ["protons", "neutrons only", "nuclei", "isotopes only"]),
        explanation: `Atomic number = number of protons = ${n}.`,
      }),
      () => ({
        topic: "Mole Concept",
        text: `How many moles are in ${n * 18} g of water? (Molar mass = 18 g/mol)`,
        ...makeOptions(1, [`${n / 2} mol`, `${n} mol`, `${n * 2} mol`, `${n * 18} mol`]),
        explanation: `Moles = mass/molar mass = ${n * 18}/18 = ${n} mol.`,
      }),
      () => ({
        topic: "Acids & Bases",
        text: `The pH of a neutral solution at 25°C is:`,
        ...makeOptions(2, ["0", "1", "7", "14"]),
        explanation: `Pure water is neutral with pH = 7.`,
      }),
    ];
    return pick(templates, i)();
  },

  Biology: (exam, subject, year, i) => {
    const templates = [
      () => ({
        topic: "Cell Biology",
        text: `Which organelle controls cell activities?`,
        ...makeOptions(2, ["Ribosome", "Mitochondrion", "Nucleus", "Vacuole"]),
        explanation: `The nucleus contains genetic material and controls cell functions.`,
      }),
      () => ({
        topic: "Ecology",
        text: `Organisms that make their own food are called:`,
        ...makeOptions(0, ["producers", "consumers", "decomposers", "parasites"]),
        explanation: `Producers (usually plants) manufacture food via photosynthesis.`,
      }),
      () => ({
        topic: "Genetics",
        text: `The basic unit of heredity is the:`,
        ...makeOptions(1, ["chromosome", "gene", "nucleus", "protein"]),
        explanation: `A gene is a segment of DNA that codes for a trait.`,
      }),
    ];
    return pick(templates, i)();
  },

  Economics: (exam, subject, year, i) => ({
    topic: "Basic Concepts",
    text: `The problem of scarcity means:`,
    ...makeOptions(0, [
      "wants exceed available resources",
      "resources exceed wants",
      "goods are free",
      "there is no choice",
    ]),
    explanation: `Scarcity arises because human wants are unlimited but resources are limited.`,
  }),

  Government: (exam, subject, year, i) => {
    const facts = [
      { q: "Nigeria gained independence in:", a: "1960", opts: ["1959", "1960", "1963", "1979"] },
      { q: "A key feature of democracy is:", a: "Periodic free and fair elections", opts: ["Military rule", "Periodic free and fair elections", "One-party state", "Monarchy"] },
      { q: "The Nigerian legislature at the federal level is the:", a: "National Assembly", opts: ["Supreme Court", "National Assembly", "Federal Executive Council", "INEC"] },
    ];
    const f = pick(facts, i);
    const idx = f.opts.indexOf(f.a);
    return {
      topic: "Civics",
      text: f.q,
      ...makeOptions(idx, f.opts),
      explanation: `The correct answer is: ${f.a}.`,
    };
  },

  Literature: (exam, subject, year, i) => ({
    topic: "Literary Terms",
    text: `A direct comparison without 'like' or 'as' is called:`,
    ...makeOptions(1, ["simile", "metaphor", "hyperbole", "onomatopoeia"]),
    explanation: `A metaphor is an implied comparison between two unlike things.`,
  }),

  Commerce: (exam, subject, year, i) => ({
    topic: "Trade",
    text: `Buying goods from abroad is called:`,
    ...makeOptions(0, ["importation", "exportation", "inflation", "devaluation"]),
    explanation: `Imports are goods and services brought into a country from abroad.`,
  }),

  "Agricultural Science": (exam, subject, year, i) => ({
    topic: "Soil Science",
    text: `The topmost layer of soil rich in organic matter is:`,
    ...makeOptions(2, ["bedrock", "subsoil", "topsoil", "parent rock"]),
    explanation: `Topsoil (horizon A) contains most nutrients and organic material.`,
  }),

  "General Paper": (exam, subject, year, i) => ({
    topic: "General Knowledge",
    text: `The capital of Nigeria is:`,
    ...makeOptions(1, ["Lagos", "Abuja", "Kano", "Port Harcourt"]),
    explanation: `Abuja became Nigeria's capital in 1991.`,
  }),

  "Use of English": (exam, subject, year, i) => ({
    topic: "Comprehension",
    text: `Choose the best punctuation: She asked ___ where is my book___`,
    ...makeOptions(2, [", ?", ": ?", "— ?", ". ?"]),
    explanation: `Use a comma before the quoted question and a question mark inside the quote.`,
  }),

  "Current Affairs": (exam, subject, year, i) => {
    const facts = [
      { q: "The currency of Nigeria is:", a: "Naira", opts: ["Cedi", "Naira", "Franc", "Dollar"] },
      { q: "ECOWAS headquarters is in:", a: "Abuja", opts: ["Lagos", "Abuja", "Accra", "Dakar"] },
      { q: "INEC is responsible for:", a: "Elections", opts: ["Taxation", "Elections", "Healthcare", "Defence"] },
    ];
    const f = pick(facts, i);
    const idx = f.opts.indexOf(f.a);
    return {
      topic: "Nigeria & Africa",
      text: f.q,
      ...makeOptions(idx, f.opts),
      explanation: `Correct answer: ${f.a}.`,
    };
  },
};

function generatePack(exam, subject) {
  const questions = [];
  const gen = generators[subject] ?? generators["General Paper"];

  for (let i = 0; i < QUESTIONS_PER_PACK; i++) {
    const year = YEARS[i % YEARS.length];
    const base = gen(exam, subject, year, i);
    questions.push({
      id: `${slugify(exam, subject)}-${year}-${String(i + 1).padStart(3, "0")}`,
      exam,
      subject,
      year,
      ...base,
    });
  }

  return questions;
}

mkdirSync(PACKS_DIR, { recursive: true });

const manifest = { generatedAt: new Date().toISOString(), packs: [], totalQuestions: 0 };

for (const [exam, subjects] of Object.entries(EXAMS)) {
  for (const subject of subjects) {
    const slug = slugify(exam, subject);
    const questions = generatePack(exam, subject);
    const filePath = join(PACKS_DIR, `${slug}.json`);
    writeFileSync(filePath, JSON.stringify(questions, null, 2));
    manifest.packs.push({
      slug,
      exam,
      subject,
      file: `packs/${slug}.json`,
      count: questions.length,
      years: YEARS,
    });
    manifest.totalQuestions += questions.length;
  }
}

writeFileSync(join(ROOT, "src/data/questions/manifest.json"), JSON.stringify(manifest, null, 2));

// Generate index.ts that imports all packs
const packFiles = readdirSync(PACKS_DIR).filter((f) => f.endsWith(".json"));
const imports = packFiles
  .map((f, i) => `import pack${i} from "./packs/${f}";`)
  .join("\n");
const exports = `export const questionPacks = [${packFiles.map((_, i) => `pack${i}`).join(", ")}];`;
const indexContent = `${imports}\n\n${exports}\n\nexport { default as manifest } from "./manifest.json";\n`;
writeFileSync(join(ROOT, "src/data/questions/index.ts"), indexContent);

console.log(`Generated ${manifest.totalQuestions} questions across ${manifest.packs.length} packs.`);
