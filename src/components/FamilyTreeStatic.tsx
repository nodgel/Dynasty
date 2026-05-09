import Link from "next/link";
import { formatYearRange } from "@/lib/format";

export type TreeNode = {
  id: number;
  slug: string;
  name: string;
  birthYear: number | null;
  deathYear: number | null;
  children: TreeNode[];
};

type Props = {
  dynastySlug: string;
  roots: TreeNode[];
};

function years(n: TreeNode) {
  return formatYearRange(n.birthYear, n.deathYear) || null;
}

function TreeBranch({ node, dynastySlug }: { node: TreeNode; dynastySlug: string }) {
  return (
    <li className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-stone-300 last:before:bottom-1/2">
      <span className="absolute left-0 top-3.5 w-5 h-px bg-stone-300" aria-hidden />
      <div className="inline-block rounded border border-stone-200 bg-white px-3 py-1.5 text-sm shadow-sm">
        <Link href={`/dynasties/${dynastySlug}/${node.slug}`} className="font-serif text-stone-900 hover:text-stone-700">
          {node.name}
        </Link>
        {years(node) && <span className="ml-2 text-xs text-stone-500">{years(node)}</span>}
      </div>
      {node.children.length > 0 && (
        <ul className="mt-2 ml-2 space-y-2">
          {node.children.map((c) => (
            <TreeBranch key={c.id} node={c} dynastySlug={dynastySlug} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FamilyTreeStatic({ dynastySlug, roots }: Props) {
  if (roots.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
        No lineage data available.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-md border border-stone-200 bg-white p-4">
      <ul className="space-y-2">
        {roots.map((r) => (
          <TreeBranch key={r.id} node={r} dynastySlug={dynastySlug} />
        ))}
      </ul>
    </div>
  );
}
