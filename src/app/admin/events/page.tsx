import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { formatYear } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminEventsList() {
  const events = await prisma.historicalEvent.findMany({
    orderBy: [{ year: "asc" }, { title: "asc" }],
    include: {
      participants: {
        include: { dynasty: { select: { name: true, slug: true } } },
      },
    },
  });

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
        </nav>
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-serif text-2xl text-stone-900">Events</h1>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-700"
          >
            + New event
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-stone-500">
            No events yet. <Link href="/admin/events/new" className="underline">Create the first one →</Link>
          </p>
        ) : (
          <ul className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {events.map((e) => (
              <li key={e.id} className="px-4 py-3 flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/admin/events/${e.slug}`}
                    className="font-serif text-stone-900 hover:text-stone-600"
                  >
                    {e.title}
                  </Link>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {e.year != null && (
                      <>
                        {formatYear(e.year)}
                        {e.endYear != null && e.endYear !== e.year && ` – ${formatYear(e.endYear)}`}
                        {" · "}
                      </>
                    )}
                    {e.kind.toLowerCase()}
                    {e.participants.length > 0 && (
                      <>
                        {" · "}
                        {e.participants.map((p) => p.dynasty.name).join(", ")}
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AdminShell>
  );
}
