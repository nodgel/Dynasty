import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, ogCollection, ogDefault } from "@/lib/og";
import { getRegion } from "@/lib/regions";
import { listDynastiesWithCounts } from "@/lib/queries";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Dynasties by region";

type Params = { slug: string };

export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) {
    return new ImageResponse(ogDefault({ heading: "Region not found" }), { ...OG_SIZE });
  }

  const dynasties = await listDynastiesWithCounts();
  const count = dynasties.filter((d) => d.regionTags.includes(region.slug)).length;

  return new ImageResponse(
    ogCollection({
      eyebrow: "By region",
      heading: `Dynasties of ${region.name}`,
      description: region.description,
      meta: `${count} ruling ${count === 1 ? "house" : "houses"}`,
    }),
    { ...OG_SIZE }
  );
}
