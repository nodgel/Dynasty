import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type FigureSeed = {
  slug: string;
  name: string;
  titles: string[];
  birthYear?: number;
  deathYear?: number;
  biography: string;
};

const dynastySeed = {
  slug: "bagrationi",
  name: "Bagrationi",
  region: "Georgia (Caucasus)",
  foundedYear: 780,
  endedYear: 1810,
  description:
    "The Bagrationi dynasty was the royal house of Georgia, ruling the medieval Kingdom of Georgia from its unification in 1008 until the Russian annexation in 1801. Tracing its origins to the 8th century, it produced some of the most consequential monarchs of the Caucasus, including David IV the Builder and Tamar the Great, under whom Georgia entered its Golden Age.",
};

const figures: FigureSeed[] = [
  {
    slug: "bagrat-iii",
    name: "Bagrat III",
    titles: ["King of Georgia", "King of Abkhazia"],
    birthYear: 960,
    deathYear: 1014,
    biography:
      "Bagrat III was the first king of a unified Georgian realm, joining the kingdoms of Abkhazia and Iberia under Bagrationi rule in 1008. His reign laid the dynastic foundation for medieval Georgia.",
  },
  {
    slug: "george-i",
    name: "George I",
    titles: ["King of Georgia"],
    birthYear: 998,
    deathYear: 1027,
    biography:
      "George I succeeded his father Bagrat III and spent much of his reign contesting Byzantine claims in southwestern Georgia, fighting two unsuccessful wars against Emperor Basil II.",
  },
  {
    slug: "bagrat-iv",
    name: "Bagrat IV",
    titles: ["King of Georgia"],
    birthYear: 1018,
    deathYear: 1072,
    biography:
      "Bagrat IV navigated a long and turbulent reign defined by Byzantine pressure, the rise of the Seljuk Turks, and recurrent revolts by powerful feudal lords, yet preserved the integrity of the kingdom.",
  },
  {
    slug: "george-ii",
    name: "George II",
    titles: ["King of Georgia"],
    birthYear: 1054,
    deathYear: 1112,
    biography:
      "George II inherited a weakened state pressed by the Great Seljuk invasions. Unable to halt the devastation, he abdicated in favor of his son David IV in 1089, retaining only ceremonial dignity.",
  },
  {
    slug: "david-iv",
    name: "David IV the Builder",
    titles: ["King of Georgia", "Sword of the Messiah"],
    birthYear: 1073,
    deathYear: 1125,
    biography:
      "David IV is celebrated as one of the greatest Georgian monarchs. He reformed the army, broke Seljuk power at the Battle of Didgori in 1121, recaptured Tbilisi, and inaugurated the Georgian Golden Age.",
  },
  {
    slug: "demetrius-i",
    name: "Demetrius I",
    titles: ["King of Georgia", "Poet"],
    birthYear: 1093,
    deathYear: 1156,
    biography:
      "Demetrius I continued the consolidation work of his father David IV, defended Georgia's expansion southward, and is remembered for his Georgian-language hymns, including 'Thou Art a Vineyard'.",
  },
  {
    slug: "george-iii",
    name: "George III",
    titles: ["King of Georgia"],
    birthYear: 1125,
    deathYear: 1184,
    biography:
      "George III led successful campaigns into Armenia and Shirvan and, lacking a male heir, crowned his daughter Tamar as co-ruler in 1178 to secure the succession.",
  },
  {
    slug: "tamar-the-great",
    name: "Tamar the Great",
    titles: ["Queen of Georgia", "King of Kings"],
    birthYear: 1160,
    deathYear: 1213,
    biography:
      "Tamar presided over the apogee of medieval Georgia. Her armies expanded the kingdom across much of the Caucasus and northern Anatolia, and her court patronized the masterpieces of Georgian literature, including Rustaveli's 'The Knight in the Panther's Skin'. She is canonized as a saint by the Georgian Orthodox Church.",
  },
  {
    slug: "david-soslan",
    name: "David Soslan",
    titles: ["King Consort of Georgia"],
    birthYear: 1158,
    deathYear: 1207,
    biography:
      "An Alan prince of the Davit-Soslanid branch of the Bagrationi house, David Soslan became Tamar's second husband and her chief military commander, leading Georgian forces to decisive victories at Shamkor (1195) and Basian (1202).",
  },
  {
    slug: "george-iv-lasha",
    name: "George IV Lasha",
    titles: ["King of Georgia"],
    birthYear: 1191,
    deathYear: 1223,
    biography:
      "George IV, called Lasha ('the Brilliant'), succeeded his mother Tamar but was forced to confront the first Mongol incursions into the Caucasus. He died at thirty-two before he could meet a planned crusade alongside Western powers.",
  },
];

// parent slug → child slug
const parentChild: [string, string][] = [
  ["bagrat-iii", "george-i"],
  ["george-i", "bagrat-iv"],
  ["bagrat-iv", "george-ii"],
  ["george-ii", "david-iv"],
  ["david-iv", "demetrius-i"],
  ["demetrius-i", "george-iii"],
  ["george-iii", "tamar-the-great"],
  ["tamar-the-great", "george-iv-lasha"],
  ["david-soslan", "george-iv-lasha"],
];

// spouse pairs (order doesn't matter; we normalize by id)
const spousePairs: [string, string, { startYear?: number; endYear?: number }][] = [
  ["tamar-the-great", "david-soslan", { startYear: 1189, endYear: 1207 }],
];

async function main() {
  console.log("→ Seeding dynasty");
  const dynasty = await prisma.dynasty.upsert({
    where: { slug: dynastySeed.slug },
    update: {
      name: dynastySeed.name,
      region: dynastySeed.region,
      description: dynastySeed.description,
      foundedYear: dynastySeed.foundedYear,
      endedYear: dynastySeed.endedYear,
    },
    create: dynastySeed,
  });

  console.log(`→ Seeding ${figures.length} figures`);
  const bySlug = new Map<string, number>();
  for (const f of figures) {
    const row = await prisma.historicalFigure.upsert({
      where: { slug: f.slug },
      update: {
        name: f.name,
        titles: f.titles,
        birthYear: f.birthYear,
        deathYear: f.deathYear,
        biography: f.biography,
        dynastyId: dynasty.id,
      },
      create: {
        slug: f.slug,
        name: f.name,
        titles: f.titles,
        birthYear: f.birthYear,
        deathYear: f.deathYear,
        biography: f.biography,
        dynastyId: dynasty.id,
      },
    });
    bySlug.set(f.slug, row.id);
  }

  console.log(`→ Linking ${parentChild.length} parent-child pairs`);
  for (const [parentSlug, childSlug] of parentChild) {
    const parentId = bySlug.get(parentSlug);
    const childId = bySlug.get(childSlug);
    if (!parentId || !childId) throw new Error(`Missing figure: ${parentSlug} or ${childSlug}`);
    await prisma.parentChild.upsert({
      where: { parentId_childId: { parentId, childId } },
      update: {},
      create: { parentId, childId },
    });
  }

  console.log(`→ Linking ${spousePairs.length} spouse pair(s)`);
  for (const [slugA, slugB, meta] of spousePairs) {
    const idA = bySlug.get(slugA);
    const idB = bySlug.get(slugB);
    if (!idA || !idB) throw new Error(`Missing figure: ${slugA} or ${slugB}`);
    const [aId, bId] = idA < idB ? [idA, idB] : [idB, idA];
    await prisma.spouse.upsert({
      where: { aId_bId: { aId, bId } },
      update: { startYear: meta.startYear, endYear: meta.endYear },
      create: { aId, bId, startYear: meta.startYear, endYear: meta.endYear },
    });
  }

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
