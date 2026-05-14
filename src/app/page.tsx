import Link from "next/link";
import { listDynasties, listRecentDynasties, listFiguresBySlugs, getSiteStats } from "@/lib/queries";
import AdSlot from "@/components/AdSlot";
import DynastyCard from "@/components/DynastyCard";
import Spotlight from "@/components/Spotlight";
import BridgeGraphic from "@/components/BridgeGraphic";

// Curated featured dynasties — deliberate picks of marquee houses, not the
// alphabetical-first three. Order is the display order. If a slug isn't in
// the DB it's silently skipped, so the page never errors when content rolls
// over.
const FEATURED_SLUGS = ["plantagenet", "austrian-habsburgs", "bagrationi"];

// Curated portraits for the homepage spotlight strip. Order is display order.
// Each figure must already have an imageUrl on file; ones that don't are
// silently dropped by listFiguresBySlugs.
const SPOTLIGHT_SLUGS = [
  "eleanor-of-aquitaine",
  "henry-viii-england",
  "elizabeth-i-england",
  "charles-v",
  "maria-theresa",
  "mary-queen-of-scots",
  "franz-joseph-i",
];

// Showcase paths for the "Follow the bloodlines" section — figures whose
// pages already cross dynasties via parent or spouse edges. Each entry points
// at a single figure page; the visitor experiences the bridge by hovering
// the relations sidebar.
const BLOODLINES: Array<{
  href: string;
  label: string;
  blurb: string;
}> = [
  {
    href: "/dynasties/austrian-habsburgs/philip-the-handsome",
    label: "Philip the Handsome",
    blurb:
      "Father of two cousin emperors: Charles V of Spain and Ferdinand I of Austria. The fork of the Habsburg empire.",
  },
  {
    href: "/dynasties/tudor/margaret-tudor",
    label: "Margaret Tudor",
    blurb:
      "Daughter of Henry VII, married to James IV of Scotland — her great-grandson united the English and Scottish crowns.",
  },
  {
    href: "/dynasties/plantagenet/isabella-of-france",
    label: "Isabella of France",
    blurb:
      "Daughter of Philip IV of France, wife of Edward II of England. Through her, the English king claimed the French throne — and the Hundred Years' War followed.",
  },
];

const DISCOVERY: Array<{ href: string; label: string; blurb: string }> = [
  {
    href: "/dynasties/region",
    label: "By region",
    blurb: "Europe, Asia, Africa — 21 regions covering every inhabited continent.",
  },
  {
    href: "/dynasties/era",
    label: "By era",
    blurb: "From the bronze age to the twentieth century, in eight broad periods.",
  },
  {
    href: "/contemporaries",
    label: "By year",
    blurb: "Pick any year and see every dynasty reigning at that moment.",
  },
];

export default async function Home() {
  const [allDynasties, recent, spotlight, stats] = await Promise.all([
    listDynasties(),
    listRecentDynasties(4),
    listFiguresBySlugs(SPOTLIGHT_SLUGS),
    getSiteStats(),
  ]);

  // Round the year span down to the nearest 500 so we don't show a brittle
  // figure like "3,468 years" that ticks unhelpfully every time a new
  // dynasty is added.
  const yearsLabel = stats.yearSpan != null
    ? `${Math.floor(stats.yearSpan / 500) * 500}+ years of history`
    : null;

  // Resolve featured slugs against the live DB, preserving curator order.
  const bySlug = new Map(allDynasties.map((d) => [d.slug, d]));
  const featured = FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d)
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <AdSlot name="homeHeader" label="Header banner" size="970×90 leaderboard" className="mb-10" />

      <section className="text-center max-w-2xl mx-auto py-8">
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-stone-900">
          The web of history&rsquo;s ruling houses
        </h1>
        <p className="mt-5 text-stone-600 leading-relaxed">
          Royal marriages don&rsquo;t respect dynasties. Dynastica maps the bloodlines, marriages,
          and successions of the houses that shaped civilizations &mdash; and the figures who
          connect them across centuries and borders.
        </p>
        <p className="mt-5 text-sm uppercase tracking-[0.18em] text-stone-500">
          {stats.dynastyCount} dynasties
          <span className="mx-2 text-stone-300">&middot;</span>
          {stats.figureCount} figures
          {yearsLabel && (
            <>
              <span className="mx-2 text-stone-300">&middot;</span>
              {yearsLabel}
            </>
          )}
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Link
            href="/dynasties"
            className="inline-flex items-center rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white hover:bg-stone-700"
          >
            Explore the dynasties &rarr;
          </Link>
        </div>
      </section>

      <Spotlight figures={spotlight} />

      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="mt-12">
          <h2 id="featured-heading" className="font-serif text-2xl text-stone-900 mb-4">
            Featured dynasties
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DynastyCard key={d.id} {...d} />
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="discovery-heading" className="mt-14">
        <h2 id="discovery-heading" className="font-serif text-2xl text-stone-900 mb-4">
          Find your way in
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {DISCOVERY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block rounded-lg border border-stone-200 bg-stone-50/60 p-5 transition hover:border-stone-400 hover:bg-stone-50"
            >
              <h3 className="font-serif text-lg text-stone-900 group-hover:text-stone-700">
                {item.label}
              </h3>
              <p className="mt-2 text-sm text-stone-600">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="bloodlines-heading"
        className="mt-14 rounded-lg border border-stone-200 bg-stone-50/60 p-6 sm:p-8"
      >
        <div className="max-w-2xl">
          <h2
            id="bloodlines-heading"
            className="font-serif text-2xl text-stone-900"
          >
            Follow the bloodlines
          </h2>
          <p className="mt-2 text-stone-600">
            A queen who married into one house was born in another, and her children inherit the
            claims of both. Eleanor of Aquitaine wore the crowns of France and England within
            fifteen years. Her grandson was Saint Louis; her great-grandson was King John.
          </p>
        </div>

        <div className="mt-7 mb-2 max-w-3xl mx-auto">
          <BridgeGraphic
            leftDynasty="Plantagenet"
            rightDynasty="Capetian"
            bridgeName="Eleanor of Aquitaine"
            bridgeYears="1122 – 1204"
            href="/dynasties/plantagenet/eleanor-of-aquitaine"
          />
        </div>

        <p className="mt-6 mb-1 text-center text-xs uppercase tracking-wider text-stone-500">
          More figures who crossed dynasties
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {BLOODLINES.map((b) => (
            <li key={b.href}>
              <Link
                href={b.href}
                className="group block h-full rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
              >
                <p className="font-serif text-base text-stone-900 group-hover:text-stone-700">
                  {b.label}
                </p>
                <p className="mt-2 text-sm text-stone-600">{b.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="mt-14">
          <div className="flex items-baseline justify-between mb-4">
            <h2 id="recent-heading" className="font-serif text-2xl text-stone-900">
              Recently added
            </h2>
            <Link
              href="/dynasties"
              className="text-sm text-stone-500 hover:text-stone-800 hover:underline"
            >
              See all {allDynasties.length} →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((d) => (
              <DynastyCard key={d.id} {...d} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
