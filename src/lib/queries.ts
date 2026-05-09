import { prisma } from "./prisma";
import type { TreeNode } from "@/components/FamilyTreeStatic";

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
          parent: { select: { slug: true, name: true, birthYear: true, deathYear: true } },
        },
      },
      childLinks: {
        include: {
          child: { select: { slug: true, name: true, birthYear: true, deathYear: true } },
        },
      },
      spouseLinksA: {
        include: {
          b: { select: { slug: true, name: true, birthYear: true, deathYear: true } },
        },
      },
      spouseLinksB: {
        include: {
          a: { select: { slug: true, name: true, birthYear: true, deathYear: true } },
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
    titles: figure.titles,
    birthYear: figure.birthYear,
    deathYear: figure.deathYear,
    biography: figure.biography,
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
