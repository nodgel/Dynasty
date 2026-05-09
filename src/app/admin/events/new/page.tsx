import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";
import { prisma } from "@/lib/prisma";
import { createEventAction } from "@/lib/actions/events";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const dynasties = await prisma.dynasty.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, region: true },
  });

  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <span className="mx-1.5">/</span>
          <Link href="/admin/events" className="hover:underline">Events</Link>
        </nav>
        <h1 className="font-serif text-2xl text-stone-900 mb-6">New event</h1>
        <EventForm dynasties={dynasties} action={createEventAction} submitLabel="Create event" />
      </main>
    </AdminShell>
  );
}
