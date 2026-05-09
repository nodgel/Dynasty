import { Field, inputClass, textareaClass } from "./Field";
import ImageUpload from "./ImageUpload";

type Dynasty = {
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
  foundedYear: number | null;
  endedYear: number | null;
  imageUrl: string | null;
};

type Props = {
  initial?: Partial<Dynasty>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  submitLabel: string;
};

export default function DynastyForm({ initial, action, submitLabel }: Props) {
  const d = initial ?? {};
  return (
    <form action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" name="name" required>
          <input
            id="name"
            name="name"
            defaultValue={d.name ?? ""}
            required
            className={inputClass}
            placeholder="e.g. Spanish Habsburgs"
          />
        </Field>
        <Field label="Slug" name="slug" hint="URL-safe identifier. Auto-derived from name if left blank.">
          <input
            id="slug"
            name="slug"
            defaultValue={d.slug ?? ""}
            className={inputClass}
            placeholder="spanish-habsburgs"
            pattern="[a-z0-9\-]*"
          />
        </Field>
      </div>

      <Field label="Region" name="region">
        <input
          id="region"
          name="region"
          defaultValue={d.region ?? ""}
          className={inputClass}
          placeholder="e.g. Spain / Holy Roman Empire"
        />
      </Field>

      <Field label="Description" name="description" hint="Shown on the dynasty overview page and in search snippets.">
        <textarea
          id="description"
          name="description"
          defaultValue={d.description ?? ""}
          rows={5}
          className={textareaClass}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Founded year" name="foundedYear" hint="Negative for BC (e.g. -305).">
          <input
            id="foundedYear"
            name="foundedYear"
            type="number"
            defaultValue={d.foundedYear ?? ""}
            className={inputClass}
            placeholder="1516"
          />
        </Field>
        <Field label="Ended year" name="endedYear" hint="Leave blank if still extant.">
          <input
            id="endedYear"
            name="endedYear"
            type="number"
            defaultValue={d.endedYear ?? ""}
            className={inputClass}
            placeholder="1700"
          />
        </Field>
      </div>

      <ImageUpload name="imageUrl" initialUrl={d.imageUrl ?? null} label="Hero image" />

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
