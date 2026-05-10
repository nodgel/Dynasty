import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { OG_SIZE, OG_CONTENT_TYPE, ogFigure, ogDefault } from "@/lib/og";
import { formatYearRange } from "@/lib/format";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Historical figure share card";

type Params = { "dynasty-slug": string; "figure-slug": string };

export default async function Image({ params }: { params: Promise<Params> }) {
  const { "figure-slug": slug } = await params;
  const figure = await prisma.historicalFigure.findUnique({
    where: { slug },
    select: {
      name: true,
      nativeName: true,
      titles: true,
      birthYear: true,
      deathYear: true,
      reignStart: true,
      reignEnd: true,
      imageUrl: true,
      dynasty: { select: { name: true } },
    },
  });

  if (!figure) {
    return new ImageResponse(ogDefault({ heading: "Figure not found" }), { ...OG_SIZE });
  }

  return new ImageResponse(
    ogFigure({
      name: figure.name,
      nativeName: figure.nativeName,
      titles: figure.titles,
      lifespan: formatYearRange(figure.birthYear, figure.deathYear) || null,
      reign: formatYearRange(figure.reignStart, figure.reignEnd) || null,
      dynastyName: figure.dynasty?.name ?? null,
      portraitUrl: figure.imageUrl,
    }),
    { ...OG_SIZE }
  );
}
