import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import DynastyForm from "@/components/admin/DynastyForm";
import { createDynastyAction } from "@/lib/actions/dynasties";

export const dynamic = "force-dynamic";

export default function NewDynastyPage() {
  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">
            ← Dashboard
          </Link>
        </nav>
        <h1 className="font-serif text-2xl text-stone-900 mb-6">New dynasty</h1>
        <DynastyForm action={createDynastyAction} submitLabel="Create dynasty" />
      </main>
    </AdminShell>
  );
}
