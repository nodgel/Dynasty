import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import FigureForm from "@/components/admin/FigureForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { updateFigureAction, deleteFigureAction } from "@/lib/actions/figures";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function EditFigurePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const figure = await prisma.historicalFigure.findUnique({
    where: { slug },
    include: {
      dynasty: { select: { slug: true, name: true, id: true } },
      parentLinks: {
        include: { parent: { select: { id: true, name: true, birthYear: true, deathYear: true } } },
      },
      childLinks: {
        include: { child: { select: { id: true, name: true, birthYear: true, deathYear: true } } },
      },
      spouseLinksA: {
        include: { b: { select: { id: true, name: true, birthYear: true, deathYear: true } } },
      },
      spouseLinksB: {
        include: { a: { select: { id: true, name: true, birthYear: true, deathYear: true } } },
      },
    },
  });
  if (!figure) notFound();

  const dynasties = await prisma.dynasty.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const parents = figure.parentLinks.map((l) => l.parent);
  const childrenLinks = figure.childLinks.map((l) => l.child);
  const spouses = [
    ...figure.spouseLinksA.map((l) => l.b),
    ...figure.spouseLinksB.map((l) => l.a),
  ];

  const updateBound = updateFigureAction.bind(null, figure.slug);
  const deleteBound = deleteFigureAction.bind(null, figure.slug);

  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          {figure.dynasty && (
            <>
              <span className="mx-1.5">/</span>
              <Link href={`/admin/dynasties/${figure.dynasty.slug}`} className="hover:underline">
                {figure.dynasty.name}
              </Link>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-stone-700">{figure.name}</span>
        </nav>

        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-serif text-2xl text-stone-900">Edit figure</h1>
          {figure.dynasty && (
            <Link
              href={`/dynasties/${figure.dynasty.slug}/${figure.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-stone-500 hover:text-stone-900"
            >
              View on site ↗
            </Link>
          )}
        </div>

        <FigureForm
          initial={{ ...figure, id: figure.id }}
          parents={parents}
          childrenLinks={childrenLinks}
          spouses={spouses}
          dynasties={dynasties}
          action={updateBound}
          submitLabel="Save changes"
        />

        <section className="mt-12 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-base text-red-700 mb-2">Danger zone</h2>
          <p className="text-sm text-stone-600 mb-3">
            Deleting this figure removes their biography and all family-relation
            links involving them. This cannot be undone.
          </p>
          <DeleteButton
            label="Delete figure"
            confirmText={`Delete "${figure.name}"?`}
            onConfirm={deleteBound}
          />
        </section>
      </main>
    </AdminShell>
  );
}
