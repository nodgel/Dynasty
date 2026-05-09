"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function parseIdList(raw: FormDataEntryValue | null): number[] {
  if (raw == null) return [];
  return String(raw)
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function readFigureForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const nativeName = String(formData.get("nativeName") ?? "").trim() || null;
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugRaw || name);
  const titles = String(formData.get("titles") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const by = String(formData.get("birthYear") ?? "").trim();
  const dy = String(formData.get("deathYear") ?? "").trim();
  const rs = String(formData.get("reignStart") ?? "").trim();
  const re = String(formData.get("reignEnd") ?? "").trim();
  const biography = String(formData.get("biography") ?? "").trim() || null;
  const dynastyIdRaw = String(formData.get("dynastyId") ?? "").trim();
  const dynastyId = dynastyIdRaw ? Number(dynastyIdRaw) : null;
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  return {
    name,
    nativeName,
    slug,
    titles,
    birthYear: by !== "" ? Number(by) : null,
    deathYear: dy !== "" ? Number(dy) : null,
    reignStart: rs !== "" ? Number(rs) : null,
    reignEnd: re !== "" ? Number(re) : null,
    biography,
    dynastyId: Number.isFinite(dynastyId as number) && dynastyId ? dynastyId : null,
    imageUrl,
  };
}

async function syncRelations(
  figureId: number,
  parentIds: number[],
  childIds: number[],
  spouseIds: number[]
) {
  await prisma.$transaction(async (tx) => {
    // Replace parent links
    await tx.parentChild.deleteMany({ where: { childId: figureId } });
    if (parentIds.length) {
      await tx.parentChild.createMany({
        data: parentIds
          .filter((pid) => pid !== figureId)
          .map((pid) => ({ parentId: pid, childId: figureId })),
        skipDuplicates: true,
      });
    }

    // Replace child links
    await tx.parentChild.deleteMany({ where: { parentId: figureId } });
    if (childIds.length) {
      await tx.parentChild.createMany({
        data: childIds
          .filter((cid) => cid !== figureId)
          .map((cid) => ({ parentId: figureId, childId: cid })),
        skipDuplicates: true,
      });
    }

    // Replace spouse links — symmetric, so we touch any row this figure is in.
    await tx.spouse.deleteMany({
      where: { OR: [{ aId: figureId }, { bId: figureId }] },
    });
    if (spouseIds.length) {
      const pairs = spouseIds
        .filter((sid) => sid !== figureId)
        .map((sid) => {
          const [aId, bId] = figureId < sid ? [figureId, sid] : [sid, figureId];
          return { aId, bId };
        });
      // Dedup
      const seen = new Set<string>();
      const unique = pairs.filter((p) => {
        const k = `${p.aId}-${p.bId}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (unique.length) {
        await tx.spouse.createMany({ data: unique, skipDuplicates: true });
      }
    }
  });
}

function revalidateFigure(figureSlug: string, dynastySlug: string | null) {
  revalidatePath("/");
  revalidatePath("/dynasties");
  if (dynastySlug) {
    revalidatePath(`/dynasties/${dynastySlug}`);
    revalidatePath(`/dynasties/${dynastySlug}/${figureSlug}`);
  }
  revalidatePath(`/figures/${figureSlug}`);
  revalidatePath("/sitemap.xml");
}

export async function createFigureAction(
  defaultDynastyId: number | null,
  formData: FormData
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readFigureForm(formData);
  if (!data.name) throw new Error("Name is required");
  if (!data.slug) throw new Error("Could not derive a URL slug");

  const exists = await prisma.historicalFigure.findUnique({ where: { slug: data.slug } });
  if (exists) throw new Error(`Slug "${data.slug}" is already taken`);

  const dynastyId = data.dynastyId ?? defaultDynastyId;

  const created = await prisma.historicalFigure.create({
    data: { ...data, dynastyId },
  });

  await syncRelations(
    created.id,
    parseIdList(formData.get("parentIds")),
    parseIdList(formData.get("childIds")),
    parseIdList(formData.get("spouseIds"))
  );

  const dynastySlug = dynastyId
    ? (await prisma.dynasty.findUnique({ where: { id: dynastyId }, select: { slug: true } }))?.slug ?? null
    : null;

  revalidateFigure(created.slug, dynastySlug);
  redirect(`/admin/figures/${created.slug}`);
}

export async function updateFigureAction(
  originalSlug: string,
  formData: FormData
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readFigureForm(formData);
  if (!data.name) throw new Error("Name is required");

  const existing = await prisma.historicalFigure.findUnique({
    where: { slug: originalSlug },
    include: { dynasty: { select: { slug: true } } },
  });
  if (!existing) throw new Error("Figure not found");

  if (data.slug !== originalSlug) {
    const collision = await prisma.historicalFigure.findUnique({ where: { slug: data.slug } });
    if (collision) throw new Error(`Slug "${data.slug}" is already taken`);
  }

  const updated = await prisma.historicalFigure.update({
    where: { id: existing.id },
    data,
    include: { dynasty: { select: { slug: true } } },
  });

  await syncRelations(
    updated.id,
    parseIdList(formData.get("parentIds")),
    parseIdList(formData.get("childIds")),
    parseIdList(formData.get("spouseIds"))
  );

  // Revalidate both the old and new locations if the figure moved.
  if (existing.dynasty?.slug && existing.dynasty.slug !== updated.dynasty?.slug) {
    revalidateFigure(originalSlug, existing.dynasty.slug);
  }
  revalidateFigure(updated.slug, updated.dynasty?.slug ?? null);
  if (updated.slug !== originalSlug) revalidatePath(`/figures/${originalSlug}`);

  redirect(`/admin/figures/${updated.slug}`);
}

export async function deleteFigureAction(slug: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const existing = await prisma.historicalFigure.findUnique({
    where: { slug },
    include: { dynasty: { select: { slug: true } } },
  });
  if (!existing) throw new Error("Figure not found");

  // Cascade is set on the join tables (ParentChild, Spouse) so they go too.
  await prisma.historicalFigure.delete({ where: { id: existing.id } });

  revalidateFigure(slug, existing.dynasty?.slug ?? null);
  redirect(existing.dynasty?.slug ? `/admin/dynasties/${existing.dynasty.slug}` : "/admin");
}
