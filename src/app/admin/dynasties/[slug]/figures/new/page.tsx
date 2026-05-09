import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import FigureForm from "@/components/admin/FigureForm";
import { prisma } from "@/lib/prisma";
import { createFigureAction } from "@/lib/actions/figures";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function NewFigureForDynastyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const [dynasty, dynasties] = await Promise.all([
    prisma.dynasty.findUnique({ where: { slug }, select: { id: true, name: true, slug: true } }),
    prisma.dynasty.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!dynasty) notFound();

  const action = createFigureAction.bind(null, dynasty.id);

  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/admin/dynasties/${dynasty.slug}`} className="hover:underline">{dynasty.name}</Link>
        </nav>
        <h1 className="font-serif text-2xl text-stone-900 mb-6">
          New figure <span className="text-stone-500 text-base">in {dynasty.name}</span>
        </h1>
        <FigureForm
          initial={{ dynastyId: dynasty.id }}
          dynasties={dynasties}
          action={action}
          submitLabel="Create figure"
        />
      </main>
    </AdminShell>
  );
}
