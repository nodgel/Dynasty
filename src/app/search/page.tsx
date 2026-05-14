import type { Metadata } from "next";
import Image from "next/image";
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
  description: string | null;
  figureCount: bigint;
};

type FigureHit = {
  slug: string;
  name: string;
  nativeName: string | null;
  imageUrl: string | null;
  biography: string | null;
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
    SELECT
      d.slug, d.name, d.region, d.description,
      COUNT(f.id) AS "figureCount"
    FROM "Dynasty" d
    LEFT JOIN "HistoricalFigure" f ON f."dynastyId" = d.id
    WHERE unaccent(d.name) ILIKE unaccent(${`%${q}%`})
    GROUP BY d.id
    ORDER BY d.name ASC
    LIMIT 10
  `;
}

async function searchFigures(q: string): Promise<FigureHit[]> {
  return prisma.$queryRaw<FigureHit[]>`
    SELECT
      f.slug,
      f.name,
      f."nativeName",
      f."imageUrl",
      f.biography,
      f."birthYear",
      f."deathYear",
      d.slug AS "dynastySlug",
      d.name AS "dynastyName"
    FROM "HistoricalFigure" f
    LEFT JOIN "Dynasty" d ON d.id = f."dynastyId"
    WHERE unaccent(f.name) ILIKE unaccent(${`%${q}%`})
    ORDER BY f.name ASC
    LIMIT 30
  `;
}

// Trim the biography to its first sentence (or ~140 chars if no sentence
// boundary appears soon enough) for the result snippet. Strips paragraph
// breaks since we render on a single line.
function snippetOf(bio: string | null): string | null {
  if (!bio) return null;
  const flat = bio.replace(/\s+/g, " ").trim();
  // Find the first sentence end after a reasonable minimum.
  const sentenceEnd = flat.slice(60).search(/[.!?]\s/);
  if (sentenceEnd !== -1 && 60 + sentenceEnd < 220) {
    return flat.slice(0, 60 + sentenceEnd + 1);
  }
  return flat.length > 180 ? `${flat.slice(0, 177).trimEnd()}…` : flat;
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

  const totalHits = dynasties.length + figures.length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Search" }]} />
      <h1 className="font-serif text-3xl text-stone-900">
        {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}
      </h1>

      {/* On-page search input — pre-filled with the current query so users
          can refine without back-button. */}
      <form
        action="/search"
        method="get"
        role="search"
        className="mt-5 max-w-2xl"
      >
        <label htmlFor="search-input" className="sr-only">
          Search dynasties, rulers, and figures
        </label>
        <div className="flex items-stretch rounded-md border border-stone-300 bg-white focus-within:border-stone-500 focus-within:ring-1 focus-within:ring-stone-400 overflow-hidden">
          <input
            id="search-input"
            type="search"
            name="q"
            autoComplete="off"
            defaultValue={query}
            placeholder="Search a dynasty, ruler, or figure…"
            className="flex-1 min-w-0 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 bg-stone-900 text-white text-sm hover:bg-stone-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {query && totalHits > 0 && (
        <p className="mt-4 text-sm text-stone-500">
          {dynasties.length > 0 && (
            <>
              {dynasties.length} {dynasties.length === 1 ? "dynasty" : "dynasties"}
            </>
          )}
          {dynasties.length > 0 && figures.length > 0 && (
            <span className="mx-2 text-stone-300">&middot;</span>
          )}
          {figures.length > 0 && (
            <>
              {figures.length} {figures.length === 1 ? "figure" : "figures"}
            </>
          )}
        </p>
      )}

      {/* Empty state when no query supplied at all. */}
      {!query && (
        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50/60 p-6">
          <p className="text-stone-700">
            Search the index of {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <Link href="/dynasties" className="underline decoration-stone-300 hover:decoration-stone-700">
              every dynasty
            </Link>{" "}
            and every figure in it &mdash; or take a{" "}
            <Link
              href="/random"
              prefetch={false}
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              random walk through history
            </Link>
            .
          </p>
        </div>
      )}

      {/* Empty state when a query was supplied but nothing matched. */}
      {query && totalHits === 0 && (
        <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50/60 p-6">
          <p className="text-stone-700">
            No dynasty or figure name matches &ldquo;{query}&rdquo;. Try a shorter
            query, or browse{" "}
            <Link
              href="/dynasties"
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              the full index
            </Link>{" "}
            instead.
          </p>
          <p className="mt-3 text-sm text-stone-500">
            Tip: we currently match dynasty and figure names, not biography text.
          </p>
        </div>
      )}

      {dynasties.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-stone-900 mb-3">Dynasties</h2>
          <ul className="space-y-3">
            {dynasties.map((d) => (
              <li
                key={d.slug}
                className="rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
              >
                <Link href={`/dynasties/${d.slug}`} className="block group">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-lg text-stone-900 group-hover:text-stone-700">
                      {d.name}
                    </h3>
                    <span className="shrink-0 text-xs text-stone-500">
                      {Number(d.figureCount)}{" "}
                      {Number(d.figureCount) === 1 ? "figure" : "figures"}
                    </span>
                  </div>
                  {d.region && (
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-stone-500">
                      {d.region}
                    </p>
                  )}
                  {d.description && (
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                      {d.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {figures.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif text-xl text-stone-900 mb-3">Figures</h2>
          <ul className="space-y-3">
            {figures.map((f) => {
              const href = f.dynastySlug
                ? `/dynasties/${f.dynastySlug}/${f.slug}`
                : `/figures/${f.slug}`;
              const years = formatYearRange(f.birthYear, f.deathYear);
              const snippet = snippetOf(f.biography);
              return (
                <li
                  key={f.slug}
                  className="rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
                >
                  <Link href={href} className="flex items-start gap-4 group">
                    <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden border border-stone-200 bg-stone-100 relative">
                      {f.imageUrl ? (
                        <Image
                          src={f.imageUrl}
                          alt={f.name}
                          fill
                          sizes="56px"
                          className="object-cover object-top"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-serif text-stone-400">
                          {f.name.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline flex-wrap gap-x-2">
                        <h3 className="font-serif text-base text-stone-900 group-hover:text-stone-700">
                          {f.name}
                        </h3>
                        {f.nativeName && (
                          <span className="font-serif italic text-sm text-stone-500">
                            {f.nativeName}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-stone-500">
                        {years || "?"}
                        {f.dynastyName && (
                          <>
                            <span className="mx-1.5 text-stone-300">&middot;</span>
                            {f.dynastyName}
                          </>
                        )}
                      </p>
                      {snippet && (
                        <p className="mt-1.5 text-sm text-stone-600 line-clamp-2">
                          {snippet}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
