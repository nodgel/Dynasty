import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ERAS } from "@/lib/eras";
import { listDynastiesWithEraFallback } from "@/lib/queries";
import { formatYear } from "@/lib/format";

export const metadata: Metadata = {
  title: "Browse dynasties by era",
  description:
    "Explore royal houses by historical period — from ancient antiquity through the modern era.",
  alternates: { canonical: "/dynasties/era" },
};

export default async function ErasIndexPage() {
  const dynasties = await listDynastiesWithEraFallback();
  const counts = new Map<string, number>();
  for (const d of dynasties) {
    for (const tag of d.eraTags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/dynasties", label: "Dynasties" },
          { label: "By era" },
        ]}
      />
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Browse by era</h1>
        <p className="mt-2 text-stone-600 max-w-2xl">
          Royal houses grouped by the era they ruled in. Long-lived dynasties
          appear in every era they touched.
        </p>
      </header>

      <ol className="space-y-3">
        {ERAS.map((era) => {
          const n = counts.get(era.slug) ?? 0;
          return (
            <li key={era.slug} className="rounded-md border border-stone-200 bg-white p-5">
              <h2 className="font-serif text-xl text-stone-900">
                <Link href={`/dynasties/era/${era.slug}`} className="hover:text-stone-600">
                  {era.name}
                </Link>
                <span className="ml-3 text-xs text-stone-500 font-sans">
                  {formatYear(era.startYear)} – {formatYear(era.endYear)} · {n} {n === 1 ? "dynasty" : "dynasties"}
                </span>
              </h2>
              <p className="mt-1 text-sm text-stone-600">{era.description}</p>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
