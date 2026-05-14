import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSiteStats } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Dynastica",
  description:
    "About Dynastica — a reference work that maps the bloodlines, marriages, and successions of history's ruling houses across centuries and continents.",
  alternates: { canonical: "/about" },
};

const CONTACT_EMAIL = "nodargelovani@gmail.com";

export default async function AboutPage() {
  const stats = await getSiteStats();
  const yearsLabel =
    stats.yearSpan != null
      ? `${Math.floor(stats.yearSpan / 500) * 500}+ years`
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />

      <h1 className="font-serif text-3xl text-stone-900">About Dynastica</h1>

      <p className="mt-4 text-sm uppercase tracking-[0.18em] text-stone-500">
        {stats.dynastyCount} dynasties
        <span className="mx-2 text-stone-300">&middot;</span>
        {stats.figureCount} figures
        {yearsLabel && (
          <>
            <span className="mx-2 text-stone-300">&middot;</span>
            {yearsLabel}
          </>
        )}
      </p>

      <div className="prose-bio mt-6">
        <p>
          Dynastica is a reference work mapping the bloodlines, marriages, and political
          successions of history&rsquo;s ruling houses. Every dynasty has a page; every figure
          inside it has a page. The links between them &mdash; parent to child, spouse to spouse,
          one house to another by marriage &mdash; are first-class data, navigable as a single
          graph rather than as siloed family trees.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8">What makes this different</h2>
        <p>
          Royal marriages do not respect dynasties. Eleanor of Aquitaine was queen of France
          before she was queen of England; her great-grandson would, three generations later, be
          a Plantagenet on her great-grandfather&rsquo;s Capetian throne. Most genealogy databases
          break those connections at dynastic borders. Dynastica preserves them. Click a figure
          and you see every relation she had &mdash; including the ones who lived in other
          houses, other realms, other languages.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8">How biographies are written</h2>
        <p>
          Each biography is a 150&ndash;300 word summary drawn from standard secondary historical
          sources &mdash; the same kind of material you would find in a university survey, an
          encyclopedia, or a popular history book. The site does not aim to compete with
          specialist monographs; it aims to give a confident, navigable orientation across
          dynasties that most reference works treat in isolation.
        </p>
        <p>
          Where dates or family relations are contested by historians, we record the
          most-cited consensus. Where they are unknown, we leave fields blank rather than
          invent. Native-language renderings of names are included when they exist in a single
          standard form. Reign dates record the period of effective sovereignty, which is not
          always the same as the period of nominal claim.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8">How to browse</h2>
        <ul>
          <li>
            <Link
              href="/dynasties"
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              The full dynasty index
            </Link>
            {" "}lists every house. Use it as the starting point if you know what you&rsquo;re
            looking for.
          </li>
          <li>
            <Link
              href="/dynasties/region"
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              By region
            </Link>
            {" "}groups dynasties geographically &mdash; useful for surveying a continent or a
            sub-region.
          </li>
          <li>
            <Link
              href="/dynasties/era"
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              By era
            </Link>
            {" "}groups dynasties temporally, from antiquity through the modern period.
          </li>
          <li>
            <Link
              href="/contemporaries"
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              Contemporaries
            </Link>
            {" "}is a year slider: pick a year and see every dynasty that was ruling somewhere in
            the world at that moment.
          </li>
          <li>
            <Link
              href="/random"
              prefetch={false}
              className="underline decoration-stone-300 hover:decoration-stone-700"
            >
              Random figure
            </Link>
            {" "}sends you to one of {stats.figureCount} figures at random &mdash; for the days
            you want to be surprised.
          </li>
        </ul>

        <h2 className="font-serif text-xl text-stone-900 mt-8">Errors and corrections</h2>
        <p>
          If you find a date, relation, or name that&rsquo;s wrong, please write. The site is
          actively maintained and corrections ship the same day in most cases. Cross-dynasty
          claims are especially welcome &mdash; those are the relations a single specialist
          source is least likely to surface.
        </p>

        <h2 className="font-serif text-xl text-stone-900 mt-8">Contact</h2>
        <p>
          Email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="underline decoration-stone-300 hover:decoration-stone-700"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          for corrections, suggestions, or to flag a dynasty that should be added.
        </p>

        <p className="text-sm text-stone-500 mt-8">
          For data-handling, advertising, and affiliate disclosure see{" "}
          <Link
            href="/privacy"
            className="underline decoration-stone-300 hover:decoration-stone-700"
          >
            the privacy policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
