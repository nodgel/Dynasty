import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import FamilyRelations from "@/components/FamilyRelations";
import RecommendedReading from "@/components/RecommendedReading";
import { getFigureBySlug, listAllFigureSlugs } from "@/lib/queries";
import { formatYear, formatYearRange } from "@/lib/format";
import JsonLd, { personLd } from "@/components/JsonLd";

type Params = { "dynasty-slug": string; "figure-slug": string };

export async function generateStaticParams() {
  const rows = await listAllFigureSlugs();
  return rows
    .filter((r) => r.dynasty?.slug)
    .map((r) => ({
      "dynasty-slug": r.dynasty!.slug,
      "figure-slug": r.slug,
    }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { "figure-slug": figureSlug } = await params;
  const figure = await getFigureBySlug(figureSlug);
  if (!figure) return { title: "Figure not found" };
  const range = formatYearRange(figure.birthYear, figure.deathYear);
  const yrs = range ? ` (${range})` : "";
  const desc =
    figure.biography?.slice(0, 160) ??
    `Biography of ${figure.name}${yrs} — ${figure.dynasty?.name ?? "dynasty"}.`;
  const canonical = figure.dynasty
    ? `/dynasties/${figure.dynasty.slug}/${figure.slug}`
    : `/figures/${figure.slug}`;
  return {
    title: `${figure.name}${yrs}`,
    description: desc,
    alternates: { canonical },
    openGraph: { title: figure.name, description: desc, type: "profile" },
  };
}

export default async function FigurePage(
  { params }: { params: Promise<Params> }
) {
  const { "dynasty-slug": dynastySlug, "figure-slug": figureSlug } = await params;
  const figure = await getFigureBySlug(figureSlug);
  if (!figure) notFound();

  // If the URL's dynasty segment doesn't match the canonical one, send to canonical.
  if (figure.dynasty && figure.dynasty.slug !== dynastySlug) {
    redirect(`/dynasties/${figure.dynasty.slug}/${figure.slug}`);
  }

  const yrs = formatYearRange(figure.birthYear, figure.deathYear) || null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd data={personLd(figure)} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/dynasties", label: "Dynasties" },
          ...(figure.dynasty
            ? [{ href: `/dynasties/${figure.dynasty.slug}`, label: figure.dynasty.name }]
            : []),
          { label: figure.name },
        ]}
      />
      <AdSlot name="figureHeader" label="Figure header banner" size="970×90 leaderboard" className="mb-8" />

      <article>
        <header className="mb-6 flex items-start gap-5">
          {figure.imageUrl && (
            <Image
              src={figure.imageUrl}
              alt={figure.name}
              width={120}
              height={120}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-md object-cover border border-stone-200 shrink-0"
              unoptimized
              priority
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-4xl text-stone-900">{figure.name}</h1>
            {figure.nativeName && (
              <p className="mt-1 font-serif italic text-stone-600 text-lg">{figure.nativeName}</p>
            )}
            {figure.titles.length > 0 && (
              <p className="mt-2 font-serif italic text-stone-600">{figure.titles.join(" · ")}</p>
            )}
            {yrs && (
              <p className="mt-1 text-sm uppercase tracking-wide text-stone-500">{yrs}</p>
            )}
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="biography-heading">
            <h2 id="biography-heading" className="sr-only">Biography</h2>
            {figure.biography ? (
              <div className="prose-bio">
                {figure.biography.split(/\n\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 italic">No biography available.</p>
            )}
            <RecommendedReading />
          </section>

          <aside className="space-y-6">
            <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm">
              <h3 className="font-serif text-base text-stone-900 mb-2">Vital statistics</h3>
              <dl className="space-y-1.5 text-stone-700">
                <div className="flex justify-between gap-3">
                  <dt className="text-stone-500">Born</dt>
                  <dd>{formatYear(figure.birthYear) || "Unknown"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-stone-500">Died</dt>
                  <dd>{formatYear(figure.deathYear) || "Unknown"}</dd>
                </div>
                {(figure.reignStart != null || figure.reignEnd != null) && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone-500">Reign</dt>
                    <dd>{formatYearRange(figure.reignStart, figure.reignEnd) || "—"}</dd>
                  </div>
                )}
                {figure.dynasty && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-stone-500">Dynasty</dt>
                    <dd>{figure.dynasty.name}</dd>
                  </div>
                )}
                {figure.titles.length > 0 && (
                  <div>
                    <dt className="text-stone-500 mb-1">Titles</dt>
                    <dd>
                      <ul className="list-disc list-inside space-y-0.5">
                        {figure.titles.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {figure.dynasty && (
              <FamilyRelations
                dynastySlug={figure.dynasty.slug}
                parents={figure.parents}
                children={figure.children}
                spouses={figure.spouses}
              />
            )}

            <AdSlot name="figureSidebar" label="Bio sidebar" size="300×250 medium rectangle" variant="rectangle" />
          </aside>
        </div>
      </article>
    </main>
  );
}
