import Image from "next/image";
import Link from "next/link";
import { formatYearRange } from "@/lib/format";

type RelatedDynasty = {
  slug: string;
  name: string;
  region: string | null;
  foundedYear: number | null;
  endedYear: number | null;
  coatOfArmsUrl: string | null;
};

type Props = {
  sameRegion: RelatedDynasty[];
  sameEra: RelatedDynasty[];
};

function Row({ d }: { d: RelatedDynasty }) {
  const span = formatYearRange(d.foundedYear, d.endedYear);
  return (
    <li className="py-2 flex items-center gap-3">
      {d.coatOfArmsUrl ? (
        <Image
          src={d.coatOfArmsUrl}
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 object-contain shrink-0"
          unoptimized
        />
      ) : (
        <span className="w-8 h-8 shrink-0" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <Link
          href={`/dynasties/${d.slug}`}
          className="font-serif text-stone-900 hover:text-stone-600"
        >
          {d.name}
        </Link>
        <p className="text-xs text-stone-500">
          {[d.region, span].filter(Boolean).join(" · ")}
        </p>
      </div>
    </li>
  );
}

export default function SeeAlsoDynasties({ sameRegion, sameEra }: Props) {
  if (sameRegion.length === 0 && sameEra.length === 0) return null;

  return (
    <section aria-labelledby="see-also-heading" className="mt-10">
      <h2 id="see-also-heading" className="font-serif text-2xl text-stone-900 mb-3">
        See also
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {sameRegion.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wide text-stone-500 mb-1.5">
              Same region
            </h3>
            <ul className="divide-y divide-stone-100 border-y border-stone-200 bg-white">
              {sameRegion.map((d) => (
                <Row key={`r-${d.slug}`} d={d} />
              ))}
            </ul>
          </div>
        )}
        {sameEra.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wide text-stone-500 mb-1.5">
              Same era
            </h3>
            <ul className="divide-y divide-stone-100 border-y border-stone-200 bg-white">
              {sameEra.map((d) => (
                <Row key={`e-${d.slug}`} d={d} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
