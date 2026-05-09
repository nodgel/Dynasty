"use client";

import { useEffect, useMemo, useState } from "react";

type DynastyOption = { id: number; name: string; region: string | null };

type Pick = { id: number; name: string; role: string };

type Props = {
  label: string;
  hint?: string;
  initial: Pick[];
  options: DynastyOption[];
};

export default function DynastyPicker({ label, hint, initial, options }: Props) {
  const [picks, setPicks] = useState<Pick[]>(initial);

  const optionMap = useMemo(() => {
    const m = new Map<number, DynastyOption>();
    for (const o of options) m.set(o.id, o);
    return m;
  }, [options]);

  const available = options.filter((o) => !picks.some((p) => p.id === o.id));

  const add = (id: number) => {
    const o = optionMap.get(id);
    if (!o) return;
    setPicks([...picks, { id, name: o.name, role: "" }]);
  };

  const remove = (id: number) => setPicks(picks.filter((p) => p.id !== id));

  const setRole = (id: number, role: string) =>
    setPicks(picks.map((p) => (p.id === id ? { ...p, role } : p)));

  // Submit values are emitted via two hidden inputs:
  //   participantIds:    "3,7,12"
  //   participantRoles:  '{"3":"victor","7":"defeated"}'
  const idsValue = picks.map((p) => p.id).join(",");
  const rolesValue = JSON.stringify(
    Object.fromEntries(picks.filter((p) => p.role).map((p) => [String(p.id), p.role]))
  );

  // Local state to drive the "add" select; resets after pick.
  const [addId, setAddId] = useState<string>("");
  useEffect(() => {
    setAddId("");
  }, [picks.length]);

  return (
    <div>
      <label className="block text-sm text-stone-700 mb-1">{label}</label>
      <input type="hidden" name="participantIds" value={idsValue} />
      <input type="hidden" name="participantRoles" value={rolesValue} />

      {picks.length > 0 && (
        <ul className="space-y-2 mb-3">
          {picks.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2"
            >
              <span className="text-sm font-serif text-stone-900 min-w-[140px]">{p.name}</span>
              <input
                type="text"
                value={p.role}
                onChange={(e) => setRole(p.id, e.target.value)}
                placeholder="role (optional) — e.g. victor, defeated, ally"
                className="flex-1 h-8 px-2 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="text-stone-400 hover:text-stone-700 text-sm px-1"
                aria-label={`Remove ${p.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <select
          value={addId}
          onChange={(e) => {
            const v = e.target.value;
            if (v) add(Number(v));
          }}
          className="flex-1 h-10 px-3 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          <option value="">+ Add a participating dynasty…</option>
          {available.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
              {o.region ? ` — ${o.region}` : ""}
            </option>
          ))}
        </select>
      </div>

      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}
