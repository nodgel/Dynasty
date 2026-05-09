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
    .slice(0, 80);
}

function readForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugRaw || name);
  const region = String(formData.get("region") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const fy = String(formData.get("foundedYear") ?? "").trim();
  const ey = String(formData.get("endedYear") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
  const coatOfArmsUrl = String(formData.get("coatOfArmsUrl") ?? "").trim() || null;
  const nativeName = String(formData.get("nativeName") ?? "").trim() || null;
  const definingMoment = String(formData.get("definingMoment") ?? "").trim() || null;
  const ptk = String(formData.get("peakTerritoryKm2") ?? "").trim();
  const livingDescendants = String(formData.get("livingDescendants") ?? "").trim() || null;
  return {
    name,
    nativeName,
    slug,
    region,
    description,
    foundedYear: fy ? Number(fy) : null,
    endedYear: ey ? Number(ey) : null,
    imageUrl,
    coatOfArmsUrl,
    definingMoment,
    peakTerritoryKm2: ptk ? Number(ptk) : null,
    livingDescendants,
  };
}

function revalidateDynasty(slug: string) {
  revalidatePath("/");
  revalidatePath("/dynasties");
  revalidatePath(`/dynasties/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function createDynastyAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readForm(formData);
  if (!data.name) throw new Error("Name is required");
  if (!data.slug) throw new Error("Could not derive a URL slug");

  const exists = await prisma.dynasty.findUnique({ where: { slug: data.slug } });
  if (exists) throw new Error(`Slug "${data.slug}" is already taken`);

  await prisma.dynasty.create({ data });
  revalidateDynasty(data.slug);
  redirect(`/admin/dynasties/${data.slug}`);
}

export async function updateDynastyAction(
  originalSlug: string,
  formData: FormData
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readForm(formData);
  if (!data.name) throw new Error("Name is required");

  const existing = await prisma.dynasty.findUnique({ where: { slug: originalSlug } });
  if (!existing) throw new Error("Dynasty not found");

  // If slug changed, ensure the new one isn't already taken.
  if (data.slug !== originalSlug) {
    const collision = await prisma.dynasty.findUnique({ where: { slug: data.slug } });
    if (collision) throw new Error(`Slug "${data.slug}" is already taken`);
  }

  await prisma.dynasty.update({
    where: { id: existing.id },
    data,
  });

  revalidateDynasty(originalSlug);
  if (data.slug !== originalSlug) revalidateDynasty(data.slug);
  redirect(`/admin/dynasties/${data.slug}`);
}

export async function deleteDynastyAction(slug: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const existing = await prisma.dynasty.findUnique({
    where: { slug },
    include: { _count: { select: { figures: true } } },
  });
  if (!existing) throw new Error("Dynasty not found");

  // Detach figures rather than cascade-delete them: deleting an entire dynasty
  // wholesale (with all its biographies) is an easy mis-click. Figures become
  // orphaned (dynastyId=null) and can be reassigned or deleted individually.
  await prisma.$transaction(async (tx) => {
    await tx.historicalFigure.updateMany({
      where: { dynastyId: existing.id },
      data: { dynastyId: null },
    });
    await tx.dynasty.delete({ where: { id: existing.id } });
  });

  revalidateDynasty(slug);
  redirect("/admin");
}
