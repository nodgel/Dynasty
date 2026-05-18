import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynastyCard from "@/components/DynastyCard";
import JsonLd from "@/components/JsonLd";
import { REGIONS, getRegion } from "@/lib/regions";
import { listDynastiesWithCounts } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Params = { slug: string };

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) return { title: "Region not found" };
  return {
    title: `Dynasties of ${region.name}`,
    description: region.description,
    alternates: { canonical: `/dynasties/region/${region.slug}` },
    openGraph: {
      title: `Dynasties of ${region.name}`,
      description: region.description,
      type: "article",
    },
  };
}

export default async function RegionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  const all = await listDynastiesWithCounts();
  const dynasties = all
    .filter((d) => d.regionTags.includes(region.slug))
    .sort((a, b) => (a.foundedYear ?? Number.MAX_SAFE_INTEGER) - (b.foundedYear ?? Number.MAX_SAFE_INTEGER));

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Dynasties of ${region.name}`,
    description: region.description,
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
          { href: "/dynasties/region", label: "By region" },
          { label: region.name },
        ]}
      />
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Dynasties of {region.name}</h1>
        <p className="mt-2 text-stone-600 max-w-2xl">{region.description}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-stone-500">
          {dynasties.length} {dynasties.length === 1 ? "dynasty" : "dynasties"}
        </p>
      </header>

      {region.leadEssay && (
        <section
          aria-labelledby="region-essay-heading"
          className="mb-10 max-w-3xl prose-bio"
        >
          <h2 id="region-essay-heading" className="sr-only">
            About {region.name}
          </h2>
          {region.leadEssay.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {dynasties.length === 0 ? (
        <p className="text-stone-500">No dynasties yet for this region. Check back as the database grows.</p>
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
