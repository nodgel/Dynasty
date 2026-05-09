import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DynastyForm from "@/components/admin/DynastyForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { updateDynastyAction, deleteDynastyAction } from "@/lib/actions/dynasties";
import { formatYearRange } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function EditDynastyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const dynasty = await prisma.dynasty.findUnique({
    where: { slug },
    include: {
      figures: {
        orderBy: [{ birthYear: "asc" }, { name: "asc" }],
      },
    },
  });
  if (!dynasty) notFound();

  const updateBound = updateDynastyAction.bind(null, dynasty.slug);
  const deleteBound = deleteDynastyAction.bind(null, dynasty.slug);

  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <span className="mx-1.5">/</span>
          <span className="text-stone-700">{dynasty.name}</span>
        </nav>

        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-serif text-2xl text-stone-900">Edit dynasty</h1>
          <Link
            href={`/dynasties/${dynasty.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            View on site ↗
          </Link>
        </div>

        <DynastyForm initial={dynasty} action={updateBound} submitLabel="Save changes" />

        <section className="mt-12 pt-6 border-t border-stone-200">
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-serif text-xl text-stone-900">Figures in this dynasty</h2>
            <Link
              href={`/admin/dynasties/${dynasty.slug}/figures/new`}
              className="text-sm text-stone-700 hover:text-stone-900 underline"
            >
              + New figure
            </Link>
          </div>
          <ul className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
            {dynasty.figures.map((f) => (
              <li key={f.id} className="px-4 py-3 flex items-center justify-between gap-4">
                <Link href={`/admin/figures/${f.slug}`} className="text-stone-900 hover:text-stone-600">
                  {f.name}
                </Link>
                <span className="text-xs text-stone-500">
                  {formatYearRange(f.birthYear, f.deathYear) || "—"}
                </span>
              </li>
            ))}
            {dynasty.figures.length === 0 && (
              <li className="px-4 py-6 text-sm text-stone-500">
                No figures yet.{" "}
                <Link
                  href={`/admin/dynasties/${dynasty.slug}/figures/new`}
                  className="underline"
                >
                  Create one →
                </Link>
              </li>
            )}
          </ul>
        </section>

        <section className="mt-12 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-base text-red-700 mb-2">Danger zone</h2>
          <p className="text-sm text-stone-600 mb-3">
            Deleting this dynasty leaves its figures orphaned (no dynasty), but
            does not delete them. Reassign or delete each figure separately if
            you want them gone.
          </p>
          <DeleteButton
            label="Delete dynasty"
            confirmText={`Delete "${dynasty.name}"?`}
            onConfirm={async () => deleteBound()}
          />
        </section>
      </main>
    </AdminShell>
  );
}
