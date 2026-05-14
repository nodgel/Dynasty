import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Serendipity endpoint: picks one figure at random and 302s to that figure's
// canonical page (or the legacy /figures/[slug] redirect if it has no
// dynasty). Used by the homepage "Surprise me" button.
export async function GET() {
  const total = await prisma.historicalFigure.count();
  if (total === 0) return NextResponse.redirect(new URL("/dynasties", "https://dynastica.net"));

  const skip = Math.floor(Math.random() * total);
  const figure = await prisma.historicalFigure.findFirst({
    skip,
    orderBy: { id: "asc" },
    select: { slug: true, dynasty: { select: { slug: true } } },
  });
  if (!figure) return NextResponse.redirect(new URL("/dynasties", "https://dynastica.net"));

  const dest = figure.dynasty
    ? `/dynasties/${figure.dynasty.slug}/${figure.slug}`
    : `/figures/${figure.slug}`;

  // Cache: response itself is no-store (we want a different figure every hit),
  // but the destination page is statically generated and served from cache.
  return NextResponse.redirect(new URL(dest, "https://dynastica.net"), {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
