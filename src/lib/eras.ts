// Maps Dynasty.foundedYear / endedYear (or fallback figure dates) onto
// canonical era buckets. A dynasty whose span overlaps multiple eras shows
// up on every era page it touches — useful since most long-lived dynasties
// genuinely belong to several.

export type EraSlug =
  | "ancient"
  | "classical"
  | "late-antiquity"
  | "early-medieval"
  | "high-medieval"
  | "late-medieval"
  | "early-modern"
  | "modern";

export const ERAS: ReadonlyArray<{
  slug: EraSlug;
  name: string;
  // Range is inclusive on both ends. Negative numbers are BC.
  startYear: number;
  endYear: number;
  description: string;
  // Optional long-form lead essay rendered above the dynasty grid.
  // Paragraphs are separated by blank lines.
  leadEssay?: string;
}> = [
  {
    slug: "ancient",
    name: "Ancient",
    startYear: -10000,
    endYear: -500,
    description: "Bronze Age and early Iron Age dynasties — pre-classical antiquity.",
    leadEssay: `Ancient dynastic genealogy is necessarily fragmentary: most names of pre-classical rulers come from king-lists that mix mythology, legend, and history without distinguishing them, and few of the dates are precise to within decades. What survives in Dynastica's catalog of the period is therefore selective — the Egyptian dynasties for which we have monumental evidence and lists of pharaohs, the early Chinese houses (Xia, Shang, Zhou) whose existence is partly archaeological and partly later historiographical reconstruction, and the early Mesopotamian and Aegean royal lineages.

The pages in this era should be read with that uncertainty in mind. Where the historicity of an individual ruler is contested, we list the most-cited reconstruction; where lifetimes are educated guesses, we mark them as such. The cross-dynasty links of the period are limited — bronze-age royal marriages outside one's own culture were rare — but the lineages that survive are remarkable for their longevity. The early Egyptian dynasties span the entire historical record of pharaonic Egypt at intervals; a single royal genealogy here can cover a millennium.`,
  },
  {
    slug: "classical",
    name: "Classical Antiquity",
    startYear: -499,
    endYear: 300,
    description: "From the rise of Greek city-states through the high Roman Empire.",
    leadEssay: `Classical Antiquity reshapes the genealogical record by introducing the first ruling houses whose lineages are documented in close detail — the Achaemenid Persian kings, the successor dynasties of Alexander the Great (Ptolemaic Egypt, Seleucid Asia, Antigonid Macedonia), the Roman imperial families from the Julio-Claudians through the Constantinians. For the first time in world history we have not only dynastic names and approximate dates but also contemporary biographers — Plutarch, Suetonius, Tacitus, Cassius Dio — whose accounts of individual rulers' personalities, marriages, and successions survive in something like the form their writers committed to ink.

The dynastic histories of this period also see the first sustained marriages between formally separate ruling houses across cultural lines. Cleopatra VII Philopator, the last Ptolemaic queen of Egypt, was a Macedonian Greek who learned Egyptian as the seventh language of her education; her marriages and liaisons with the Romans Julius Caesar and Mark Antony bridged two of the most important dynastic spheres of the ancient Mediterranean. The Roman imperial succession, meanwhile, evolved from the family dynasties of the early Principate through the systematic adoption of capable heirs under the Antonines into the chaos of the Crisis of the Third Century — a near-collapse of the dynastic principle itself.`,
  },
  {
    slug: "late-antiquity",
    name: "Late Antiquity",
    startYear: 301,
    endYear: 600,
    description: "The transition from the Roman world to the early medieval — fall of Rome, rise of the successor kingdoms.",
  },
  {
    slug: "early-medieval",
    name: "Early Medieval",
    startYear: 601,
    endYear: 1000,
    description: "Caliphates, Carolingians, the rise of new royal houses across Eurasia.",
    leadEssay: `The early medieval period is the formative age of most of the dynasties we now think of as canonically European. The Carolingian house in continental Europe, the Anglo-Saxon kings of Wessex who consolidated the English crown, the Bagrationi of Georgia, the Capetian Robertian ancestors in West Francia, the Tang and Song imperial houses of China, the Abbasid caliphate in Baghdad — all rose to dominance between roughly 600 and 1000. By the end of the period, the political map of Eurasia had been redrawn into shapes that lasted, in their dynastic essentials, until the seventeenth century.

Cross-dynasty connections in the early medieval are still relatively sparse compared to what would come later: long-distance royal marriages were rare and the great religious-cultural divides (Latin Christendom, Greek Christendom, Dar al-Islam, Confucian East Asia) operated as effective barriers to royal intermarriage. But the period laid the groundwork: the Carolingian princess Bertha of Holland married into the Capetians, the Byzantine princess Theophanu married Otto II of Saxony, and the Anglo-Saxon royal women who married into the early Norman and French houses transmitted English royal blood far enough across the continent to be claimed back, four centuries later, by the Tudor and Stuart kings of England.`,
  },
  {
    slug: "high-medieval",
    name: "High Medieval",
    startYear: 1001,
    endYear: 1300,
    description: "The Crusades, the Mongol expansion, the apex of Christian and Islamic medieval polities.",
    leadEssay: `The high medieval period is the age in which European royal genealogy first becomes the dense, interconnected graph that this site catalogs. Marriage diplomacy among Latin Christendom's ruling houses intensified to an unprecedented degree: by 1200, the kings of England and France were closely related cousins, the Hohenstaufen emperors of the Holy Roman Empire were marrying into both lines, and the Crusader states of the Levant were producing a third generation of European-Levantine dynastic households. Eleanor of Aquitaine, queen of France and then of England, is the iconic figure of the era — but she is in fact one of dozens of high-status royal women whose marriages bridged two or three otherwise rival dynasties.

The same period saw the most catastrophic dynastic disruption of the medieval era. The Mongol expansion under Genghis Khan and his successors swept across Eurasia between 1206 and 1260, destroying or absorbing the Khwarezmian Shahs, the Tangut kingdom, the Jin and Song dynasties of China, the Kyivan Rus principalities, and the Abbasid Caliphate. Where the Mongols left rump states they often left them under Mongol rulers: the Ilkhanate in Persia, the Yuan dynasty in China, the Golden Horde over Russia, the Chagatai Khanate in Central Asia. The genealogical aftermath shaped Eurasia for the next three centuries.`,
  },
  {
    slug: "late-medieval",
    name: "Late Medieval",
    startYear: 1301,
    endYear: 1500,
    description: "From the Black Death to the eve of European overseas empires.",
  },
  {
    slug: "early-modern",
    name: "Early Modern",
    startYear: 1501,
    endYear: 1800,
    description: "Gunpowder empires, dynastic wars, and global colonial reach.",
    leadEssay: `Early modern royal genealogy is dominated by a small number of expansive, intermarrying families operating at planetary scale. The Habsburg house, which split in 1556 into Spanish and Austrian branches, ruled simultaneously in Madrid, Vienna, Brussels, Naples, Milan, and the new American viceroyalties; the Bourbons replaced them in Spain in 1700 and held France through the Napoleonic wars; the Hohenzollerns built Prussia into a great power from a Brandenburg margraviate; the Romanovs transformed Muscovy into the largest territorial state in human history. Outside Europe, the gunpowder empires — Ottoman, Safavid, Mughal, Ming and Qing — held parallel reach over their own civilizational zones.

This is also the period in which the European dynastic system began to globalize. Habsburg marriage to Trastámara Spain via Joanna of Castile and Philip the Handsome produced Charles V, who inherited Spain, Burgundy, Austria, the Holy Roman imperial title, and the American conquests all at once. Mary Tudor of England married Philip II of Spain to forge a Catholic counter-Reformation alliance. By the seventeenth and eighteenth centuries the major European royal houses formed a single political-genealogical system whose marriages were negotiated as international treaties and whose succession crises produced continent-wide wars.`,
  },
  {
    slug: "modern",
    name: "Modern",
    startYear: 1801,
    endYear: 2200,
    description: "From the Napoleonic age to the dynasties that survive into the present.",
    leadEssay: `The modern period is the age in which the dynastic system that had governed most of the world for millennia broke apart. Between 1789 and 1918, monarchy as the default form of large-scale government was overthrown in France (twice), abolished in the United States, dismantled in Spain, transformed by parliamentary constraint in Britain, and finally destroyed across Russia, Germany, Austria-Hungary, and the Ottoman Empire in a single five-year span at the close of the First World War. The Romanov, Hohenzollern, Habsburg-Lorraine, and Ottoman dynasties had all reigned for hundreds of years; all four ended within months of each other.

What remains in the early twenty-first century is a small set of constitutional monarchies — the British, Dutch, Belgian, Scandinavian, and Spanish royal houses, the Japanese imperial dynasty, the Thai monarchy, several Gulf states — most of which exercise little real political power. The genealogical interconnections persist: nearly every reigning European monarch today is descended from Queen Victoria, who herself descended through her mother from Sophia of Hanover and so from the seventeenth-century Stuart kings. The shape of the dynastic graph is now a vestige of the political order that produced it.`,
  },
];

const ERA_BY_SLUG: ReadonlyMap<EraSlug, (typeof ERAS)[number]> = new Map(
  ERAS.map((e) => [e.slug, e])
);

export function getEra(slug: string): (typeof ERAS)[number] | undefined {
  return ERA_BY_SLUG.get(slug as EraSlug);
}

// Returns every era a dynasty's span overlaps. If only foundedYear is set we
// approximate endYear as foundedYear + 100 (typical dynastic survival). If
// neither is set, returns []. The fallback to figure dates is computed by
// the caller (queries.ts) when needed.
export function eraTagsFor(
  foundedYear: number | null | undefined,
  endedYear: number | null | undefined
): EraSlug[] {
  if (foundedYear == null && endedYear == null) return [];
  const start = foundedYear ?? endedYear!;
  const end = endedYear ?? (foundedYear != null ? foundedYear + 100 : start);
  const tags: EraSlug[] = [];
  for (const era of ERAS) {
    const overlaps = end >= era.startYear && start <= era.endYear;
    if (overlaps) tags.push(era.slug);
  }
  return tags;
}
