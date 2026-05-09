import Link from "next/link";

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: c.href } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-stone-500 mb-4">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-stone-800 hover:underline">
                {c.label}
              </Link>
            ) : (
              <span className="text-stone-700" aria-current={i === items.length - 1 ? "page" : undefined}>
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden className="text-stone-300">/</span>}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </nav>
  );
}
