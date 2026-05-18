// Maps the free-text Dynasty.region field onto canonical region tags so we
// can build aggregation pages like /dynasties/region/europe. A dynasty whose
// region matches no rule gets no tags and is excluded from region pages —
// that's fine; we'd rather skip than miscategorize.

export type RegionSlug =
  | "europe"
  | "iberia"
  | "british-isles"
  | "frankish"
  | "russia"
  | "balkans"
  | "byzantium"
  | "asia"
  | "east-asia"
  | "china"
  | "japan"
  | "korea"
  | "south-asia"
  | "central-asia"
  | "steppe"
  | "caucasus"
  | "middle-east"
  | "africa"
  | "north-africa"
  | "west-africa"
  | "east-africa";

export const REGIONS: ReadonlyArray<{
  slug: RegionSlug;
  name: string;
  description: string;
  // Optional long-form lead essay rendered above the dynasty grid. Use it
  // to give the region page real editorial substance — the kind of context
  // a thoughtful reader expects before being handed a list of cards.
  // Paragraphs are separated by blank lines and rendered individually.
  leadEssay?: string;
  // Parent region(s); used to display nested counts and breadcrumbs.
  parents?: RegionSlug[];
}> = [
  {
    slug: "europe",
    name: "Europe",
    description: "Royal houses of Continental Europe and the British Isles.",
    leadEssay: `European royal genealogy is unusual in world history for the density of marriages across borders. By the late Middle Ages it had become exceptional for a king of England to marry an English subject, or for a French queen to be born in France. Diplomats negotiated children's marriages decades in advance; daughters were treated as long-term assets dispatched to courts they would never leave; sons of one dynasty grew up speaking a different language than their grandfathers. The effect was an aristocracy that was a single extended family stretched across the continent.

This page collects the royal lines that mattered: the Frankish houses whose partitions drew the borders of medieval France and Germany; the English dynasties from Plantagenet through Stuart; the Iberian houses whose ambitions reached across the Atlantic; the Russian Tsars and their Romanov successors; the Habsburgs whose marriage strategy gave them so much of the continent. Where dynasties are linked by marriage or descent, Dynastica makes those edges navigable as a single graph.`,
  },
  {
    slug: "iberia",
    name: "Iberia",
    description: "Dynasties of the Iberian Peninsula — Spain, Portugal, Andalusi Moorish realms.",
    parents: ["europe"],
  },
  {
    slug: "british-isles",
    name: "British Isles",
    description: "English, Scottish, Welsh, and Irish ruling houses.",
    leadEssay: `The British Isles produced one of the most continuously documented royal genealogies in the world — eleven centuries of unbroken succession from the West Saxon kings of the ninth century through the present house of Windsor. The continuity is partly an accident of geography (an island kingdom is hard to extinguish from outside) and partly of constitutional habit (the English crown survived two civil wars and a regicide largely because the political class kept reaching for legitimating cousins rather than abolishing the institution).

Dynastica catalogs the four dynasties that dominate the medieval-to-early-modern period: the Plantagenets (1154–1485, including their Lancaster and York cadet branches), the Welsh-descended Tudors (1485–1603), the Stuarts of Scotland and then Britain (1603–1714), and the Carolingian-era Anglo-Saxon background. The cross-dynasty bridges this page makes navigable are some of the densest on the site: the marriage of Henry VII and Elizabeth of York fused the Wars of the Roses combatants in one couple; Margaret Tudor's marriage to James IV of Scotland transmitted the English crown to her great-grandson a century later.`,
    parents: ["europe"],
  },
  {
    slug: "frankish",
    name: "Frankish & Holy Roman",
    description: "The Carolingian and Holy Roman Empire lineages of Continental Europe.",
    parents: ["europe"],
  },
  {
    slug: "russia",
    name: "Russia & Eastern Europe",
    description: "The houses that shaped Rus, Muscovy, and the Russian Empire.",
    parents: ["europe"],
  },
  {
    slug: "balkans",
    name: "Balkans",
    description: "Southeast European royal lines — Serbia, Bulgaria, the Byzantine successor states.",
    parents: ["europe"],
  },
  {
    slug: "byzantium",
    name: "Byzantium",
    description: "The Eastern Roman / Byzantine imperial dynasties.",
  },
  {
    slug: "asia",
    name: "Asia",
    description: "Royal houses of mainland Asia, from the Mediterranean to the Pacific.",
    leadEssay: `Asian royal genealogy operates on a scale and timeline that dwarfs the European catalog. The earliest dynasties indexed here predate the Roman Republic; the longest reigned for half a millennium without serious challenge. Chinese imperial history alone covers two thousand years of essentially uninterrupted dynastic succession, with the throne passing among a recognizable cast of imperial houses — the Han, Tang, Song, Yuan, Ming, Qing — separated by interregnums but anchored by a single political tradition.

The page catalogs ruling houses from the Mediterranean to the Pacific: the Persian and Mesopotamian dynasties of the Achaemenid world, the Caucasus kingdoms of Georgia and Armenia, the Chinese imperial houses, the Mughal emperors of India, the shoguns of Tokugawa Japan, the Mongol khanates whose conquests bound the continent into a single trade network for the first time in its history. Cross-dynasty links are sparser than in Europe (Asian royal marriages more often stayed within cultural-linguistic zones) but the largest ones are dramatic — Kublai Khan to the Yuan emperors, the Ilkhanate to the Mongol-era Persian successor states.`,
  },
  {
    slug: "east-asia",
    name: "East Asia",
    description: "Dynasties of China, Japan, Korea, and Vietnam.",
    parents: ["asia"],
  },
  {
    slug: "china",
    name: "China",
    description: "The imperial dynasties of China.",
    parents: ["asia", "east-asia"],
  },
  {
    slug: "japan",
    name: "Japan",
    description: "Imperial and shogunal houses of Japan.",
    parents: ["asia", "east-asia"],
  },
  {
    slug: "korea",
    name: "Korea",
    description: "Royal houses of the Korean peninsula.",
    parents: ["asia", "east-asia"],
  },
  {
    slug: "south-asia",
    name: "South Asia",
    description: "Dynasties of the Indian subcontinent.",
    parents: ["asia"],
  },
  {
    slug: "central-asia",
    name: "Central Asia",
    description: "Houses spanning Persia, Transoxiana, and the Silk Road.",
    parents: ["asia"],
  },
  {
    slug: "steppe",
    name: "Eurasian Steppe",
    description: "Nomadic and semi-nomadic confederations of the Pontic and Central Asian steppe.",
    parents: ["asia"],
  },
  {
    slug: "caucasus",
    name: "Caucasus",
    description: "Royal houses of Georgia, Armenia, and surrounding regions.",
    leadEssay: `The Caucasus has the rare distinction of producing one of the longest single-line royal dynasties in world history: the Bagrationi house of Georgia, which traces a continuous male-line descent from the late ninth century through the Russian annexation of 1801 — nine hundred and twenty years. By comparison, the Capetian senior line of France lasted three hundred and forty-one years; the Habsburgs, six hundred and forty-five. Only the Yamato dynasty of Japan has reigned longer in a comparable royal capacity.

Dynastica's Caucasus catalog is unusually deep in Bagrationi figures by design — the site was founded to map this lineage. It also includes the smaller surrounding houses (the Khosroid kings of pre-Bagrationi Iberia, the Abkhazian royals, the Ossetian princes) whose marriages and successions interweave with the Bagrationi line. The cross-dynasty bridges from the Caucasus reach further than they look: the Bagrationi married into the Byzantine imperial house, the Komnenian dynasty of Trebizond, and the medieval Armenian and Alanian royal lines.`,
    parents: ["asia"],
  },
  {
    slug: "middle-east",
    name: "Middle East",
    description: "Dynasties of Mesopotamia, the Levant, and Anatolia.",
    parents: ["asia"],
  },
  {
    slug: "africa",
    name: "Africa",
    description: "Ruling houses across the African continent.",
    leadEssay: `African royal genealogy is the most under-catalogued of any major world region in English-language reference works, and the gap is wider in popular than in scholarly literature. Dynastica works to close that gap, with particular depth in the early-dynastic Egyptian, Ptolemaic, Mali (Keita), Songhai, and Solomonic Ethiopian houses. The continent's recorded dynastic history runs deeper than any other in the world: the Egyptian Old Kingdom — including the Fourth Dynasty whose pharaohs built the Pyramids of Giza — was already nine centuries old when Babylon's first dynasty rose.

This page collects the regional ruling houses across the African continent, from the early Egyptian dynasties of the Nile to the trans-Saharan trading empires of West Africa to the Christian Solomonic kings of Abyssinian Ethiopia, whose unbroken line of descent claimed an origin from King Solomon and the Queen of Sheba and reigned, with brief interruptions, from the thirteenth century to 1974.`,
  },
  {
    slug: "north-africa",
    name: "North Africa",
    description: "Dynasties of Egypt, the Maghreb, and the Nile valley.",
    parents: ["africa"],
  },
  {
    slug: "west-africa",
    name: "West Africa",
    description: "The trans-Saharan trading empires and their successor states.",
    parents: ["africa"],
  },
  {
    slug: "east-africa",
    name: "East Africa",
    description: "Royal houses of the Horn and East African coast.",
    parents: ["africa"],
  },
];

const REGION_BY_SLUG: ReadonlyMap<RegionSlug, (typeof REGIONS)[number]> = new Map(
  REGIONS.map((r) => [r.slug, r])
);

export function getRegion(slug: string): (typeof REGIONS)[number] | undefined {
  return REGION_BY_SLUG.get(slug as RegionSlug);
}

// Order matters somewhat: more specific keywords first so we tag the most
// precise region before falling back to broader ones.
const RULES: ReadonlyArray<{ matches: RegExp; tags: RegionSlug[] }> = [
  // Iberia / Andalusi
  { matches: /\b(spain|iberia|cordoba|córdoba|castile|aragon|portugal|leon|navarre|andalus)/i, tags: ["iberia", "europe"] },
  // British Isles
  { matches: /\b(england|britain|english|scotland|scottish|wales|welsh|ireland|irish)/i, tags: ["british-isles", "europe"] },
  // Frankish / HRE
  { matches: /\b(holy roman|frank|francia|german|austria|prussia|saxon|bavaria)/i, tags: ["frankish", "europe"] },
  // Russia / Eastern Europe
  { matches: /\b(russia|eurasia|muscovy|rus|kievan|ukrain|belarus|poland|polish)/i, tags: ["russia", "europe"] },
  // Balkans
  { matches: /\b(serbia|serb|bulgaria|romania|albania|croatia|bosnia|montenegro)/i, tags: ["balkans", "europe"] },
  // Byzantium
  { matches: /\b(byzanti|eastern roman)/i, tags: ["byzantium", "europe"] },
  // China + East Asia
  { matches: /\b(china|imperial china|chinese)/i, tags: ["china", "east-asia", "asia"] },
  // Japan
  { matches: /\b(japan|japanese)/i, tags: ["japan", "east-asia", "asia"] },
  // Korea
  { matches: /\b(korea|korean)/i, tags: ["korea", "east-asia", "asia"] },
  // South Asia
  { matches: /\b(india|indian|pakistan|bangladesh|south asia|coromandel|deccan|punjab)/i, tags: ["south-asia", "asia"] },
  // Steppe
  { matches: /\b(steppe|mongol|turkic|pontic|kipchaq|qipchaq|khazar|cuman|pecheneg|hun)/i, tags: ["steppe", "asia"] },
  // Caucasus / Georgia / Armenia
  { matches: /\b(caucasus|georgia|georgian|iberia.*caucas|armenia|armenian|abkhaz|ossetia|alania)/i, tags: ["caucasus", "asia"] },
  // Middle East / Anatolia / Levant
  { matches: /\b(anatolia|middle east|mesopotamia|persia|iran|iraq|levant|syria|damascus|babylon|assyria|baghdad)/i, tags: ["middle-east", "asia"] },
  { matches: /\b(balkans)/i, tags: ["balkans", "europe"] },
  // North Africa / Egypt
  { matches: /\b(egypt|nile|maghreb|morocco|tunisia|libya|north africa|hellenistic|alexandria|carthage)/i, tags: ["north-africa", "africa"] },
  // West Africa
  { matches: /\b(west africa|niger|mali|ghana|songhai|benin|hausa|sokoto|yoruba)/i, tags: ["west-africa", "africa"] },
  // East Africa
  { matches: /\b(east africa|ethiopia|aksum|abyssinia|horn of africa|swahili|nubia)/i, tags: ["east-africa", "africa"] },
  // Central Asia (catch after the more specific rules)
  { matches: /\b(central asia|transoxiana|silk road|sogd|bactria|khwarezm|samark)/i, tags: ["central-asia", "asia"] },
];

export function regionTagsFor(rawRegion: string | null | undefined): RegionSlug[] {
  if (!rawRegion) return [];
  const tags = new Set<RegionSlug>();
  for (const rule of RULES) {
    if (rule.matches.test(rawRegion)) {
      for (const t of rule.tags) tags.add(t);
    }
  }
  return [...tags];
}
