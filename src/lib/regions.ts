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
  // Parent region(s); used to display nested counts and breadcrumbs.
  parents?: RegionSlug[];
}> = [
  { slug: "europe", name: "Europe", description: "Royal houses of Continental Europe and the British Isles." },
  { slug: "iberia", name: "Iberia", description: "Dynasties of the Iberian Peninsula — Spain, Portugal, Andalusi Moorish realms.", parents: ["europe"] },
  { slug: "british-isles", name: "British Isles", description: "English, Scottish, Welsh, and Irish ruling houses.", parents: ["europe"] },
  { slug: "frankish", name: "Frankish & Holy Roman", description: "The Carolingian and Holy Roman Empire lineages of Continental Europe.", parents: ["europe"] },
  { slug: "russia", name: "Russia & Eastern Europe", description: "The houses that shaped Rus, Muscovy, and the Russian Empire.", parents: ["europe"] },
  { slug: "balkans", name: "Balkans", description: "Southeast European royal lines — Serbia, Bulgaria, the Byzantine successor states.", parents: ["europe"] },
  { slug: "byzantium", name: "Byzantium", description: "The Eastern Roman / Byzantine imperial dynasties." },
  { slug: "asia", name: "Asia", description: "Royal houses of mainland Asia, from the Mediterranean to the Pacific." },
  { slug: "east-asia", name: "East Asia", description: "Dynasties of China, Japan, Korea, and Vietnam.", parents: ["asia"] },
  { slug: "china", name: "China", description: "The imperial dynasties of China.", parents: ["asia", "east-asia"] },
  { slug: "japan", name: "Japan", description: "Imperial and shogunal houses of Japan.", parents: ["asia", "east-asia"] },
  { slug: "korea", name: "Korea", description: "Royal houses of the Korean peninsula.", parents: ["asia", "east-asia"] },
  { slug: "south-asia", name: "South Asia", description: "Dynasties of the Indian subcontinent.", parents: ["asia"] },
  { slug: "central-asia", name: "Central Asia", description: "Houses spanning Persia, Transoxiana, and the Silk Road.", parents: ["asia"] },
  { slug: "steppe", name: "Eurasian Steppe", description: "Nomadic and semi-nomadic confederations of the Pontic and Central Asian steppe.", parents: ["asia"] },
  { slug: "caucasus", name: "Caucasus", description: "Royal houses of Georgia, Armenia, and surrounding regions.", parents: ["asia"] },
  { slug: "middle-east", name: "Middle East", description: "Dynasties of Mesopotamia, the Levant, and Anatolia.", parents: ["asia"] },
  { slug: "africa", name: "Africa", description: "Ruling houses across the African continent." },
  { slug: "north-africa", name: "North Africa", description: "Dynasties of Egypt, the Maghreb, and the Nile valley.", parents: ["africa"] },
  { slug: "west-africa", name: "West Africa", description: "The trans-Saharan trading empires and their successor states.", parents: ["africa"] },
  { slug: "east-africa", name: "East Africa", description: "Royal houses of the Horn and East African coast.", parents: ["africa"] },
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
