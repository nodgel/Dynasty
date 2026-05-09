"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  analyzeImportAction,
  applyImportAction,
  type AnalyzeResult,
  type ApplyResult,
  type ImportRow,
} from "@/lib/actions/import";

const PLACEHOLDER = `[
  {
    "name": "Guaram I",
    "slug": "guaram-i-bagrationi",
    "dynasty": "Bagrationi",
    "description": "...",
    "birthYear": null,
    "deathYear": 600,
    "parents": [],
    "spouses": [],
    "children": ["stepanos-i-bagrationi", "demetre-bagrationi"]
  }
]`;

export default function ImportClient() {
  const [analyzeState, analyzeAction, analyzePending] = useActionState<
    AnalyzeResult | null,
    FormData
  >(analyzeImportAction, null);
  const [applyState, applyAction, applyPending] = useActionState<
    ApplyResult | null,
    FormData
  >(applyImportAction, null);

  const [draft, setDraft] = useState("");

  // After a successful apply, show a result panel.
  if (applyState?.kind === "applied") {
    return <Result state={applyState} />;
  }

  // After a successful analyze, show the diff preview.
  if (analyzeState?.kind === "ok") {
    return <Preview analyze={analyzeState} action={applyAction} pending={applyPending} />;
  }

  // Initial / error state.
  return (
    <form action={analyzeAction} className="space-y-4">
      <div>
        <label htmlFor="json" className="block text-sm text-stone-700 mb-1">
          Paste JSON array of figures
        </label>
        <textarea
          id="json"
          name="json"
          rows={18}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full font-mono text-xs px-3 py-2 rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
          placeholder={PLACEHOLDER}
          required
        />
      </div>
      {analyzeState?.kind === "error" && (
        <p className="text-sm text-red-600">{analyzeState.message}</p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={analyzePending}
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {analyzePending ? "Analyzing…" : "Analyze"}
        </button>
        <span className="text-xs text-stone-500">
          Nothing is written to the database until you click Apply on the next screen.
        </span>
      </div>
    </form>
  );
}

function Result({ state }: { state: Extract<ApplyResult, { kind: "applied" }> }) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5">
      <h2 className="font-serif text-lg text-stone-900">Import applied</h2>
      <ul className="mt-3 text-sm text-stone-700 space-y-1">
        <li>{state.createdDynasties} new dynasty/dynasties created</li>
        <li>{state.createdFigures} new figures created</li>
        <li>{state.createdParentChild} parent-child links added</li>
        <li>{state.createdSpouses} spouse pairs added</li>
      </ul>
      <div className="mt-4 flex items-center gap-3 text-sm">
        <Link href="/admin" className="underline text-stone-700">Back to dashboard</Link>
        <Link href="/admin/import" className="underline text-stone-700">Import another batch</Link>
      </div>
    </div>
  );
}

function Preview({
  analyze,
  action,
  pending,
}: {
  analyze: Extract<AnalyzeResult, { kind: "ok" }>;
  action: (fd: FormData) => void;
  pending: boolean;
}) {
  const newRows = analyze.rows.filter((r) => r.status.kind === "new");
  const conflictRows = analyze.rows.filter((r) => r.status.kind === "exists");
  const invalidRows = analyze.rows.filter((r) => r.status.kind === "invalid");

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="json" value={analyze.json} />

      <section className="rounded-md border border-stone-200 bg-white p-4">
        <h2 className="font-serif text-lg text-stone-900 mb-2">Summary</h2>
        <ul className="text-sm text-stone-700 space-y-1">
          <li>
            <strong>{newRows.length}</strong> new figures will be created.
          </li>
          <li>
            <strong>{conflictRows.length}</strong> figures already exist in the database (left untouched in v1).
          </li>
          <li>
            <strong>{invalidRows.length}</strong> rows have validation errors and cannot be applied.
          </li>
          <li>
            <strong>{analyze.parentChildEdges.length}</strong> parent-child edges and{" "}
            <strong>{analyze.spouseEdges.length}</strong> spouse pairs will be linked (resolving across both new and existing figures).
          </li>
          {analyze.unresolvedSlugs.length > 0 && (
            <li className="text-amber-700">
              <strong>{analyze.unresolvedSlugs.length}</strong> referenced slugs are not present in this import or in the DB — those edges will be skipped:{" "}
              <span className="font-mono text-xs">{analyze.unresolvedSlugs.join(", ")}</span>
            </li>
          )}
        </ul>
      </section>

      {analyze.newDynastyNames.length > 0 && (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <h2 className="font-serif text-lg text-stone-900 mb-2">New dynasties</h2>
          <p className="text-sm text-stone-700 mb-3">
            These dynasties don&apos;t exist yet. Tick the ones you want created automatically before figures are inserted. Figures whose dynasty isn&apos;t approved will still be inserted, but with no dynasty.
          </p>
          <ul className="space-y-1.5">
            {analyze.newDynastyNames.map((n) => (
              <li key={n} className="text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="createDynasty" value={n} defaultChecked className="rounded" />
                  <span>{n}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {newRows.length > 0 && (
        <DiffSection title={`New figures (${newRows.length})`} rows={newRows} editable />
      )}
      {conflictRows.length > 0 && (
        <DiffSection
          title={`Already in DB (${conflictRows.length})`}
          rows={conflictRows}
          editable={false}
          note="Skipped in v1. To update existing figures, use the admin edit page directly."
        />
      )}
      {invalidRows.length > 0 && (
        <DiffSection
          title={`Invalid (${invalidRows.length})`}
          rows={invalidRows}
          editable={false}
          note="Cannot be applied. Fix the issues in your JSON and re-analyze."
        />
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-stone-200">
        <button
          type="submit"
          disabled={pending || newRows.length === 0}
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Applying…" : "Apply selected"}
        </button>
        <Link href="/admin/import" className="text-sm text-stone-500 hover:text-stone-900">
          Discard and start over
        </Link>
      </div>
    </form>
  );
}

function DiffSection({
  title,
  rows,
  editable,
  note,
}: {
  title: string;
  rows: ImportRow[];
  editable: boolean;
  note?: string;
}) {
  return (
    <section className="rounded-md border border-stone-200 bg-white">
      <header className="px-4 py-2 border-b border-stone-200 flex items-baseline justify-between">
        <h2 className="font-serif text-base text-stone-900">{title}</h2>
        {note && <span className="text-xs text-stone-500">{note}</span>}
      </header>
      <ul className="divide-y divide-stone-100">
        {rows.map((row) => (
          <li key={row.figure.slug} className="px-4 py-2.5 flex items-center gap-3 text-sm">
            {editable ? (
              <input
                type="checkbox"
                name="apply"
                value={row.figure.slug}
                defaultChecked
                className="rounded"
              />
            ) : (
              <span className="w-4" aria-hidden />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-stone-900">{row.figure.name}</span>
                <span className="font-mono text-xs text-stone-400">{row.figure.slug}</span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {row.figure.dynasty && (
                  <span>
                    {row.figure.dynasty}
                    {row.dynastyResolution.kind === "new" && (
                      <span className="text-amber-700"> (will create)</span>
                    )}
                    {" · "}
                  </span>
                )}
                {row.figure.birthYear ?? "?"}–{row.figure.deathYear ?? "?"}
              </div>
              {row.status.kind === "invalid" && (
                <ul className="mt-1 text-xs text-red-600 list-disc pl-4">
                  {row.status.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
