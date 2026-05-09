import { notFound, permanentRedirect } from "next/navigation";
import { getFigureBySlug, listAllFigureSlugs } from "@/lib/queries";

type Params = { "figure-slug": string };

export async function generateStaticParams() {
  const rows = await listAllFigureSlugs();
  return rows.map((r) => ({ "figure-slug": r.slug }));
}

// Flat /figures/[slug] URLs always redirect to the canonical
// /dynasties/[dynasty-slug]/[figure-slug] route — see Phase 2 spec resolution.
export default async function FigureRedirect(
  { params }: { params: Promise<Params> }
) {
  const { "figure-slug": slug } = await params;
  const figure = await getFigureBySlug(slug);
  if (!figure) notFound();
  if (!figure.dynasty) {
    // Shouldn't happen with current seed data, but render minimal info if it does.
    notFound();
  }
  permanentRedirect(`/dynasties/${figure.dynasty.slug}/${figure.slug}`);
}
