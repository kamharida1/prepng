export interface UniversityPack {
  slug: string;
  name: string;
  shortName: string;
  state: string;
  founded: number;
  motto: string;
  location: string;
}

export const UNIVERSITY_PACKS: UniversityPack[] = [
  {
    slug: "unilag",
    name: "University of Lagos",
    shortName: "UNILAG",
    state: "Lagos",
    founded: 1962,
    motto: "In deed and in truth",
    location: "Akoka, Lagos",
  },
  {
    slug: "unn",
    name: "University of Nigeria, Nsukka",
    shortName: "UNN",
    state: "Enugu",
    founded: 1960,
    motto: "To restore the dignity of man",
    location: "Nsukka, Enugu",
  },
  {
    slug: "oau",
    name: "Obafemi Awolowo University",
    shortName: "OAU",
    state: "Osun",
    founded: 1962,
    motto: "For learning and culture",
    location: "Ile-Ife, Osun",
  },
  {
    slug: "ui",
    name: "University of Ibadan",
    shortName: "UI",
    state: "Oyo",
    founded: 1948,
    motto: "Recte sapere fons",
    location: "Ibadan, Oyo",
  },
  {
    slug: "abu",
    name: "Ahmadu Bello University",
    shortName: "ABU",
    state: "Kaduna",
    founded: 1962,
    motto: "The first duty of every university is the search for and the spread of knowledge",
    location: "Zaria, Kaduna",
  },
  {
    slug: "lasu",
    name: "Lagos State University",
    shortName: "LASU",
    state: "Lagos",
    founded: 1983,
    motto: "For truth and service",
    location: "Ojo, Lagos",
  },
  {
    slug: "uniport",
    name: "University of Port Harcourt",
    shortName: "UNIPORT",
    state: "Rivers",
    founded: 1975,
    motto: "For enlightenment and self-reliance",
    location: "Port Harcourt, Rivers",
  },
  {
    slug: "uniben",
    name: "University of Benin",
    shortName: "UNIBEN",
    state: "Edo",
    founded: 1970,
    motto: "Knowledge for service",
    location: "Benin City, Edo",
  },
  {
    slug: "futa",
    name: "Federal University of Technology, Akure",
    shortName: "FUTA",
    state: "Ondo",
    founded: 1981,
    motto: "Technology for self-reliance",
    location: "Akure, Ondo",
  },
  {
    slug: "unilorin",
    name: "University of Ilorin",
    shortName: "UNILORIN",
    state: "Kwara",
    founded: 1975,
    motto: "Probitas doctrina",
    location: "Ilorin, Kwara",
  },
];

export function getUniversityBySlug(slug: string): UniversityPack | undefined {
  return UNIVERSITY_PACKS.find((u) => u.slug === slug);
}
