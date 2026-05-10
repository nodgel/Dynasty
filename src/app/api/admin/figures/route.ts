import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const exclude = Number(url.searchParams.get("exclude") ?? "0");

  const rows = await prisma.historicalFigure.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      ...(exclude ? { id: { not: exclude } } : {}),
    },
    take: 12,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      birthYear: true,
      deathYear: true,
      dynasty: { select: { name: true } },
    },
  });

  return NextResponse.json({ ok: true, results: rows });
}
