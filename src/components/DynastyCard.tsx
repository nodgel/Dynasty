import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  region: string | null;
  description: string | null;
  foundedYear: number | null;
  endedYear: number | null;
  figureCount: number;
};

export default function DynastyCard({
  slug,
  name,
  region,
  description,
  foundedYear,
  endedYear,
  figureCount,
}: Props) {
  const span =
    foundedYear && endedYear
      ? `${foundedYear} – ${endedYear}`
      : foundedYear
      ? `from ${foundedYear}`
      : null;

  return (
    <Link
      href={`/dynasties/${slug}`}
      className="group block rounded-lg border border-stone-200 bg-white p-5 transition hover:border-stone-400 hover:shadow-sm"
    >
      <article>
        <h2 className="font-serif text-xl text-stone-900 group-hover:text-stone-700">{name}</h2>
        {(region || span) && (
          <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
            {[region, span].filter(Boolean).join(" · ")}
          </p>
        )}
        {description && (
          <p className="mt-3 text-sm text-stone-600 line-clamp-3">{description}</p>
        )}
        <p className="mt-4 text-xs text-stone-500">
          {figureCount} {figureCount === 1 ? "figure" : "figures"}
        </p>
      </article>
    </Link>
  );
}
