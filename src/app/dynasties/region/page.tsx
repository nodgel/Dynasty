import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { REGIONS } from "@/lib/regions";
import { listDynastiesWithCounts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Browse dynasties by region",
  description:
    "Royal houses and ruling dynasties of Europe, Asia, Africa, and the Americas, organized by geography.",
  alternates: { canonical: "/dynasties/region" },
};

export default async function RegionsIndexPage() {
  const dynasties = await listDynastiesWithCounts();
  const counts = new Map<string, number>();
  for (const d of dynasties) {
    for (const tag of d.regionTags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  // Top-level regions render as bigger cards with their sub-regions nested.
  const topLevel = REGIONS.filter((r) => !r.parents);
  const childrenOf = (slug: string) =>
    REGIONS.filter((r) => r.parents?.includes(slug as never));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/dynasties", label: "Dynasties" },
          { label: "By region" },
        ]}
      />
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Browse by region</h1>
        <p className="mt-2 text-stone-600 max-w-2xl">
          Every dynasty in Dynastica, grouped by where they ruled. Click any
          region to see its royal houses, or jump straight to a sub-region.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {topLevel.map((region) => {
          const subs = childrenOf(region.slug);
          const n = counts.get(region.slug) ?? 0;
          return (
            <article
              key={region.slug}
              className="rounded-md border border-stone-200 bg-white p-5"
            >
              <h2 className="font-serif text-xl text-stone-900">
                <Link href={`/dynasties/region/${region.slug}`} className="hover:text-stone-600">
                  {region.name}
                </Link>
                <span className="ml-2 text-xs text-stone-500 font-sans">
                  {n} {n === 1 ? "dynasty" : "dynasties"}
                </span>
              </h2>
              <p className="mt-1 text-sm text-stone-600">{region.description}</p>
              {subs.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                  {subs.map((sub) => {
                    const subN = counts.get(sub.slug) ?? 0;
                    if (subN === 0) return null;
                    return (
                      <li key={sub.slug}>
                        <Link href={`/dynasties/region/${sub.slug}`} className="wiki-link">
                          {sub.name}
                        </Link>
                        <span className="text-xs text-stone-400 ml-1">({subN})</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
