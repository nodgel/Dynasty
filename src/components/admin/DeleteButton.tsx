"use client";

import { useState, useTransition } from "react";

type Props = {
  label: string;
  confirmText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConfirm: () => Promise<any>;
};

export default function DeleteButton({ label, confirmText, onConfirm }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
      >
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-red-700">{confirmText}</span>
      <button
        type="button"
        onClick={() => startTransition(() => onConfirm())}
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-sm text-stone-500 hover:text-stone-700"
      >
        Cancel
      </button>
    </span>
  );
}
