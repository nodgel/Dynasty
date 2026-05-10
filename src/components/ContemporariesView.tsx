"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { FigureWithDates } from "@/lib/queries";
import { formatYear, formatYearRange } from "@/lib/format";

type Props = {
  initialYear: number;
  figures: FigureWithDates[];
  // True/false: should slider movements update the URL? Default true. We
  // disable on the landing page where the URL has no [year] param.
  syncToUrl?: boolean;
};

function reigningIn(f: FigureWithDates, year: number): boolean {
  if (f.reignStart != null && f.reignEnd != null) {
    return year >= f.reignStart && year <= f.reignEnd;
  }
  return false;
}

function ageIn(f: FigureWithDates, year: number): number {
  return year - f.birthYear;
}

export default function ContemporariesView({
  initialYear,
  figures,
  syncToUrl = true,
}: Props) {
  const [year, setYear] = useState(initialYear);

  // Bounds for the slider come from the data: earliest birth, latest death.
  const { minYear, maxYear } = useMemo(() => {
    if (figures.length === 0) return { minYear: -3000, maxYear: 2000 };
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (const f of figures) {
      if (f.birthYear < lo) lo = f.birthYear;
      if (f.deathYear > hi) hi = f.deathYear;
    }
    return { minYear: lo, maxYear: hi };
  }, [figures]);

  const aliveNow = useMemo(
    () => figures.filter((f) => year >= f.birthYear && year <= f.deathYear),
    [figures, year]
  );

  // Group alive figures by dynasty. Reigning figures bubble to the top of
  // each group. Sort dynasties by alive-figure count desc, then by name.
  const grouped = useMemo(() => {
    const byDynasty = new Map<string, FigureWithDates[]>();
    for (const f of aliveNow) {
      const key = f.dynastySlug ?? "_orphan";
      if (!byDynasty.has(key)) byDynasty.set(key, []);
      byDynasty.get(key)!.push(f);
    }
    const groups = [...byDynasty.entries()].map(([slug, items]) => ({
      dynastySlug: slug === "_orphan" ? null : slug,
      dynastyName: items[0].dynastyName ?? "(no dynasty)",
      figures: items.sort((a, b) => {
        const ar = reigningIn(a, year) ? 0 : 1;
        const br = reigningIn(b, year) ? 0 : 1;
        if (ar !== br) return ar - br;
        return a.birthYear - b.birthYear;
      }),
    }));
    groups.sort((a, b) => {
      if (b.figures.length !== a.figures.length) return b.figures.length - a.figures.length;
      return a.dynastyName.localeCompare(b.dynastyName);
    });
    return groups;
  }, [aliveNow, year]);

  // Update the URL after the user releases the slider (doesn't navigate during drag).
  useEffect(() => {
    if (!syncToUrl) return;
    const handle = setTimeout(() => {
      const desired = `/contemporaries/${year}`;
      if (typeof window !== "undefined" && window.location.pathname !== desired) {
        window.history.replaceState(null, "", desired);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [year, syncToUrl]);

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-stone-500">The world in</p>
        <h1 className="font-serif text-5xl text-stone-900 mt-1">{formatYear(year)}</h1>
        <p className="mt-2 text-stone-600">
          {aliveNow.length} {aliveNow.length === 1 ? "figure" : "figures"} alive across{" "}
          {grouped.length} {grouped.length === 1 ? "dynasty" : "dynasties"}.
        </p>
      </header>

      <section aria-labelledby="year-slider-label" className="mb-10">
        <label
          id="year-slider-label"
          htmlFor="year-slider"
          className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
        >
          Drag to scrub through history
        </label>
        <input
          id="year-slider"
          type="range"
          min={minYear}
          max={maxYear}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full accent-stone-900"
        />
        <div className="mt-1 flex justify-between text-xs text-stone-400">
          <span>{formatYear(minYear)}</span>
          <span>{formatYear(Math.round((minYear + maxYear) / 2))}</span>
          <span>{formatYear(maxYear)}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {[-300, 100, 700, 1100, 1300, 1500, 1700, 1900].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`px-2 py-0.5 rounded border ${
                y === year
                  ? "bg-stone-900 text-white border-stone-900"
                  : "border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {formatYear(y)}
            </button>
          ))}
        </div>
      </section>

      {aliveNow.length === 0 ? (
        <p className="text-stone-500">
          No figures with recorded birth and death years overlapping {formatYear(year)}. Try
          dragging the slider to a more populated period.
        </p>
      ) : (
        <ul className="space-y-6">
          {grouped.map((group) => (
            <li
              key={group.dynastySlug ?? "_orphan"}
              className="rounded-md border border-stone-200 bg-white p-4"
            >
              <header className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="font-serif text-xl text-stone-900">
                  {group.dynastySlug ? (
                    <Link href={`/dynasties/${group.dynastySlug}`} className="hover:text-stone-600">
                      {group.dynastyName}
                    </Link>
                  ) : (
                    group.dynastyName
                  )}
                </h2>
                <span className="text-xs text-stone-500">
                  {group.figures.length} {group.figures.length === 1 ? "figure" : "figures"}
                </span>
              </header>
              <ul className="divide-y divide-stone-100">
                {group.figures.map((f) => {
                  const isReigning = reigningIn(f, year);
                  return (
                    <li key={f.slug} className="py-2 flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        {f.dynastySlug ? (
                          <Link
                            href={`/dynasties/${f.dynastySlug}/${f.slug}`}
                            className="font-serif text-stone-900 hover:text-stone-600"
                          >
                            {f.name}
                          </Link>
                        ) : (
                          <span className="font-serif text-stone-900">{f.name}</span>
                        )}
                        {isReigning && (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                            Reigning
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 whitespace-nowrap">
                        Age {ageIn(f, year)} · {formatYearRange(f.birthYear, f.deathYear)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
