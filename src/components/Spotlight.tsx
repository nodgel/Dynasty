import Image from "next/image";
import Link from "next/link";
import { formatYearRange } from "@/lib/format";

type SpotlightFigure = {
  slug: string;
  name: string;
  imageUrl: string | null;
  birthYear: number | null;
  deathYear: number | null;
  dynastySlug: string | null;
};

type Props = { figures: SpotlightFigure[] };

// Horizontal strip of portrait + name cards beneath the hero. Each card
// links to the canonical figure page (/dynasties/{dynasty}/{figure}); if
// the figure has no dynasty, fall back to /figures/{slug} which redirects.
export default function Spotlight({ figures }: Props) {
  if (figures.length === 0) return null;
  return (
    <section aria-labelledby="spotlight-heading" className="mt-10">
      <h2 id="spotlight-heading" className="font-serif text-2xl text-stone-900 mb-4">
        Faces of history
      </h2>
      <ul className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory sm:snap-none">
        {figures.map((f) => {
          const href = f.dynastySlug
            ? `/dynasties/${f.dynastySlug}/${f.slug}`
            : `/figures/${f.slug}`;
          const years = formatYearRange(f.birthYear, f.deathYear);
          return (
            <li
              key={f.slug}
              className="shrink-0 w-36 sm:w-40 snap-start"
            >
              <Link
                href={href}
                className="group block text-center"
              >
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 overflow-hidden rounded-md border border-stone-200 bg-stone-100 transition group-hover:border-stone-400 group-hover:shadow-sm">
                  {f.imageUrl ? (
                    <Image
                      src={f.imageUrl}
                      alt={f.name}
                      fill
                      sizes="160px"
                      className="object-cover object-top transition group-hover:scale-[1.02]"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-serif text-stone-400">
                      {f.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <p className="mt-2 font-serif text-sm text-stone-900 leading-tight group-hover:text-stone-700">
                  {f.name}
                </p>
                {years && (
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-stone-500">
                    {years}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
