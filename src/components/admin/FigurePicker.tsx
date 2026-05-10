"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  id: number;
  name: string;
  slug: string;
  birthYear: number | null;
  deathYear: number | null;
  dynasty: { name: string } | null;
};

type Props = {
  name: string;
  label: string;
  initial: Array<{ id: number; name: string; birthYear: number | null; deathYear: number | null }>;
  excludeId?: number;
  hint?: string;
};

function years(b: number | null, d: number | null) {
  const fmt = (y: number) => (y < 0 ? `${-y} BC` : `${y}`);
  if (b != null && d != null) return `${fmt(b)}–${fmt(d)}`;
  if (b != null) return `b. ${fmt(b)}`;
  if (d != null) return `d. ${fmt(d)}`;
  return null;
}

export default function FigurePicker({ name, label, initial, excludeId, hint }: Props) {
  const [picks, setPicks] = useState(initial);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query });
        if (excludeId) params.set("exclude", String(excludeId));
        const res = await fetch(`/api/admin/figures?${params}`);
        const json = await res.json();
        if (active && json.ok) setResults(json.results as Suggestion[]);
      } finally {
        if (active) setLoading(false);
      }
    }, 200);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [query, excludeId]);

  // Click outside to close suggestions
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const add = (s: Suggestion) => {
    if (picks.some((p) => p.id === s.id)) return;
    setPicks([...picks, { id: s.id, name: s.name, birthYear: s.birthYear, deathYear: s.deathYear }]);
    setQuery("");
    setOpen(false);
  };

  const remove = (id: number) => setPicks(picks.filter((p) => p.id !== id));

  return (
    <div ref={containerRef}>
      <label className="block text-sm text-stone-700 mb-1">{label}</label>
      <input type="hidden" name={name} value={picks.map((p) => p.id).join(",")} />

      {picks.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-2">
          {picks.map((p) => (
            <li
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200 px-2.5 py-1 text-sm"
            >
              <span>{p.name}</span>
              {years(p.birthYear, p.deathYear) && (
                <span className="text-xs text-stone-500">{years(p.birthYear, p.deathYear)}</span>
              )}
              <button
                type="button"
                aria-label={`Remove ${p.name}`}
                onClick={() => remove(p.id)}
                className="text-stone-400 hover:text-stone-700"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={`Search figures to add…`}
          className="w-full h-10 px-3 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        {open && query && (
          <ul className="absolute z-10 mt-1 w-full max-h-72 overflow-auto rounded-md border border-stone-200 bg-white shadow-md">
            {loading && <li className="px-3 py-2 text-sm text-stone-500">Searching…</li>}
            {!loading && results.length === 0 && (
              <li className="px-3 py-2 text-sm text-stone-500">No matches.</li>
            )}
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => add(r)}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-stone-900">{r.name}</span>
                  <span className="text-xs text-stone-500">
                    {years(r.birthYear, r.deathYear) ?? ""} {r.dynasty?.name ? `· ${r.dynasty.name}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}
