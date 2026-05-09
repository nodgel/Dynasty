import { Field, inputClass, textareaClass } from "./Field";
import DynastyPicker from "./DynastyPicker";

type EventInitial = {
  title?: string;
  slug?: string;
  year?: number | null;
  endYear?: number | null;
  description?: string | null;
  kind?: "CONFLICT" | "ALLIANCE" | "MARRIAGE" | "SUCCESSION" | "OTHER";
};

type ParticipantPick = { id: number; name: string; role: string };
type DynastyOption = { id: number; name: string; region: string | null };

type Props = {
  initial?: EventInitial;
  participants?: ParticipantPick[];
  dynasties: DynastyOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  submitLabel: string;
};

const KIND_OPTIONS: Array<{ value: EventInitial["kind"]; label: string }> = [
  { value: "CONFLICT", label: "Conflict (war, battle, rebellion)" },
  { value: "ALLIANCE", label: "Alliance (treaty, pact, cooperation)" },
  { value: "MARRIAGE", label: "Marriage (dynastic union)" },
  { value: "SUCCESSION", label: "Succession (annexation, abdication)" },
  { value: "OTHER", label: "Other" },
];

export default function EventForm({
  initial,
  participants = [],
  dynasties,
  action,
  submitLabel,
}: Props) {
  const e = initial ?? {};
  return (
    <form action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" name="title" required>
          <input
            id="title"
            name="title"
            defaultValue={e.title ?? ""}
            required
            className={inputClass}
            placeholder="e.g. Battle of Didgori"
          />
        </Field>
        <Field label="Slug" name="slug" hint="Auto-derived from title if blank.">
          <input
            id="slug"
            name="slug"
            defaultValue={e.slug ?? ""}
            className={inputClass}
            placeholder="battle-of-didgori"
            pattern="[a-z0-9\-]*"
          />
        </Field>
      </div>

      <Field label="Kind" name="kind">
        <select
          id="kind"
          name="kind"
          defaultValue={e.kind ?? "OTHER"}
          className={inputClass}
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Year" name="year" hint="Negative for BC. Single-year events only need this.">
          <input
            id="year"
            name="year"
            type="number"
            defaultValue={e.year ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="End year" name="endYear" hint="Optional, for multi-year events (e.g. wars).">
          <input
            id="endYear"
            name="endYear"
            type="number"
            defaultValue={e.endYear ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" name="description">
        <textarea
          id="description"
          name="description"
          defaultValue={e.description ?? ""}
          rows={5}
          className={textareaClass}
          placeholder="Brief description of the event."
        />
      </Field>

      <fieldset className="space-y-3 pt-2 border-t border-stone-200">
        <legend className="font-serif text-base text-stone-800 mt-3 mb-1">
          Participating dynasties
        </legend>
        <DynastyPicker
          label="Dynasties involved"
          hint="Add each dynasty that participated. Roles are optional — fill in only when meaningful."
          initial={participants}
          options={dynasties}
        />
      </fieldset>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
