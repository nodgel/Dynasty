import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type FigureSeed = {
  slug: string;
  name: string;
  titles: string[];
  birthYear?: number;
  deathYear?: number;
  biography: string;
  parents?: string[];
  spouses?: string[];
};

type DynastySeed = {
  slug: string;
  name: string;
  region: string;
  description: string;
  figures: FigureSeed[];
};

// BC years are stored as negative integers; this lets standard ordering
// queries (`ORDER BY birthYear ASC`) sort BC → AD chronologically.
const dynasties: DynastySeed[] = [
  {
    slug: "spanish-habsburgs",
    name: "Spanish Habsburgs",
    region: "Spain / Holy Roman Empire",
    description:
      "A dominant European royal house known for controlling a vast global empire, and notorious for their strategic, yet ultimately catastrophic, generations of close intermarriage which led to the dynasty's genetic collapse.",
    figures: [
      {
        slug: "charles-v",
        name: "Charles V",
        titles: ["Holy Roman Emperor", "King of Spain", "Archduke of Austria"],
        birthYear: 1500,
        deathYear: 1558,
        biography:
          "Ruled over an empire \"on which the sun never sets,\" spanning Europe to the Americas. Exhausted by constant wars with France and the Ottoman Empire, he abdicated his thrones and retired to a monastery.",
      },
      {
        slug: "philip-ii",
        name: "Philip II of Spain",
        titles: ["King of Spain", "King of Portugal", "King of Naples and Sicily"],
        birthYear: 1527,
        deathYear: 1598,
        biography:
          "Champion of the Roman Catholic Counter-Reformation. His reign saw Spain reach the height of its influence and power, though he famously launched the ill-fated Spanish Armada against England in 1588.",
        parents: ["charles-v"],
      },
      {
        slug: "philip-iii",
        name: "Philip III of Spain",
        titles: ["King of Spain", "King of Portugal"],
        birthYear: 1578,
        deathYear: 1621,
        biography:
          "Known as \"The Pious.\" His reign saw a period of relative peace but marked the beginning of Spain's economic and political decline, largely due to his reliance on corrupt chief ministers.",
        parents: ["philip-ii"],
      },
      {
        slug: "philip-iv",
        name: "Philip IV of Spain",
        titles: ["King of Spain", "Planet King"],
        birthYear: 1605,
        deathYear: 1665,
        biography:
          "A great patron of the arts (sponsoring Diego Velázquez), but his reign was disastrous militarily and economically, overseeing the loss of Portugal and ongoing conflicts in the Thirty Years' War.",
        parents: ["philip-iii"],
      },
      {
        slug: "charles-ii-bewitched",
        name: "Charles II of Spain",
        titles: ["King of Spain"],
        birthYear: 1661,
        deathYear: 1700,
        biography:
          "Known as \"The Bewitched.\" The tragic final product of generations of Habsburg inbreeding. He suffered from severe physical and mental disabilities, was infertile, and his death without an heir sparked the War of the Spanish Succession.",
        parents: ["philip-iv"],
      },
    ],
  },
  {
    slug: "keita-dynasty",
    name: "Keita Dynasty",
    region: "West Africa",
    description:
      "The ruling house of the Mali Empire, which dominated West Africa from the 13th to 15th centuries. They controlled the trans-Saharan trade routes and held near-monopolies on gold and salt.",
    figures: [
      {
        slug: "sundiata-keita",
        name: "Sundiata Keita",
        titles: ["Mansa of Mali", "The Lion King"],
        birthYear: 1190,
        deathYear: 1255,
        biography:
          "The legendary founder of the Mali Empire. Overcoming physical limitations in his youth, he defeated the Sosso king Soumaoro Kanté at the Battle of Kirina, unifying several West African kingdoms.",
      },
      {
        slug: "abu-bakr-ii",
        name: "Abu Bakr II",
        titles: ["Mansa of Mali", "The Voyager King"],
        birthYear: 1270,
        deathYear: 1312,
        biography:
          "A visionary ruler who abdicated his throne to explore the limits of the ocean. He assembled a massive fleet of ships stocked with gold, water, and provisions, and sailed west into the Atlantic Ocean, never to be seen again.",
      },
      {
        slug: "mansa-musa",
        name: "Mansa Musa",
        titles: ["Mansa of Mali", "Lord of the Mines of Wangara"],
        birthYear: 1280,
        deathYear: 1337,
        biography:
          "Widely considered the wealthiest individual in human history. His famous pilgrimage (Hajj) to Mecca in 1324 involved a caravan so massive and he distributed so much gold that he caused severe inflation in the regional economies of Egypt and Arabia.",
      },
      {
        slug: "mansa-maghan",
        name: "Mansa Maghan",
        titles: ["Mansa of Mali"],
        birthYear: 1300,
        deathYear: 1341,
        biography:
          "Succeeded his father, Mansa Musa. Though a capable ruler, his reign saw the beginning of the empire's slow decline and the first successful raids by the Mossi people on the capital city.",
        parents: ["mansa-musa"],
      },
    ],
  },
  {
    slug: "tang-dynasty",
    name: "Tang Dynasty",
    region: "Imperial China",
    description:
      "Often cited as the greatest imperial dynasty in ancient Chinese history, marking a golden age of cosmopolitan culture, poetry, military expansion, and the booming Silk Road trade.",
    figures: [
      {
        slug: "emperor-taizong",
        name: "Emperor Taizong of Tang (Li Shimin)",
        titles: ["Emperor of Tang", "Tian Kehan (Heavenly Khagan)"],
        birthYear: 598,
        deathYear: 649,
        biography:
          "The co-founder and second emperor of the dynasty. He is considered one of the greatest monarchs in Chinese history, known for his military prowess, rational statecraft, and establishing a model of imperial rule studied by future generations.",
      },
      {
        slug: "emperor-gaozong",
        name: "Emperor Gaozong of Tang (Li Zhi)",
        titles: ["Emperor of Tang"],
        birthYear: 628,
        deathYear: 683,
        biography:
          "Under his rule, the Tang Empire reached its largest territorial extent. However, in his later years, due to chronic illness, he increasingly delegated state affairs to his highly capable and ambitious empress, Wu Zetian.",
        parents: ["emperor-taizong"],
      },
      {
        slug: "wu-zetian",
        name: "Wu Zetian",
        titles: ["Huangdi (Emperor) of China", "Empress Consort"],
        birthYear: 624,
        deathYear: 705,
        biography:
          "The only woman in over 3,000 years of Chinese history to rule in her own right as Emperor. She briefly interrupted the Tang Dynasty to establish her own Zhou Dynasty. A brilliant but ruthless politician, she vastly expanded the empire's borders and reformed the civil service.",
        spouses: ["emperor-gaozong"],
      },
      {
        slug: "emperor-zhongzong",
        name: "Emperor Zhongzong of Tang (Li Xian)",
        titles: ["Emperor of Tang"],
        birthYear: 656,
        deathYear: 710,
        biography:
          "Reigned twice, being deposed by his own mother (Wu Zetian) and later restored to the throne following a coup against her. His second reign was weak and dominated by his influential wife, Empress Wei.",
        parents: ["emperor-gaozong", "wu-zetian"],
      },
      {
        slug: "emperor-xuanzong",
        name: "Emperor Xuanzong of Tang (Li Longji)",
        titles: ["Emperor of Tang"],
        birthYear: 685,
        deathYear: 762,
        biography:
          "His early reign is considered the absolute pinnacle of Tang culture and power. However, his later infatuation with his concubine Yang Guifei led to political negligence, culminating in the devastating An Lushan Rebellion, from which the dynasty never fully recovered.",
      },
    ],
  },
  {
    slug: "ptolemaic-dynasty",
    name: "Ptolemaic Dynasty",
    region: "Ancient Egypt / Hellenistic World",
    description:
      "A Macedonian Greek royal house that ruled Egypt following the death of Alexander the Great. Known for adopting the customs of Egyptian Pharaohs, including extensive sibling marriage, and building the Library of Alexandria.",
    figures: [
      {
        slug: "ptolemy-i-soter",
        name: "Ptolemy I Soter",
        titles: ["Pharaoh of Egypt", "Basileus"],
        birthYear: -367,
        deathYear: -282,
        biography:
          "A trusted general and bodyguard to Alexander the Great. After Alexander's death, he secured control of Egypt, founding a dynasty that would last nearly 300 years. He began the construction of the Great Library of Alexandria.",
      },
      {
        slug: "ptolemy-v-epiphanes",
        name: "Ptolemy V Epiphanes",
        titles: ["Pharaoh of Egypt"],
        birthYear: -210,
        deathYear: -180,
        biography:
          "Ascended to the throne as a young child, leading to a period of great instability and loss of foreign territories. His rule is most famous today because the decree issued celebrating his coronation is inscribed on the Rosetta Stone.",
      },
      {
        slug: "ptolemy-xii-auletes",
        name: "Ptolemy XII Auletes",
        titles: ["Pharaoh of Egypt", "The Flute Player"],
        birthYear: -117,
        deathYear: -51,
        biography:
          "A weak ruler heavily dependent on the Roman Republic for political survival. He bankrupted the Egyptian treasury through massive bribes to Roman politicians like Julius Caesar and Pompey to recognize his legitimacy.",
      },
      {
        slug: "cleopatra-vii",
        name: "Cleopatra VII Philopator",
        titles: ["Queen of Egypt", "Pharaoh"],
        birthYear: -69,
        deathYear: -30,
        biography:
          "The last active ruler of the Ptolemaic Kingdom. Highly educated and fluent in Egyptian (unlike her predecessors), she formed famous military and romantic alliances with Julius Caesar and Mark Antony in a desperate, ultimately failed bid to keep Egypt independent from the Roman Empire.",
        parents: ["ptolemy-xii-auletes"],
      },
      {
        slug: "caesarion",
        name: "Ptolemy XV Caesarion",
        titles: ["Pharaoh of Egypt", "King of Kings"],
        birthYear: -47,
        deathYear: -30,
        biography:
          "The eldest son of Cleopatra and the only known biological son of Julius Caesar. After his mother's suicide, he was briefly the sole Pharaoh before being executed on the orders of Octavian (the future Emperor Augustus), ending the dynasty.",
        parents: ["cleopatra-vii"],
      },
    ],
  },
  {
    slug: "bagrationi",
    name: "Bagrationi",
    region: "Georgia (Caucasus)",
    description:
      "The Bagrationi dynasty was the royal house of Georgia, ruling the medieval Kingdom of Georgia from its unification in 1008 until the Russian annexation in 1801. Tracing its origins to the 8th century, it produced some of the most consequential monarchs of the Caucasus, including David IV the Builder and Tamar the Great, under whom Georgia entered its Golden Age.",
    figures: [
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
        parents: ["bagrat-iii"],
      },
      {
        slug: "bagrat-iv",
        name: "Bagrat IV",
        titles: ["King of Georgia"],
        birthYear: 1018,
        deathYear: 1072,
        biography:
          "Bagrat IV navigated a long and turbulent reign defined by Byzantine pressure, the rise of the Seljuk Turks, and recurrent revolts by powerful feudal lords, yet preserved the integrity of the kingdom.",
        parents: ["george-i"],
      },
      {
        slug: "george-ii",
        name: "George II",
        titles: ["King of Georgia"],
        birthYear: 1054,
        deathYear: 1112,
        biography:
          "George II inherited a weakened state pressed by the Great Seljuk invasions. Unable to halt the devastation, he abdicated in favor of his son David IV in 1089, retaining only ceremonial dignity.",
        parents: ["bagrat-iv"],
      },
      {
        slug: "david-iv",
        name: "David IV the Builder",
        titles: ["King of Georgia", "Sword of the Messiah"],
        birthYear: 1073,
        deathYear: 1125,
        biography:
          "David IV is celebrated as one of the greatest Georgian monarchs. He reformed the army, broke Seljuk power at the Battle of Didgori in 1121, recaptured Tbilisi, and inaugurated the Georgian Golden Age.",
        parents: ["george-ii"],
      },
      {
        slug: "demetrius-i",
        name: "Demetrius I",
        titles: ["King of Georgia", "Poet"],
        birthYear: 1093,
        deathYear: 1156,
        biography:
          "Demetrius I continued the consolidation work of his father David IV, defended Georgia's expansion southward, and is remembered for his Georgian-language hymns, including 'Thou Art a Vineyard'.",
        parents: ["david-iv"],
      },
      {
        slug: "george-iii",
        name: "George III",
        titles: ["King of Georgia"],
        birthYear: 1125,
        deathYear: 1184,
        biography:
          "George III led successful campaigns into Armenia and Shirvan and, lacking a male heir, crowned his daughter Tamar as co-ruler in 1178 to secure the succession.",
        parents: ["demetrius-i"],
      },
      {
        slug: "tamar-the-great",
        name: "Tamar the Great",
        titles: ["Queen of Georgia", "King of Kings"],
        birthYear: 1160,
        deathYear: 1213,
        biography:
          "Tamar presided over the apogee of medieval Georgia. Her armies expanded the kingdom across much of the Caucasus and northern Anatolia, and her court patronized the masterpieces of Georgian literature, including Rustaveli's 'The Knight in the Panther's Skin'. She is canonized as a saint by the Georgian Orthodox Church.",
        parents: ["george-iii"],
      },
      {
        slug: "david-soslan",
        name: "David Soslan",
        titles: ["King Consort of Georgia"],
        birthYear: 1158,
        deathYear: 1207,
        biography:
          "An Alan prince of the Davit-Soslanid branch of the Bagrationi house, David Soslan became Tamar's second husband and her chief military commander, leading Georgian forces to decisive victories at Shamkor (1195) and Basian (1202).",
        spouses: ["tamar-the-great"],
      },
      {
        slug: "george-iv-lasha",
        name: "George IV Lasha",
        titles: ["King of Georgia"],
        birthYear: 1191,
        deathYear: 1223,
        biography:
          "George IV, called Lasha ('the Brilliant'), succeeded his mother Tamar but was forced to confront the first Mongol incursions into the Caucasus. He died at thirty-two before he could meet a planned crusade alongside Western powers.",
        parents: ["tamar-the-great", "david-soslan"],
      },
    ],
  },
];

async function main() {
  console.log("→ Wiping existing data");
  // Order matters: join tables before figures, figures before dynasties.
  // (Schema also has onDelete: Cascade, but explicit deletion is clearer.)
  await prisma.spouse.deleteMany({});
  await prisma.parentChild.deleteMany({});
  await prisma.historicalFigure.deleteMany({});
  await prisma.dynasty.deleteMany({});

  const figureIdBySlug = new Map<string, number>();

  console.log(`→ Creating ${dynasties.length} dynasties`);
  for (const d of dynasties) {
    const dynasty = await prisma.dynasty.create({
      data: {
        slug: d.slug,
        name: d.name,
        region: d.region,
        description: d.description,
      },
    });
    console.log(`  ${d.name}: inserting ${d.figures.length} figures`);
    for (const f of d.figures) {
      const created = await prisma.historicalFigure.create({
        data: {
          slug: f.slug,
          name: f.name,
          titles: f.titles,
          birthYear: f.birthYear,
          deathYear: f.deathYear,
          biography: f.biography,
          dynastyId: dynasty.id,
        },
      });
      figureIdBySlug.set(f.slug, created.id);
    }
  }

  console.log("→ Linking parent-child relationships");
  let pcCount = 0;
  let pcSkipped = 0;
  for (const d of dynasties) {
    for (const f of d.figures) {
      if (!f.parents) continue;
      const childId = figureIdBySlug.get(f.slug);
      if (!childId) continue;
      for (const parentSlug of f.parents) {
        const parentId = figureIdBySlug.get(parentSlug);
        if (!parentId) {
          console.warn(
            `  ⚠ parent slug "${parentSlug}" not found for child "${f.slug}" — skipping`
          );
          pcSkipped++;
          continue;
        }
        await prisma.parentChild.create({ data: { parentId, childId } });
        pcCount++;
      }
    }
  }
  console.log(`  ${pcCount} parent-child link(s) created${pcSkipped ? `, ${pcSkipped} skipped` : ""}`);

  console.log("→ Linking spouse relationships");
  const seenPairs = new Set<string>();
  let spouseCount = 0;
  let spouseSkipped = 0;
  for (const d of dynasties) {
    for (const f of d.figures) {
      if (!f.spouses) continue;
      const aId = figureIdBySlug.get(f.slug);
      if (!aId) continue;
      for (const spouseSlug of f.spouses) {
        const otherId = figureIdBySlug.get(spouseSlug);
        if (!otherId) {
          console.warn(
            `  ⚠ spouse slug "${spouseSlug}" not found for "${f.slug}" — skipping`
          );
          spouseSkipped++;
          continue;
        }
        const [low, high] = aId < otherId ? [aId, otherId] : [otherId, aId];
        const key = `${low}-${high}`;
        if (seenPairs.has(key)) continue;
        seenPairs.add(key);
        await prisma.spouse.create({ data: { aId: low, bId: high } });
        spouseCount++;
      }
    }
  }
  console.log(`  ${spouseCount} spouse pair(s) created${spouseSkipped ? `, ${spouseSkipped} skipped` : ""}`);

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
