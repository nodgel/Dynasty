"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Input schema accepted by /admin/import. Mirrors the JSON shape produced by
// the AI-historian prompt (see doc), with `description` mapping to our
// `biography` field at apply time.
export type ImportFigure = {
  name: string;
  slug: string;
  nativeName?: string | null;
  dynasty?: string | null;
  description?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  reignStart?: number | null;
  reignEnd?: number | null;
  titles?: string[];
  parents?: string[];
  spouses?: string[];
  children?: string[];
};

export type FigureStatus =
  | { kind: "new" }
  | { kind: "exists" } // slug already in DB; v1 leaves these alone
  | { kind: "invalid"; reasons: string[] };

export type ImportRow = {
  figure: ImportFigure;
  status: FigureStatus;
  dynastyResolution:
    | { kind: "matched"; id: number; name: string }
    | { kind: "new"; name: string }
    | { kind: "none" };
};

export type AnalyzeOk = {
  kind: "ok";
  json: string;
  rows: ImportRow[];
  newDynastyNames: string[]; // distinct dynasty names not yet in DB
  parentChildEdges: Array<{ parent: string; child: string }>; // slug → slug
  spouseEdges: Array<[string, string]>; // unordered
  unresolvedSlugs: string[]; // referenced as relations but not in DB or import
};

export type AnalyzeResult = AnalyzeOk | { kind: "error"; message: string };

export type ApplyResult =
  | { kind: "applied"; createdDynasties: number; createdFigures: number; createdParentChild: number; createdSpouses: number }
  | { kind: "error"; message: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function parseFigures(raw: string): ImportFigure[] | { error: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { error: `Invalid JSON: ${(e as Error).message}` };
  }
  if (!Array.isArray(data)) {
    return { error: "Input must be a JSON array of figure objects." };
  }
  const out: ImportFigure[] = [];
  for (let i = 0; i < data.length; i++) {
    const o = data[i] as Record<string, unknown>;
    if (!o || typeof o !== "object") return { error: `Item ${i} is not an object.` };
    const name = typeof o.name === "string" ? o.name.trim() : "";
    const slug = typeof o.slug === "string" ? o.slug.trim() : "";
    if (!name) return { error: `Item ${i}: missing "name".` };
    if (!slug) return { error: `Item ${i}: missing "slug".` };
    out.push({
      name,
      slug,
      nativeName: typeof o.nativeName === "string" ? o.nativeName.trim() || null : null,
      dynasty: typeof o.dynasty === "string" ? o.dynasty.trim() || null : null,
      description: typeof o.description === "string" ? o.description : null,
      birthYear: typeof o.birthYear === "number" ? o.birthYear : null,
      deathYear: typeof o.deathYear === "number" ? o.deathYear : null,
      reignStart: typeof o.reignStart === "number" ? o.reignStart : null,
      reignEnd: typeof o.reignEnd === "number" ? o.reignEnd : null,
      titles: asArray<string>(o.titles)
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter(Boolean),
      parents: asArray<string>(o.parents).filter((s) => typeof s === "string"),
      spouses: asArray<string>(o.spouses).filter((s) => typeof s === "string"),
      children: asArray<string>(o.children).filter((s) => typeof s === "string"),
    });
  }
  return out;
}

function deriveEdges(figures: ImportFigure[]) {
  const pcSet = new Set<string>();
  const pcEdges: Array<{ parent: string; child: string }> = [];
  const spSet = new Set<string>();
  const spEdges: Array<[string, string]> = [];

  for (const f of figures) {
    for (const parent of f.parents ?? []) {
      const k = `${parent}|${f.slug}`;
      if (!pcSet.has(k) && parent !== f.slug) {
        pcSet.add(k);
        pcEdges.push({ parent, child: f.slug });
      }
    }
    for (const child of f.children ?? []) {
      const k = `${f.slug}|${child}`;
      if (!pcSet.has(k) && child !== f.slug) {
        pcSet.add(k);
        pcEdges.push({ parent: f.slug, child });
      }
    }
    for (const sp of f.spouses ?? []) {
      if (sp === f.slug) continue;
      const [a, b] = f.slug < sp ? [f.slug, sp] : [sp, f.slug];
      const k = `${a}|${b}`;
      if (!spSet.has(k)) {
        spSet.add(k);
        spEdges.push([a, b]);
      }
    }
  }
  return { pcEdges, spEdges };
}

export async function analyzeImportAction(
  _prev: AnalyzeResult | null,
  formData: FormData
): Promise<AnalyzeResult> {
  const session = await getSession();
  if (!session) return { kind: "error", message: "Unauthorized" };

  const raw = String(formData.get("json") ?? "").trim();
  if (!raw) return { kind: "error", message: "Paste JSON to analyze." };

  const parsed = parseFigures(raw);
  if (!Array.isArray(parsed)) return { kind: "error", message: parsed.error };

  // Detect duplicate slugs within the input.
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const f of parsed) {
    if (seen.has(f.slug)) dupes.push(f.slug);
    seen.add(f.slug);
  }

  const inputSlugs = new Set(parsed.map((f) => f.slug));

  // Load existing slugs (figures + dynasty names) for diffing.
  const [existingFigures, existingDynasties] = await Promise.all([
    prisma.historicalFigure.findMany({ select: { slug: true } }),
    prisma.dynasty.findMany({ select: { id: true, name: true } }),
  ]);
  const existingFigureSlugs = new Set(existingFigures.map((r) => r.slug));
  const dynastyByLowerName = new Map(
    existingDynasties.map((d) => [d.name.toLowerCase(), d])
  );

  // Compute per-row status.
  const newDynastyNamesSet = new Set<string>();
  const rows: ImportRow[] = parsed.map((figure) => {
    const reasons: string[] = [];
    if (!SLUG_RE.test(figure.slug)) reasons.push("Slug must be lowercase, hyphenated.");
    if (dupes.includes(figure.slug)) reasons.push("Slug appears more than once in this import.");

    let dynastyResolution: ImportRow["dynastyResolution"] = { kind: "none" };
    if (figure.dynasty) {
      const matched = dynastyByLowerName.get(figure.dynasty.toLowerCase());
      if (matched) {
        dynastyResolution = { kind: "matched", id: matched.id, name: matched.name };
      } else {
        dynastyResolution = { kind: "new", name: figure.dynasty };
        newDynastyNamesSet.add(figure.dynasty);
      }
    }

    let status: FigureStatus;
    if (reasons.length) status = { kind: "invalid", reasons };
    else if (existingFigureSlugs.has(figure.slug)) status = { kind: "exists" };
    else status = { kind: "new" };

    return { figure, status, dynastyResolution };
  });

  // Derive parent-child + spouse edges and detect unresolved slugs.
  const { pcEdges, spEdges } = deriveEdges(parsed);
  const referenced = new Set<string>();
  for (const e of pcEdges) {
    referenced.add(e.parent);
    referenced.add(e.child);
  }
  for (const [a, b] of spEdges) {
    referenced.add(a);
    referenced.add(b);
  }
  const unresolvedSlugs = [...referenced].filter(
    (s) => !inputSlugs.has(s) && !existingFigureSlugs.has(s)
  );

  return {
    kind: "ok",
    json: raw,
    rows,
    newDynastyNames: [...newDynastyNamesSet],
    parentChildEdges: pcEdges,
    spouseEdges: spEdges,
    unresolvedSlugs,
  };
}

export async function applyImportAction(
  _prev: ApplyResult | null,
  formData: FormData
): Promise<ApplyResult> {
  const session = await getSession();
  if (!session) return { kind: "error", message: "Unauthorized" };

  const raw = String(formData.get("json") ?? "").trim();
  if (!raw) return { kind: "error", message: "Missing payload." };

  // Re-parse from scratch so we don't trust client-side state.
  const parsed = parseFigures(raw);
  if (!Array.isArray(parsed)) return { kind: "error", message: parsed.error };

  const selectedSlugs = new Set(formData.getAll("apply").map(String));
  const approvedNewDynasties = new Set(
    formData.getAll("createDynasty").map((v) => String(v).toLowerCase())
  );

  const [existingFigures, existingDynasties] = await Promise.all([
    prisma.historicalFigure.findMany({ select: { slug: true, id: true } }),
    prisma.dynasty.findMany({ select: { id: true, name: true } }),
  ]);
  const existingFigureBySlug = new Map(existingFigures.map((r) => [r.slug, r.id]));
  const dynastyByLowerName = new Map(
    existingDynasties.map((d) => [d.name.toLowerCase(), d])
  );

  // Plan the writes.
  const figuresToCreate = parsed.filter(
    (f) => selectedSlugs.has(f.slug) && !existingFigureBySlug.has(f.slug) && SLUG_RE.test(f.slug)
  );

  // Collect dynasty names that need creation (only those approved by user).
  const dynastyNamesToCreate = [
    ...new Set(
      figuresToCreate
        .map((f) => f.dynasty?.trim())
        .filter((n): n is string => Boolean(n))
        .filter((n) => !dynastyByLowerName.has(n.toLowerCase()))
        .filter((n) => approvedNewDynasties.has(n.toLowerCase()))
    ),
  ];

  const { pcEdges, spEdges } = deriveEdges(parsed);

  let createdDynasties = 0;
  let createdFigures = 0;
  let createdParentChild = 0;
  let createdSpouses = 0;

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Create approved new dynasties.
        for (const name of dynastyNamesToCreate) {
          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);
          const created = await tx.dynasty.create({
            data: { name, slug },
          });
          dynastyByLowerName.set(name.toLowerCase(), { id: created.id, name });
          createdDynasties++;
        }

        // 2. Create figures.
        for (const f of figuresToCreate) {
          let dynastyId: number | null = null;
          if (f.dynasty) {
            const d = dynastyByLowerName.get(f.dynasty.toLowerCase());
            if (d) dynastyId = d.id;
            // If dynasty wasn't matched and wasn't approved, leave figure unattached.
          }
          const created = await tx.historicalFigure.create({
            data: {
              slug: f.slug,
              name: f.name,
              nativeName: f.nativeName ?? null,
              titles: f.titles ?? [],
              birthYear: f.birthYear ?? null,
              deathYear: f.deathYear ?? null,
              reignStart: f.reignStart ?? null,
              reignEnd: f.reignEnd ?? null,
              biography: f.description ?? null,
              dynastyId,
            },
          });
          existingFigureBySlug.set(created.slug, created.id);
          createdFigures++;
        }

        // 3. Apply parent-child edges (only when both ends are now resolvable).
        for (const e of pcEdges) {
          const parentId = existingFigureBySlug.get(e.parent);
          const childId = existingFigureBySlug.get(e.child);
          if (!parentId || !childId) continue;
          // Only insert if at least one end was just created OR both selected.
          // Simpler rule: always upsert via skipDuplicates — won't double up.
          const r = await tx.parentChild.createMany({
            data: [{ parentId, childId }],
            skipDuplicates: true,
          });
          createdParentChild += r.count;
        }

        // 4. Apply spouse edges (normalized).
        for (const [aSlug, bSlug] of spEdges) {
          const aId = existingFigureBySlug.get(aSlug);
          const bId = existingFigureBySlug.get(bSlug);
          if (!aId || !bId) continue;
          const [low, high] = aId < bId ? [aId, bId] : [bId, aId];
          const r = await tx.spouse.createMany({
            data: [{ aId: low, bId: high }],
            skipDuplicates: true,
          });
          createdSpouses += r.count;
        }
      },
      { timeout: 30_000 }
    );
  } catch (err) {
    return { kind: "error", message: `Apply failed: ${(err as Error).message}` };
  }

  // Revalidate every dynasty page that may have new figures or new edges.
  revalidatePath("/");
  revalidatePath("/dynasties");
  revalidatePath("/sitemap.xml");
  // For touched dynasties:
  const touchedDynastyIds = new Set<number>();
  for (const f of figuresToCreate) {
    if (f.dynasty) {
      const d = dynastyByLowerName.get(f.dynasty.toLowerCase());
      if (d) touchedDynastyIds.add(d.id);
    }
  }
  if (touchedDynastyIds.size) {
    const slugs = await prisma.dynasty.findMany({
      where: { id: { in: [...touchedDynastyIds] } },
      select: { slug: true },
    });
    for (const { slug } of slugs) revalidatePath(`/dynasties/${slug}`);
  }

  return {
    kind: "applied",
    createdDynasties,
    createdFigures,
    createdParentChild,
    createdSpouses,
  };
}
