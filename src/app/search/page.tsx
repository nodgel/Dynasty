import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { formatYearRange } from "@/lib/format";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

type SearchParams = { q?: string };

type DynastyHit = {
  slug: string;
  name: string;
  region: string | null;
};

type FigureHit = {
  slug: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  dynastySlug: string | null;
  dynastyName: string | null;
};

// Search uses Postgres' unaccent() so "suleyman" matches "Süleyman", "zofia"
// matches "Žofia", etc. Prisma's high-level findMany doesn't expose unaccent,
// so we drop to $queryRaw with parameterized template literals (still safe
// from SQL injection — Prisma escapes interpolated values).
async function searchDynasties(q: string): Promise<DynastyHit[]> {
  return prisma.$queryRaw<DynastyHit[]>`
    SELECT slug, name, region
    FROM "Dynasty"
    WHERE unaccent(name) ILIKE unaccent(${`%${q}%`})
    ORDER BY name ASC
    LIMIT 10
  `;
}

async function searchFigures(q: string): Promise<FigureHit[]> {
  return prisma.$queryRaw<FigureHit[]>`
    SELECT
      f.slug,
      f.name,
      f."birthYear",
      f."deathYear",
      d.slug AS "dynastySlug",
      d.name AS "dynastyName"
    FROM "HistoricalFigure" f
    LEFT JOIN "Dynasty" d ON d.id = f."dynastyId"
    WHERE unaccent(f.name) ILIKE unaccent(${`%${q}%`})
    ORDER BY f.name ASC
    LIMIT 20
  `;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [dynasties, figures]: [DynastyHit[], FigureHit[]] = query
    ? await Promise.all([searchDynasties(query), searchFigures(query)])
    : [[], []];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Search" }]} />
      <h1 className="font-serif text-3xl text-stone-900">
        {query ? <>Results for “{query}”</> : "Search"}
      </h1>

      {!query && (
        <p className="mt-3 text-stone-600">Use the search field in the header to find dynasties or figures.</p>
      )}

      {query && dynasties.length === 0 && figures.length === 0 && (
        <p className="mt-4 text-stone-500">No matches.</p>
      )}

      {dynasties.length > 0 && (
        <section className="mt-6">
          <h2 className="font-serif text-xl text-stone-900 mb-2">Dynasties</h2>
          <ul className="space-y-1.5">
            {dynasties.map((d) => (
              <li key={d.slug}>
                <Link href={`/dynasties/${d.slug}`} className="wiki-link">
                  {d.name}
                </Link>
                {d.region && <span className="ml-2 text-xs text-stone-500">{d.region}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {figures.length > 0 && (
        <section className="mt-6">
          <h2 className="font-serif text-xl text-stone-900 mb-2">Figures</h2>
          <ul className="space-y-1.5">
            {figures.map((f) => (
              <li key={f.slug}>
                {f.dynastySlug ? (
                  <Link href={`/dynasties/${f.dynastySlug}/${f.slug}`} className="wiki-link">
                    {f.name}
                  </Link>
                ) : (
                  <span>{f.name}</span>
                )}
                <span className="ml-2 text-xs text-stone-500">
                  {formatYearRange(f.birthYear, f.deathYear) || "?"} {f.dynastyName ? `· ${f.dynastyName}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
