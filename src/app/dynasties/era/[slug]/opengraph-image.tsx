import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, ogCollection, ogDefault } from "@/lib/og";
import { getEra } from "@/lib/eras";
import { listDynastiesWithEraFallback } from "@/lib/queries";
import { formatYear } from "@/lib/format";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Dynasties by era";

type Params = { slug: string };

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const era = getEra(slug);
  if (!era) {
    return new ImageResponse(ogDefault({ heading: "Era not found" }), { ...OG_SIZE });
  }

  const dynasties = await listDynastiesWithEraFallback();
  const count = dynasties.filter((d) => d.eraTags.includes(era.slug)).length;
  const span = `${formatYear(era.startYear)} – ${formatYear(era.endYear)}`;

  return new ImageResponse(
    ogCollection({
      eyebrow: span,
      heading: `${era.name} dynasties`,
      description: era.description,
      meta: `${count} ruling ${count === 1 ? "house" : "houses"}`,
    }),
    { ...OG_SIZE }
  );
}
