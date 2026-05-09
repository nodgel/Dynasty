"use client";

import { useEffect, useState, type ComponentType } from "react";
import FamilyTreeStatic, { type TreeNode } from "./FamilyTreeStatic";

export type { TreeNode };

type Props = { dynastySlug: string; roots: TreeNode[] };

// Renders the SEO-friendly static indented tree on the server and during the
// initial client paint, then dynamically loads the interactive D3 tree and
// swaps it in once mounted. This keeps the HTML crawlable and avoids shipping
// the heavy d3 bundle until needed.
export default function FamilyTreeViewer(props: Props) {
  const [Interactive, setInteractive] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./FamilyTreeD3").then((m) => {
      if (!cancelled) setInteractive(() => m.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (Interactive) return <Interactive {...props} />;
  return <FamilyTreeStatic {...props} />;
}
