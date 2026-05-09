type FieldProps = {
  label: string;
  name?: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, name, hint, required, children }: FieldProps) {
  const id = htmlFor ?? name;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-stone-700 mb-1">
        {label}
        {required && <span className="text-red-500" aria-hidden> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-stone-500 mt-1">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full h-10 px-3 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400";

export const textareaClass =
  "w-full px-3 py-2 text-sm rounded-md border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-400";
