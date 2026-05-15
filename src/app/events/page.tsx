import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import { listAllEvents } from "@/lib/queries";
import { formatYearRange } from "@/lib/format";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Historical events that tied dynasties together — battles, treaties, marriages, successions, conquests. Every event lists the figures and houses that participated.",
  alternates: { canonical: "/events" },
};

const KIND_LABEL: Record<string, string> = {
  CONFLICT: "Conflict",
  ALLIANCE: "Alliance",
  MARRIAGE: "Marriage",
  SUCCESSION: "Succession",
  OTHER: "Other",
};

export default async function EventsIndexPage() {
  const events = await listAllEvents();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Events" }]} />
      <AdSlot
        name="eventsIndexHeader"
        label="Events index banner"
        size="970×90 leaderboard"
        className="mb-8"
      />

      <header className="mb-8">
        <h1 className="font-serif text-3xl text-stone-900">Events</h1>
        <p className="mt-2 text-stone-600 max-w-2xl">
          Every event &mdash; battle, treaty, marriage, succession crisis &mdash; that tied
          dynasties together. Each one lists the figures and houses who participated and is a
          natural starting point for walking the family tree sideways across the realms.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-stone-500">No events catalogued yet.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => {
            const span = formatYearRange(e.year, e.endYear) ?? "—";
            return (
              <li key={e.id}>
                <Link
                  href={`/events/${e.slug}`}
                  className="group block rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h2 className="font-serif text-lg text-stone-900 group-hover:text-stone-700">
                      {e.title}
                    </h2>
                    <div className="text-xs uppercase tracking-wide text-stone-500 whitespace-nowrap">
                      {span}
                      <span className="mx-2 text-stone-300">&middot;</span>
                      {KIND_LABEL[e.kind] ?? e.kind}
                    </div>
                  </div>
                  {e.description && (
                    <p className="mt-2 text-sm text-stone-600 line-clamp-2">{e.description}</p>
                  )}
                  <p className="mt-3 text-xs text-stone-500">
                    {e.dynastyCount} {e.dynastyCount === 1 ? "dynasty" : "dynasties"}
                    {" · "}
                    {e.figureCount} {e.figureCount === 1 ? "figure" : "figures"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
