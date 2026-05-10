import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { OG_SIZE, OG_CONTENT_TYPE, ogDynasty, ogDefault } from "@/lib/og";
import { formatYearRange } from "@/lib/format";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Dynasty share card";

type Params = { "dynasty-slug": string };

export default async function Image({ params }: { params: Promise<Params> }) {
  const { "dynasty-slug": slug } = await params;
  const dynasty = await prisma.dynasty.findUnique({
    where: { slug },
    select: {
      name: true,
      nativeName: true,
      region: true,
      foundedYear: true,
      endedYear: true,
      coatOfArmsUrl: true,
    },
  });

  if (!dynasty) {
    return new ImageResponse(ogDefault({ heading: "Dynasty not found" }), { ...OG_SIZE });
  }

  const span = formatYearRange(dynasty.foundedYear, dynasty.endedYear) || null;

  return new ImageResponse(
    ogDynasty({
      name: dynasty.name,
      nativeName: dynasty.nativeName,
      region: dynasty.region,
      span,
      coatOfArmsUrl: dynasty.coatOfArmsUrl,
    }),
    { ...OG_SIZE }
  );
}
