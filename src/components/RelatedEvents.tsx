import Link from "next/link";
import { formatYear } from "@/lib/format";

type Other = { slug: string; name: string; role: string | null };

type EventEntry = {
  id: number;
  slug: string;
  title: string;
  year: number | null;
  endYear: number | null;
  kind: "CONFLICT" | "ALLIANCE" | "MARRIAGE" | "SUCCESSION" | "OTHER";
  description: string | null;
  ownRole: string | null;
  otherParticipants: Other[];
};

const KIND_BADGE: Record<EventEntry["kind"], { label: string; className: string }> = {
  CONFLICT: { label: "Conflict", className: "bg-red-50 text-red-800 border-red-200" },
  ALLIANCE: { label: "Alliance", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  MARRIAGE: { label: "Marriage", className: "bg-rose-50 text-rose-800 border-rose-200" },
  SUCCESSION: { label: "Succession", className: "bg-amber-50 text-amber-800 border-amber-200" },
  OTHER: { label: "Event", className: "bg-stone-100 text-stone-700 border-stone-200" },
};

function formatEventDate(year: number | null, endYear: number | null): string | null {
  if (year == null) return null;
  if (endYear != null && endYear !== year) {
    return `${formatYear(year)} – ${formatYear(endYear)}`;
  }
  return formatYear(year);
}

export default function RelatedEvents({ events }: { events: EventEntry[] }) {
  if (events.length === 0) return null;

  return (
    <section aria-labelledby="related-events-heading" className="mt-10">
      <h2 id="related-events-heading" className="font-serif text-2xl text-stone-900 mb-3">
        Related events
      </h2>
      <ul className="space-y-3">
        {events.map((e) => {
          const badge = KIND_BADGE[e.kind];
          const date = formatEventDate(e.year, e.endYear);
          return (
            <li
              key={e.id}
              className="rounded-md border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span
                  className={`inline-block text-[10px] uppercase tracking-widest border rounded px-1.5 py-0.5 ${badge.className}`}
                >
                  {badge.label}
                </span>
                <h3 className="font-serif text-lg text-stone-900">{e.title}</h3>
                {date && <span className="text-xs text-stone-500">{date}</span>}
                {e.ownRole && (
                  <span className="text-xs text-stone-500 italic">· this dynasty: {e.ownRole}</span>
                )}
              </div>
              {e.description && (
                <p className="mt-2 text-sm text-stone-700 leading-relaxed line-clamp-3">
                  {e.description}
                </p>
              )}
              {e.otherParticipants.length > 0 && (
                <p className="mt-2 text-xs text-stone-500">
                  Also involved:{" "}
                  {e.otherParticipants.map((o, i) => (
                    <span key={o.slug}>
                      {i > 0 && ", "}
                      <Link href={`/dynasties/${o.slug}`} className="wiki-link">
                        {o.name}
                      </Link>
                      {o.role && <span className="italic"> ({o.role})</span>}
                    </span>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
