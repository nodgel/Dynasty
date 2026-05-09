import Link from "next/link";
import { listDynasties } from "@/lib/queries";
import AdSlot from "@/components/AdSlot";
import DynastyCard from "@/components/DynastyCard";

export default async function Home() {
  const dynasties = await listDynasties();
  const featured = dynasties.slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <AdSlot label="Header banner" size="970×90 leaderboard" className="mb-10" />

      <section className="text-center max-w-2xl mx-auto py-8">
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight text-stone-900">
          A genealogy of history's ruling houses
        </h1>
        <p className="mt-4 text-stone-600 leading-relaxed">
          Dynastica maps the bloodlines, marriages, and successions of the dynasties that shaped
          civilizations. Browse interactive family trees and read concise, sourced biographies of
          the figures behind them.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dynasties"
            className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
          >
            Browse dynasties
          </Link>
        </div>
      </section>

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
    </main>
  );
}
