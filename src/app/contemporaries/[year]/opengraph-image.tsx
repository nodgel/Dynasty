import { ImageResponse } from "next/og";
import { OG_SIZE, OG_CONTENT_TYPE, ogCollection, ogDefault } from "@/lib/og";
import { listAllFiguresWithDates } from "@/lib/queries";
import { formatYear } from "@/lib/format";

export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contemporaries — who was alive together";

type Params = { year: string };

export default async function Image({ params }: { params: Promise<Params> }) {
  const { year: raw } = await params;
  const year = Number(raw);
  if (!Number.isFinite(year)) {
    return new ImageResponse(ogDefault({ heading: "Contemporaries" }), { ...OG_SIZE });
  }
  const figures = await listAllFiguresWithDates();
  const alive = figures.filter((f) => year >= f.birthYear && year <= f.deathYear);
  const dynasties = new Set(alive.map((f) => f.dynastySlug).filter(Boolean));

  return new ImageResponse(
    ogCollection({
      eyebrow: "The world in",
      heading: formatYear(year),
      description: `${alive.length} royal figures alive across ${dynasties.size} dynast${
        dynasties.size === 1 ? "y" : "ies"
      } — drag the slider to scrub through history.`,
      // Dedupe by name in case the dataset has duplicate slugs for the same
      // historical person (transliteration variants etc. — surfaced by the
      // first contemporaries audit). Take up to three distinct names.
      meta: [...new Set(alive.map((f) => f.name))].slice(0, 3).join("  ·  "),
    }),
    { ...OG_SIZE }
  );
}
