"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const VALID_KINDS = ["CONFLICT", "ALLIANCE", "MARRIAGE", "SUCCESSION", "OTHER"] as const;
type Kind = (typeof VALID_KINDS)[number];

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
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugRaw || title);
  const y = String(formData.get("year") ?? "").trim();
  const ey = String(formData.get("endYear") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const kindRaw = String(formData.get("kind") ?? "OTHER");
  const kind: Kind = (VALID_KINDS as readonly string[]).includes(kindRaw)
    ? (kindRaw as Kind)
    : "OTHER";
  return {
    title,
    slug,
    year: y !== "" ? Number(y) : null,
    endYear: ey !== "" ? Number(ey) : null,
    description,
    kind,
  };
}

// Participants come in via two parallel form fields:
//   participantIds: comma-separated dynasty IDs
//   participantRoles: JSON object {[dynastyId]: roleString}
function readParticipants(formData: FormData) {
  const ids = String(formData.get("participantIds") ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
  const roleRaw = String(formData.get("participantRoles") ?? "{}");
  let rolesByDynastyId: Record<string, string> = {};
  try {
    const parsed = JSON.parse(roleRaw);
    if (parsed && typeof parsed === "object") rolesByDynastyId = parsed;
  } catch {
    /* ignore malformed JSON; fall back to empty roles */
  }
  return ids.map((id) => ({
    dynastyId: id,
    role: (rolesByDynastyId[String(id)] ?? "").trim() || null,
  }));
}

async function syncParticipants(eventId: number, participants: { dynastyId: number; role: string | null }[]) {
  await prisma.$transaction(async (tx) => {
    await tx.dynastyEvent.deleteMany({ where: { eventId } });
    if (participants.length) {
      await tx.dynastyEvent.createMany({
        data: participants.map((p) => ({ ...p, eventId })),
        skipDuplicates: true,
      });
    }
  });
}

function revalidateEventTouchedPaths(dynastySlugs: string[]) {
  revalidatePath("/dynasties");
  for (const slug of dynastySlugs) {
    revalidatePath(`/dynasties/${slug}`);
  }
}

async function dynastySlugsFor(dynastyIds: number[]): Promise<string[]> {
  if (!dynastyIds.length) return [];
  const rows = await prisma.dynasty.findMany({
    where: { id: { in: dynastyIds } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function createEventAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readForm(formData);
  if (!data.title) throw new Error("Title is required");
  if (!data.slug) throw new Error("Could not derive a URL slug");

  const exists = await prisma.historicalEvent.findUnique({ where: { slug: data.slug } });
  if (exists) throw new Error(`Slug "${data.slug}" is already taken`);

  const created = await prisma.historicalEvent.create({ data });
  const participants = readParticipants(formData);
  await syncParticipants(created.id, participants);

  const slugs = await dynastySlugsFor(participants.map((p) => p.dynastyId));
  revalidateEventTouchedPaths(slugs);
  redirect(`/admin/events/${created.slug}`);
}

export async function updateEventAction(originalSlug: string, formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = readForm(formData);
  if (!data.title) throw new Error("Title is required");

  const existing = await prisma.historicalEvent.findUnique({
    where: { slug: originalSlug },
    include: { participants: { select: { dynastyId: true } } },
  });
  if (!existing) throw new Error("Event not found");

  if (data.slug !== originalSlug) {
    const collision = await prisma.historicalEvent.findUnique({ where: { slug: data.slug } });
    if (collision) throw new Error(`Slug "${data.slug}" is already taken`);
  }

  const updated = await prisma.historicalEvent.update({
    where: { id: existing.id },
    data,
  });
  const participants = readParticipants(formData);
  await syncParticipants(updated.id, participants);

  // Revalidate every dynasty that was OR is involved.
  const allDynastyIds = new Set([
    ...existing.participants.map((p) => p.dynastyId),
    ...participants.map((p) => p.dynastyId),
  ]);
  const slugs = await dynastySlugsFor([...allDynastyIds]);
  revalidateEventTouchedPaths(slugs);
  redirect(`/admin/events/${updated.slug}`);
}

export async function deleteEventAction(slug: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const existing = await prisma.historicalEvent.findUnique({
    where: { slug },
    include: { participants: { select: { dynastyId: true } } },
  });
  if (!existing) throw new Error("Event not found");

  const dynastyIds = existing.participants.map((p) => p.dynastyId);
  await prisma.historicalEvent.delete({ where: { id: existing.id } });

  const slugs = await dynastySlugsFor(dynastyIds);
  revalidateEventTouchedPaths(slugs);
  redirect("/admin/events");
}
