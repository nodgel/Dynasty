import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContemporariesView from "@/components/ContemporariesView";
import { listAllFiguresWithDates } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contemporaries — who was alive together",
  description:
    "Pick any year in history and see every royal figure who was alive at that moment, grouped by dynasty.",
  alternates: { canonical: "/contemporaries" },
};

const DEFAULT_YEAR = 1200;

// A few evocative pre-baked years to illustrate the feature on the landing
// page. Each links to the deep page for that year.
const SHOWCASE_YEARS: Array<{ year: number; label: string; blurb: string }> = [
  {
    year: 1066,
    label: "1066",
    blurb: "Norman conquest. William, Harold Godwinson, and the kings of Scotland, France, and the Holy Roman Empire all alive on the same European map.",
  },
  {
    year: 1492,
    label: "1492",
    blurb: "Granada falls, Columbus sails. Ferdinand and Isabella hold Spain; the Aztecs, the Inca, the Ming, and the Ottomans are all reigning.",
  },
  {
    year: 1789,
    label: "1789",
    blurb: "France goes revolutionary. Louis XVI, George III, Catherine the Great, the Qianlong Emperor, and George Washington — same year on Earth.",
  },
];

export default async function ContemporariesLandingPage() {
  const figures = await listAllFiguresWithDates();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contemporaries" }]} />

      <section className="mb-10">
        <h1 className="font-serif text-3xl text-stone-900">
          Who was alive at the same time
        </h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          History rarely teaches us in horizontal slices. We learn the Plantagenets one
          century, the Song the next, the Mongols a chapter later &mdash; and rarely notice that
          Henry II of England, Saladin, and the Jin emperor of north China were all alive in the
          same year. Drag the slider, or pick a year below, and see every dynasty reigning
          somewhere in the world at that moment.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {SHOWCASE_YEARS.map((y) => (
            <li key={y.year}>
              <Link
                href={`/contemporaries/${y.year}`}
                className="group block h-full rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
              >
                <p className="font-serif text-2xl text-stone-900 group-hover:text-stone-700">
                  {y.label}
                </p>
                <p className="mt-2 text-sm text-stone-600">{y.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContemporariesView initialYear={DEFAULT_YEAR} figures={figures} />
    </main>
  );
}
