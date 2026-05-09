import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import FamilyTreeViewer from "@/components/FamilyTreeViewer";
import PremiumExportButton from "@/components/PremiumExportButton";
import { getDynastyBySlug, getDynastyTree, listAllDynastySlugs } from "@/lib/queries";

type Params = { "dynasty-slug": string };

export async function generateStaticParams() {
  const rows = await listAllDynastySlugs();
  return rows.map((d) => ({ "dynasty-slug": d.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { "dynasty-slug": slug } = await params;
  const dynasty = await getDynastyBySlug(slug);
  if (!dynasty) return { title: "Dynasty not found" };
  const desc =
    dynasty.description?.slice(0, 160) ??
    `The ${dynasty.name} dynasty — lineage, figures, and history.`;
  return {
    title: dynasty.name,
    description: desc,
    alternates: { canonical: `/dynasties/${dynasty.slug}` },
    openGraph: { title: dynasty.name, description: desc, type: "article" },
  };
}

export default async function DynastyOverviewPage(
  { params }: { params: Promise<Params> }
) {
  const { "dynasty-slug": slug } = await params;
  const dynasty = await getDynastyBySlug(slug);
  if (!dynasty) notFound();

  const tree = await getDynastyTree(dynasty.id);

  const span =
    dynasty.foundedYear && dynasty.endedYear
      ? `${dynasty.foundedYear} – ${dynasty.endedYear}`
      : dynasty.foundedYear
      ? `from ${dynasty.foundedYear}`
      : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/dynasties", label: "Dynasties" },
          { label: dynasty.name },
        ]}
      />
      <AdSlot label="Dynasty header banner" size="970×90 leaderboard" className="mb-8" />

      <article>
        <header className="mb-8">
          <h1 className="font-serif text-4xl text-stone-900">{dynasty.name}</h1>
          {(dynasty.region || span) && (
            <p className="mt-2 text-sm uppercase tracking-wide text-stone-500">
              {[dynasty.region, span].filter(Boolean).join(" · ")}
            </p>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {dynasty.description && (
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="font-serif text-2xl text-stone-900 mb-3">
                  Overview
                </h2>
                <p className="prose-bio">{dynasty.description}</p>
              </section>
            )}

            <section aria-labelledby="lineage-heading" className="mt-10">
              <div className="flex items-baseline justify-between mb-3">
                <h2 id="lineage-heading" className="font-serif text-2xl text-stone-900">
                  Lineage
                </h2>
                <span className="text-xs text-stone-500">{dynasty.figures.length} figures</span>
              </div>
              <FamilyTreeViewer dynastySlug={dynasty.slug} roots={tree} />
              <PremiumExportButton />
            </section>

            <section aria-labelledby="figures-heading" className="mt-10">
              <h2 id="figures-heading" className="font-serif text-2xl text-stone-900 mb-3">
                All figures
              </h2>
              <ul className="divide-y divide-stone-200 border-y border-stone-200">
                {dynasty.figures.map((f) => (
                  <li key={f.id} className="py-3 flex items-baseline justify-between gap-4">
                    <Link
                      href={`/dynasties/${dynasty.slug}/${f.slug}`}
                      className="font-serif text-stone-900 hover:text-stone-600"
                    >
                      {f.name}
                    </Link>
                    <span className="text-xs text-stone-500 whitespace-nowrap">
                      {f.birthYear ?? "?"} – {f.deathYear ?? "?"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <AdSlot label="Sidebar 1" size="300×250 medium rectangle" variant="rectangle" />
            <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm">
              <h3 className="font-serif text-base text-stone-900 mb-2">Quick facts</h3>
              <dl className="space-y-1.5 text-stone-700">
                {dynasty.region && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone-500">Region</dt>
                    <dd>{dynasty.region}</dd>
                  </div>
                )}
                {span && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone-500">Span</dt>
                    <dd>{span}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-stone-500">Figures</dt>
                  <dd>{dynasty.figures.length}</dd>
                </div>
              </dl>
            </div>
            <AdSlot label="Sidebar 2" size="300×600 half page" variant="rectangle" className="min-h-[400px]" />
          </aside>
        </div>
      </article>
    </main>
  );
}
