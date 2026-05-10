import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContemporariesView from "@/components/ContemporariesView";
import JsonLd from "@/components/JsonLd";
import { listAllFiguresWithDates } from "@/lib/queries";
import { formatYear } from "@/lib/format";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Params = { year: string };

// Pre-render round years from -1000 (BC) through 2000 every 100 years; 50-year
// intervals from 0 to 1900 and every 25 years from 1500-1900 to give the
// historically dense periods more SEO coverage. Other years still resolve
// dynamically (Next App Router's default dynamicParams = true).
function roundYears(): number[] {
  const out = new Set<number>();
  for (let y = -1000; y <= -100; y += 100) out.add(y);
  for (let y = 0; y <= 2000; y += 50) out.add(y);
  for (let y = 1500; y <= 1900; y += 25) out.add(y);
  return [...out].sort((a, b) => a - b);
}

export async function generateStaticParams(): Promise<Params[]> {
  return roundYears().map((y) => ({ year: String(y) }));
}

function parseYear(raw: string): number | null {
  // Allow negative for BC and the special "0" (just for sake of completeness).
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n < -10000 || n > 3000) return null;
  return Math.trunc(n);
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { year: raw } = await params;
  const year = parseYear(raw);
  if (year == null) return { title: "Contemporaries" };
  return {
    title: `Who was alive in ${formatYear(year)}?`,
    description: `Royal houses and historical figures alive in the year ${formatYear(year)} — explore the world's contemporaries across dynasties.`,
    alternates: { canonical: `/contemporaries/${year}` },
    openGraph: {
      title: `The world in ${formatYear(year)}`,
      description: `Figures and ruling houses alive in ${formatYear(year)}.`,
      type: "article",
    },
  };
}

export default async function ContemporariesYearPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year: raw } = await params;
  const year = parseYear(raw) ?? 1200;
  const figures = await listAllFiguresWithDates();

  // Initial server-rendered list (SEO + no-JS): the same filter the client
  // will run, so the static HTML already contains the right answer for
  // crawlers and visitors before hydration.
  const aliveCount = figures.filter((f) => year >= f.birthYear && year <= f.deathYear).length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `The world in ${formatYear(year)}`,
          description: `Royal houses and figures alive in ${formatYear(year)}`,
          url: `${SITE_URL}/contemporaries/${year}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: aliveCount,
          },
        }}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/contemporaries", label: "Contemporaries" },
          { label: formatYear(year) },
        ]}
      />
      <ContemporariesView initialYear={year} figures={figures} />
    </main>
  );
}
