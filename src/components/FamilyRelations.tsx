import Link from "next/link";
import { formatYearRange } from "@/lib/format";

type RelatedFigure = {
  slug: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  dynasty?: { slug: string; name: string } | null;
};

type Props = {
  // The dynasty of the figure currently being viewed. Related people whose
  // dynasty differs are surfaced with a "via [Other Dynasty]" link — the
  // rabbit-hole effect for cross-dynasty marriages, ancestry, and offspring.
  currentDynastySlug: string;
  parents: RelatedFigure[];
  children: RelatedFigure[];
  spouses: RelatedFigure[];
};

function years(p: RelatedFigure) {
  return formatYearRange(p.birthYear, p.deathYear) || null;
}

function figureUrl(p: RelatedFigure, fallbackDynastySlug: string) {
  return `/dynasties/${p.dynasty?.slug ?? fallbackDynastySlug}/${p.slug}`;
}

function RelationGroup({
  title,
  people,
  currentDynastySlug,
  crossDynastyPrefix,
}: {
  title: string;
  people: RelatedFigure[];
  currentDynastySlug: string;
  // Prefix shown when the related figure belongs to a different dynasty.
  // "Spouses" → "Married into [Dynasty]"; "Parents" → "From the House of
  // [Dynasty]"; "Children" → "Founded line in [Dynasty]".
  crossDynastyPrefix: string;
}) {
  if (people.length === 0) return null;
  return (
    <div className="mt-4 first:mt-0">
      <h3 className="text-xs uppercase tracking-wide text-stone-500 mb-1.5">{title}</h3>
      <ul className="space-y-1.5">
        {people.map((p) => {
          const otherDynasty =
            p.dynasty && p.dynasty.slug !== currentDynastySlug ? p.dynasty : null;
          return (
            <li key={p.slug} className="text-sm">
              <Link href={figureUrl(p, currentDynastySlug)} className="wiki-link">
                {p.name}
              </Link>
              {years(p) && <span className="text-stone-500"> · {years(p)}</span>}
              {otherDynasty && (
                <div className="mt-0.5 text-xs text-stone-500">
                  {crossDynastyPrefix}{" "}
                  <Link
                    href={`/dynasties/${otherDynasty.slug}`}
                    className="wiki-link"
                  >
                    {otherDynasty.name}
                  </Link>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function FamilyRelations({
  currentDynastySlug,
  parents,
  children,
  spouses,
}: Props) {
  const empty = parents.length === 0 && children.length === 0 && spouses.length === 0;
  return (
    <aside aria-labelledby="family-relations-heading" className="rounded-md border border-stone-200 bg-stone-50 p-4">
      <h2 id="family-relations-heading" className="font-serif text-lg text-stone-900 mb-3">
        Family Relations
      </h2>
      {empty ? (
        <p className="text-sm text-stone-500">No recorded relations.</p>
      ) : (
        <>
          <RelationGroup
            title="Parents"
            people={parents}
            currentDynastySlug={currentDynastySlug}
            crossDynastyPrefix="From the House of"
          />
          <RelationGroup
            title="Spouses"
            people={spouses}
            currentDynastySlug={currentDynastySlug}
            crossDynastyPrefix="Married into"
          />
          <RelationGroup
            title="Children"
            people={children}
            currentDynastySlug={currentDynastySlug}
            crossDynastyPrefix="Founded line in"
          />
        </>
      )}
    </aside>
  );
}
