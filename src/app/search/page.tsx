import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

type SearchParams = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const [dynasties, figures] = query
    ? await Promise.all([
        prisma.dynasty.findMany({
          where: { name: { contains: query, mode: "insensitive" } },
          take: 10,
          select: { slug: true, name: true, region: true },
        }),
        prisma.historicalFigure.findMany({
          where: { name: { contains: query, mode: "insensitive" } },
          take: 20,
          select: {
            slug: true,
            name: true,
            birthYear: true,
            deathYear: true,
            dynasty: { select: { slug: true, name: true } },
          },
        }),
      ])
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
                {f.dynasty ? (
                  <Link href={`/dynasties/${f.dynasty.slug}/${f.slug}`} className="wiki-link">
                    {f.name}
                  </Link>
                ) : (
                  <span>{f.name}</span>
                )}
                <span className="ml-2 text-xs text-stone-500">
                  {f.birthYear ?? "?"}–{f.deathYear ?? "?"} {f.dynasty ? `· ${f.dynasty.name}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
