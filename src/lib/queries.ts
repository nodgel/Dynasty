import { prisma } from "./prisma";
import type { TreeNode } from "@/components/FamilyTreeStatic";
import { regionTagsFor, type RegionSlug } from "./regions";
import { eraTagsFor, type EraSlug } from "./eras";

export async function listDynasties() {
  const rows = await prisma.dynasty.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { figures: true } } },
  });
  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    description: d.description,
    foundedYear: d.foundedYear,
    endedYear: d.endedYear,
    coatOfArmsUrl: d.coatOfArmsUrl,
    figureCount: d._count.figures,
  }));
}

// Recently added dynasties, newest first. Used on the homepage to give the
// site a recency signal for returning visitors and crawlers.
export async function listRecentDynasties(take = 4) {
  const rows = await prisma.dynasty.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { _count: { select: { figures: true } } },
  });
  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    description: d.description,
    foundedYear: d.foundedYear,
    endedYear: d.endedYear,
    coatOfArmsUrl: d.coatOfArmsUrl,
    figureCount: d._count.figures,
  }));
}

export async function getDynastyBySlug(slug: string) {
  const d = await prisma.dynasty.findUnique({
    where: { slug },
    include: {
      figures: {
        orderBy: [{ birthYear: "asc" }, { name: "asc" }],
      },
    },
  });
  return d;
}

// Builds a forest of TreeNodes for figures in a given dynasty, using
// parent-child links restricted to that dynasty. A figure becomes a root
// when none of its parents (within the dynasty) exist.
export async function getDynastyTree(dynastyId: number): Promise<TreeNode[]> {
  const figures = await prisma.historicalFigure.findMany({
    where: { dynastyId },
    select: { id: true, slug: true, name: true, birthYear: true, deathYear: true },
  });
  const figureIds = new Set(figures.map((f) => f.id));

  const links = await prisma.parentChild.findMany({
    where: { parentId: { in: [...figureIds] }, childId: { in: [...figureIds] } },
    select: { parentId: true, childId: true },
  });

  const nodeById = new Map<number, TreeNode>();
  for (const f of figures) nodeById.set(f.id, { ...f, children: [] });

  const childIds = new Set<number>();
  for (const { parentId, childId } of links) {
    const parent = nodeById.get(parentId);
    const child = nodeById.get(childId);
    if (!parent || !child) continue;
    // Avoid duplicate child entries when a child has two parents in the dynasty.
    if (!parent.children.some((c) => c.id === child.id)) parent.children.push(child);
    childIds.add(childId);
  }

  const roots: TreeNode[] = [];
  for (const node of nodeById.values()) {
    if (!childIds.has(node.id)) roots.push(node);
  }
  roots.sort((a, b) => (a.birthYear ?? 0) - (b.birthYear ?? 0));
  return roots;
}

export async function getFigureBySlug(slug: string) {
  const figure = await prisma.historicalFigure.findUnique({
    where: { slug },
    include: {
      dynasty: { select: { slug: true, name: true } },
      parentLinks: {
        include: {
          parent: {
            select: {
              slug: true,
              name: true,
              birthYear: true,
              deathYear: true,
              dynasty: { select: { slug: true, name: true } },
            },
          },
        },
      },
      childLinks: {
        include: {
          child: {
            select: {
              slug: true,
              name: true,
              birthYear: true,
              deathYear: true,
              dynasty: { select: { slug: true, name: true } },
            },
          },
        },
      },
      spouseLinksA: {
        include: {
          b: {
            select: {
              slug: true,
              name: true,
              birthYear: true,
              deathYear: true,
              dynasty: { select: { slug: true, name: true } },
            },
          },
        },
      },
      spouseLinksB: {
        include: {
          a: {
            select: {
              slug: true,
              name: true,
              birthYear: true,
              deathYear: true,
              dynasty: { select: { slug: true, name: true } },
            },
          },
        },
      },
    },
  });
  if (!figure) return null;

  const parents = figure.parentLinks.map((l) => l.parent);
  const children = figure.childLinks.map((l) => l.child);
  const spouses = [
    ...figure.spouseLinksA.map((l) => l.b),
    ...figure.spouseLinksB.map((l) => l.a),
  ];

  return {
    id: figure.id,
    slug: figure.slug,
    name: figure.name,
    nativeName: figure.nativeName,
    titles: figure.titles,
    birthYear: figure.birthYear,
    deathYear: figure.deathYear,
    reignStart: figure.reignStart,
    reignEnd: figure.reignEnd,
    biography: figure.biography,
    imageUrl: figure.imageUrl,
    dynasty: figure.dynasty,
    parents,
    children,
    spouses,
  };
}

export async function listAllFigureSlugs() {
  return prisma.historicalFigure.findMany({
    select: { slug: true, dynasty: { select: { slug: true } } },
  });
}

export async function listAllDynastySlugs() {
  return prisma.dynasty.findMany({ select: { slug: true } });
}

// Every figure with both birth and death years known, plus enough dynasty
// metadata to render a "who was alive in year X" view. Returns the entire
// dataset (currently ~150 rows × small fields → ~10KB) so a client component
// can filter in real time without re-querying on every slider movement.
export async function listAllFiguresWithDates() {
  const rows = await prisma.historicalFigure.findMany({
    where: { birthYear: { not: null }, deathYear: { not: null } },
    select: {
      slug: true,
      name: true,
      birthYear: true,
      deathYear: true,
      reignStart: true,
      reignEnd: true,
      dynasty: { select: { slug: true, name: true } },
    },
    orderBy: { birthYear: "asc" },
  });
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    birthYear: r.birthYear!,
    deathYear: r.deathYear!,
    reignStart: r.reignStart,
    reignEnd: r.reignEnd,
    dynastySlug: r.dynasty?.slug ?? null,
    dynastyName: r.dynasty?.name ?? null,
  }));
}

export type FigureWithDates = Awaited<ReturnType<typeof listAllFiguresWithDates>>[number];

// "See also" suggestions for a dynasty page. Returns two buckets:
//   • sameRegion — dynasties that share at least one region tag
//   • sameEra    — dynasties that share at least one era tag
// Each bucket is at most `take` entries, sorted by start year (chronological).
// The current dynasty is excluded from both. Buckets may overlap (same dynasty
// in both is fine — it's a clear "highly related" signal for the user).
export async function getRelatedDynasties(currentSlug: string, take = 6) {
  const all = await listDynastiesWithEraFallback();
  const current = all.find((d) => d.slug === currentSlug);
  if (!current) return { sameRegion: [], sameEra: [] };

  const others = all.filter((d) => d.slug !== currentSlug);

  const sameRegion = others
    .filter((d) => d.regionTags.some((t) => current.regionTags.includes(t)))
    .sort((a, b) => (a.foundedYear ?? 0) - (b.foundedYear ?? 0))
    .slice(0, take)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      region: d.region,
      foundedYear: d.foundedYear,
      endedYear: d.endedYear,
      coatOfArmsUrl: d.coatOfArmsUrl,
    }));

  const sameEra = others
    .filter((d) => d.eraTags.some((t) => current.eraTags.includes(t)))
    .sort((a, b) => (a.foundedYear ?? 0) - (b.foundedYear ?? 0))
    .slice(0, take)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      region: d.region,
      foundedYear: d.foundedYear,
      endedYear: d.endedYear,
      coatOfArmsUrl: d.coatOfArmsUrl,
    }));

  return { sameRegion, sameEra };
}

// Aggregations used by the region/era browse pages. We pull every dynasty in
// one shot (only ~30 rows) and tag in JavaScript — simpler than N round-trips
// and lets us reuse regionTagsFor / eraTagsFor without Postgres extensions.
export async function listDynastiesWithCounts() {
  const rows = await prisma.dynasty.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { figures: true } } },
  });
  return rows.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    region: d.region,
    description: d.description,
    foundedYear: d.foundedYear,
    endedYear: d.endedYear,
    coatOfArmsUrl: d.coatOfArmsUrl,
    figureCount: d._count.figures,
    regionTags: regionTagsFor(d.region) as RegionSlug[],
    eraTags: eraTagsFor(d.foundedYear, d.endedYear) as EraSlug[],
  }));
}

export type DynastyAggRow = Awaited<ReturnType<typeof listDynastiesWithCounts>>[number];

// For dynasties with no foundedYear/endedYear, fall back to oldest birthYear
// + youngest deathYear among their figures so era tagging still works.
export async function listDynastiesWithEraFallback(): Promise<DynastyAggRow[]> {
  const dynasties = await listDynastiesWithCounts();
  const needsFallback = dynasties.filter((d) => d.eraTags.length === 0);
  if (needsFallback.length === 0) return dynasties;

  const fallbackYears = await prisma.historicalFigure.groupBy({
    by: ["dynastyId"],
    where: { dynastyId: { in: needsFallback.map((d) => d.id) } },
    _min: { birthYear: true },
    _max: { deathYear: true },
  });
  const byId = new Map(fallbackYears.map((r) => [r.dynastyId!, r]));

  return dynasties.map((d) => {
    if (d.eraTags.length > 0) return d;
    const fb = byId.get(d.id);
    if (!fb) return d;
    return {
      ...d,
      eraTags: eraTagsFor(fb._min.birthYear, fb._max.deathYear) as EraSlug[],
    };
  });
}

// All events that involve the given dynasty, plus per-event the OTHER
// dynasties involved (the "rabbit-hole" links to render in the UI). The
// current dynasty itself is excluded from the otherParticipants list.
export async function getDynastyEvents(dynastyId: number) {
  const rows = await prisma.dynastyEvent.findMany({
    where: { dynastyId },
    include: {
      event: {
        include: {
          participants: {
            include: { dynasty: { select: { slug: true, name: true } } },
          },
        },
      },
    },
  });

  return rows
    .map((row) => {
      const e = row.event;
      const others = e.participants
        .filter((p) => p.dynastyId !== dynastyId)
        .map((p) => ({
          slug: p.dynasty.slug,
          name: p.dynasty.name,
          role: p.role,
        }));
      return {
        id: e.id,
        slug: e.slug,
        title: e.title,
        year: e.year,
        endYear: e.endYear,
        kind: e.kind,
        description: e.description,
        ownRole: row.role,
        otherParticipants: others,
      };
    })
    .sort((a, b) => (a.year ?? Number.MAX_SAFE_INTEGER) - (b.year ?? Number.MAX_SAFE_INTEGER));
}
