import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import EventForm from "@/components/admin/EventForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { updateEventAction, deleteEventAction } from "@/lib/actions/events";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function EditEventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const [event, dynasties] = await Promise.all([
    prisma.historicalEvent.findUnique({
      where: { slug },
      include: {
        participants: {
          include: { dynasty: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.dynasty.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, region: true },
    }),
  ]);
  if (!event) notFound();

  const participants = event.participants.map((p) => ({
    id: p.dynasty.id,
    name: p.dynasty.name,
    role: p.role ?? "",
  }));

  const updateBound = updateEventAction.bind(null, event.slug);
  const deleteBound = deleteEventAction.bind(null, event.slug);

  return (
    <AdminShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/admin" className="hover:underline">← Dashboard</Link>
          <span className="mx-1.5">/</span>
          <Link href="/admin/events" className="hover:underline">Events</Link>
          <span className="mx-1.5">/</span>
          <span className="text-stone-700">{event.title}</span>
        </nav>

        <h1 className="font-serif text-2xl text-stone-900 mb-6">Edit event</h1>

        <EventForm
          initial={event}
          participants={participants}
          dynasties={dynasties}
          action={updateBound}
          submitLabel="Save changes"
        />

        <section className="mt-12 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-base text-red-700 mb-2">Danger zone</h2>
          <p className="text-sm text-stone-600 mb-3">
            Deleting this event removes it from every dynasty page it appears
            on. The dynasties themselves are not affected.
          </p>
          <DeleteButton
            label="Delete event"
            confirmText={`Delete "${event.title}"?`}
            onConfirm={deleteBound}
          />
        </section>
      </main>
    </AdminShell>
  );
}
