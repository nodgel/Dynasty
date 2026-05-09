type Recommendation = { title: string; author: string };

const placeholderBooks: Recommendation[] = [
  { title: "The Making of the Georgian Nation", author: "Ronald Grigor Suny" },
  { title: "Bagrationi: A Royal House", author: "Cyril Toumanoff" },
  { title: "Tamar: Queen of Queens", author: "Antony Eastmond" },
];

export default function RecommendedReading() {
  return (
    <section
      aria-labelledby="recommended-reading-heading"
      className="mt-12 border-t border-stone-200 pt-8"
    >
      <h2 id="recommended-reading-heading" className="font-serif text-xl text-stone-900">
        Recommended Reading
      </h2>
      <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
        Affiliate links — ads disclosure
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {placeholderBooks.map((b) => (
          <li
            key={b.title}
            data-affiliate-slot
            className="border border-dashed border-stone-300 bg-stone-50/60 p-4 text-sm"
          >
            <p className="font-serif text-stone-800">{b.title}</p>
            <p className="text-xs text-stone-500 mt-1">{b.author}</p>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-stone-400">
              Affiliate slot
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
