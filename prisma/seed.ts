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
  {
    slug: "house-of-romanov",
    name: "House of Romanov",
    region: "Russia / Eurasia",
    description:
      "Ruled Russia for over 300 years, transforming a marginalized state into a transcontinental Eurasian empire through autocratic modernization and expansion.",
    figures: [
      {
        slug: "michael-romanov",
        name: "Michael I",
        titles: [],
        birthYear: 1596,
        deathYear: 1645,
        biography:
          "Elected Tsar in 1613 after the \"Time of Troubles,\" founding the dynasty that would rule until the Russian Revolution.",
      },
      {
        slug: "peter-the-great",
        name: "Peter the Great",
        titles: [],
        birthYear: 1672,
        deathYear: 1725,
        biography:
          "A radical reformer who established St. Petersburg as a \"window to the West\" and modernized the Russian military and administration.",
        // Source dataset names Alexis I (Michael's son) as the parent; Alexis is
        // not seeded here, so the resolver will warn and skip this link.
        parents: ["alexis-i"],
      },
      {
        slug: "catherine-the-great",
        name: "Catherine the Great",
        titles: [],
        birthYear: 1729,
        deathYear: 1796,
        biography:
          "An enlightened despot who significantly expanded Russian borders into Poland and the Black Sea region.",
        // Peter III is not seeded; the resolver will warn and skip.
        spouses: ["peter-iii"],
      },
      {
        slug: "nicholas-ii",
        name: "Nicholas II",
        titles: [],
        birthYear: 1868,
        deathYear: 1918,
        biography:
          "The last Romanov emperor. His reign was marked by military defeat in the Russo-Japanese War and World War I, culminating in his execution by Bolshevik revolutionaries.",
      },
    ],
  },
  {
    slug: "joseon-dynasty",
    name: "Joseon Dynasty",
    region: "Korean Peninsula",
    description:
      "The final and longest-lived imperial dynasty of Korea, known for its strong Neo-Confucian ideology and high cultural achievement.",
    figures: [
      {
        slug: "king-taejo-joseon",
        name: "King Taejo (Yi Seong-Gye)",
        titles: ["King of Joseon"],
        birthYear: 1335,
        deathYear: 1408,
        biography:
          "A general who overthrew the Goryeo dynasty to found Joseon, establishing the capital at Hanyang (Seoul).",
      },
      {
        slug: "king-sejong-great",
        name: "King Sejong the Great",
        titles: ["King of Korea"],
        birthYear: 1397,
        deathYear: 1450,
        biography:
          "Widely revered for inventing Hangul, the Korean phonetic alphabet, and sponsoring major advancements in science and scholarship.",
      },
      {
        slug: "king-gojong",
        name: "King Gojong",
        titles: ["Emperor of Korea"],
        birthYear: 1852,
        deathYear: 1919,
        biography:
          "The final effective ruler of Korea. He elevated the nation to an empire in a bid for independence before the country was annexed by Japan in 1910.",
      },
    ],
  },
  {
    slug: "ottoman-empire",
    name: "Ottoman Empire",
    region: "Anatolia / Balkans / Middle East",
    description:
      "One of history's most powerful states, bridging Europe, the Middle East, and North Africa for over 600 years.",
    figures: [
      {
        slug: "osman-i",
        name: "Osman I",
        titles: [],
        birthYear: 1258,
        deathYear: 1324,
        biography:
          "The nomadic Turkmen chief who founded the dynasty and began the initial raids against the Byzantine Empire.",
      },
      {
        slug: "mehmed-conqueror",
        name: "Mehmed II (The Conqueror)",
        titles: [],
        birthYear: 1432,
        deathYear: 1481,
        biography:
          "Famously captured Constantinople in 1453, ending the Byzantine Empire and establishing Istanbul as the new Ottoman capital.",
      },
      {
        slug: "suleyman-magnificent",
        name: "Süleyman the Magnificent",
        titles: [],
        birthYear: 1494,
        deathYear: 1566,
        biography:
          "Presided over the peak of Ottoman power, codifying legal systems and expanding the empire deep into Central Europe.",
      },
    ],
  },
  {
    slug: "mauryan-empire",
    name: "Mauryan Empire",
    region: "South Asia / India",
    description:
      "The first empire to unify the majority of the Indian subcontinent, known for its highly organized administration and Ashoka's conversion to pacifism.",
    figures: [
      {
        slug: "chandragupta-maurya",
        name: "Chandragupta Maurya",
        titles: [],
        birthYear: -340,
        deathYear: -297,
        biography:
          "Unified northern India after the vacuum left by Alexander the Great, building an empire that stretched from the Himalayas to the Vindhya Range.",
      },
      {
        slug: "ashoka-great",
        name: "Ashoka the Great",
        titles: [],
        birthYear: -304,
        deathYear: -232,
        biography:
          "After the bloody conquest of Kalinga, he renounced war, converted to Buddhism, and spread the \"Dharma\" across Asia via his famous stone pillar edicts.",
      },
    ],
  },
  {
    slug: "chola-dynasty",
    name: "Chola Dynasty",
    region: "South India / Coromandel Coast",
    description:
      "A Tamil maritime empire that projected naval power across Southeast Asia and was known for its colossal temple architecture.",
    figures: [
      {
        slug: "rajaraja-i",
        name: "Rajaraja I",
        titles: [],
        birthYear: 947,
        deathYear: 1014,
        biography:
          "Built the massive Brihadishvara Temple in Thanjavur and established Chola dominance over the Indian Ocean trade routes.",
      },
      {
        slug: "rajendra-i",
        name: "Rajendra I",
        titles: ["Victor of the Ganges"],
        birthYear: 1012,
        deathYear: 1044,
        biography:
          "Expanded the empire even further, launching an unprecedented naval expedition to Southeast Asia and overrunning the Deccan plateau.",
        // The dataset leaves "Parents:" blank; Rajendra I was historically the
        // son of Rajaraja I (the only candidate in this dynasty), so wiring
        // the link explicitly to make the family-tree view useful.
        parents: ["rajaraja-i"],
      },
    ],
  },
  {
    slug: "abbasid-caliphate",
    name: "Abbasid Caliphate",
    region: "Middle East / Mesopotamia",
    description:
      "The second great Islamic dynasty, which oversaw the \"Golden Age of Islam\" from their capital in Baghdad.",
    figures: [
      {
        slug: "al-mansur",
        name: "Al-Mansur",
        titles: ["Caliph"],
        birthYear: 714,
        deathYear: 775,
        biography:
          "The true architect of the caliphate who founded the circular city of Baghdad as the administrative heart of the empire.",
      },
      {
        slug: "harun-al-rashid",
        name: "Harun al-Rashid",
        titles: ["Caliph"],
        birthYear: 763,
        deathYear: 809,
        biography:
          "His reign is synonymous with the height of Abbasid scientific and cultural achievement, famously associated with the \"One Thousand and One Nights\".",
      },
    ],
  },
  {
    slug: "umayyad-caliphate",
    name: "Umayyad Caliphate",
    region: "Syria / Damascus / Spain",
    description:
      "The first hereditary Islamic dynasty, responsible for the rapid expansion of Arab rule from Spain to India.",
    figures: [
      {
        slug: "abd-al-malik",
        name: "Abd al-Malik",
        titles: ["Caliph"],
        birthYear: 646,
        deathYear: 705,
        biography:
          "Centralized the empire's administration, made Arabic the official language, and built the Dome of the Rock in Jerusalem.",
      },
      {
        slug: "abd-al-rahman-cordoba",
        name: "Abd al-Rahman I",
        titles: ["Emir of Córdoba"],
        birthYear: 731,
        deathYear: 788,
        biography:
          "A lone survivor of the Umayyad house who fled to Spain after the Abbasid revolution, founding a brilliant successor state in Córdoba.",
      },
    ],
  },
  {
    slug: "tokugawa-shogunate",
    name: "Tokugawa Shogunate",
    region: "Japan",
    description:
      "A centralized military dictatorship that brought 250 years of stability and isolation to Japan during the Edo period.",
    figures: [
      {
        slug: "tokugawa-ieyasu",
        name: "Tokugawa Ieyasu",
        titles: [],
        birthYear: 1543,
        deathYear: 1616,
        biography:
          "Achieved hegemony over Japan by balancing hostile lords and established the bakuhan system of governance.",
      },
      {
        slug: "tokugawa-yoshinobu",
        name: "Tokugawa Yoshinobu",
        titles: [],
        birthYear: 1837,
        deathYear: 1913,
        biography:
          "The 15th and final shogun. He resigned his power during the Meiji Restoration, marking the end of military rule in Japan.",
      },
    ],
  },
  {
    slug: "mughal-empire",
    name: "Mughal Empire",
    region: "South Asia / North India",
    description:
      "A Turco-Mongol dynasty that synthesized Persian and Indian cultures, overseeing an era of unparalleled artistic and economic prosperity.",
    figures: [
      {
        slug: "babur-mughal",
        name: "Babur",
        titles: ["Padishah"],
        birthYear: 1483,
        deathYear: 1530,
        biography:
          "A descendant of Genghis Khan and Timur who founded the Mughal dynasty after winning the Battle of Panipat.",
      },
      {
        slug: "akbar-the-great",
        name: "Akbar the Great",
        titles: ["Emperor of India"],
        birthYear: 1542,
        deathYear: 1605,
        biography:
          "Known for his religious tolerance and for building a centralized, inclusive bureaucratic system that united Hindus and Muslims.",
      },
      {
        slug: "shah-jahan",
        name: "Shah Jahan",
        titles: ["Emperor"],
        birthYear: 1592,
        deathYear: 1666,
        biography:
          "Most famous for commissioning the Taj Mahal as a tomb for his wife, Mumtaz Mahal.",
      },
    ],
  },
  {
    slug: "songhai-empire",
    name: "Songhai Empire",
    region: "West Africa / Middle Niger",
    description:
      "The largest contiguous empire in West African history, which controlled the trans-Saharan gold and salt trade.",
    figures: [
      {
        slug: "sonni-ali",
        name: "Sonni Ali",
        titles: [],
        // Source dataset gives 1464 as accession year; preserved here under
        // birthYear for consistency with how "(Estimated)" years are handled
        // elsewhere in the seed (admin can be used to refine if needed).
        birthYear: 1464,
        deathYear: 1492,
        biography:
          "A ferocious military leader who expanded Songhai's borders and balanced the interests of urban Muslim and rural animist populations.",
      },
      {
        slug: "askia-the-great",
        name: "Askia the Great (Muhammad I Askia)",
        titles: ["Askia"],
        birthYear: 1443,
        deathYear: 1538,
        biography:
          "Usurped the throne and implemented massive political reforms, patronizing scholars and formalizing the imperial bureaucracy.",
      },
    ],
  },
  {
    slug: "solomonic-dynasty",
    name: "Solomonic Dynasty",
    region: "Horn of Africa / Ethiopia",
    description:
      "One of the longest-ruling royal houses in history, claiming direct descent from the biblical King Solomon and the Queen of Sheba.",
    figures: [
      {
        slug: "yekuno-amlak",
        name: "Yekuno Amlak",
        titles: ["Emperor of Ethiopia"],
        // Source dataset gives 1270 as accession year (same caveat as Sonni Ali).
        birthYear: 1270,
        deathYear: 1285,
        biography:
          "Overthrew the Zagwe dynasty to restore the Solomonic lineage, strengthening Christian rule in the Ethiopian highlands.",
      },
      {
        slug: "haile-selassie",
        name: "Haile Selassie I",
        titles: ["King of Kings", "Elect of God"],
        birthYear: 1892,
        deathYear: 1975,
        biography:
          "The final emperor of the dynasty. He led Ethiopia's resistance against Italian invasion and became a pivotal figure in modern African politics.",
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
