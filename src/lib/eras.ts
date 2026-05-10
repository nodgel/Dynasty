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
}> = [
  { slug: "ancient", name: "Ancient", startYear: -10000, endYear: -500, description: "Bronze Age and early Iron Age dynasties — pre-classical antiquity." },
  { slug: "classical", name: "Classical Antiquity", startYear: -499, endYear: 300, description: "From the rise of Greek city-states through the high Roman Empire." },
  { slug: "late-antiquity", name: "Late Antiquity", startYear: 301, endYear: 600, description: "The transition from the Roman world to the early medieval — fall of Rome, rise of the successor kingdoms." },
  { slug: "early-medieval", name: "Early Medieval", startYear: 601, endYear: 1000, description: "Caliphates, Carolingians, the rise of new royal houses across Eurasia." },
  { slug: "high-medieval", name: "High Medieval", startYear: 1001, endYear: 1300, description: "The Crusades, the Mongol expansion, the apex of Christian and Islamic medieval polities." },
  { slug: "late-medieval", name: "Late Medieval", startYear: 1301, endYear: 1500, description: "From the Black Death to the eve of European overseas empires." },
  { slug: "early-modern", name: "Early Modern", startYear: 1501, endYear: 1800, description: "Gunpowder empires, dynastic wars, and global colonial reach." },
  { slug: "modern", name: "Modern", startYear: 1801, endYear: 2200, description: "From the Napoleonic age to the dynasties that survive into the present." },
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
