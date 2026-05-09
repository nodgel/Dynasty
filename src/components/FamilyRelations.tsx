import Link from "next/link";
import { formatYearRange } from "@/lib/format";

type RelatedFigure = { slug: string; name: string; birthYear: number | null; deathYear: number | null };

type Props = {
  dynastySlug: string;
  parents: RelatedFigure[];
  children: RelatedFigure[];
  spouses: RelatedFigure[];
};

function years(p: RelatedFigure) {
  return formatYearRange(p.birthYear, p.deathYear) || null;
}

function RelationGroup({
  title,
  people,
  dynastySlug,
}: {
  title: string;
  people: RelatedFigure[];
  dynastySlug: string;
}) {
  if (people.length === 0) return null;
  return (
    <div className="mt-4 first:mt-0">
      <h3 className="text-xs uppercase tracking-wide text-stone-500 mb-1.5">{title}</h3>
      <ul className="space-y-1.5">
        {people.map((p) => (
          <li key={p.slug} className="text-sm">
            <Link href={`/dynasties/${dynastySlug}/${p.slug}`} className="wiki-link">
              {p.name}
            </Link>
            {years(p) && <span className="text-stone-500"> · {years(p)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FamilyRelations({ dynastySlug, parents, children, spouses }: Props) {
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
          <RelationGroup title="Parents" people={parents} dynastySlug={dynastySlug} />
          <RelationGroup title="Spouses" people={spouses} dynastySlug={dynastySlug} />
          <RelationGroup title="Children" people={children} dynastySlug={dynastySlug} />
        </>
      )}
    </aside>
  );
}
