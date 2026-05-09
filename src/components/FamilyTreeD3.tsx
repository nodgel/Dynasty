"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Tree, type CustomNodeElementProps, type RawNodeDatum } from "react-d3-tree";
import Link from "next/link";
import type { TreeNode } from "./FamilyTreeStatic";
import { formatYearRange } from "@/lib/format";

type Props = { dynastySlug: string; roots: TreeNode[] };

function toRDT(n: TreeNode): RawNodeDatum {
  return {
    name: n.name,
    attributes: {
      slug: n.slug,
      years: formatYearRange(n.birthYear, n.deathYear),
    },
    children: n.children.map(toRDT),
  };
}

function NodeCard({
  nodeDatum,
  dynastySlug,
}: {
  nodeDatum: CustomNodeElementProps["nodeDatum"];
  dynastySlug: string;
}) {
  const slug = nodeDatum.attributes?.slug as string | undefined;
  const years = nodeDatum.attributes?.years as string | undefined;

  return (
    <foreignObject x={-100} y={-30} width={200} height={64}>
      <div className="flex h-full items-center justify-center">
        <div className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-center shadow-sm">
          {slug ? (
            <Link
              href={`/dynasties/${dynastySlug}/${slug}`}
              className="block font-serif text-[14px] leading-tight text-stone-900 hover:text-stone-600"
            >
              {nodeDatum.name}
            </Link>
          ) : (
            <span className="block font-serif text-[14px] leading-tight text-stone-900">
              {nodeDatum.name}
            </span>
          )}
          {years && <div className="text-[11px] text-stone-500 mt-0.5">{years}</div>}
        </div>
      </div>
    </foreignObject>
  );
}

export default function FamilyTreeD3({ dynastySlug, roots }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 60 });

  const data = useMemo(() => {
    const converted = roots.map(toRDT);
    if (converted.length === 0) return null;
    if (converted.length === 1) return converted[0];
    // Multiple unrelated founders → wrap in a synthetic invisible root.
    return { name: "", attributes: { synthetic: "true" }, children: converted };
  }, [roots]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setTranslate({ x: rect.width / 2, y: 60 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!data) return null;

  return (
    <div
      ref={containerRef}
      className="w-full rounded-md border border-stone-200 bg-white"
      style={{ height: 640 }}
    >
      <Tree
        data={data}
        translate={translate}
        orientation="vertical"
        pathFunc="step"
        separation={{ siblings: 1.4, nonSiblings: 1.7 }}
        nodeSize={{ x: 220, y: 110 }}
        renderCustomNodeElement={(props) => {
          const isSynthetic = props.nodeDatum.attributes?.synthetic === "true";
          if (isSynthetic) return <g />;
          return <NodeCard nodeDatum={props.nodeDatum} dynastySlug={dynastySlug} />;
        }}
        zoom={0.8}
        scaleExtent={{ min: 0.3, max: 2 }}
        collapsible={false}
        enableLegacyTransitions={false}
      />
      <p className="px-3 pb-2 text-xs text-stone-400">
        Drag to pan · scroll to zoom · click a name to open the biography
      </p>
    </div>
  );
}
