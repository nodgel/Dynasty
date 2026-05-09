import { Field, inputClass, textareaClass } from "./Field";
import ImageUpload from "./ImageUpload";
import FigurePicker from "./FigurePicker";

type RelatedFigure = { id: number; name: string; birthYear: number | null; deathYear: number | null };

type Figure = {
  id?: number;
  name: string;
  nativeName: string | null;
  slug: string;
  titles: string[];
  birthYear: number | null;
  deathYear: number | null;
  reignStart: number | null;
  reignEnd: number | null;
  biography: string | null;
  dynastyId: number | null;
  imageUrl: string | null;
};

type DynastyOption = { id: number; name: string };

type Props = {
  initial?: Partial<Figure>;
  parents?: RelatedFigure[];
  childrenLinks?: RelatedFigure[];
  spouses?: RelatedFigure[];
  dynasties: DynastyOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  submitLabel: string;
};

export default function FigureForm({
  initial,
  parents = [],
  childrenLinks = [],
  spouses = [],
  dynasties,
  action,
  submitLabel,
}: Props) {
  const f = initial ?? {};
  return (
    <form action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" name="name" required>
          <input
            id="name"
            name="name"
            defaultValue={f.name ?? ""}
            required
            className={inputClass}
            placeholder="e.g. Cleopatra VII Philopator"
          />
        </Field>
        <Field label="Slug" name="slug" hint="Auto-derived from name if left blank.">
          <input
            id="slug"
            name="slug"
            defaultValue={f.slug ?? ""}
            className={inputClass}
            placeholder="cleopatra-vii"
            pattern="[a-z0-9\-]*"
          />
        </Field>
      </div>

      <Field label="Native name" name="nativeName" hint='Optional. Name in original script (e.g. "თამარი" for Tamar).'>
        <input
          id="nativeName"
          name="nativeName"
          defaultValue={f.nativeName ?? ""}
          className={inputClass}
          placeholder="თამარი"
        />
      </Field>

      <Field label="Dynasty" name="dynastyId" hint="The dynasty this figure belongs to.">
        <select
          id="dynastyId"
          name="dynastyId"
          defaultValue={f.dynastyId ?? ""}
          className={inputClass}
        >
          <option value="">— None —</option>
          {dynasties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Titles"
        name="titles"
        hint="One per line. e.g. Queen of Egypt, Pharaoh."
      >
        <textarea
          id="titles"
          name="titles"
          defaultValue={(f.titles ?? []).join("\n")}
          rows={3}
          className={textareaClass}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Birth year" name="birthYear" hint="Negative for BC (e.g. -69).">
          <input
            id="birthYear"
            name="birthYear"
            type="number"
            defaultValue={f.birthYear ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Death year" name="deathYear">
          <input
            id="deathYear"
            name="deathYear"
            type="number"
            defaultValue={f.deathYear ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Reign start" name="reignStart" hint="Year reign began. Leave blank for non-rulers.">
          <input
            id="reignStart"
            name="reignStart"
            type="number"
            defaultValue={f.reignStart ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Reign end" name="reignEnd" hint="Year reign ended (death, abdication, deposition).">
          <input
            id="reignEnd"
            name="reignEnd"
            type="number"
            defaultValue={f.reignEnd ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Biography" name="biography">
        <textarea
          id="biography"
          name="biography"
          defaultValue={f.biography ?? ""}
          rows={8}
          className={textareaClass}
        />
      </Field>

      <ImageUpload name="imageUrl" initialUrl={f.imageUrl ?? null} label="Portrait" />

      <fieldset className="space-y-4 pt-2 border-t border-stone-200">
        <legend className="font-serif text-base text-stone-800 mt-3 mb-1">Family relations</legend>
        <FigurePicker
          name="parentIds"
          label="Parents"
          initial={parents}
          excludeId={f.id}
        />
        <FigurePicker
          name="childIds"
          label="Children"
          initial={childrenLinks}
          excludeId={f.id}
        />
        <FigurePicker
          name="spouseIds"
          label="Spouses"
          initial={spouses}
          excludeId={f.id}
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
