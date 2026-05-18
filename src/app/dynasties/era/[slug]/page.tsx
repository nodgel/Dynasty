import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynastyCard from "@/components/DynastyCard";
import JsonLd from "@/components/JsonLd";
import { ERAS, getEra } from "@/lib/eras";
import { listDynastiesWithEraFallback } from "@/lib/queries";
import { formatYear } from "@/lib/format";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Params = { slug: string };

export async function generateStaticParams() {
  return ERAS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const era = getEra(slug);
  if (!era) return { title: "Era not found" };
  const span = `${formatYear(era.startYear)}–${formatYear(era.endYear)}`;
  return {
    title: `${era.name} dynasties (${span})`,
    description: era.description,
    alternates: { canonical: `/dynasties/era/${era.slug}` },
    openGraph: {
      title: `${era.name} dynasties (${span})`,
      description: era.description,
      type: "article",
    },
  };
}

export default async function EraPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const era = getEra(slug);
  if (!era) notFound();

  const all = await listDynastiesWithEraFallback();
  const dynasties = all
    .filter((d) => d.eraTags.includes(era.slug))
    .sort((a, b) => (a.foundedYear ?? Number.MAX_SAFE_INTEGER) - (b.foundedYear ?? Number.MAX_SAFE_INTEGER));

  const span = `${formatYear(era.startYear)}–${formatYear(era.endYear)}`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${era.name} dynasties`,
    description: era.description,
    numberOfItems: dynasties.length,
    itemListElement: dynasties.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/dynasties/${d.slug}`,
      name: d.name,
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={itemListLd} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/dynasties", label: "Dynasties" },
          { href: "/dynasties/era", label: "By era" },
          { label: era.name },
        ]}
      />
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">
          {era.name} dynasties <span className="text-stone-400 text-2xl font-normal">({span})</span>
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl">{era.description}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-stone-500">
          {dynasties.length} {dynasties.length === 1 ? "dynasty" : "dynasties"}
        </p>
      </header>

      {era.leadEssay && (
        <section
          aria-labelledby="era-essay-heading"
          className="mb-10 max-w-3xl prose-bio"
        >
          <h2 id="era-essay-heading" className="sr-only">
            About the {era.name} era
          </h2>
          {era.leadEssay.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {dynasties.length === 0 ? (
        <p className="text-stone-500">No dynasties yet in this era.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dynasties.map((d) => (
            <DynastyCard key={d.id} {...d} />
          ))}
        </div>
      )}
    </main>
  );
}
