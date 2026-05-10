import { amazonSearchUrl, figureBookSearches } from "@/lib/amazon";

type Props = {
  figureName: string;
  dynastyName?: string | null;
};

export default function RecommendedReading({ figureName, dynastyName }: Props) {
  const searches = figureBookSearches(figureName, dynastyName ?? null);
  return (
    <section
      aria-labelledby="recommended-reading-heading"
      className="mt-12 border-t border-stone-200 pt-8"
    >
      <h2 id="recommended-reading-heading" className="font-serif text-xl text-stone-900">
        Recommended Reading
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        As an Amazon Associate we earn from qualifying purchases.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {searches.map((s) => (
          <li key={s.label}>
            <a
              href={amazonSearchUrl(s.query)}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="block border border-stone-200 bg-stone-50/60 p-4 text-sm hover:border-stone-400 hover:bg-stone-100 transition-colors"
            >
              <p className="text-[10px] uppercase tracking-widest text-stone-500">
                {s.label}
              </p>
              <p className="mt-2 font-serif text-stone-900">
                Books about {s.label === "Dynasty" && dynastyName ? dynastyName : figureName}
              </p>
              <p className="mt-2 text-xs text-stone-500">Search on Amazon →</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
