import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynastyCard from "@/components/DynastyCard";
import AdSlot from "@/components/AdSlot";
import { listDynasties } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Dynasties",
  description:
    "Browse historical dynasties indexed in Dynastica, from medieval royal houses to ancient ruling families.",
  alternates: { canonical: "/dynasties" },
};

export default async function DynastiesIndexPage() {
  const dynasties = await listDynasties();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Dynasties" }]} />
      <AdSlot name="dynastiesIndexHeader" label="Index header banner" size="970×90 leaderboard" className="mb-8" />

      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Dynasties</h1>
        <p className="mt-2 text-stone-600 max-w-2xl">
          Every ruling house catalogued in Dynastica. Click into a dynasty to see its full lineage
          and the figures who defined it.
        </p>
        <nav aria-label="Browse" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/dynasties/region" className="wiki-link">
            Browse by region →
          </Link>
          <Link href="/dynasties/era" className="wiki-link">
            Browse by era →
          </Link>
        </nav>
      </header>

      {dynasties.length === 0 ? (
        <p className="text-stone-500">No dynasties have been added yet.</p>
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
