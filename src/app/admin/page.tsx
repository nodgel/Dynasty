import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [dynasties, recentFigures, counts] = await Promise.all([
    prisma.dynasty.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { figures: true } } },
    }),
    prisma.historicalFigure.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { dynasty: { select: { slug: true, name: true } } },
    }),
    prisma.$transaction([
      prisma.dynasty.count(),
      prisma.historicalFigure.count(),
      prisma.parentChild.count(),
      prisma.spouse.count(),
      prisma.historicalEvent.count(),
    ]),
  ]);
  const [dCount, fCount, pcCount, sCount, eCount] = counts;

  return (
    <AdminShell>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-2xl text-stone-900">Dashboard</h1>

        <section className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            ["Dynasties", dCount],
            ["Figures", fCount],
            ["Events", eCount],
            ["Parent links", pcCount],
            ["Spouse pairs", sCount],
          ].map(([label, n]) => (
            <div key={label as string} className="rounded-md border border-stone-200 bg-white p-4">
              <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
              <div className="font-serif text-2xl text-stone-900 mt-1">{n}</div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif text-xl text-stone-900">Dynasties</h2>
            <Link href="/admin/dynasties/new" className="text-sm text-stone-700 hover:text-stone-900 underline">
              + New dynasty
            </Link>
          </div>
          <ul className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {dynasties.map((d) => (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <Link href={`/admin/dynasties/${d.slug}`} className="font-serif text-stone-900 hover:text-stone-600">
                  {d.name}
                </Link>
                <span className="text-xs text-stone-500">
                  {d._count.figures} {d._count.figures === 1 ? "figure" : "figures"}
                </span>
              </li>
            ))}
            {dynasties.length === 0 && (
              <li className="px-4 py-6 text-stone-500 text-sm">
                No dynasties yet. <Link href="/admin/dynasties/new" className="underline">Create the first one →</Link>
              </li>
            )}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-serif text-xl text-stone-900 mb-3">Recently updated figures</h2>
          <ul className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {recentFigures.map((f) => (
              <li key={f.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <Link href={`/admin/figures/${f.slug}`} className="text-stone-900 hover:text-stone-600">
                  {f.name}
                </Link>
                <span className="text-xs text-stone-500">
                  {f.dynasty?.name ?? "—"} · {new Date(f.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
            {recentFigures.length === 0 && (
              <li className="px-4 py-6 text-stone-500 text-sm">No figures yet.</li>
            )}
          </ul>
        </section>
      </main>
    </AdminShell>
  );
}
