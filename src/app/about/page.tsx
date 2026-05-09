import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description: "About Dynastica — a historical genealogy and dynasty database.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <h1 className="font-serif text-3xl text-stone-900">About Dynastica</h1>
      <div className="prose-bio mt-4">
        <p>
          Dynastica is a historical genealogy and dynasty database. It maps the bloodlines,
          marriages, and political successions that shaped civilizations, with concise biographies
          and interactive family trees.
        </p>
        <p>
          The site is built as a static-rendered reference work optimized for discoverability:
          every dynasty and figure has a stable, descriptive URL with full metadata.
        </p>
      </div>
    </main>
  );
}
