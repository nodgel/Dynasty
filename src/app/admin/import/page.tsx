import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ImportClient from "@/components/admin/ImportClient";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
        </nav>
        <h1 className="font-serif text-2xl text-stone-900">Bulk import</h1>
        <p className="text-sm text-stone-600 mt-2 mb-6 max-w-2xl">
          Paste a JSON array of figures (the AI-historian prompt format). The
          analyzer will compute a diff against the database, flag duplicates
          and invalid rows, list any dynasties that don&apos;t exist yet, and
          show you exactly what will change before you apply. Nothing is
          written until you click Apply on the next screen.
        </p>
        <ImportClient />
      </main>
    </AdminShell>
  );
}
