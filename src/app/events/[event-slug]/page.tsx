import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import { getEventBySlug, listAllEventSlugs } from "@/lib/queries";
import { formatYearRange } from "@/lib/format";

type Params = { "event-slug": string };

export async function generateStaticParams() {
  const rows = await listAllEventSlugs();
  return rows.map((r) => ({ "event-slug": r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { "event-slug": slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  const span = formatYearRange(event.year, event.endYear);
  const title = span ? `${event.title} (${span})` : event.title;
  const desc =
    event.description?.slice(0, 160) ??
    `Historical event ${event.title}${span ? ` (${span})` : ""}.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: { title, description: desc, type: "article" },
  };
}

const KIND_LABEL: Record<string, string> = {
  CONFLICT: "Conflict",
  ALLIANCE: "Alliance",
  MARRIAGE: "Marriage",
  SUCCESSION: "Succession",
  OTHER: "Event",
};

export default async function EventPage(
  { params }: { params: Promise<Params> }
) {
  const { "event-slug": slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const span = formatYearRange(event.year, event.endYear);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/events", label: "Events" },
          { label: event.title },
        ]}
      />
      <AdSlot
        name="eventHeader"
        label="Event banner"
        size="970×90 leaderboard"
        className="mb-8"
      />

      <article>
        <header className="mb-6">
          <p className="text-xs uppercase tracking-widest text-stone-500">
            {KIND_LABEL[event.kind] ?? event.kind}
            {span && (
              <>
                <span className="mx-2 text-stone-300">&middot;</span>
                {span}
              </>
            )}
          </p>
          <h1 className="mt-1 font-serif text-4xl text-stone-900">{event.title}</h1>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            {event.description && (
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="sr-only">Overview</h2>
                <div className="prose-bio">
                  {event.description.split(/\n\n+/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {event.figures.length > 0 && (
              <section aria-labelledby="figures-heading" className="mt-10">
                <h2 id="figures-heading" className="font-serif text-2xl text-stone-900 mb-3">
                  Figures
                </h2>
                <ul className="space-y-3">
                  {event.figures.map((f) => {
                    const href = f.dynastySlug
                      ? `/dynasties/${f.dynastySlug}/${f.slug}`
                      : `/figures/${f.slug}`;
                    const years = formatYearRange(f.birthYear, f.deathYear);
                    return (
                      <li key={f.slug}>
                        <Link
                          href={href}
                          className="group flex items-start gap-4 rounded-md border border-stone-200 bg-white p-4 transition hover:border-stone-400 hover:shadow-sm"
                        >
                          <div className="shrink-0 w-14 h-14 rounded-md overflow-hidden border border-stone-200 bg-stone-100 relative">
                            {f.imageUrl ? (
                              <Image
                                src={f.imageUrl}
                                alt={f.name}
                                fill
                                sizes="56px"
                                className="object-cover object-top"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center font-serif text-stone-400">
                                {f.name.slice(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base text-stone-900 group-hover:text-stone-700">
                              {f.name}
                            </p>
                            <p className="mt-0.5 text-xs uppercase tracking-wide text-stone-500">
                              {years || "?"}
                              {f.dynastyName && (
                                <>
                                  <span className="mx-1.5 text-stone-300">&middot;</span>
                                  {f.dynastyName}
                                </>
                              )}
                            </p>
                            {f.role && (
                              <p className="mt-1.5 text-sm text-stone-600">{f.role}</p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <AdSlot
              name="eventSidebar"
              label="Event sidebar"
              size="300×250 medium rectangle"
              variant="rectangle"
            />
            {event.dynasties.length > 0 && (
              <div className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm">
                <h3 className="font-serif text-base text-stone-900 mb-3">Dynasties involved</h3>
                <ul className="space-y-2">
                  {event.dynasties.map((d) => (
                    <li key={d.slug}>
                      <Link
                        href={`/dynasties/${d.slug}`}
                        className="font-serif text-stone-900 hover:text-stone-600 underline decoration-stone-300 hover:decoration-stone-700"
                      >
                        {d.name}
                      </Link>
                      {d.role && (
                        <p className="mt-0.5 text-xs text-stone-500">{d.role}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>
    </main>
  );
}
